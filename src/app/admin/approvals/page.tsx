import * as store from "@/lib/store";
import { decideEventAction, decidePostingAction } from "@/lib/actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ApprovalsPage() {
  const postings = store.getPostings({ status: "PENDING" });
  const events = store.getEvents({ status: "PENDING" });
  const clubNameById = new Map(store.getClubs().map((c) => [c.id, c.name]));

  return (
    <div>
      <h1 className="text-xl font-bold text-navy sm:text-2xl">
        Pending Approvals
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Every posting and event submitted by a core team is queued here until
        the DSW office approves it.
      </p>

      <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Postings ({postings.length})
        </h2>
        <div className="mt-3 space-y-3">
          {postings.length === 0 && (
            <p className="text-sm text-gray-400">Nothing pending.</p>
          )}
          {postings.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  {p.title}
                </p>
                <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-navy">
                  {clubNameById.get(p.clubId)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{p.summary}</p>
              <p className="mt-1 text-xs text-gray-400">
                {p.tag} &middot; {formatDate(p.createdAt)}
              </p>
              <div className="mt-3 flex gap-2">
                <form action={decidePostingAction.bind(null, p.id, true)}>
                  <button className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                    Approve
                  </button>
                </form>
                <form action={decidePostingAction.bind(null, p.id, false)}>
                  <button className="rounded-full bg-gray-200 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-300">
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Events ({events.length})
        </h2>
        <div className="mt-3 space-y-3">
          {events.length === 0 && (
            <p className="text-sm text-gray-400">Nothing pending.</p>
          )}
          {events.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  {e.title}
                </p>
                <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-navy">
                  {clubNameById.get(e.clubId)}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formatDate(e.date)} &middot; {e.time} &middot; {e.venue}
              </p>
              <div className="mt-3 flex gap-2">
                <form action={decideEventAction.bind(null, e.id, true)}>
                  <button className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                    Approve
                  </button>
                </form>
                <form action={decideEventAction.bind(null, e.id, false)}>
                  <button className="rounded-full bg-gray-200 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-300">
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
