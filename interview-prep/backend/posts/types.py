import strawberry
import strawberry_django
from strawberry import auto
from typing import Optional

from posts import models


@strawberry_django.type(models.Comment)
class CommentType:
    id: auto
    content: auto
    author: auto
    score: auto
    created_at: auto

    @strawberry_django.field
    def replies(self) -> list["CommentType"]:
        """Return direct child comments."""
        return models.Comment.objects.filter(parent=self)


@strawberry_django.type(models.Post)
class PostType:
    id: auto
    title: auto
    content: auto
    author: auto
    score: auto
    created_at: auto

    @strawberry_django.field
    def comment_count(self) -> int:
        return models.Comment.objects.filter(post=self).count()

    @strawberry_django.field
    def comments(self) -> list[CommentType]:
        """Return top-level comments (no parent)."""
        return models.Comment.objects.filter(post=self, parent__isnull=True)


# --- Input types for mutations ---

@strawberry.input
class CreatePostInput:
    title: str
    content: str
    author: str


@strawberry.input
class CreateCommentInput:
    post_id: int
    content: str
    author: str
    parent_id: Optional[int] = None


@strawberry.input
class VoteInput:
    post_id: Optional[int] = None
    comment_id: Optional[int] = None
    user: str
    direction: int  # 1 upvote, -1 downvote, 0 remove
