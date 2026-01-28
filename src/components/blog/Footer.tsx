import React from 'react'

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} DNext Blog. All rights reserved.</p>
        <p>Powered by Payload CMS & Next.js</p>
      </div>
    </footer>
  )
}
