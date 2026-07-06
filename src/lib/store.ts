import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { type CommitteeId } from "@/lib/data";
import { CORE_POSITIONS } from "@/lib/constants";

export type Role = "ADMIN" | "CORE" | "MEMBER";
export type ContentStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PostingTag = "Recruitment" | "Result" | "Announcement" | "Achievement";

export { CORE_POSITIONS };

export interface StoreUser {
  id: string;
  name: string;
  role: Role;
  clubId: string | null;
  position?: string;
}

export interface StoreClub {
  id: string;
  name: string;
  committee: CommitteeId;
  description: string;
  meetingDay: string;
}

export interface StoreJoinRequest {
  id: string;
  userId: string;
  clubId: string;
  status: ContentStatus;
  createdAt: string;
}

export interface StorePosting {
  id: string;
  clubId: string;
  title: string;
  summary: string;
  tag: PostingTag;
  status: ContentStatus;
  createdAt: string;
  createdBy: string;
}

export interface StoreEvent {
  id: string;
  clubId: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  status: ContentStatus;
  createdBy: string;
}

export interface StoreNotification {
  id: string;
  title: string;
  body: string;
  priority: "high" | "normal";
  clubId: string | null;
  createdAt: string;
}

export interface StoreCommitteeMember {
  id: string;
  committee: CommitteeId;
  schoolId: string;
  slot: 1 | 2;
  name: string | null;
}

// Initialize Neon Client
const sql = neon(process.env.DATABASE_URL!);

// --- Row Mappers ---
function mapUser(row: any): StoreUser {
  return {
    id: row.id,
    name: row.name,
    role: row.role as Role,
    clubId: row.club_id,
    position: row.position || undefined,
  };
}

function mapClub(row: any): StoreClub {
  return {
    id: row.id,
    name: row.name,
    committee: row.committee as CommitteeId,
    description: row.description,
    meetingDay: row.meeting_day,
  };
}

function mapJoinRequest(row: any): StoreJoinRequest {
  return {
    id: row.id,
    userId: row.user_id,
    clubId: row.club_id,
    status: row.status as ContentStatus,
    createdAt: row.created_at,
  };
}

function mapPosting(row: any): StorePosting {
  return {
    id: row.id,
    clubId: row.club_id,
    title: row.title,
    summary: row.summary,
    tag: row.tag as PostingTag,
    status: row.status as ContentStatus,
    createdAt: row.created_at,
    createdBy: row.created_by,
  };
}

function mapEvent(row: any): StoreEvent {
  return {
    id: row.id,
    clubId: row.club_id,
    title: row.title,
    date: row.date,
    time: row.time,
    venue: row.venue,
    status: row.status as ContentStatus,
    createdBy: row.created_by,
  };
}

function mapNotification(row: any): StoreNotification {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    priority: row.priority as "high" | "normal",
    clubId: row.club_id,
    createdAt: row.created_at,
  };
}

function mapCommitteeMember(row: any): StoreCommitteeMember {
  return {
    id: row.id,
    committee: row.committee as CommitteeId,
    schoolId: row.school_id,
    slot: row.slot as 1 | 2,
    name: row.name,
  };
}

// --- Users ---
export async function getUsers(): Promise<StoreUser[]> {
  const rows = await sql.query("SELECT * FROM users");
  return rows.map(mapUser);
}

export async function getUserById(id: string): Promise<StoreUser | undefined> {
  const rows = await sql.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] ? mapUser(rows[0]) : undefined;
}

export async function getUsersByClub(clubId: string): Promise<StoreUser[]> {
  const rows = await sql.query("SELECT * FROM users WHERE club_id = $1", [clubId]);
  return rows.map(mapUser);
}

export async function getCoreTeam(clubId: string): Promise<StoreUser[]> {
  const rows = await sql.query("SELECT * FROM users WHERE club_id = $1 AND role = 'CORE'", [clubId]);
  return rows.map(mapUser);
}

export async function getMembers(clubId: string): Promise<StoreUser[]> {
  const rows = await sql.query("SELECT * FROM users WHERE club_id = $1 AND role = 'MEMBER'", [clubId]);
  return rows.map(mapUser);
}

export async function getUnassignedStudents(): Promise<StoreUser[]> {
  const rows = await sql.query("SELECT * FROM users WHERE role = 'MEMBER' AND club_id IS NULL");
  return rows.map(mapUser);
}

export async function assignCoreRole(userId: string, position: string): Promise<void> {
  const userRows = await sql.query("SELECT * FROM users WHERE id = $1", [userId]);
  const user = userRows[0] ? mapUser(userRows[0]) : null;
  if (!user || !user.clubId) return;

  const coreRows = await sql.query("SELECT COUNT(*)::int as count FROM users WHERE club_id = $1 AND role = 'CORE'", [user.clubId]);
  const coreCount = coreRows[0]?.count || 0;
  if (coreCount >= 5) return;

  await sql.query("UPDATE users SET role = 'CORE', position = $1 WHERE id = $2", [position, userId]);
}

export async function removeCoreRole(userId: string): Promise<void> {
  await sql.query("UPDATE users SET role = 'MEMBER', position = NULL WHERE id = $1", [userId]);
}

// --- Clubs ---
export async function getClubs(): Promise<StoreClub[]> {
  const rows = await sql.query("SELECT * FROM clubs");
  return rows.map(mapClub);
}

export async function getClubById(id: string): Promise<StoreClub | undefined> {
  const rows = await sql.query("SELECT * FROM clubs WHERE id = $1", [id]);
  return rows[0] ? mapClub(rows[0]) : undefined;
}

export async function getMemberCount(clubId: string): Promise<number> {
  const rows = await sql.query("SELECT COUNT(*)::int as count FROM users WHERE club_id = $1", [clubId]);
  return rows[0]?.count || 0;
}

// --- Join requests ---
export async function getJoinRequests(clubId?: string): Promise<StoreJoinRequest[]> {
  if (clubId) {
    const rows = await sql.query("SELECT * FROM join_requests WHERE club_id = $1", [clubId]);
    return rows.map(mapJoinRequest);
  } else {
    const rows = await sql.query("SELECT * FROM join_requests");
    return rows.map(mapJoinRequest);
  }
}

export async function getPendingJoinRequestFor(userId: string): Promise<StoreJoinRequest | undefined> {
  const rows = await sql.query("SELECT * FROM join_requests WHERE user_id = $1 AND status = 'PENDING'", [userId]);
  return rows[0] ? mapJoinRequest(rows[0]) : undefined;
}

export async function createJoinRequest(userId: string, clubId: string): Promise<void> {
  const existing = await getPendingJoinRequestFor(userId);
  if (existing) return;
  await sql.query(
    "INSERT INTO join_requests (id, user_id, club_id, status, created_at) VALUES ($1, $2, $3, 'PENDING', $4)",
    [randomUUID(), userId, clubId, new Date().toISOString()]
  );
}

export async function decideJoinRequest(id: string, approve: boolean): Promise<void> {
  const status = approve ? "APPROVED" : "REJECTED";
  await sql.query("UPDATE join_requests SET status = $1 WHERE id = $2", [status, id]);
  if (approve) {
    const jrRows = await sql.query("SELECT * FROM join_requests WHERE id = $1", [id]);
    if (jrRows[0]) {
      await sql.query("UPDATE users SET club_id = $1 WHERE id = $2", [jrRows[0].club_id, jrRows[0].user_id]);
    }
  }
}

// --- Postings ---
export async function getPostings(filter?: { clubId?: string; status?: ContentStatus }): Promise<StorePosting[]> {
  let queryStr = "SELECT * FROM postings";
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.clubId) {
    params.push(filter.clubId);
    conditions.push(`club_id = $${params.length}`);
  }
  if (filter?.status) {
    params.push(filter.status);
    conditions.push(`status = $${params.length}`);
  }

  if (conditions.length > 0) {
    queryStr += " WHERE " + conditions.join(" AND ");
  }
  queryStr += " ORDER BY created_at DESC";

  const rows = await sql.query(queryStr, params);
  return rows.map(mapPosting);
}

export async function createPosting(input: { clubId: string; title: string; summary: string; tag: PostingTag; createdBy: string }): Promise<void> {
  await sql.query(
    "INSERT INTO postings (id, club_id, title, summary, tag, status, created_at, created_by) VALUES ($1, $2, $3, $4, $5, 'PENDING', $6, $7)",
    [randomUUID(), input.clubId, input.title, input.summary, input.tag, new Date().toISOString(), input.createdBy]
  );
}

export async function updatePostingStatus(id: string, status: ContentStatus): Promise<void> {
  await sql.query("UPDATE postings SET status = $1 WHERE id = $2", [status, id]);
}

// --- Events ---
export async function getEvents(filter?: { clubId?: string; status?: ContentStatus }): Promise<StoreEvent[]> {
  let queryStr = "SELECT * FROM events";
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.clubId) {
    params.push(filter.clubId);
    conditions.push(`club_id = $${params.length}`);
  }
  if (filter?.status) {
    params.push(filter.status);
    conditions.push(`status = $${params.length}`);
  }

  if (conditions.length > 0) {
    queryStr += " WHERE " + conditions.join(" AND ");
  }
  queryStr += " ORDER BY date ASC";

  const rows = await sql.query(queryStr, params);
  return rows.map(mapEvent);
}

export async function createEvent(input: { clubId: string; title: string; date: string; time: string; venue: string; createdBy: string }): Promise<void> {
  await sql.query(
    "INSERT INTO events (id, club_id, title, date, time, venue, status, created_by) VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', $7)",
    [randomUUID(), input.clubId, input.title, input.date, input.time, input.venue, input.createdBy]
  );
}

export async function updateEventStatus(id: string, status: ContentStatus): Promise<void> {
  await sql.query("UPDATE events SET status = $1 WHERE id = $2", [status, id]);
}

// --- Notifications ---
export async function getNotifications(): Promise<StoreNotification[]> {
  const rows = await sql.query("SELECT * FROM notifications ORDER BY created_at DESC");
  return rows.map(mapNotification);
}

export async function createNotification(input: { title: string; body: string; priority: "high" | "normal"; clubId: string | null }): Promise<void> {
  await sql.query(
    "INSERT INTO notifications (id, title, body, priority, club_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
    [randomUUID(), input.title, input.body, input.priority, input.clubId, new Date().toISOString()]
  );
}

export async function deleteNotification(id: string): Promise<void> {
  await sql.query("DELETE FROM notifications WHERE id = $1", [id]);
}

// --- Committee members (school representatives) ---
export async function getCommitteeMembers(committee?: CommitteeId): Promise<StoreCommitteeMember[]> {
  if (committee) {
    const rows = await sql.query("SELECT * FROM committee_members WHERE committee = $1", [committee]);
    return rows.map(mapCommitteeMember);
  } else {
    const rows = await sql.query("SELECT * FROM committee_members");
    return rows.map(mapCommitteeMember);
  }
}

export async function setCommitteeMemberName(id: string, name: string): Promise<void> {
  const value = name.trim() || null;
  await sql.query("UPDATE committee_members SET name = $1 WHERE id = $2", [value, id]);
}
