import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import { PostCard } from '@/components/blog/PostCard'
import { publicPostWhere } from '@/lib/posts/publicPostWhere'
import type { Tag, Post } from '@/payload-types'

export const revalidate = 0

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const tags = await payload.find({
    collection: 'tags',
    limit: 1000,
  })

  return tags.docs.map((tag) => ({
    slug: (tag as Tag).slug,
  }))
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 获取标签信息
  const tagResult = await payload.find({
    collection: 'tags',
    where: {
      slug: {
        equals: decodedSlug,
      },
    },
    limit: 1,
  })

  const tag = tagResult.docs[0] as Tag

  if (!tag) {
    notFound()
  }

  // 获取该标签下的文章
  const posts = await payload.find({
    collection: 'posts',
    where: publicPostWhere({
      tags: {
        contains: tag.id,
      },
    }),
    sort: '-publishedDate',
    limit: 50,
    depth: 2,
  })

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="tag-title">
          <span className="hash">#</span>
          {tag.name}
        </h1>
        <span className="count">{posts.totalDocs} 篇文章</span>
      </div>

      {posts.docs.length > 0 ? (
        <div className="posts-grid">
          {posts.docs.map((post) => (
            <PostCard key={post.id} post={post as Post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>该标签下暂无文章</p>
        </div>
      )}
    </div>
  )
}
