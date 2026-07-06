import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NotificationsPanel from "@/components/NotificationsPanel";
import EventCalendar from "@/components/EventCalendar";
import PostingsFeed from "@/components/PostingsFeed";
import ClubsDirectory from "@/components/ClubsDirectory";
import Footer from "@/components/Footer";
import * as store from "@/lib/store";
import { committees } from "@/lib/data";

export default async function Home() {
  const [clubs, notificationsData, postingsData, eventsData] = await Promise.all([
    store.getClubs(),
    store.getNotifications(),
    store.getPostings({ status: "APPROVED" }),
    store.getEvents({ status: "APPROVED" }),
  ]);

  const clubNameById = new Map(clubs.map((c) => [c.id, c.name]));

  const clubsWithCounts = await Promise.all(
    clubs.map(async (c) => ({
      ...c,
      members: await store.getMemberCount(c.id),
    }))
  );

  const notifications = notificationsData.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    date: n.createdAt.slice(0, 10),
    priority: n.priority,
    club: n.clubId ? clubNameById.get(n.clubId) : undefined,
  }));

  const postings = postingsData.map((p) => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    date: p.createdAt.slice(0, 10),
    club: clubNameById.get(p.clubId) ?? "",
    tag: p.tag,
  }));

  const events = eventsData.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time,
    venue: e.venue,
    club: clubNameById.get(e.clubId) ?? "",
  }));

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <Hero
        clubCount={clubs.length}
        eventCount={events.length}
        notificationCount={notifications.length}
      />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16 px-4 py-12 sm:px-6 sm:py-16">
        <NotificationsPanel notifications={notifications} />
        <EventCalendar events={events} />
        <PostingsFeed postings={postings} />
        <CommitteesTeaser />
        <ClubsDirectory clubs={clubsWithCounts} />
      </main>
      <Footer />
    </div>
  );
}

async function CommitteesTeaser() {
  const committeeMembers = await store.getCommitteeMembers();
  const filled = committeeMembers.filter((m) => m.name).length;
  const total = committeeMembers.length;

  return (
    <section id="committees" className="scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy sm:text-2xl">
          Committee Structure
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Every club activity runs under the Sports or Cultural Committee.
        </p>
      </div>
      <Link
        href="/committees"
        className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md sm:grid-cols-2"
      >
        {committees.map((committee) => (
          <div
            key={committee.id}
            className={`rounded-xl p-4 ${committee.id === "sports" ? "bg-maroon/5" : "bg-navy/5"}`}
          >
            <p
              className={`text-sm font-semibold ${committee.id === "sports" ? "text-maroon" : "text-navy"}`}
            >
              {committee.name}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {committee.totalMembers} members &middot; 2 from each school
            </p>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 sm:col-span-2">
          <p className="text-xs text-gray-500">
            {filled} of {total} representative seats filled
          </p>
          <span className="text-sm font-medium text-gold">
            View full committee structure &amp; representatives →
          </span>
        </div>
      </Link>
    </section>
  );
}
