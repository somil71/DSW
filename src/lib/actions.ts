"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as store from "@/lib/store";
import { getCurrentUser, setSessionUserId, clearSession } from "@/lib/session";
import { getPermissions } from "@/lib/permissions";
import { DEMO_PASSWORD } from "@/lib/constants";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const userId = String(formData.get("userId") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!userId) {
    return { error: "Pick who you're logging in as first." };
  }
  if (password !== DEMO_PASSWORD) {
    return { error: "Incorrect password." };
  }
  const user = store.getUserById(userId);
  if (!user) {
    return { error: "That account could not be found." };
  }

  await setSessionUserId(userId);
  revalidatePath("/", "layout");
  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  await clearSession();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function createPostingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.clubId || (user.role !== "CORE" && user.role !== "ADMIN")) {
    redirect("/login");
  }
  if (!getPermissions(user.position, user.role === "ADMIN").managePostings) {
    redirect("/dashboard");
  }
  const clubId = user.role === "ADMIN" ? String(formData.get("clubId")) : user.clubId!;
  store.createPosting({
    clubId,
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    tag: String(formData.get("tag") ?? "Announcement") as store.PostingTag,
    createdBy: user.id,
  });
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/admin/approvals");
  revalidatePath("/");
}

export async function createEventAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.clubId || (user.role !== "CORE" && user.role !== "ADMIN")) {
    redirect("/login");
  }
  if (!getPermissions(user.position, user.role === "ADMIN").manageEvents) {
    redirect("/dashboard");
  }
  const clubId = user.role === "ADMIN" ? String(formData.get("clubId")) : user.clubId!;
  store.createEvent({
    clubId,
    title: String(formData.get("title") ?? "").trim(),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? "").trim(),
    venue: String(formData.get("venue") ?? "").trim(),
    createdBy: user.id,
  });
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/admin/approvals");
  revalidatePath("/");
}

export async function decidePostingAction(id: string, approve: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  store.updatePostingStatus(id, approve ? "APPROVED" : "REJECTED");
  revalidatePath("/admin/approvals");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

export async function decideEventAction(id: string, approve: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  store.updateEventStatus(id, approve ? "APPROVED" : "REJECTED");
  revalidatePath("/admin/approvals");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

export async function requestJoinAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const clubId = String(formData.get("clubId") ?? "");
  store.createJoinRequest(user.id, clubId);
  revalidatePath("/dashboard");
}

export async function decideJoinRequestAction(id: string, approve: boolean) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "CORE" && user.role !== "ADMIN")) redirect("/login");
  if (!getPermissions(user.position, user.role === "ADMIN").manageJoinRequests) {
    redirect("/dashboard");
  }
  store.decideJoinRequest(id, approve);
  revalidatePath("/dashboard");
  revalidatePath("/admin/clubs");
}

export async function assignCoreAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "CORE" && user.role !== "ADMIN")) redirect("/login");
  if (!getPermissions(user.position, user.role === "ADMIN").manageRoster) {
    redirect("/dashboard");
  }
  const userId = String(formData.get("userId") ?? "");
  const position = String(formData.get("position") ?? "");
  store.assignCoreRole(userId, position);
  revalidatePath("/dashboard");
  revalidatePath("/admin/clubs");
}

export async function removeCoreAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "CORE" && user.role !== "ADMIN")) redirect("/login");
  if (!getPermissions(user.position, user.role === "ADMIN").manageRoster) {
    redirect("/dashboard");
  }
  const userId = String(formData.get("userId") ?? "");
  store.removeCoreRole(userId);
  revalidatePath("/dashboard");
  revalidatePath("/admin/clubs");
}

export async function createNotificationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  const clubId = String(formData.get("clubId") ?? "");
  store.createNotification({
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    priority: (formData.get("priority") === "high" ? "high" : "normal"),
    clubId: clubId === "" ? null : clubId,
  });
  revalidatePath("/admin/notifications");
  revalidatePath("/");
}

export async function deleteNotificationAction(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  store.deleteNotification(id);
  revalidatePath("/admin/notifications");
  revalidatePath("/");
}

export async function setCommitteeMemberAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  store.setCommitteeMemberName(id, name);
  revalidatePath("/admin/committees");
  revalidatePath("/");
}
