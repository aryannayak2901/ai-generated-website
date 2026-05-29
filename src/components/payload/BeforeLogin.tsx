import React from 'react'

export const BeforeLogin: React.FC = () => {
  return (
    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <h1 
        style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '2.5rem', 
          color: '#FFFFFF',
          marginBottom: '0.5rem',
          fontWeight: 600
        }}
      >
        Welcome Back
      </h1>
      <p 
        style={{ 
          fontFamily: "'Public Sans', sans-serif", 
          color: '#A0ABC0',
          fontSize: '1rem'
        }}
      >
        Sign in to manage the Chambers of Jeet Bhatt portfolio.
      </p>
    </div>
  )
}

export default BeforeLogin
