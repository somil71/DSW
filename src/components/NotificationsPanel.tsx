export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: "high" | "normal";
  club?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export default function NotificationsPanel({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  return (
    <section id="notifications" className="scroll-mt-20">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            Club Notifications
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Official circulars and alerts from the DSW office and club
            conveners.
          </p>
        </div>
      </div>
      {notifications.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-400">
          No notifications yet.
        </p>
      ) : (
        <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {notifications.map((n) => (
            <div key={n.id} className="flex gap-4 px-5 py-4">
              <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-navy/5 py-2">
                <span className="text-xs font-semibold uppercase text-navy/60">
                  {formatDate(n.date)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                    {n.title}
                  </h3>
                  {n.priority === "high" && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                      Priority
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">{n.body}</p>
                {n.club && (
                  <p className="mt-2 text-xs font-medium text-gold">
                    {n.club}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
