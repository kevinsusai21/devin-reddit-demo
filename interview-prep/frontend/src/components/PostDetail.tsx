import { useState } from 'react'
import { usePost } from '../hooks/usePost'
import { useCreateComment, useVote } from '../hooks/useMutations'
import { CommentTree } from './CommentTree'

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

export function PostDetail({
  postId,
  onBack,
}: {
  postId: number
  onBack: () => void
}) {
  const [newComment, setNewComment] = useState('')
  const { data: post, isLoading, error } = usePost(postId)
  const createComment = useCreateComment()
  const voteMutation = useVote()

  const handleVote = (direction: number) => {
    voteMutation.mutate({
      postId,
      user: CURRENT_USER,
      direction,
    })
  }

  const submitComment = () => {
    if (!newComment.trim()) return
    createComment.mutate(
      {
        postId,
        content: newComment,
        author: CURRENT_USER,
      },
      {
        onSuccess: () => setNewComment(''),
      }
    )
  }

  if (isLoading) {
    return <p className="text-center text-zinc-400 py-8">Loading post...</p>
  }

  if (error || !post) {
    return <p className="text-center text-red-400 py-8">Failed to load post.</p>
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="text-sm text-zinc-400 hover:text-zinc-200 mb-4 cursor-pointer"
      >
        ← Back to feed
      </button>

      <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-4">
        <div className="flex gap-3">
          {/* Vote column */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleVote(1)}
              className="text-zinc-500 hover:text-orange-500 text-lg cursor-pointer"
            >
              ▲
            </button>
            <span
              className={`text-sm font-bold ${
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
              onClick={() => handleVote(-1)}
              className="text-zinc-500 hover:text-blue-500 text-lg cursor-pointer"
            >
              ▼
            </button>
          </div>

          {/* Post content */}
          <div className="flex-1">
            <div className="text-xs text-zinc-400 mb-1">
              Posted by{' '}
              <span className="text-orange-400">{post.author}</span> ·{' '}
              {timeAgo(post.createdAt)}
            </div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">
              {post.title}
            </h2>
            <p className="text-zinc-300 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </div>

      {/* New comment form */}
      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500 resize-none mb-2"
          rows={3}
        />
        <button
          onClick={submitComment}
          disabled={!newComment.trim() || createComment.isPending}
          className="bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
        >
          {createComment.isPending ? 'Commenting...' : 'Comment'}
        </button>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-zinc-400 mb-3">
          {post.commentCount} Comment{post.commentCount !== 1 ? 's' : ''}
        </h3>
        <CommentTree comments={post.comments} postId={postId} />
      </div>
    </div>
  )
}
