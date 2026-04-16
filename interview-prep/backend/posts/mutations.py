import strawberry
from django.db.models import Sum

from posts import models
from posts.types import PostType, CommentType, CreatePostInput, CreateCommentInput, VoteInput


def _recalc_post_score(post: models.Post) -> None:
    """Recompute the post's score from its votes."""
    agg = post.votes.aggregate(total=Sum("direction"))
    post.score = agg["total"] or 0
    post.save(update_fields=["score"])


def _recalc_comment_score(comment: models.Comment) -> None:
    """Recompute the comment's score from its votes."""
    agg = comment.votes.aggregate(total=Sum("direction"))
    comment.score = agg["total"] or 0
    comment.save(update_fields=["score"])


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_post(self, input: CreatePostInput) -> PostType:
        """Create a new post."""
        return models.Post.objects.create(
            title=input.title,
            content=input.content,
            author=input.author,
        )

    @strawberry.mutation
    def create_comment(self, input: CreateCommentInput) -> CommentType:
        """Create a comment on a post, optionally as a reply."""
        post = models.Post.objects.get(pk=input.post_id)
        parent = None
        if input.parent_id:
            parent = models.Comment.objects.get(pk=input.parent_id)
        return models.Comment.objects.create(
            post=post,
            parent=parent,
            content=input.content,
            author=input.author,
        )

    @strawberry.mutation
    def vote(self, input: VoteInput) -> bool:
        """
        Cast a vote on a post or comment.
        direction=0 removes an existing vote.
        """
        if input.post_id:
            post = models.Post.objects.get(pk=input.post_id)
            if input.direction == 0:
                models.Vote.objects.filter(user=input.user, post=post).delete()
            else:
                models.Vote.objects.update_or_create(
                    user=input.user,
                    post=post,
                    defaults={"direction": input.direction},
                )
            _recalc_post_score(post)
        elif input.comment_id:
            comment = models.Comment.objects.get(pk=input.comment_id)
            if input.direction == 0:
                models.Vote.objects.filter(user=input.user, comment=comment).delete()
            else:
                models.Vote.objects.update_or_create(
                    user=input.user,
                    comment=comment,
                    defaults={"direction": input.direction},
                )
            _recalc_comment_score(comment)
        return True

    @strawberry.mutation
    def delete_post(self, id: int) -> bool:
        """Delete a post by ID."""
        models.Post.objects.filter(pk=id).delete()
        return True

    @strawberry.mutation
    def delete_comment(self, id: int) -> bool:
        """Delete a comment by ID (cascades to replies)."""
        models.Comment.objects.filter(pk=id).delete()
        return True
