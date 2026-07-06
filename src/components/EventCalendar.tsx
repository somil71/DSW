"use client";

import { useMemo, useState } from "react";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  club: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function EventCalendar({ events }: { events: EventItem[] }) {
  const initial = useMemo(() => {
    const first = events
      .map((e) => new Date(e.date))
      .sort((a, b) => a.getTime() - b.getTime())[0];
    return first ?? new Date();
  }, [events]);

  const [cursor, setCursor] = useState(
    new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
  const [selected, setSelected] = useState<string | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = cursor.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const upcoming = [...events]
    .filter((e) => (selected ? e.date === selected : true))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section id="calendar" className="scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy sm:text-2xl">
          Club Activity Calendar
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Every club event and DSW deadline in one shared calendar.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-500 transition hover:bg-gray-50"
              aria-label="Previous month"
            >
              ‹
            </button>
            <p className="text-sm font-semibold text-navy sm:text-base">
              {monthLabel}
            </p>
            <button
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-500 transition hover:bg-gray-50"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-gray-400">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              const key = toKey(year, month, day);
              const dayEvents = eventsByDate.get(key) ?? [];
              const isSelected = selected === key;
              return (
                <button
                  key={key}
                  onClick={() =>
                    setSelected((prev) => (prev === key ? null : key))
                  }
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition ${
                    isSelected
                      ? "bg-navy text-white"
                      : dayEvents.length
                        ? "bg-gold/10 text-navy hover:bg-gold/20"
                        : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {day}
                  {dayEvents.length > 0 && (
                    <span
                      className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-gold-light" : "bg-gold"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="mt-4 text-xs font-medium text-navy underline underline-offset-2"
            >
              Clear selected date
            </button>
          )}
        </div>

        <div className="scrollbar-thin max-h-[420px] space-y-3 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {selected ? "Events on selected date" : "Upcoming events"}
          </p>
          {upcoming.length === 0 && (
            <p className="text-sm text-gray-400">No events scheduled.</p>
          )}
          {upcoming.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-gray-100 bg-navy/[0.03] p-3"
            >
              <p className="text-sm font-semibold text-gray-900">
                {e.title}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(e.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}{" "}
                &middot; {e.time} &middot; {e.venue}
              </p>
              <p className="mt-1 text-xs font-medium text-gold">{e.club}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
