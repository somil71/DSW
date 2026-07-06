import * as store from "@/lib/store";
import { CORE_POSITIONS } from "@/lib/store";
import { getPermissions } from "@/lib/permissions";
import {
  assignCoreAction,
  createEventAction,
  createPostingAction,
  decideEventAction,
  decideJoinRequestAction,
  decidePostingAction,
  removeCoreAction,
} from "@/lib/actions";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ClubManagementPanel({
  clubId,
  isAdmin,
  viewerPosition,
}: {
  clubId: string;
  isAdmin: boolean;
  viewerPosition?: string;
}) {
  const club = store.getClubById(clubId);
  if (!club) return null;

  const permissions = getPermissions(viewerPosition, isAdmin);
  const core = store.getCoreTeam(clubId);
  const members = store.getMembers(clubId);
  const joinRequests = store
    .getJoinRequests(clubId)
    .filter((j) => j.status === "PENDING");
  const postings = store.getPostings({ clubId });
  const events = store.getEvents({ clubId });
  const availablePositions = CORE_POSITIONS.filter(
    (p) => !core.some((c) => c.position === p),
  );

  return (
    <div className="space-y-8">
      {!isAdmin && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-navy/10 bg-navy/[0.03] px-4 py-3 text-xs text-navy">
          <span className="font-semibold uppercase tracking-wide">
            Your access as {viewerPosition ?? "Member"}:
          </span>
          {permissions.manageRoster && <span className="rounded-full bg-white px-2 py-0.5">Roster</span>}
          {permissions.manageJoinRequests && <span className="rounded-full bg-white px-2 py-0.5">Join Requests</span>}
          {permissions.managePostings && <span className="rounded-full bg-white px-2 py-0.5">Postings</span>}
          {permissions.manageEvents && <span className="rounded-full bg-white px-2 py-0.5">Events</span>}
          {!permissions.manageRoster &&
            !permissions.manageJoinRequests &&
            !permissions.managePostings &&
            !permissions.manageEvents && (
              <span className="rounded-full bg-white px-2 py-0.5">
                View only
              </span>
            )}
        </div>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Core Team ({core.length}/5)
        </h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {core.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{u.name}</p>
                <p className="text-xs text-gold">{u.position}</p>
              </div>
              {permissions.manageRoster && (
                <form action={removeCoreAction}>
                  <input type="hidden" name="userId" value={u.id} />
                  <button
                    type="submit"
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </form>
              )}
            </div>
          ))}
          {core.length === 0 && (
            <p className="text-sm text-gray-400">No core team assigned yet.</p>
          )}
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Members ({members.length})
        </h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {members.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 px-4 py-2.5"
            >
              <p className="text-sm font-medium text-gray-900">{u.name}</p>
              {!permissions.manageRoster ? null : availablePositions.length >
                0 ? (
                <form
                  action={assignCoreAction}
                  className="flex items-center gap-1.5"
                >
                  <input type="hidden" name="userId" value={u.id} />
                  <select
                    name="position"
                    className="rounded-md border border-gray-200 bg-white px-1.5 py-1 text-xs"
                  >
                    {availablePositions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-navy px-2.5 py-1 text-xs font-medium text-white hover:bg-navy-dark"
                  >
                    Promote
                  </button>
                </form>
              ) : (
                <span className="text-xs text-gray-400">Core team full</span>
              )}
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-sm text-gray-400">No regular members yet.</p>
          )}
        </div>
      </section>

      {joinRequests.length > 0 && (isAdmin || permissions.manageJoinRequests) && (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Pending Join Requests
          </h3>
          <div className="mt-3 space-y-2">
            {joinRequests.map((jr) => {
              const student = store.getUserById(jr.userId);
              return (
                <div
                  key={jr.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-2.5"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {student?.name ?? "Unknown student"}
                  </p>
                  <div className="flex gap-2">
                    <form action={decideJoinRequestAction.bind(null, jr.id, true)}>
                      <button
                        type="submit"
                        className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={decideJoinRequestAction.bind(null, jr.id, false)}>
                      <button
                        type="submit"
                        className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            {permissions.managePostings ? "New Posting" : "Postings"}
          </h3>
          {permissions.managePostings && (
            <form action={createPostingAction} className="mt-3 space-y-2">
              {isAdmin && <input type="hidden" name="clubId" value={clubId} />}
              <input
                name="title"
                required
                placeholder="Title"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <textarea
                name="summary"
                required
                placeholder="Summary"
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <select
                name="tag"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="Announcement">Announcement</option>
                <option value="Recruitment">Recruitment</option>
                <option value="Result">Result</option>
                <option value="Achievement">Achievement</option>
              </select>
              <button
                type="submit"
                className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy-dark hover:bg-gold-light"
              >
                Submit for DSW approval
              </button>
            </form>
          )}

          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
            {postings.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-gray-100 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {p.title}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles[p.status]}`}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(p.createdAt)}
                </p>
                {isAdmin && p.status === "PENDING" && (
                  <div className="mt-2 flex gap-2">
                    <form action={decidePostingAction.bind(null, p.id, true)}>
                      <button className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                        Approve
                      </button>
                    </form>
                    <form action={decidePostingAction.bind(null, p.id, false)}>
                      <button className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300">
                        Reject
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
            {postings.length === 0 && (
              <p className="text-sm text-gray-400">No postings yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            {permissions.manageEvents ? "New Event" : "Events"}
          </h3>
          {permissions.manageEvents && (
            <form action={createEventAction} className="mt-3 space-y-2">
              {isAdmin && <input type="hidden" name="clubId" value={clubId} />}
              <input
                name="title"
                required
                placeholder="Event title"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <input
                  name="date"
                  type="date"
                  required
                  className="w-1/2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                <input
                  name="time"
                  required
                  placeholder="e.g. 5:00 PM"
                  className="w-1/2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <input
                name="venue"
                required
                placeholder="Venue"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy-dark hover:bg-gold-light"
              >
                Submit for DSW approval
              </button>
            </form>
          )}

          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
            {events.map((e) => (
              <div
                key={e.id}
                className="rounded-xl border border-gray-100 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {e.title}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles[e.status]}`}
                  >
                    {e.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(e.date)} &middot; {e.time} &middot; {e.venue}
                </p>
                {isAdmin && e.status === "PENDING" && (
                  <div className="mt-2 flex gap-2">
                    <form action={decideEventAction.bind(null, e.id, true)}>
                      <button className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                        Approve
                      </button>
                    </form>
                    <form action={decideEventAction.bind(null, e.id, false)}>
                      <button className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300">
                        Reject
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-gray-400">No events yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
