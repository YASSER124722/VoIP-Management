"use client";

import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/extensions", label: "Extensions", icon: "☎" },
  { href: "/calls", label: "Calls", icon: "📞\uFE0E" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside>
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Company Logo" />
      </div>

      <nav>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <a
              key={item.href}
              href={item.href}
              className={isActive ? "active" : ""}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
