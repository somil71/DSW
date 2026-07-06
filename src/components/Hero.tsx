import { committees } from "@/lib/data";

export default function Hero({
  clubCount,
  eventCount,
  notificationCount,
}: {
  clubCount: number;
  eventCount: number;
  notificationCount: number;
}) {
  const stats = [
    { label: "Committees", value: committees.length },
    { label: "Sub-Clubs", value: clubCount },
    { label: "Upcoming Events", value: eventCount },
    { label: "Live Notifications", value: notificationCount },
  ];

  return (
    <section
      id="top"
      className="bg-gradient-to-br from-navy via-navy to-navy-dark text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
          Office of the Dean of Student Welfare
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
          One home for every committee, club, notification and event at IILM
          University
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-white/70 sm:text-base">
          Building structure, ensuring transparency: every activity now runs
          as a sub-club under the Sports Committee or Cultural Committee,
          coordinated centrally through the DSW office.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center sm:text-left"
            >
              <p className="text-2xl font-bold text-gold-light sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-white/60 sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
