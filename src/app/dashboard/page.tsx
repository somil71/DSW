import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { logoutAction, requestJoinAction } from "@/lib/actions";
import * as store from "@/lib/store";
import ClubManagementPanel from "@/components/ClubManagementPanel";

function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
      >
        Logout
      </button>
    </form>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");

  const club = user.clubId ? store.getClubById(user.clubId) : null;

  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="bg-navy">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-gold-light">
              {user.role === "CORE" ? user.position : "Member"}
              {club ? ` — ${club.name}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-white/70 hover:text-gold-light"
            >
              View public site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {user.role === "CORE" && club && (
          <>
            <h1 className="text-xl font-bold text-navy sm:text-2xl">
              Manage {club.name}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Postings and events you submit go to the DSW office for
              approval before appearing on the public site.
            </p>
            <div className="mt-6">
              <ClubManagementPanel
                clubId={club.id}
                isAdmin={false}
                viewerPosition={user.position}
              />
            </div>
          </>
        )}

        {user.role === "MEMBER" && club && (
          <MemberClubView clubId={club.id} />
        )}

        {user.role === "MEMBER" && !club && <JoinFlow userId={user.id} />}
      </main>
    </div>
  );
}

function MemberClubView({ clubId }: { clubId: string }) {
  const club = store.getClubById(clubId)!;
  const core = store.getCoreTeam(clubId);
  const events = store.getEvents({ clubId, status: "APPROVED" });
  const postings = store.getPostings({ clubId, status: "APPROVED" });

  return (
    <div>
      <h1 className="text-xl font-bold text-navy sm:text-2xl">
        {club.name}
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        {club.description}
      </p>
      <p className="mt-2 text-xs font-medium text-gold">
        Meets: {club.meetingDay}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Core Team
          </h3>
          <div className="mt-3 space-y-2">
            {core.map((u) => (
              <div key={u.id} className="flex justify-between text-sm">
                <span className="text-gray-900">{u.name}</span>
                <span className="text-gold">{u.position}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Upcoming Events
          </h3>
          <div className="mt-3 space-y-2">
            {events.length === 0 && (
              <p className="text-sm text-gray-400">No approved events yet.</p>
            )}
            {events.map((e) => (
              <div key={e.id} className="text-sm">
                <p className="font-medium text-gray-900">{e.title}</p>
                <p className="text-xs text-gray-500">
                  {e.date} &middot; {e.time} &middot; {e.venue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Club Postings
        </h3>
        <div className="mt-3 space-y-2">
          {postings.length === 0 && (
            <p className="text-sm text-gray-400">No postings yet.</p>
          )}
          {postings.map((p) => (
            <div key={p.id} className="text-sm">
              <p className="font-medium text-gray-900">{p.title}</p>
              <p className="text-xs text-gray-500">{p.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JoinFlow({ userId }: { userId: string }) {
  const clubs = store.getClubs();
  const pending = store.getPendingJoinRequestFor(userId);

  return (
    <div>
      <h1 className="text-xl font-bold text-navy sm:text-2xl">
        Join a Sub-Club
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        You&apos;re not part of a club yet. Request to join one below — a
        core team member will approve it.
      </p>

      {pending && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your request to join{" "}
          <strong>{store.getClubById(pending.clubId)?.name}</strong> is
          pending approval.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-gray-900">
              {club.name}
            </h3>
            <p className="mt-2 flex-1 text-xs text-gray-500">
              {club.description}
            </p>
            <form action={requestJoinAction} className="mt-3">
              <input type="hidden" name="clubId" value={club.id} />
              <button
                type="submit"
                disabled={!!pending}
                className="w-full rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Request to Join
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
