import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Image
              src="/dsw-logo.png"
              alt="IILM University — Office of Dean Students' Welfare"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                Office of the Dean of Student Welfare
              </p>
              <p className="mt-1 max-w-sm text-xs text-white/50">
                IILM University &middot; Central hub for club activity,
                notifications and student engagement.
              </p>
            </div>
          </div>
          <div className="text-xs text-white/50">
            <p>dsw@iilm.edu</p>
            <p className="mt-1">+91-120-XXXX-XXX</p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold-light/80">
          One University. One Culture. One Vision.
        </p>
        <p className="mt-2 text-center text-[11px] text-white/30">
          &copy; {new Date().getFullYear()} IILM University. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
