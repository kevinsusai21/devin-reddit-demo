import strawberry
from posts.queries import Query
from posts.mutations import Mutation

schema = strawberry.Schema(query=Query, mutation=Mutation)
