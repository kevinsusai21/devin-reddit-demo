import { useQuery } from '@tanstack/react-query'
import { client } from '../graphql/client'
import { POST_QUERY } from '../graphql/queries'
import type { PostQueryResponse } from '../graphql/types'

export function usePost(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => client.request<PostQueryResponse>(POST_QUERY, { id }),
    select: (data) => data.post,
    enabled: id > 0,
  })
}
