import * as store from "@/lib/store";
import { committees, schools } from "@/lib/data";
import { setCommitteeMemberAction } from "@/lib/actions";

export default async function AdminCommitteesPage() {
  const allMembers = await store.getCommitteeMembers();

  return (
    <div>
      <h1 className="text-xl font-bold text-navy sm:text-2xl">
        Committee Representatives
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Assign the 2 elected representatives from each school to the Sports
        and Cultural Committees. Leave blank to mark a seat vacant.
      </p>

      <div className="mt-6 space-y-8">
        {committees.map((committee) => (
          <section
            key={committee.id}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div
              className={`px-5 py-4 text-white sm:px-6 ${
                committee.id === "sports" ? "bg-maroon" : "bg-navy"
              }`}
            >
              <h2 className="text-base font-bold sm:text-lg">
                {committee.name}
              </h2>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              {schools.map((school) => {
                const reps = allMembers.filter(
                  (m) => m.committee === committee.id && m.schoolId === school.id,
                );
                return (
                  <div
                    key={school.id}
                    className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                  >
                    <p className="text-xs font-semibold text-gray-700">
                      {school.shortName}
                    </p>
                    <div className="mt-3 space-y-2">
                      {reps.map((rep) => (
                        <form
                          key={rep.id}
                          action={setCommitteeMemberAction}
                          className="flex items-center gap-1.5"
                        >
                          <input type="hidden" name="id" value={rep.id} />
                          <input
                            name="name"
                            defaultValue={rep.name ?? ""}
                            placeholder="Vacant seat"
                            className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs"
                          />
                          <button
                            type="submit"
                            className="shrink-0 rounded-full bg-navy px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-navy-dark"
                          >
                            Save
                          </button>
                        </form>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
