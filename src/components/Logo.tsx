import React from 'react'

export const Logo = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
      }}>
        D
      </div>
      <span style={{
        fontSize: '20px',
        fontWeight: '600',
        color: 'var(--theme-text)',
        letterSpacing: '-0.5px'
      }}>
        DNext CMS
      </span>
    </div>
  )
}
