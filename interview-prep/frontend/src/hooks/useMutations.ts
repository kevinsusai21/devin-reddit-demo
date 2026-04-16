import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../graphql/client'
import {
  CREATE_POST_MUTATION,
  CREATE_COMMENT_MUTATION,
  VOTE_MUTATION,
  DELETE_POST_MUTATION,
  DELETE_COMMENT_MUTATION,
} from '../graphql/queries'
import type { CreatePostInput, CreateCommentInput, VoteInput } from '../graphql/types'

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreatePostInput) =>
      client.request(CREATE_POST_MUTATION, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCommentInput) =>
      client.request(CREATE_COMMENT_MUTATION, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post'] })
    },
  })
}

export function useVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: VoteInput) =>
      client.request(VOTE_MUTATION, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post'] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      client.request(DELETE_POST_MUTATION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      client.request(DELETE_COMMENT_MUTATION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post'] })
    },
  })
}
