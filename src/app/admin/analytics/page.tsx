import * as store from "@/lib/store";
import {
  CommitteeSplitChart,
  ContentStatusChart,
  MembersByClubChart,
} from "@/components/AdminCharts";

function shortName(name: string) {
  return name.replace(/\s*IILM$/, "");
}

function countByStatus(list: { status: string }[]) {
  return {
    Approved: list.filter((x) => x.status === "APPROVED").length,
    Pending: list.filter((x) => x.status === "PENDING").length,
    Rejected: list.filter((x) => x.status === "REJECTED").length,
  };
}

export default async function AdminAnalyticsPage() {
  const [clubs, postings, events, users] = await Promise.all([
    store.getClubs(),
    store.getPostings(),
    store.getEvents(),
    store.getUsers(),
  ]);

  const memberCounts = new Map<string, number>();
  users.forEach((u) => {
    if (u.clubId) {
      memberCounts.set(u.clubId, (memberCounts.get(u.clubId) || 0) + 1);
    }
  });
  const getMemberCount = (clubId: string) => memberCounts.get(clubId) || 0;

  const membersByClub = clubs
    .map((c) => ({
      name: shortName(c.name),
      members: getMemberCount(c.id),
    }))
    .sort((a, b) => b.members - a.members);

  const sportsMembers = clubs
    .filter((c) => c.committee === "sports")
    .reduce((sum, c) => sum + getMemberCount(c.id), 0);
  const culturalMembers = clubs
    .filter((c) => c.committee === "cultural")
    .reduce((sum, c) => sum + getMemberCount(c.id), 0);

  const committeeSplit = [
    { name: "Sports Committee", value: sportsMembers },
    { name: "Cultural Committee", value: culturalMembers },
  ];

  const contentStatus = [
    { name: "Postings", ...countByStatus(postings) },
    { name: "Events", ...countByStatus(events) },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-navy sm:text-2xl">Analytics</h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Club activity and membership at a glance across every committee.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <MembersByClubChart data={membersByClub} />
        </div>
        <CommitteeSplitChart data={committeeSplit} />
        <ContentStatusChart data={contentStatus} />
      </div>
    </div>
  );
}
