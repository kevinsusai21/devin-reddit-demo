# Interview Prep: Django + Strawberry GraphQL + React Query

A full-stack demo app using the exact tech stack from the technical interview:
**Django · Strawberry GraphQL · React Query · React + TypeScript**

## Architecture

```
interview-prep/
├── backend/                  # Django + Strawberry GraphQL API
│   ├── core/                 # Django project (settings, urls, schema)
│   ├── posts/                # Django app (models, types, queries, mutations)
│   ├── manage.py
│   └── requirements.txt
└── frontend/                 # React + TypeScript + React Query
    ├── src/
    │   ├── graphql/          # GraphQL client, queries, and types
    │   ├── hooks/            # React Query hooks (usePosts, usePost, useMutations)
    │   ├── components/       # React components (PostList, PostDetail, etc.)
    │   └── App.tsx           # QueryClientProvider setup
    └── package.json
```

## Quick Start

### Backend (Django + Strawberry)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed          # Load sample data
python manage.py runserver 8001
```

Visit http://localhost:8001/graphql/ for the GraphiQL playground.

### Frontend (React + TypeScript + React Query)

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 to use the app.

## Key Patterns to Study

### 1. Django Models → Strawberry Types (`posts/types.py`)
Strawberry uses decorators to map Django models to GraphQL types:
```python
@strawberry_django.type(models.Post)
class PostType:
    id: auto
    title: auto
    # Custom resolvers for computed fields
    @strawberry_django.field
    def comment_count(self) -> int:
        return models.Comment.objects.filter(post=self).count()
```

### 2. GraphQL Queries & Mutations (`posts/queries.py`, `posts/mutations.py`)
```python
@strawberry.type
class Query:
    @strawberry.field
    def posts(self, sort: str = "new") -> list[PostType]:
        ...

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_post(self, input: CreatePostInput) -> PostType:
        ...
```

### 3. React Query Hooks (`hooks/usePosts.ts`)
```typescript
export function usePosts(sort: string) {
  return useQuery({
    queryKey: ['posts', sort],
    queryFn: () => client.request<PostsQueryResponse>(POSTS_QUERY, { sort }),
    select: (data) => data.posts,
  })
}
```

### 4. Mutations with Cache Invalidation (`hooks/useMutations.ts`)
```typescript
export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input) => client.request(CREATE_POST_MUTATION, { input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
}
```

## Tech Stack Reference

| Technology | Role | Docs |
|-----------|------|------|
| [Django](https://docs.djangoproject.com/) | Python web framework | Models, ORM, management commands |
| [Strawberry](https://strawberry.rocks/docs) | GraphQL library for Python | Types, queries, mutations |
| [React Query](https://tanstack.com/query/latest) | Server state management | useQuery, useMutation, cache |
| [graphql-request](https://github.com/jasonkuhrt/graphql-request) | Minimal GraphQL client | Sends queries to the API |
| [React + TypeScript](https://react.dev/) | Frontend UI | Components, hooks, type safety |
