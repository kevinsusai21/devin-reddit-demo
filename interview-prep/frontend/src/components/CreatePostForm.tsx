import { useState } from 'react'
import { useCreatePost } from '../hooks/useMutations'

const CURRENT_USER = 'kevinsusai21'

export function CreatePostForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const createPost = useCreatePost()

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return
    createPost.mutate(
      { title, content, author: CURRENT_USER },
      {
        onSuccess: () => {
          setTitle('')
          setContent('')
          onClose()
        },
      }
    )
  }

  return (
    <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-zinc-100">Create a Post</h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-200 text-xl cursor-pointer"
        >
          ×
        </button>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500 mb-3"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500 resize-none mb-3"
        rows={4}
      />
      <button
        onClick={handleSubmit}
        disabled={!title.trim() || !content.trim() || createPost.isPending}
        className="bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-6 py-2 rounded-full text-sm font-medium cursor-pointer"
      >
        {createPost.isPending ? 'Posting...' : 'Post'}
      </button>
    </div>
  )
}
