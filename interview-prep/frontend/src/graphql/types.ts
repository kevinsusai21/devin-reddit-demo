export interface Post {
  id: string
  title: string
  content: string
  author: string
  score: number
  commentCount: number
  createdAt: string
}

export interface Comment {
  id: string
  content: string
  author: string
  score: number
  createdAt: string
  replies: Comment[]
}

export interface PostWithComments extends Post {
  comments: Comment[]
}

// --- Query response types ---

export interface PostsQueryResponse {
  posts: Post[]
}

export interface PostQueryResponse {
  post: PostWithComments
}

// --- Mutation input types ---

export interface CreatePostInput {
  title: string
  content: string
  author: string
}

export interface CreateCommentInput {
  postId: number
  content: string
  author: string
  parentId?: number
}

export interface VoteInput {
  postId?: number
  commentId?: number
  user: string
  direction: number
}
