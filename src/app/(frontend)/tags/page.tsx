import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'
import config from '@/payload.config'
import type { Tag } from '@/payload-types'

type TagWithCount = Tag & { postCount: number }

export default async function TagsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const tags = await payload.find({
    collection: 'tags',
    limit: 100,
    sort: 'name',
  })

  // 统计每个标签的文章数量
  const tagsWithCount: TagWithCount[] = await Promise.all(
    tags.docs.map(async (tag) => {
      const posts = await payload.find({
        collection: 'posts',
        where: {
          and: [
            {
              status: {
                equals: 'published',
              },
            },
            {
              tags: {
                contains: (tag as Tag).id,
              },
            },
          ],
        },
        limit: 0,
      })

      return {
        ...(tag as Tag),
        postCount: posts.totalDocs,
      }
    }),
  )

  return (
    <div className="container">
      <div className="page-header">
        <h1>标签云</h1>
        <p>浏览所有文章标签</p>
      </div>

      <div className="tags-cloud">
        {tagsWithCount.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.slug}`}
            className="tag-item"
            style={{
              backgroundColor: tag.color ? `${tag.color}20` : undefined,
              borderColor: tag.color || undefined,
            }}
          >
            <span className="name">#{tag.name}</span>
            <span className="count">{tag.postCount}</span>
          </Link>
        ))}
      </div>

      {tagsWithCount.length === 0 && (
        <div className="empty-state">
          <p>暂无标签</p>
        </div>
      )}
    </div>
  )
}
