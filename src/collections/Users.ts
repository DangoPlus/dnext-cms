import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
  },
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: false, // 邮箱验证（可选）
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  access: {
    // 只有管理员可以创建用户
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
    // 只有管理员可以读取所有用户
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // 普通用户只能读取自己的信息
      return {
        id: {
          equals: user.id,
        },
      }
    },
    // 管理员可以更新所有，用户可以更新自己
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        id: {
          equals: user.id,
        },
      }
    },
    // 只有管理员可以删除
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: '姓名',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      label: '角色',
      // 第一个用户默认为管理员，之后为编辑
      defaultValue: 'admin',
      options: [
        {
          label: '管理员',
          value: 'admin',
        },
        {
          label: '编辑',
          value: 'editor',
        },
        {
          label: '作者',
          value: 'author',
        },
        {
          label: '访客',
          value: 'viewer',
        },
      ],
      access: {
        // 只有管理员可以修改角色
        update: ({ req: { user } }) => {
          return user?.role === 'admin'
        },
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: '头像',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: '个人简介',
    },
  ],
}
