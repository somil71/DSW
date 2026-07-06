"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CommitteeId } from "@/lib/data";
import { getClubMonogram } from "@/lib/club-visuals";

export interface ClubItem {
  id: string;
  name: string;
  committee: CommitteeId;
  description: string;
  meetingDay: string;
  members: number;
}

const filters: { id: "all" | CommitteeId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sports", label: "Sports Committee" },
  { id: "cultural", label: "Cultural Committee" },
];

const committeeLabel: Record<CommitteeId, string> = {
  sports: "Sports Committee",
  cultural: "Cultural Committee",
};

const committeeBadge: Record<CommitteeId, string> = {
  sports: "bg-maroon/10 text-maroon",
  cultural: "bg-navy/10 text-navy",
};

const monogramBg: Record<CommitteeId, string> = {
  sports: "bg-maroon text-white",
  cultural: "bg-navy text-white",
};

export default function ClubsDirectory({ clubs }: { clubs: ClubItem[] }) {
  const [filter, setFilter] = useState<"all" | CommitteeId>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      const matchesFilter = filter === "all" || c.committee === filter;
      const matchesQuery =
        query.trim().length === 0 ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, clubs]);

  return (
    <section id="clubs" className="scroll-mt-20">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            Sub-Club Directory
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Every sub-club runs under the Sports or Cultural Committee. Click
            a club to see its page, team and events.
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sub-clubs..."
          className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none ring-gold/40 transition focus:ring-2 sm:w-64"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
              filter === f.id
                ? "bg-navy text-white"
                : "bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-400">
          No sub-clubs match your search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((club) => (
            <Link
              key={club.id}
              href={`/clubs/${club.id}`}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${monogramBg[club.committee]}`}
                >
                  {getClubMonogram(club.name)}
                </div>
                <span className="text-xs text-gray-400">
                  {club.members} members
                </span>
              </div>
              <span
                className={`mt-3 w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${committeeBadge[club.committee]}`}
              >
                {committeeLabel[club.committee]}
              </span>
              <h3 className="mt-3 text-base font-semibold text-gray-900">
                {club.name}
              </h3>
              <p className="mt-2 flex-1 text-sm text-gray-500">
                {club.description}
              </p>
              <div className="mt-4 space-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500">
                <p>
                  <span className="font-medium text-gray-700">Meets:</span>{" "}
                  {club.meetingDay}
                </p>
                <span className="inline-block font-medium text-gold">
                  View club page →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
