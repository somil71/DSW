import * as store from "@/lib/store";
import { createNotificationAction, deleteNotificationAction } from "@/lib/actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminNotificationsPage() {
  const notifications = store.getNotifications();
  const clubs = store.getClubs();
  const clubNameById = new Map(clubs.map((c) => [c.id, c.name]));

  return (
    <div>
      <h1 className="text-xl font-bold text-navy sm:text-2xl">
        Notifications
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Publish an official circular — university-wide or targeted at one
        sub-club.
      </p>

      <form
        action={createNotificationAction}
        className="mt-6 max-w-xl space-y-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
      >
        <input
          name="title"
          required
          placeholder="Title"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <textarea
          name="body"
          required
          rows={3}
          placeholder="Body"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <select
            name="priority"
            className="w-1/2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="normal">Normal</option>
            <option value="high">High Priority</option>
          </select>
          <select
            name="clubId"
            className="w-1/2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">University-wide</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy-dark hover:bg-gold-light"
        >
          Publish Notification
        </button>
      </form>

      <div className="mt-8 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-start justify-between gap-4 px-5 py-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  {n.title}
                </p>
                {n.priority === "high" && (
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-600">
                    Priority
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">{n.body}</p>
              <p className="mt-1 text-xs text-gray-400">
                {formatDate(n.createdAt)} &middot;{" "}
                {n.clubId ? clubNameById.get(n.clubId) : "University-wide"}
              </p>
            </div>
            <form action={deleteNotificationAction.bind(null, n.id)}>
              <button className="text-xs font-medium text-red-600 hover:underline">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
