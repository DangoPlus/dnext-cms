/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'

interface RichTextRendererProps {
  content: SerializedEditorState
}

// 渲染单个节点
const renderNode = (node: SerializedLexicalNode, index: number): React.ReactNode => {
  const nodeType = node.type

  // 段落节点
  if (nodeType === 'paragraph') {
    const children = 'children' in node ? (node as any).children : []
    return (
      <p key={index}>
        {children.map((child: any, i: number) => renderNode(child, i))}
      </p>
    )
  }

  // 标题节点
  if (nodeType === 'heading') {
    const { tag, children } = node as any
    const HeadingTag = tag as React.ElementType
    return (
      <HeadingTag key={index}>
        {children.map((child: any, i: number) => renderNode(child, i))}
      </HeadingTag>
    )
  }

  // 文本节点
  if (nodeType === 'text') {
    const { text, format } = node as any
    let content: React.ReactNode = text

    // 处理文本格式
    if (format) {
      if (format & 1) content = <strong>{content}</strong> // bold
      if (format & 2) content = <em>{content}</em> // italic
      if (format & 4) content = <s>{content}</s> // strikethrough
      if (format & 8) content = <u>{content}</u> // underline
      if (format & 16) content = <code>{content}</code> // code
      if (format & 32) content = <sub>{content}</sub> // subscript
      if (format & 64) content = <sup>{content}</sup> // superscript
    }

    return <React.Fragment key={index}>{content}</React.Fragment>
  }

  // 链接节点
  if (nodeType === 'link') {
    const { url, children } = node as any
    return (
      <a key={index} href={url} target="_blank" rel="noopener noreferrer">
        {children.map((child: any, i: number) => renderNode(child, i))}
      </a>
    )
  }

  // 列表节点
  if (nodeType === 'list') {
    const { listType, children } = node as any
    const ListTag = listType === 'bullet' ? 'ul' : 'ol'
    return (
      <ListTag key={index}>
        {children.map((child: any, i: number) => renderNode(child, i))}
      </ListTag>
    )
  }

  // 列表项节点
  if (nodeType === 'listitem') {
    const children = 'children' in node ? (node as any).children : []
    return (
      <li key={index}>
        {children.map((child: any, i: number) => renderNode(child, i))}
      </li>
    )
  }

  // 引用节点
  if (nodeType === 'quote') {
    const children = 'children' in node ? (node as any).children : []
    return (
      <blockquote key={index}>
        {children.map((child: any, i: number) => renderNode(child, i))}
      </blockquote>
    )
  }

  // 代码块节点
  if (nodeType === 'code') {
    const { children } = node as any
    const code = children.map((child: any) => child.text).join('\n')
    return (
      <pre key={index}>
        <code>{code}</code>
      </pre>
    )
  }

  // 换行节点
  if (nodeType === 'linebreak') {
    return <br key={index} />
  }

  // 图片节点（Payload 上传的图片）
  if (nodeType === 'upload') {
    const { value, relationTo } = node as any
    if (relationTo === 'media' && value) {
      return (
        <img
          key={index}
          src={value.url}
          alt={value.alt || ''}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )
    }
  }

  // 水平线
  if (nodeType === 'horizontalrule') {
    return <hr key={index} />
  }

  // 未知节点类型，返回空
  return null
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content }) => {
  if (!content || !content.root) {
    return null
  }

  const { children } = content.root as any

  if (!children || children.length === 0) {
    return null
  }

  return (
    <div className="rich-text">
      {children.map((node: SerializedLexicalNode, index: number) =>
        renderNode(node, index),
      )}
    </div>
  )
}
