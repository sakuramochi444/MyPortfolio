"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

  // 管理画面（/admin, /login）ではヘッダーを表示しない
  const isAdminPage = pathname.startsWith("/admin") || pathname.startsWith("/login");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (!mounted || isAdminPage) return null;

  return (
    <header className="portfolio-header">
      <div className="header-container">
        <div className="logo">
          <Link href="/">三宅 泰知</Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""}>
                About
              </Link>
            </li>
            <li>
              <Link href="/work" className={pathname.startsWith("/work") ? "active" : ""}>
                Work
              </Link>
            </li>
            <li>
              <button
                id="darkModeToggle"
                className="dark-mode-toggle"
                onClick={toggleTheme}
              >
                {theme === "light" ? "Dark" : "Light"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
