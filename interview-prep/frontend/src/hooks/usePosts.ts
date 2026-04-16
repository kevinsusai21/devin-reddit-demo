import { useQuery } from '@tanstack/react-query'
import { client } from '../graphql/client'
import { POSTS_QUERY } from '../graphql/queries'
import type { PostsQueryResponse } from '../graphql/types'

export function usePosts(sort: string) {
  return useQuery({
    queryKey: ['posts', sort],
    queryFn: () => client.request<PostsQueryResponse>(POSTS_QUERY, { sort }),
    select: (data) => data.posts,
  })
}
