import React from 'react'
import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'
import './styles.css'

export const metadata = {
  description: '一个基于 Payload CMS 和 Next.js 构建的现代化博客',
  title: 'DNext Blog - 现代化博客系统',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main className="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
