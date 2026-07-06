import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/lib/actions";

const navLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/approvals", label: "Approvals" },
  { href: "/admin/clubs", label: "Clubs" },
  { href: "/admin/committees", label: "Committees" },
  { href: "/admin/notifications", label: "Notifications" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="bg-navy-dark">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/dsw-logo.png"
              alt="IILM University — Office of Dean Students' Welfare"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              priority
            />
            <div>
              <p className="text-sm font-semibold text-white">DSW Admin</p>
              <p className="text-xs text-gold-light">{user.name}</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/80 hover:text-gold-light"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="text-xs font-medium text-white/60 hover:text-gold-light"
            >
              Public site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
              >
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
