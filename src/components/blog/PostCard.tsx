/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

interface PostCardProps {
  post: any
}

export const PostCard = ({ post }: PostCardProps) => {
  const formatDate = (date?: string) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const featuredImage = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const author = typeof post.author === 'object' ? post.author : null

  return (
    <article className="post-card">
      {featuredImage && (
        <Link href={`/posts/${post.slug}`} className="post-card-image">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || post.title}
            width={800}
            height={400}
            className="image"
          />
        </Link>
      )}
      <div className="post-card-content">
        <div className="post-card-meta">
          {post.publishedDate && (
            <time className="date">{formatDate(post.publishedDate)}</time>
          )}
          {author && <span className="author">· {author.name}</span>}
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h2 className="post-card-title">{post.title}</h2>
        </Link>
        {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}
        {post.categories && post.categories.length > 0 && (
          <div className="post-card-categories">
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
      </div>
    </article>
  )
}
