import type { Endpoint } from 'payload'
import { canWritePosts } from '../../access/posts'
import { generateUniquePostSlug } from '../../lib/posts/slugify'

type AutomationPostStatus = 'draft' | 'published'
type AutomationContentFormat = 'plain' | 'markdown'

type AutomationPostInput = {
  content?: unknown
  contentFormat?: unknown
  excerpt?: unknown
  status?: unknown
  title?: unknown
}

type AutomationUser = {
  _strategy?: string
  collection?: string
  id: string
  role: 'admin' | 'editor' | 'author' | 'viewer'
}

const parseStatus = (value: unknown): AutomationPostStatus | null => {
  if (value === undefined) {
    return 'draft'
  }

  if (value === 'draft' || value === 'published') {
    return value
  }

  return null
}

const parseContentFormat = (value: unknown): AutomationContentFormat | null => {
  if (value === undefined) {
    return 'plain'
  }

  if (value === 'plain' || value === 'markdown') {
    return value
  }

  return null
}

export const createAutomationPostEndpoint: Endpoint = {
  path: '/automation/posts',
  method: 'post',
  handler: async (req) => {
    const authorization = req.headers.get('Authorization')

    if (!authorization?.startsWith('users API-Key ')) {
      return Response.json(
        {
          message: '缺少有效的 API Key 请求头。',
        },
        {
          status: 401,
        },
      )
    }

    const user = req.user as AutomationUser | null

    if (!user || user.collection !== 'users' || user._strategy !== 'api-key') {
      return Response.json(
        {
          message: '当前请求未通过 API Key 鉴权。',
        },
        {
          status: 401,
        },
      )
    }

    if (!canWritePosts(user)) {
      return Response.json(
        {
          message: '当前用户没有写入文章的权限。',
        },
        {
          status: 403,
        },
      )
    }

    let body: AutomationPostInput

    if (!req.json) {
      return Response.json(
        {
          message: '当前请求不支持 JSON 请求体。',
        },
        {
          status: 400,
        },
      )
    }

    try {
      body = (await req.json()) as AutomationPostInput
    } catch {
      return Response.json(
        {
          message: '请求体必须是合法的 JSON。',
        },
        {
          status: 400,
        },
      )
    }

    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const rawContent = typeof body.content === 'string' ? body.content : ''
    const excerpt =
      typeof body.excerpt === 'string' && body.excerpt.trim().length > 0
        ? body.excerpt.trim()
        : undefined
    const status = parseStatus(body.status)
    const contentFormat = parseContentFormat(body.contentFormat)

    if (!title) {
      return Response.json(
        {
          message: 'title 为必填项。',
        },
        {
          status: 400,
        },
      )
    }

    if (!rawContent.trim()) {
      return Response.json(
        {
          message: 'content 为必填项。',
        },
        {
          status: 400,
        },
      )
    }

    if (!status) {
      return Response.json(
        {
          message: 'status 仅支持 draft 或 published。',
        },
        {
          status: 400,
        },
      )
    }

    if (!contentFormat) {
      return Response.json(
        {
          message: 'contentFormat 仅支持 plain 或 markdown。',
        },
        {
          status: 400,
        },
      )
    }

    const slug = await generateUniquePostSlug({
      req,
      title,
    })

    const postData = {
      _status: status === 'published' ? ('published' as const) : ('draft' as const),
      author: user.id,
      contentFormat,
      excerpt,
      rawContent,
      slug,
      source: 'n8n' as const,
      status,
      title,
    }

    const post =
      status === 'published'
        ? await req.payload.create({
            collection: 'posts',
            data: postData,
            draft: false,
            depth: 0,
            overrideAccess: false,
            req,
          })
        : await req.payload.create({
            collection: 'posts',
            data: postData,
            draft: true,
            depth: 0,
            overrideAccess: false,
            req,
          })

    return Response.json(
      {
        authorId: typeof post.author === 'object' ? post.author.id : post.author,
        id: post.id,
        publishedDate: post.publishedDate,
        slug: post.slug,
        source: post.source,
        status: post.status,
        title: post.title,
      },
      {
        status: 201,
      },
    )
  },
}
