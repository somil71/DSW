import Link from "next/link";
import { notFound } from "next/navigation";
import * as store from "@/lib/store";
import { committees } from "@/lib/data";
import { getClubMonogram, getPositionInitials } from "@/lib/club-visuals";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const committeeStyles = {
  sports: {
    hero: "from-maroon to-maroon-light",
    badge: "bg-white/15 text-white",
    monogram: "bg-white/15 text-white border-white/30",
    avatar: "bg-maroon/10 text-maroon",
  },
  cultural: {
    hero: "from-navy to-navy-dark",
    badge: "bg-white/15 text-white",
    monogram: "bg-white/15 text-white border-white/30",
    avatar: "bg-navy/10 text-navy",
  },
} as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function ClubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const club = await store.getClubById(id);
  if (!club) notFound();

  const style = committeeStyles[club.committee];
  const committee = committees.find((c) => c.id === club.committee);
  const core = await store.getCoreTeam(id);
  const members = await store.getMembers(id);
  const memberCount = await store.getMemberCount(id);
  const events = await store.getEvents({ clubId: id, status: "APPROVED" });
  const postings = await store.getPostings({ clubId: id, status: "APPROVED" });

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <section className={`bg-gradient-to-br ${style.hero} text-white`}>
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <Link
            href="/#clubs"
            className="text-xs font-medium text-white/70 hover:text-gold-light"
          >
            ← All Clubs
          </Link>
        </div>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 pb-12 text-center sm:flex-row sm:text-left sm:px-6">
          <div
            className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 text-3xl font-bold ${style.monogram}`}
          >
            {getClubMonogram(club.name)}
          </div>
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${style.badge}`}
            >
              {committee?.name}
            </span>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
              {club.name}
            </h1>
            <p className="mt-2 text-sm text-white/70">
              {club.meetingDay} &middot; {memberCount} members
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-10">
            <div>
              <h2 className="text-lg font-bold text-navy">About the Club</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {club.description}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-navy">Meet the Team</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {core.map((u) => (
                  <div key={u.id} className="text-center">
                    <div
                      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-sm font-bold ${style.avatar}`}
                    >
                      {getPositionInitials(u.position ?? "")}
                    </div>
                    <p className="mt-2 text-xs font-semibold text-gray-900">
                      {u.position}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                Plus {members.length} general members. Real names, photos and
                IDs are issued by the DSW office.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-navy">Upcoming Events</h2>
              <div className="mt-4 space-y-3">
                {events.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No upcoming events yet — check back soon.
                  </p>
                )}
                {events.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {e.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(e.date)} &middot; {e.time} &middot;{" "}
                      {e.venue}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-navy">Postings</h2>
              <div className="mt-4 space-y-3">
                {postings.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No postings yet from this club.
                  </p>
                )}
                {postings.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {p.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{p.summary}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(p.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Interested in joining?
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Log in to your student portal to send a join request, or
                reach out to the DSW office directly.
              </p>
              <Link
                href="/login"
                className="mt-4 block w-full rounded-full bg-gold px-4 py-2 text-center text-xs font-semibold text-navy-dark hover:bg-gold-light"
              >
                Portal Login
              </Link>
              <a
                href="mailto:dsw@iilm.edu"
                className="mt-2 block w-full rounded-full border border-gray-200 px-4 py-2 text-center text-xs font-semibold text-navy hover:bg-gray-50"
              >
                Contact via DSW Office
              </a>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Club Facts
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Committee</dt>
                  <dd className="font-medium text-gray-900">
                    {committee?.name}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Meets</dt>
                  <dd className="font-medium text-gray-900">
                    {club.meetingDay}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Core Team</dt>
                  <dd className="font-medium text-gray-900">
                    {core.length}/5
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Total Members</dt>
                  <dd className="font-medium text-gray-900">{memberCount}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
