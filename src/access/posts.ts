import type { Access } from 'payload'
import { publicPostWhere } from '../lib/posts/publicPostWhere'
import type { User } from '../payload-types'

const postWriteRoles = new Set<User['role']>(['admin', 'editor', 'author'])

export const canWritePosts = (user?: Pick<User, 'role'> | null): boolean => {
  if (!user) {
    return false
  }

  return postWriteRoles.has(user.role)
}

export const readPostsAccess: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return publicPostWhere()
}

export const createPostAccess: Access = ({ req: { user } }) => {
  return canWritePosts(user)
}

export const updatePostAccess: Access = ({ req: { user } }) => {
  return canWritePosts(user)
}

export const deletePostAccess: Access = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  return user.role === 'admin' || user.role === 'editor'
}
