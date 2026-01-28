import Link from 'next/link'
import React from 'react'

export const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link href="/" className="logo">
          <h1>DNext Blog</h1>
        </Link>
        <nav className="nav">
          <Link href="/">首页</Link>
          <Link href="/categories">分类</Link>
          <Link href="/tags">标签</Link>
          <Link href="/admin" target="_blank">管理后台</Link>
        </nav>
      </div>
    </header>
  )
}
