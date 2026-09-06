"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { BrandLogo } from "@/components/BrandLogo";

const primary = [
  { href: "/dashboard", label: "Dashboard", icon: IconGrid },
];

const tools = [
  { href: "/tools/common-data-set", label: "Common Data Set", icon: IconTable },
  { href: "/tools/vr-tours", label: "VR Tours", icon: IconGlobe },
  { href: "/tools/list-builder", label: "AI List Builder", icon: IconSpark },
];

export function AppSidebar({
  email,
  name,
}: {
  email: string | null;
  name: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar relative flex w-[260px] shrink-0 flex-col text-[#d7e8eb]">
      <div className="app-sidebar-waves pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative z-10 flex h-full flex-col px-3 py-4">
        <div className="mb-6 rounded-lg bg-white/95 px-2 py-1.5">
          <BrandLogo variant="full" size="sm" priority />
        </div>

        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto">
          <div className="space-y-1">
            {primary.map((item) => (
              <SideLink key={item.href} {...item} active={pathname === item.href} />
            ))}
          </div>

          <div>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8aa8b0]">
              Tools
            </p>
            <div className="space-y-1">
              {tools.map((item) => (
                <SideLink
                  key={item.href}
                  {...item}
                  active={pathname === item.href || pathname.startsWith(item.href)}
                />
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#b5c9cf] transition hover:bg-white/5 hover:text-white"
            >
              <IconHome />
              Public site
            </Link>
            <div className="px-3 pt-2 text-xs text-[#8aa8b0]">
              <p className="truncate font-medium text-[#d7e8eb]">{name}</p>
              {email && <p className="truncate">{email}</p>}
            </div>
            <div className="px-2 pt-2">
              <SignOutButton variant="sidebar" />
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}

function SideLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: () => React.JSX.Element;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "flex items-center gap-3 rounded-md bg-[var(--teal)] px-3 py-2.5 text-sm font-semibold text-white"
          : "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#b5c9cf] transition hover:bg-white/5 hover:text-white"
      }
    >
      <Icon />
      {label}
    </Link>
  );
}

function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconTable() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 4v16" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}
