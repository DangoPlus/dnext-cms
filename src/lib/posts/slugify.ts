import type { PayloadRequest } from 'payload'

const MAX_SLUG_LENGTH = 96

const trimSlug = (value: string): string => {
  const trimmed = value.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '')
  return trimmed || 'post'
}

export const slugifyTitle = (value: string): string => {
  const normalized = value
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!normalized) {
    return `post-${Date.now().toString(36)}`
  }

  return trimSlug(normalized)
}

type GenerateUniquePostSlugArgs = {
  preferredSlug?: string | null
  req: PayloadRequest
  title?: string | null
}

export const generateUniquePostSlug = async ({
  preferredSlug,
  req,
  title,
}: GenerateUniquePostSlugArgs): Promise<string> => {
  const baseSlug = slugifyTitle(preferredSlug || title || 'post')

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidateSlug = attempt === 0 ? baseSlug : trimSlug(`${baseSlug}-${attempt + 1}`)

    const existingPosts = await req.payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      req,
      where: {
        slug: {
          equals: candidateSlug,
        },
      },
    })

    if (existingPosts.docs.length === 0) {
      return candidateSlug
    }
  }

  return trimSlug(`${baseSlug}-${Date.now().toString(36)}`)
}
