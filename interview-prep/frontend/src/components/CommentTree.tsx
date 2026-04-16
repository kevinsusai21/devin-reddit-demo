import { useState } from 'react'
import type { Comment } from '../graphql/types'
import { useCreateComment, useVote, useDeleteComment } from '../hooks/useMutations'

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

function CommentItem({
  comment,
  postId,
}: {
  comment: Comment
  postId: number
}) {
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [collapsed, setCollapsed] = useState(false)

  const createComment = useCreateComment()
  const voteMutation = useVote()
  const deleteComment = useDeleteComment()

  const handleVote = (direction: number) => {
    voteMutation.mutate({
      commentId: Number(comment.id),
      user: CURRENT_USER,
      direction,
    })
  }

  const submitReply = () => {
    if (!replyContent.trim()) return
    createComment.mutate(
      {
        postId,
        content: replyContent,
        author: CURRENT_USER,
        parentId: Number(comment.id),
      },
      {
        onSuccess: () => {
          setReplyContent('')
          setShowReply(false)
        },
      }
    )
  }

  const handleDelete = () => {
    deleteComment.mutate(Number(comment.id))
  }

  return (
    <div className="pl-4 border-l-2 border-zinc-700 mt-3">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hover:text-zinc-200 cursor-pointer"
        >
          {collapsed ? '▸' : '▾'}
        </button>
        <span className="font-semibold text-orange-400">{comment.author}</span>
        <span>·</span>
        <span>{timeAgo(comment.createdAt)}</span>
        <span>·</span>
        <span>{comment.score} pts</span>
      </div>

      {!collapsed && (
        <>
          <p className="text-sm text-zinc-200 mt-1 ml-5">{comment.content}</p>
          <div className="flex items-center gap-3 mt-1 ml-5">
            <button
              onClick={() => handleVote(1)}
              className="text-zinc-500 hover:text-orange-500 text-sm cursor-pointer"
            >
              ▲
            </button>
            <button
              onClick={() => handleVote(-1)}
              className="text-zinc-500 hover:text-blue-500 text-sm cursor-pointer"
            >
              ▼
            </button>
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              Reply
            </button>
            {comment.author === CURRENT_USER && (
              <button
                onClick={handleDelete}
                className="text-xs text-zinc-500 hover:text-red-400 cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>

          {showReply && (
            <div className="ml-5 mt-2 flex gap-2">
              <input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitReply()}
                placeholder="Write a reply..."
                className="flex-1 bg-zinc-800 border border-zinc-600 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={submitReply}
                className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded text-sm cursor-pointer"
              >
                Reply
              </button>
            </div>
          )}

          {comment.replies?.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} />
          ))}
        </>
      )}
    </div>
  )
}

export function CommentTree({
  comments,
  postId,
}: {
  comments: Comment[]
  postId: number
}) {
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
      {comments.length === 0 && (
        <p className="text-sm text-zinc-500 italic">No comments yet. Be the first!</p>
      )}
    </div>
  )
}
