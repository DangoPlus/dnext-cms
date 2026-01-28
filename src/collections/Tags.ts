import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
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
      label: '标签名称',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'URL别名',
      unique: true,
    },
    {
      name: 'color',
      type: 'text',
      label: '标签颜色',
      admin: {
        description: '十六进制颜色代码，如 #FF5733',
      },
    },
  ],
}
