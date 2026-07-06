import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommitteeStructure from "@/components/CommitteeStructure";
import * as store from "@/lib/store";

export default function CommitteesPage() {
  const clubs = store.getClubs();
  const committeeMembers = store.getCommitteeMembers();

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <section className="bg-gradient-to-br from-navy via-navy to-navy-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
            Office of the Dean of Student Welfare
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Committee Structure
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
            Every sub-club at IILM University runs under the Sports Committee
            or the Cultural Committee — 12 elected representatives each, two
            from every school, overseeing operations and approvals alongside
            the DSW office.
          </p>
        </div>
      </section>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6">
        <CommitteeStructure clubs={clubs} committeeMembers={committeeMembers} />
      </main>
      <Footer />
    </div>
  );
}
