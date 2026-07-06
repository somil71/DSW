export interface PostingItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  club: string;
  tag: "Recruitment" | "Result" | "Announcement" | "Achievement";
}

const tagStyles: Record<PostingItem["tag"], string> = {
  Recruitment: "bg-blue-50 text-blue-700",
  Result: "bg-purple-50 text-purple-700",
  Announcement: "bg-amber-50 text-amber-700",
  Achievement: "bg-emerald-50 text-emerald-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PostingsFeed({ postings }: { postings: PostingItem[] }) {
  return (
    <section id="postings" className="scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy sm:text-2xl">
          New Postings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Fresh updates, recruitment calls and results shared by clubs.
        </p>
      </div>
      {postings.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-400">
          No postings yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {postings.map((p) => (
            <article
              key={p.id}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${tagStyles[p.tag]}`}
                >
                  {p.tag}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(p.date)}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 sm:text-base">
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-gray-500">{p.summary}</p>
              <p className="mt-4 text-xs font-medium text-gold">{p.club}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
