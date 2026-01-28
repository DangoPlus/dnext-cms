import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import config from '@/payload.config'
import { RichTextRenderer } from '@/components/blog/RichTextRenderer'

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
  })

  return posts.docs.map((post: any) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const post = result.docs[0]

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    keywords: post.seo?.keywords,
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const post = result.docs[0] as any

  if (!post) {
    notFound()
  }

  const formatDate = (date?: string) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="container">
      <article className="post-detail">
        {/* 文章头部 */}
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            {post.publishedDate && (
              <time className="date">{formatDate(post.publishedDate)}</time>
            )}
            {post.author && <span className="author">· 作者：{post.author.name}</span>}
            {post.viewCount !== undefined && (
              <span className="views">· 阅读：{post.viewCount}</span>
            )}
          </div>

          {/* 分类和标签 */}
          <div className="post-taxonomy">
            {post.categories && post.categories.length > 0 && (
              <div className="categories">
                {post.categories.map((category: any) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="category-tag"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="tags">
                {post.tags.map((tag: any) => (
                  <Link key={tag.id} href={`/tags/${tag.slug}`} className="tag">
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 特色图片 */}
        {post.featuredImage && (
          <div className="post-featured-image">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              width={1200}
              height={600}
              className="image"
              priority
            />
          </div>
        )}

        {/* 文章内容 */}
        <div className="post-content">
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          {/* 富文本内容渲染 */}
          {post.content && <RichTextRenderer content={post.content} />}
        </div>

        {/* 文章底部 */}
        <footer className="post-footer">
          <div className="author-info">
            {post.author?.avatar && (
              <Image
                src={post.author.avatar.url}
                alt={post.author.name}
                width={60}
                height={60}
                className="avatar"
              />
            )}
            <div className="author-details">
              <h3>{post.author?.name}</h3>
              {post.author?.bio && <p>{post.author.bio}</p>}
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
