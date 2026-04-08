import React from 'react'

interface PlainTextRendererProps {
  content: string
}

export const PlainTextRenderer: React.FC<PlainTextRendererProps> = ({ content }) => {
  if (!content.trim()) {
    return null
  }

  return (
    <div
      className="plain-text-content"
      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
    >
      {content}
    </div>
  )
}
