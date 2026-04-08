import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import config from '@/payload.config'
import { PlainTextRenderer } from '@/components/blog/PlainTextRenderer'
import { RichTextRenderer } from '@/components/blog/RichTextRenderer'
import { publicPostWhere } from '@/lib/posts/publicPostWhere'
import type { Post, Category, Tag, User, Media } from '@/payload-types'

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const posts = await payload.find({
    collection: 'posts',
    where: publicPostWhere(),
    limit: 1000,
  })

  return posts.docs.map((post) => ({
    slug: (post as Post).slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'posts',
    where: publicPostWhere({
      slug: {
        equals: slug,
      },
    }),
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
    where: publicPostWhere({
      slug: {
        equals: slug,
      },
    }),
    limit: 1,
    depth: 2,
  })

  const post = result.docs[0] as Post

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
            {post.author && typeof post.author === 'object' && <span className="author">· 作者：{(post.author as User).name}</span>}
            {post.viewCount !== undefined && (
              <span className="views">· 阅读：{post.viewCount}</span>
            )}
          </div>

          {/* 分类和标签 */}
          <div className="post-taxonomy">
            {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && (
              <div className="categories">
                {post.categories.map((category) => {
                  const cat = category as Category
                  return (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="category-tag"
                    >
                      {cat.name}
                    </Link>
                  )
                })}
              </div>
            )}
            {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="tags">
                {post.tags.map((tag) => {
                  const t = tag as Tag
                  return (
                    <Link key={t.id} href={`/tags/${t.slug}`} className="tag">
                      #{t.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </header>

        {/* 特色图片 */}
        {post.featuredImage && typeof post.featuredImage === 'object' && (
          <div className="post-featured-image">
            <Image
              src={(post.featuredImage as Media).url || ''}
              alt={(post.featuredImage as Media).alt || post.title}
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
          {post.content && <RichTextRenderer content={post.content} />}
          {!post.content && post.rawContent && <PlainTextRenderer content={post.rawContent} />}
        </div>

        {/* 文章底部 */}
        <footer className="post-footer">
          <div className="author-info">
            {post.author && typeof post.author === 'object' && (post.author as User).avatar && typeof (post.author as User).avatar === 'object' && (
              <Image
                src={((post.author as User).avatar as Media).url || ''}
                alt={(post.author as User).name || ''}
                width={60}
                height={60}
                className="avatar"
              />
            )}
            <div className="author-details">
              {post.author && typeof post.author === 'object' && <h3>{(post.author as User).name}</h3>}
              {post.author && typeof post.author === 'object' && (post.author as User).bio && <p>{(post.author as User).bio}</p>}
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
