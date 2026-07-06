import {
  committees,
  governancePolicies,
  schools,
  type CommitteeId,
} from "@/lib/data";

interface ClubRef {
  id: string;
  name: string;
  committee: CommitteeId;
}

interface CommitteeMemberRef {
  schoolId: string;
  committee: CommitteeId;
  name: string | null;
}

const committeeStyles: Record<
  CommitteeId,
  { bar: string; chip: string; dot: string }
> = {
  sports: {
    bar: "bg-maroon",
    chip: "bg-maroon/10 text-maroon",
    dot: "bg-maroon",
  },
  cultural: {
    bar: "bg-navy",
    chip: "bg-navy/10 text-navy",
    dot: "bg-navy",
  },
};

export default function CommitteeStructure({
  clubs,
  committeeMembers,
}: {
  clubs: ClubRef[];
  committeeMembers: CommitteeMemberRef[];
}) {
  return (
    <section id="committees" className="scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy sm:text-2xl">
          Committee Structure
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Every club activity is organized under two university-wide
          committees — building structure, ensuring transparency.
        </p>
      </div>

      <div className="space-y-8">
        {committees.map((committee) => {
          const style = committeeStyles[committee.id];
          const subClubs = clubs.filter((c) => c.committee === committee.id);
          return (
            <div
              key={committee.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className={`${style.bar} px-5 py-4 text-white sm:px-6`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold sm:text-lg">
                    {committee.name}
                  </h3>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                    {committee.totalMembers} members &middot; 2 from each
                    school
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                {schools.map((school) => {
                  const reps = committeeMembers.filter(
                    (m) =>
                      m.committee === committee.id && m.schoolId === school.id,
                  );
                  return (
                    <div
                      key={school.id}
                      className="rounded-xl border border-gray-100 bg-gray-50/60 p-3"
                    >
                      <p className="text-xs font-semibold text-gray-700">
                        {school.shortName}
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {reps.map((rep, i) =>
                          rep.name ? (
                            <p
                              key={i}
                              className={`rounded-full px-2 py-1 text-[11px] font-medium ${style.chip}`}
                            >
                              {rep.name}
                            </p>
                          ) : (
                            <p
                              key={i}
                              className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700"
                            >
                              Vacant &middot; nominations open
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 px-5 py-5 sm:px-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Sub-clubs under the {committee.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {subClubs.map((club) => (
                    <span
                      key={club.id}
                      className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                      />
                      {club.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-navy-dark text-white">
        <div className="border-b border-white/10 bg-maroon/90 px-5 py-3 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-wide">
            Governance &amp; Policies
          </p>
        </div>
        <ul className="grid gap-3 px-5 py-5 text-sm text-white/80 sm:grid-cols-2 sm:px-6">
          {governancePolicies.map((policy, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1 text-gold-light">&#9670;</span>
              <span>{policy}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
