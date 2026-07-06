import * as store from "@/lib/store";
import LoginClient from "@/components/LoginClient";

export default async function LoginPage() {
  const [users, clubs, unassigned] = await Promise.all([
    store.getUsers(),
    store.getClubs(),
    store.getUnassignedStudents(),
  ]);
  const admin = users.find((u) => u.role === "ADMIN")!;

  return <LoginClient admin={admin} clubs={clubs} unassigned={unassigned} />;
}
