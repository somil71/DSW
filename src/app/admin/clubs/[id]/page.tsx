import Link from "next/link";
import { notFound } from "next/navigation";
import * as store from "@/lib/store";
import ClubManagementPanel from "@/components/ClubManagementPanel";

export default async function AdminClubDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const club = await store.getClubById(id);
  if (!club) notFound();

  return (
    <div>
      <Link
        href="/admin/clubs"
        className="text-xs font-medium text-gray-400 hover:text-navy"
      >
        ← All clubs
      </Link>
      <h1 className="mt-2 text-xl font-bold text-navy sm:text-2xl">
        {club.name}
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        {club.description}
      </p>
      <p className="mt-1 text-xs font-medium text-gold">
        Meets: {club.meetingDay}
      </p>

      <div className="mt-6">
        <ClubManagementPanel clubId={club.id} isAdmin={true} />
      </div>
    </div>
  );
}
