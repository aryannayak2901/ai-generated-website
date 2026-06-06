const fs = require('fs');

const path = './src/components/payload/HeaderPreview.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetStart = `            <div style={{ background: "#0a0e1a", height: "100%", position: "relative" }}>
              <div 
                style={{ 
                  background: "#0f1729", 
                  borderBottom: "1px solid rgba(212, 175, 55, 0.2)", 
                  padding: "14px 20px",
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center"
                }}
              >`;

const targetEnd = `                  <Menu size={16} style={{ color: mobileMenuOpen ? "#d4af37" : "#ffffff" }} />
                </button>
              </div>`;

if (!code.includes(targetStart) || !code.includes(targetEnd)) {
  console.log('Could not find target block');
  process.exit(1);
}

const newBlock = `            <div style={{ background: "#0a0e1a", height: "100%", position: "relative" }}>
              
              {/* Dynamic Simulated Mobile Top Bar */}
              <div 
                style={{ 
                  background: headerStyle === "glassmorphic" ? "rgba(15, 23, 41, 0.85)" : 
                              headerStyle === "island" ? "transparent" :
                              headerStyle === "minimal" ? "#080c14" : 
                              headerStyle === "sidebar" ? "#060911" : "#0f1729", 
                  backdropFilter: headerStyle === "glassmorphic" ? "blur(12px)" : "none",
                  borderBottom: headerStyle === "island" || headerStyle === "glassmorphic" ? "none" : 
                                headerStyle === "minimal" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(212, 175, 55, 0.2)", 
                  padding: headerStyle === "island" ? "12px 16px" : "14px 20px",
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  flexDirection: headerStyle === "sidebar" && drawerPosition === "left" ? "row-reverse" : "row"
                }}
              >
                {/* Optional Island Inner Wrapper */}
                <div style={
                  headerStyle === "island" 
                    ? {
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "rgba(15, 23, 41, 0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        borderRadius: "50px",
                        padding: "6px 10px 6px 16px",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.5)"
                      } 
                    : { 
                        display: "contents" 
                      }
                }>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt={logoAlt} style={{ width: headerStyle === "island" ? "20px" : "24px", height: headerStyle === "island" ? "20px" : "24px", objectFit: "contain" }} />
                    ) : (
                      <span style={{ color: "#d4af37", fontSize: headerStyle === "island" ? "12px" : "14px" }}>⚖️</span>
                    )}
                    {(headerStyle !== "minimal" || !logoUrl) && (
                      <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: headerStyle === "island" ? "11px" : "12px", color: "#ffffff", letterSpacing: "0.5px" }}>Chambers of JB</span>
                    )}
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ 
                      background: headerStyle === "island" ? "transparent" : "rgba(255, 255, 255, 0.05)", 
                      border: headerStyle === "island" ? "none" : "1px solid rgba(212, 175, 55, 0.2)", 
                      color: "#ffffff", 
                      cursor: "pointer", 
                      width: "32px", 
                      height: "32px", 
                      borderRadius: headerStyle === "island" ? "16px" : "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      outline: "none"
                    }}
                  >
                    <Menu size={16} style={{ color: mobileMenuOpen ? "#d4af37" : "#ffffff" }} />
                  </button>
                </div>
              </div>`;

const startIndex = code.indexOf(targetStart);
const endIndex = code.indexOf(targetEnd) + targetEnd.length;

code = code.substring(0, startIndex) + newBlock + code.substring(endIndex);

fs.writeFileSync(path, code);
console.log('Success');
