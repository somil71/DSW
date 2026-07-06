import { cookies } from "next/headers";
import { getUserById, type StoreUser } from "@/lib/store";

const COOKIE_NAME = "dsw_session";

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function setSessionUserId(userId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, userId, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<StoreUser | null> {
  const id = await getSessionUserId();
  if (!id) return null;
  return (await getUserById(id)) ?? null;
}
