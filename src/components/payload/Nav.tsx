"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConfig, useAuth } from "@payloadcms/ui";
import {
  FileText,
  Users,
  UserCircle,
  Image as ImageIcon,
  PenTool,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronRight,
} from "lucide-react";

export const Nav: React.FC = () => {
  const { config } = useConfig();
  const { user } = useAuth();
  const pathname = usePathname();

  // Defensive check for config
  if (!config) return null;

  // In Payload 3.0, the admin route might be in different places depending on version
  const adminPath =
    (config as any).routes?.admin || (config as any).admin?.routes?.admin || "/admin";

  const collections = (config.collections || []).filter((c) => !c.admin.hidden);
  const globals = (config.globals || []).filter((g) => !g.admin.hidden);

  const getIcon = (slug: string) => {
    switch (slug) {
      case "pages":
        return <FileText size={18} />;
      case "team":
        return <Users size={18} />;
      case "users":
        return <UserCircle size={18} />;
      case "media":
        return <ImageIcon size={18} />;
      case "posts":
        return <PenTool size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  const isActive = (href: string) => {
    if (!href || !pathname) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="bb-nav-container">
      <div className="bb-nav-header">
        <div className="bb-nav-header-logo">🏛️</div>
      </div>

      <div className="bb-nav-main">
        <div className="bb-nav-group">
          <Link
            href={adminPath}
            className={`bb-nav-item ${pathname === adminPath ? "bb-nav-item--active" : ""}`}
          >
            <div className="bb-nav-icon">
              <LayoutDashboard size={18} />
            </div>
            <span className="bb-nav-label">Dashboard</span>
          </Link>
        </div>

        <div className="bb-nav-group">
          <h3 className="bb-nav-group-title">Collections</h3>
          {collections.map((collection) => {
            if (!collection?.slug) return null;
            const href = `${adminPath}/collections/${collection.slug}`;
            return (
              <Link
                key={collection.slug}
                href={href}
                className={`bb-nav-item ${isActive(href) ? "bb-nav-item--active" : ""}`}
              >
                <div className="bb-nav-icon">{getIcon(collection.slug)}</div>
                <span className="bb-nav-label">
                  {(collection.labels?.plural as string) || collection.slug}
                </span>
                <ChevronRight className="bb-nav-chevron" size={14} />
              </Link>
            );
          })}
        </div>

        <div className="bb-nav-group">
          <h3 className="bb-nav-group-title">Globals</h3>
          {globals.map((global) => {
            if (!global?.slug) return null;
            const href = `${adminPath}/globals/${global.slug}`;
            return (
              <Link
                key={global.slug}
                href={href}
                className={`bb-nav-item ${isActive(href) ? "bb-nav-item--active" : ""}`}
              >
                <div className="bb-nav-icon">
                  <Settings size={18} />
                </div>
                <span className="bb-nav-label">
                  {(global.label as string) || global.slug}
                </span>
                <ChevronRight className="bb-nav-chevron" size={14} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bb-nav-footer">
        <Link href={`${adminPath}/account`} className="bb-nav-account-link">
          <div className="bb-nav-user-avatar">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="bb-nav-user-info">
            <span className="bb-nav-user-name">{user?.email || "Admin"}</span>
          </div>
        </Link>
        <Link
          href={`${adminPath}/logout`}
          className="bb-nav-logout-btn"
          title="Logout"
        >
          <LogOut size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Nav;
