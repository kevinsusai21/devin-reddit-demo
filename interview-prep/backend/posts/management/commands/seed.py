"""Seed the database with sample food/steak-themed posts and comments."""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from posts.models import Post, Comment, Vote


class Command(BaseCommand):
    help = "Populate the database with sample data"

    def handle(self, *args, **options):
        if Post.objects.exists():
            self.stdout.write(self.style.WARNING("Data already exists, skipping seed."))
            return

        now = timezone.now()

        # --- Posts ---
        posts_data = [
            {
                "title": "The Perfect Reverse Sear: A Step-by-Step Guide",
                "content": (
                    "After years of experimenting, I've nailed the reverse sear method for thick-cut "
                    "ribeyes. Here's what works for me:\n\n"
                    "1. Season generously with salt and pepper, let it rest uncovered in the fridge overnight\n"
                    "2. Bring to room temp for 45 min before cooking\n"
                    "3. Oven at 250F until internal temp hits 120F (~45 min for a 1.5\" cut)\n"
                    "4. Rest 10 min, then sear in a ripping hot cast iron with avocado oil\n"
                    "5. 45 seconds per side, baste with butter, garlic, and thyme\n\n"
                    "The crust you get is unreal. Medium-rare edge to edge with a perfect sear."
                ),
                "author": "grillmaster99",
                "hours_ago": 3,
            },
            {
                "title": "Unpopular opinion: A5 Wagyu is overrated for a regular dinner",
                "content": (
                    "Don't get me wrong, A5 Wagyu is an incredible experience. But I think people "
                    "overhype it as the 'best steak ever.' It's so rich and fatty that you can only "
                    "eat a few ounces before you're done. For a satisfying dinner-sized steak, give me "
                    "a well-marbled USDA Prime ribeye any day.\n\n"
                    "A5 is a luxury tasting experience, not an everyday steak. Anyone else feel this way?"
                ),
                "author": "foodie_mike",
                "hours_ago": 8,
            },
            {
                "title": "Made my first dry-aged ribeye at home and I'm never going back",
                "content": (
                    "Picked up a whole bone-in ribeye primal from my local butcher and dry-aged it in "
                    "a dedicated mini fridge for 45 days. Used the Umai dry age bags.\n\n"
                    "The flavor is insane -- nutty, beefy, almost cheese-like funk. Lost about 30% to "
                    "trim and moisture loss but what's left is pure concentrated beef flavor.\n\n"
                    "Total cost worked out to about $18/lb after trim, which is way cheaper than "
                    "buying dry-aged steaks at a steakhouse. Highly recommend if you're patient!"
                ),
                "author": "steaklover42",
                "hours_ago": 14,
            },
            {
                "title": "Best steakhouses in NYC? Taking my partner for our anniversary",
                "content": (
                    "Looking for recommendations for a special anniversary dinner in Manhattan. Budget "
                    "isn't a huge concern but I'd like to stay under $300 for two.\n\n"
                    "I've heard great things about Peter Luger, Keens, and Cote. Any favorites? "
                    "Bonus points if they have a great wine list and a good atmosphere."
                ),
                "author": "umami_queen",
                "hours_ago": 20,
            },
            {
                "title": "Cast iron vs. grill -- which do you prefer for steaks?",
                "content": (
                    "I've been going back and forth on this. Cast iron gives you an incredible crust "
                    "and lets you baste with butter. But grilling over charcoal gives you that smoky "
                    "flavor you can't replicate indoors.\n\n"
                    "Lately I've been doing a hybrid: start on the grill for smoke, finish in cast "
                    "iron for the sear. Best of both worlds?\n\n"
                    "What's your go-to method?"
                ),
                "author": "BBQ_Dan",
                "hours_ago": 26,
            },
        ]

        created_posts = []
        for pd in posts_data:
            p = Post.objects.create(
                title=pd["title"],
                content=pd["content"],
                author=pd["author"],
                created_at=now - timedelta(hours=pd["hours_ago"]),
            )
            created_posts.append(p)

        p1, p2, p3, p4, p5 = created_posts

        # --- Comments ---
        c1 = Comment.objects.create(
            post=p1, author="chef_julia",
            content="Great guide! One tip: try finishing with a blowtorch instead of the cast iron.",
            created_at=now - timedelta(hours=2, minutes=30),
        )
        c2 = Comment.objects.create(
            post=p1, parent=c1, author="grillmaster99",
            content="I've tried the torch method! It works but I find the cast iron gives a more even crust.",
            created_at=now - timedelta(hours=2, minutes=15),
        )
        c3 = Comment.objects.create(
            post=p1, author="cast_iron_carl",
            content="250F is the sweet spot. Also, don't skip the overnight salt -- it makes a huge difference.",
            created_at=now - timedelta(hours=1, minutes=45),
        )
        c4 = Comment.objects.create(
            post=p2, author="steaklover42",
            content="Hard disagree. A5 Wagyu is a completely different category of food.",
            created_at=now - timedelta(hours=7),
        )
        c5 = Comment.objects.create(
            post=p2, parent=c4, author="foodie_mike",
            content="That's kind of my point though. For a regular Tuesday dinner steak, Prime is better.",
            created_at=now - timedelta(hours=6, minutes=30),
        )
        c6 = Comment.objects.create(
            post=p2, author="chef_julia",
            content="As someone who's cooked A5 professionally, the issue is most people don't prepare it correctly.",
            created_at=now - timedelta(hours=5),
        )
        c7 = Comment.objects.create(
            post=p3, author="grillmaster99",
            content="45 days is brave for a first attempt! How was the pellicle?",
            created_at=now - timedelta(hours=13),
        )
        c8 = Comment.objects.create(
            post=p4, author="chef_julia",
            content="Cote is incredible -- it's Korean BBQ meets steakhouse. The Butcher's Feast is the move.",
            created_at=now - timedelta(hours=19),
        )
        c9 = Comment.objects.create(
            post=p5, author="grillmaster99",
            content="Your hybrid method is the way. I do the same thing -- 2 min per side over hot charcoal.",
            created_at=now - timedelta(days=1, hours=1),
        )

        # --- Votes ---
        vote_data = [
            ("chef_julia", p1, 1), ("steaklover42", p1, 1), ("foodie_mike", p1, 1),
            ("BBQ_Dan", p1, 1), ("umami_queen", p1, 1), ("cast_iron_carl", p1, 1),
            ("grillmaster99", p2, 1), ("steaklover42", p2, -1), ("BBQ_Dan", p2, 1),
            ("grillmaster99", p3, 1), ("chef_julia", p3, 1), ("foodie_mike", p3, 1),
            ("chef_julia", p4, 1), ("foodie_mike", p4, 1), ("BBQ_Dan", p4, 1),
            ("grillmaster99", p5, 1), ("steaklover42", p5, 1), ("chef_julia", p5, 1),
        ]
        for user, post, direction in vote_data:
            Vote.objects.create(user=user, post=post, direction=direction)

        # Recalculate scores
        from django.db.models import Sum
        for post in created_posts:
            agg = post.votes.aggregate(total=Sum("direction"))
            post.score = agg["total"] or 0
            post.save(update_fields=["score"])

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(created_posts)} posts, 9 comments, and {len(vote_data)} votes."
        ))
