import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div 
        style={{ 
          width: '40px', 
          height: '40px', 
          backgroundColor: '#C5A059', 
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0A1128',
          fontWeight: 'bold',
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.2rem'
        }}
      >
        JB
      </div>
      <span 
        style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '1.1rem', 
          fontWeight: 600,
          color: '#FFFFFF',
          letterSpacing: '0.5px'
        }}
      >
        Chambers of<br/>Jeet Bhatt
      </span>
    </div>
  )
}

export default Logo
