import { getPayload } from 'payload'
import config from '../payload.config'

const resetAdmin = async () => {
  const payload = await getPayload({ config })
  const adminUrl = 'http://localhost:3000/admin'

  try {
    // 删除所有用户
    const users = await payload.find({
      collection: 'users',
      limit: 100,
    })

    console.log(`找到 ${users.docs.length} 个用户`)

    for (const user of users.docs) {
      await payload.delete({
        collection: 'users',
        id: user.id,
      })
      console.log(`已删除用户: ${user.email}`)
    }

    console.log('\n所有用户已删除！')
    console.log(`现在访问 ${adminUrl} 创建新的管理员账号`)

    process.exit(0)
  } catch (error) {
    console.error('错误:', error)
    process.exit(1)
  }
}

resetAdmin()
