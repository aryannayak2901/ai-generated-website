"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Eye, 
  MailCheck, 
  FileSignature, 
  AlertCircle, 
  TrendingUp, 
  RotateCw 
} from "lucide-react";

interface AnalyticsReport {
  isDemo: boolean;
  demoReason?: string;
  activeUsers: number;
  totalPageviews: number;
  dailyTraffic: Array<{ date: string; pageviews: number; activeUsers: number }>;
  events: {
    disclaimer_accepted: number;
    contact_form_submit_success: number;
    cta_clicked: number;
  };
  topPages: Array<{ page: string; views: number }>;
}

export const GA4Dashboard: React.FC = () => {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics/report");
      if (!res.ok) {
        throw new Error(`Report API responded with ${res.status}`);
      }
      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const res = await fetch("/api/analytics/report");
        if (!res.ok) {
          throw new Error(`Report API responded with ${res.status}`);
        }
        const data = await res.json();
        if (active) {
          setReport(data);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Failed to load report");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bb-dashboard-loading" style={{
        padding: "48px",
        background: "#0f1729",
        borderRadius: "8px",
        color: "#ffffff",
        textAlign: "center",
        border: "1px solid rgba(212, 175, 55, 0.2)",
        marginBottom: "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px"
      }}>
        <RotateCw className="animate-spin text-amber-500" size={32} style={{ animation: "spin 2s linear infinite" }} />
        <p className="font-serif text-lg tracking-wide text-slate-300" style={{ fontFamily: "serif" }}>Retrieving Chambers Telemetry Report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="bb-dashboard-error" style={{
        padding: "32px",
        background: "#1e1b1b",
        borderRadius: "8px",
        color: "#ef4444",
        border: "1px solid #ef4444",
        marginBottom: "32px",
        display: "flex",
        alignItems: "center",
        gap: "16px"
      }}>
        <AlertCircle size={32} />
        <div>
          <h4 className="font-bold text-lg" style={{ fontWeight: "bold" }}>System Integration Error</h4>
          <p className="text-sm text-slate-400">{error || "Unknown telemetry query issue"}</p>
        </div>
      </div>
    );
  }

  // SVG Chart dimensions and coordinates computation
  const padding = 40;
  const width = 800;
  const height = 240;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxVal = Math.max(...report.dailyTraffic.map(d => d.pageviews), 50);

  const points = report.dailyTraffic.map((d, i) => {
    const x = padding + (i / (report.dailyTraffic.length - 1)) * chartWidth;
    const y = padding + chartHeight - (d.pageviews / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.length ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ") : "";
  const fillD = points.length ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` : "";

  return (
    <div className="ga4-dashboard-container" style={{
      background: "#0f1729",
      color: "#ffffff",
      padding: "32px",
      borderRadius: "8px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      border: "1px solid rgba(212, 175, 55, 0.3)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      marginBottom: "32px",
      maxHeight: "380px",
      overflowY: "auto",
      position: "relative"
    }}>
      <style>{`
        .ga4-dashboard-container::-webkit-scrollbar {
          width: 8px;
        }
        .ga4-dashboard-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .ga4-dashboard-container::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 4px;
        }
        .ga4-dashboard-container::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
      {/* Header Section */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        paddingBottom: "20px",
        marginBottom: "24px"
      }}>
        <div>
          <h2 style={{
            fontFamily: "serif",
            fontSize: "28px",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            ⚖️ chambers report
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>
            Firm performance and visitor interaction telemetry
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button 
            type="button"
            onClick={fetchReport}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#94a3b8",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              transition: "all 0.3s"
            }}
          >
            <RotateCw size={14} /> Refresh
          </button>
          <span style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: report.isDemo ? "rgba(212, 175, 55, 0.15)" : "rgba(16, 185, 129, 0.15)",
            border: `1px solid ${report.isDemo ? "#d4af37" : "#10b981"}`,
            color: report.isDemo ? "#d4af37" : "#10b981",
            fontSize: "12px",
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: "50px",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: report.isDemo ? "#d4af37" : "#10b981",
              display: "inline-block"
            }} />
            {report.isDemo ? "Demo Simulation" : "Connected Live"}
          </span>
        </div>
      </div>

      {report.isDemo && (
        <div style={{
          background: "rgba(212, 175, 55, 0.08)",
          border: "1px dashed rgba(212, 175, 55, 0.3)",
          color: "#d4af37",
          padding: "12px 16px",
          borderRadius: "6px",
          fontSize: "13px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <AlertCircle size={18} />
          <span>{report.demoReason}</span>
        </div>
      )}

      {/* Metrics Bento Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "32px"
      }}>
        {/* Card 1: Active Users */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "20px",
          borderRadius: "6px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "14px" }}>
            <span>Active Audience</span>
            <Users size={20} style={{ color: "#2dd4bf" }} />
          </div>
          <div style={{ fontSize: "36px", fontWeight: 700, marginTop: "8px", fontFamily: "serif" }}>
            {report.activeUsers}
          </div>
          <span style={{ fontSize: "11px", color: "#10b981", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
            <span style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%", display: "inline-block" }} />
            Live interactive readers right now
          </span>
        </div>

        {/* Card 2: Total Pageviews */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "20px",
          borderRadius: "6px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "14px" }}>
            <span>Weekly Pageviews</span>
            <Eye size={20} style={{ color: "#60a5fa" }} />
          </div>
          <div style={{ fontSize: "36px", fontWeight: 700, marginTop: "8px", fontFamily: "serif" }}>
            {report.totalPageviews}
          </div>
          <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
            Total dynamic loads (last 7 days)
          </span>
        </div>

        {/* Card 3: Lead Submissions */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "20px",
          borderRadius: "6px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "14px" }}>
            <span>Lead Submissions</span>
            <MailCheck size={20} style={{ color: "#f59e0b" }} />
          </div>
          <div style={{ fontSize: "36px", fontWeight: 700, marginTop: "8px", fontFamily: "serif", color: "#d4af37" }}>
            {report.events.contact_form_submit_success}
          </div>
          <span style={{ fontSize: "11px", color: "#10b981", marginTop: "4px", display: "block" }}>
            Consultation inquiries completed
          </span>
        </div>

        {/* Card 4: Disclaimer accepts */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "20px",
          borderRadius: "6px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "14px" }}>
            <span>Disclaimer Accepts</span>
            <FileSignature size={20} style={{ color: "#34d399" }} />
          </div>
          <div style={{ fontSize: "36px", fontWeight: 700, marginTop: "8px", fontFamily: "serif" }}>
            {report.events.disclaimer_accepted}
          </div>
          <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
            Total regulations acknowledged
          </span>
        </div>
      </div>

      {/* Center Section: Chart & Event Lists split */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "24px"
      }}>
        {/* Daily Trend SVG Chart */}
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "20px",
          borderRadius: "6px"
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            fontSize: "16px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <TrendingUp size={16} style={{ color: "#f59e0b" }} /> 7-Day Traffic Velocity
          </h3>

          <div style={{ position: "relative" }}>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
              {/* Gradients */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => (
                <line 
                  key={idx}
                  x1={padding}
                  y1={padding + p * chartHeight}
                  x2={width - padding}
                  y2={padding + p * chartHeight}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                />
              ))}

              {/* Area under curve */}
              {fillD && <path d={fillD} fill="url(#chartGrad)" />}

              {/* Stroke line */}
              {pathD && (
                <path 
                  d={pathD}
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Points & Labels */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle 
                    cx={p.x}
                    cy={p.y}
                    r="5.5"
                    fill="#0f1729"
                    stroke="#d4af37"
                    strokeWidth="2.5"
                  />
                  <text 
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {p.pageviews}
                  </text>
                  <text 
                    x={p.x}
                    y={height - padding + 20}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="11"
                  >
                    {p.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Top Pages List */}
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "20px",
          borderRadius: "6px"
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            fontSize: "16px",
            fontWeight: 600
          }}>
            🏛️ Top Viewed Client Portals
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {report.topPages.map((page, idx) => {
              const total = report.totalPageviews || 1;
              const ratio = Math.min((page.views / total) * 100, 100);
              return (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "monospace", color: "#cbd5e1" }}>{page.page}</span>
                    <span style={{ fontWeight: 600, color: "#d4af37" }}>{page.views} views</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${ratio}%`, height: "100%", background: "#d4af37", borderRadius: "4px" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "16px", marginTop: "16px", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
            <span>CTA Button Click Ratio</span>
            <span style={{ color: "#2dd4bf", fontWeight: "bold" }}>
              {Math.round((report.events.cta_clicked / (report.totalPageviews || 1)) * 100)}% Conversion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
