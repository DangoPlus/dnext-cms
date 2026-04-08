import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'
import config from '@/payload.config'
import { publicPostWhere } from '@/lib/posts/publicPostWhere'
import type { Category } from '@/payload-types'

export default async function CategoriesPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'name',
  })

  // 统计每个分类的文章数量
  const categoriesWithCount = await Promise.all(
    categories.docs.map(async (category) => {
      const posts = await payload.find({
        collection: 'posts',
        where: publicPostWhere({
          categories: {
            contains: category.id,
          },
        }),
        limit: 0,
      })

      return {
        ...category,
        postCount: posts.totalDocs,
      }
    }),
  )

  return (
    <div className="container">
      <div className="page-header">
        <h1>文章分类</h1>
        <p>浏览所有文章分类</p>
      </div>

      <div className="categories-grid">
        {categoriesWithCount.map((category) => (
          <Link
            key={(category as Category).id}
            href={`/categories/${(category as Category).slug}`}
            className="category-card"
          >
            <h2>{(category as Category).name}</h2>
            {(category as Category).description && <p className="description">{(category as Category).description}</p>}
            <span className="count">{(category as unknown as { postCount: number }).postCount} 篇文章</span>
          </Link>
        ))}
      </div>

      {categoriesWithCount.length === 0 && (
        <div className="empty-state">
          <p>暂无分类</p>
        </div>
      )}
    </div>
  )
}
