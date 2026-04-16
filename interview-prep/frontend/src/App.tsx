import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PostList } from './components/PostList'
import { PostDetail } from './components/PostDetail'
import { CreatePostForm } from './components/CreatePostForm'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
})

function AppContent() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [sortBy, setSortBy] = useState('new')

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Header */}
      <header className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setSelectedPostId(null)
              setShowCreate(false)
            }}
          >
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
              F
            </div>
            <h1 className="text-lg font-bold">
              <span className="text-orange-500">r/</span>FoodieFinds
            </h1>
          </div>
          <button
            onClick={() => {
              setShowCreate(!showCreate)
              setSelectedPostId(null)
            }}
            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer"
          >
            + Create Post
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Create Post Form */}
        {showCreate && <CreatePostForm onClose={() => setShowCreate(false)} />}

        {/* Post Detail or Feed */}
        {selectedPostId ? (
          <PostDetail
            postId={selectedPostId}
            onBack={() => setSelectedPostId(null)}
          />
        ) : (
          <PostList
            sort={sortBy}
            onSortChange={setSortBy}
            onSelectPost={setSelectedPostId}
          />
        )}
      </main>

      {/* Footer with tech stack info */}
      <footer className="border-t border-zinc-800 py-4 mt-8">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-zinc-600">
          Built with Django · Strawberry GraphQL · React Query · React + TypeScript
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
