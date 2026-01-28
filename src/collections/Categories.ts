import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: '分类名称',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'URL别名',
      unique: true,
      admin: {
        description: '用于 URL 的唯一标识符',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述',
    },
  ],
}
