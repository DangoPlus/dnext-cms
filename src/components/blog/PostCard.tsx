import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string
    publishedDate?: string
    featuredImage?: {
      url: string
      alt: string
    }
    author?: {
      name: string
    }
    categories?: Array<{
      id: string
      name: string
      slug: string
    }>
  }
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

  return (
    <article className="post-card">
      {post.featuredImage && (
        <Link href={`/posts/${post.slug}`} className="post-card-image">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
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
          {post.author && <span className="author">· {post.author.name}</span>}
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h2 className="post-card-title">{post.title}</h2>
        </Link>
        {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}
        {post.categories && post.categories.length > 0 && (
          <div className="post-card-categories">
            {post.categories.map((category) => (
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
