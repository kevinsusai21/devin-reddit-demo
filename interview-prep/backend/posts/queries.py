import strawberry
from posts import models
from posts.types import PostType


@strawberry.type
class Query:
    @strawberry.field
    def posts(self, sort: str = "new") -> list[PostType]:
        """Return all posts, sorted by the given strategy."""
        qs = models.Post.objects.all()
        if sort == "top":
            qs = qs.order_by("-score")
        elif sort == "hot":
            qs = qs.order_by("-score", "-created_at")
        else:  # "new" is the default
            qs = qs.order_by("-created_at")
        return qs

    @strawberry.field
    def post(self, id: int) -> PostType:
        """Return a single post by its ID."""
        return models.Post.objects.get(pk=id)
