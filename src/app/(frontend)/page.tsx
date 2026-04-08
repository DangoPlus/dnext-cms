import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'
import config from '@/payload.config'
import { PostCard } from '@/components/blog/PostCard'
import { publicPostWhere } from '@/lib/posts/publicPostWhere'
import type { Post } from '@/payload-types'

export const revalidate = 0

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 获取已发布的文章
  const posts = await payload.find({
    collection: 'posts',
    where: publicPostWhere(),
    sort: '-publishedDate',
    limit: 12,
    depth: 2, // 深度查询关联数据
  })

  // 获取推荐文章
  const featuredPosts = await payload.find({
    collection: 'posts',
    where: publicPostWhere({
      featured: {
        equals: true,
      },
    }),
    sort: '-publishedDate',
    limit: 3,
    depth: 2,
  })

  return (
    <div className="container">
      {/* 推荐文章区域 */}
      {featuredPosts.docs.length > 0 && (
        <section className="featured-section">
          <h2 className="section-title">推荐文章</h2>
          <div className="featured-posts">
            {featuredPosts.docs.map((post) => (
              <PostCard key={post.id} post={post as Post} />
            ))}
          </div>
        </section>
      )}

      {/* 最新文章区域 */}
      <section className="posts-section">
        <h2 className="section-title">最新文章</h2>
        {posts.docs.length > 0 ? (
          <div className="posts-grid">
            {posts.docs.map((post) => (
              <PostCard key={post.id} post={post as Post} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>暂无文章，请在后台创建第一篇文章。</p>
            <Link href="/admin" className="button">
              前往管理后台
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
