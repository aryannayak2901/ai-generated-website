const fs = require('fs');

const path = './src/components/payload/HeaderPreview.tsx';
let code = fs.readFileSync(path, 'utf8');

const replacement = `              {/* Dynamic Simulated Mobile Top Bar */}
              {headerStyle === "corporate" && (
                <div style={{ background: "#0a0e1a", padding: "4px 16px", display: "flex", justifyContent: "flex-end", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "8px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
                  <span>{contactEmail} | {contactPhone}</span>
                </div>
              )}
              <div 
                style={{`;

code = code.replace(
  /\{\/\* Dynamic Simulated Mobile Top Bar \*\/\}\n\s*<div \n\s*style=\{\{/g,
  replacement
);

fs.writeFileSync(path, code);
console.log('Success HeaderPreview.tsx');

const navbarPath = './src/components/Navbar.tsx';
let navbarCode = fs.readFileSync(navbarPath, 'utf8');

// The corporate top tier in Navbar.tsx currently is:
// <div className="w-full bg-[#0a0e1a] border-b border-white/5 hidden md:block">
// Let's remove hidden md:block
navbarCode = navbarCode.replace(
  /<div className="w-full bg-\[#0a0e1a\] border-b border-white\/5 hidden md:block">/g,
  '<div className="w-full bg-[#0a0e1a] border-b border-white/5">'
);

fs.writeFileSync(navbarPath, navbarCode);
console.log('Success Navbar.tsx');
