import Link from "next/link";
import * as store from "@/lib/store";

const committeeBadge: Record<string, string> = {
  sports: "bg-maroon/10 text-maroon",
  cultural: "bg-navy/10 text-navy",
};

export default function AdminClubsPage() {
  const clubs = store.getClubs();

  return (
    <div>
      <h1 className="text-xl font-bold text-navy sm:text-2xl">
        Clubs ({clubs.length})
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Manage each sub-club&apos;s core team, members and join requests.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {clubs.map((club) => {
          const core = store.getCoreTeam(club.id);
          const members = store.getMembers(club.id);
          const pendingRequests = store
            .getJoinRequests(club.id)
            .filter((j) => j.status === "PENDING").length;
          return (
            <Link
              key={club.id}
              href={`/admin/clubs/${club.id}`}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${committeeBadge[club.committee]}`}
              >
                {club.committee === "sports"
                  ? "Sports Committee"
                  : "Cultural Committee"}
              </span>
              <h3 className="mt-3 text-base font-semibold text-gray-900">
                {club.name}
              </h3>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span>Core: {core.length}/5</span>
                <span>Members: {members.length}</span>
                {pendingRequests > 0 && (
                  <span className="font-semibold text-amber-600">
                    {pendingRequests} join req.
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
