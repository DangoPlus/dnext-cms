import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'publishedDate', 'updatedAt'],
  },
  // 启用版本控制
  versions: {
    drafts: {
      autosave: {
        interval: 1000, // 自动保存间隔（毫秒）
      },
    },
    maxPerDoc: 50,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: '文章标题',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL别名',
      admin: {
        description: '用于 URL 的唯一标识符',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: '状态',
      options: [
        {
          label: '草稿',
          value: 'draft',
        },
        {
          label: '已发布',
          value: 'published',
        },
        {
          label: '归档',
          value: 'archived',
        },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: '作者',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: '发布日期',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: '特色图片',
      admin: {
        description: '文章的封面图片',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: '摘要',
      admin: {
        description: '文章的简短描述，用于列表和 SEO',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: '内容',
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: '分类',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: '标签',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO 设置',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO 标题',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO 描述',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'SEO 关键词',
        },
      ],
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      label: '浏览次数',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: '推荐文章',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
