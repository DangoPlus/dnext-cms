import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import { PostCard } from '@/components/blog/PostCard'

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
  })

  return categories.docs.map((category: any) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 获取分类信息
  const categoryResult = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const category = categoryResult.docs[0] as any

  if (!category) {
    notFound()
  }

  // 获取该分类下的文章
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
          categories: {
            contains: category.id,
          },
        },
      ],
    },
    sort: '-publishedDate',
    limit: 50,
    depth: 2,
  })

  return (
    <div className="container">
      <div className="page-header">
        <h1>{category.name}</h1>
        {category.description && <p>{category.description}</p>}
        <span className="count">{posts.totalDocs} 篇文章</span>
      </div>

      {posts.docs.length > 0 ? (
        <div className="posts-grid">
          {posts.docs.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>该分类下暂无文章</p>
        </div>
      )}
    </div>
  )
}
