import { gql } from 'graphql-request'

export const POSTS_QUERY = gql`
  query Posts($sort: String!) {
    posts(sort: $sort) {
      id
      title
      content
      author
      score
      commentCount
      createdAt
    }
  }
`

export const POST_QUERY = gql`
  query Post($id: Int!) {
    post(id: $id) {
      id
      title
      content
      author
      score
      commentCount
      createdAt
      comments {
        id
        content
        author
        score
        createdAt
        replies {
          id
          content
          author
          score
          createdAt
          replies {
            id
            content
            author
            score
            createdAt
            replies {
              id
              content
              author
              score
              createdAt
            }
          }
        }
      }
    }
  }
`

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      author
    }
  }
`

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      author
    }
  }
`

export const VOTE_MUTATION = gql`
  mutation Vote($input: VoteInput!) {
    vote(input: $input)
  }
`

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id)
  }
`
