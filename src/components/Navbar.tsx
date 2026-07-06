import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/lib/actions";

const links = [
  { href: "/#notifications", label: "Notifications" },
  { href: "/#calendar", label: "Calendar" },
  { href: "/#postings", label: "Postings" },
  { href: "/committees", label: "Committees" },
  { href: "/#clubs", label: "Clubs" },
];

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/#top" className="flex items-center gap-3">
          <Image
            src="/dsw-logo.png"
            alt="IILM University — Office of Dean Students' Welfare"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
            priority
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white sm:text-base">
              IILM University
            </p>
            <p className="text-[11px] uppercase tracking-wider text-gold-light sm:text-xs">
              Dean of Student Welfare
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition hover:text-gold-light"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy-dark transition hover:bg-gold-light sm:text-sm"
              >
                {user.role === "ADMIN" ? "Admin Console" : "My Dashboard"}
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="hidden text-xs font-medium text-white/70 hover:text-gold-light sm:block"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy-dark transition hover:bg-gold-light sm:text-sm"
            >
              Portal Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
