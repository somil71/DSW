import * as store from "@/lib/store";
import LoginClient from "@/components/LoginClient";

export default function LoginPage() {
  const users = store.getUsers();
  const clubs = store.getClubs();
  const admin = users.find((u) => u.role === "ADMIN")!;
  const unassigned = store.getUnassignedStudents();

  return <LoginClient admin={admin} clubs={clubs} unassigned={unassigned} />;
}
