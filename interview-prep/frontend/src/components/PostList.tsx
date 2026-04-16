import { usePosts } from '../hooks/usePosts'
import { useVote, useDeletePost } from '../hooks/useMutations'
import type { Post } from '../graphql/types'

const CURRENT_USER = 'kevinsusai21'

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function PostCard({
  post,
  onSelect,
}: {
  post: Post
  onSelect: (id: number) => void
}) {
  const voteMutation = useVote()
  const deletePost = useDeletePost()

  const handleVote = (e: React.MouseEvent, direction: number) => {
    e.stopPropagation()
    voteMutation.mutate({
      postId: Number(post.id),
      user: CURRENT_USER,
      direction,
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deletePost.mutate(Number(post.id))
  }

  return (
    <div
      onClick={() => onSelect(Number(post.id))}
      className="bg-zinc-800 rounded-lg border border-zinc-700 mb-3 hover:border-zinc-500 transition-colors cursor-pointer"
    >
      <div className="flex gap-3 p-3">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <button
            onClick={(e) => handleVote(e, 1)}
            className="text-zinc-500 hover:text-orange-500 text-sm cursor-pointer"
          >
            ▲
          </button>
          <span
            className={`text-xs font-bold ${
              post.score > 0
                ? 'text-orange-400'
                : post.score < 0
                ? 'text-blue-400'
                : 'text-zinc-400'
            }`}
          >
            {post.score}
          </span>
          <button
            onClick={(e) => handleVote(e, -1)}
            className="text-zinc-500 hover:text-blue-500 text-sm cursor-pointer"
          >
            ▼
          </button>
        </div>

        {/* Post content */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-zinc-400 mb-1">
            Posted by <span className="text-orange-400">{post.author}</span> ·{' '}
            {timeAgo(post.createdAt)}
          </div>
          <h3 className="text-base font-semibold text-zinc-100 mb-1">
            {post.title}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-2">{post.content}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
            <span>💬 {post.commentCount} comments</span>
            {post.author === CURRENT_USER && (
              <button
                onClick={handleDelete}
                className="hover:text-red-400 cursor-pointer"
              >
                🗑 Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PostList({
  sort,
  onSortChange,
  onSelectPost,
}: {
  sort: string
  onSortChange: (sort: string) => void
  onSelectPost: (id: number) => void
}) {
  const { data: posts, isLoading, error } = usePosts(sort)

  return (
    <>
      {/* Sort tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'hot', label: '🔥 Hot' },
          { key: 'new', label: '🕐 New' },
          { key: 'top', label: '📈 Top' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSortChange(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              sort === key
                ? 'bg-zinc-700 text-zinc-100'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <p className="text-center text-zinc-400 py-8">Loading posts...</p>
      )}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-sm mb-4">
          Failed to fetch posts. Make sure the backend is running.
        </div>
      )}

      {/* Posts feed */}
      {!isLoading && posts && posts.length === 0 && (
        <div className="text-center text-zinc-500 py-12">
          <p className="text-lg mb-2">No posts yet</p>
          <p className="text-sm">Be the first to create a post!</p>
        </div>
      )}
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} onSelect={onSelectPost} />
      ))}
    </>
  )
}
