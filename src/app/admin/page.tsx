import Link from "next/link";
import * as store from "@/lib/store";

export default async function AdminOverviewPage() {
  const [clubs, users, pendingPostings, pendingEvents, allJoinRequests] = await Promise.all([
    store.getClubs(),
    store.getUsers(),
    store.getPostings({ status: "PENDING" }),
    store.getEvents({ status: "PENDING" }),
    store.getJoinRequests(),
  ]);
  const pendingJoinRequests = allJoinRequests.filter((j) => j.status === "PENDING");

  const stats = [
    { label: "Sub-Clubs", value: clubs.length },
    { label: "Total Students", value: users.length - 1 },
    {
      label: "Pending Approvals",
      value: pendingPostings.length + pendingEvents.length,
    },
    { label: "Pending Join Requests", value: pendingJoinRequests.length },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-navy sm:text-2xl">
        DSW Admin Overview
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Oversight for every committee, sub-club, posting and event across the
        university.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm sm:text-left"
          >
            <p className="text-2xl font-bold text-navy">{s.value}</p>
            <p className="mt-1 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/analytics"
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-semibold text-navy">View Analytics</p>
          <p className="mt-1 text-xs text-gray-500">
            Membership and activity charts across every club.
          </p>
        </Link>
        <Link
          href="/admin/approvals"
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-semibold text-navy">Review Approvals</p>
          <p className="mt-1 text-xs text-gray-500">
            {pendingPostings.length} postings, {pendingEvents.length} events
            waiting on you.
          </p>
        </Link>
        <Link
          href="/admin/clubs"
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-semibold text-navy">Manage Clubs</p>
          <p className="mt-1 text-xs text-gray-500">
            Rosters, core team assignments and join requests.
          </p>
        </Link>
        <Link
          href="/admin/notifications"
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-semibold text-navy">
            Publish Notification
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Send a university-wide or club-specific circular.
          </p>
        </Link>
      </div>
    </div>
  );
}
