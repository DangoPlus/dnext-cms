import { getPayload, handleEndpoints, Payload } from 'payload'
import config from '@/payload.config'

import { beforeAll, describe, expect, it } from 'vitest'
import type { User } from '@/payload-types'

let payload: Payload

describe('Automation posts endpoint', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('rejects requests without an API key', async () => {
    const response = await handleEndpoints({
      config,
      request: new Request('http://localhost:3000/api/automation/posts', {
        body: JSON.stringify({
          content: 'test body',
          title: 'test title',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
    })

    expect(response.status).toBe(401)
  })

  it('creates a draft post with mapped automation fields', async () => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1000)}`
    const apiKey = `n8n-test-key-${uniqueSuffix}`
    const user = await payload.create({
      collection: 'users',
      data: {
        apiKey,
        email: `n8n-bot-${uniqueSuffix}@example.com`,
        enableAPIKey: true,
        name: 'n8n Bot',
        password: 'Password123!',
        role: 'author',
      },
    })

    const response = await handleEndpoints({
      config,
      request: new Request('http://localhost:3000/api/automation/posts', {
        body: JSON.stringify({
          content: '# 自动化正文\n\n这是一段由 n8n 写入的测试内容。',
          contentFormat: 'markdown',
          title: '自动化测试文章',
        }),
        headers: {
          Authorization: `users API-Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
    })

    expect(response.status).toBe(201)

    const body = (await response.json()) as {
      author: string | User
      id: string
      slug: string
      source: string
      status: string
      title: string
    }

    expect(body.status).toBe('draft')
    expect(body.source).toBe('n8n')
    expect(body.slug).toBeTruthy()

    const post = await payload.findByID({
      collection: 'posts',
      id: body.id,
    })

    expect(post.author).toBe(user.id)
    expect(post.rawContent).toContain('自动化正文')
    expect(post.contentFormat).toBe('markdown')
    expect(post.source).toBe('n8n')
    expect(post.status).toBe('draft')
    expect(post.slug).toBe(body.slug)
    expect(post.title).toBe('自动化测试文章')
  })
})
