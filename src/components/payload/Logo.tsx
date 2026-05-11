// src/components/payload/Logo.tsx
import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div 
        style={{ 
          width: '32px', 
          height: '32px', 
          backgroundColor: '#d4af37', 
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0f1729',
          fontWeight: 'bold',
          fontFamily: "'Playfair Display', serif"
        }}
      >
        JB
      </div>
      <span 
        style={{ 
          fontSize: '1.25rem', 
          fontWeight: 600, 
          fontFamily: "'Playfair Display', serif",
          color: '#ffffff',
          letterSpacing: '0.05em'
        }}
      >
        Chambers of Jeet Bhatt
      </span>
    </div>
  )
}
