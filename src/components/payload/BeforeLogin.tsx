// src/components/payload/BeforeLogin.tsx
import React from 'react'

export const BeforeLogin: React.FC = () => {
  return (
    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <h1 
        style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '2rem', 
          color: '#ffffff',
          marginBottom: '0.5rem'
        }}
      >
        Welcome Back
      </h1>
      <p 
        style={{ 
          fontFamily: "'Public Sans', sans-serif", 
          color: '#94a3b8', /* Slate 400 */
          fontSize: '1rem'
        }}
      >
        Sign in to manage chambers content and configurations.
      </p>
    </div>
  )
}
