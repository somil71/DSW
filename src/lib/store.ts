import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { schools, type CommitteeId } from "@/lib/data";
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

interface DB {
  users: StoreUser[];
  clubs: StoreClub[];
  joinRequests: StoreJoinRequest[];
  postings: StorePosting[];
  events: StoreEvent[];
  notifications: StoreNotification[];
  committeeMembers: StoreCommitteeMember[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const CLUB_SEED: StoreClub[] = [
  { id: "cricket", name: "Cricket Club IILM", committee: "sports", description: "Inter-school cricket leagues, nets practice and university team trials.", meetingDay: "Tue & Fri, 5 PM" },
  { id: "football", name: "Football Club IILM", committee: "sports", description: "Campus football league, coaching sessions and tournaments.", meetingDay: "Mon, Wed & Fri, 5 PM" },
  { id: "volleyball", name: "Volleyball Club IILM", committee: "sports", description: "Volleyball coaching, inter-school matches and tournament squads.", meetingDay: "Tue & Thu, 5 PM" },
  { id: "basketball", name: "Basketball Club IILM", committee: "sports", description: "Daily practice sessions and inter-campus basketball trials.", meetingDay: "Daily, 5 PM" },
  { id: "indoor-games", name: "Indoor Games Club IILM", committee: "sports", description: "Chess, carrom and table tennis leagues held through the year.", meetingDay: "Every Wednesday" },
  { id: "athletics", name: "Athletics Club IILM", committee: "sports", description: "Track and field training for university athletics meets.", meetingDay: "Daily, 6 AM" },
  { id: "pickleball", name: "Pickleball Club IILM", committee: "sports", description: "Pickleball coaching clinics and weekend campus tournaments.", meetingDay: "Sat & Sun, 4 PM" },
  { id: "esports", name: "E-Sports Club IILM", committee: "sports", description: "Competitive gaming squads, LAN nights and inter-university e-sports meets.", meetingDay: "Every Thursday" },
  { id: "dance", name: "Dance Club IILM", committee: "cultural", description: "Classical and contemporary dance crews performing at every campus fest.", meetingDay: "Tue & Thu, 6 PM" },
  { id: "music", name: "Music Club IILM", committee: "cultural", description: "Bands, vocalists and instrumentalists rehearsing weekly.", meetingDay: "Mon & Wed, 6 PM" },
  { id: "fashion", name: "Fashion Society IILM", committee: "cultural", description: "Styling, ramp walks and the annual fashion show production.", meetingDay: "Every Friday" },
  { id: "literature", name: "Literature Club IILM", committee: "cultural", description: "Debates, MUNs, creative writing and the campus literary magazine.", meetingDay: "Every Friday" },
  { id: "social-media", name: "Social Media Club IILM", committee: "cultural", description: "Manages official club socials, campus reels and digital storytelling.", meetingDay: "Every Monday" },
  { id: "designing", name: "Designing Club IILM", committee: "cultural", description: "Graphic design, branding and creatives for campus events.", meetingDay: "Every Tuesday" },
  { id: "theatre-movie-society", name: "Theatre & Movie Society IILM", committee: "cultural", description: "Stage plays, street theatre and short-film production across fests.", meetingDay: "Tue & Thu" },
  { id: "art-craft", name: "Art & Craft Society IILM", committee: "cultural", description: "Painting, installations and craft workshops on campus.", meetingDay: "Every Wednesday" },
  { id: "ngo-social-service", name: "NGO / Social Service Club IILM", committee: "cultural", description: "Community outreach, donation drives and sustainability projects.", meetingDay: "Every Saturday" },
  { id: "videography-photography", name: "Videography & Photography Club IILM", committee: "cultural", description: "Official photo and video coverage for the DSW office and campus fests.", meetingDay: "Every Thursday" },
];

function buildSeed(): DB {
  const clubs: StoreClub[] = CLUB_SEED;

  const users: StoreUser[] = [
    { id: "admin-dsw", name: "DSW Office Admin", role: "ADMIN", clubId: null },
  ];

  clubs.forEach((club) => {
    CORE_POSITIONS.forEach((position, i) => {
      users.push({
        id: `${club.id}-core-${i + 1}`,
        name: `${position} — ${club.name}`,
        role: "CORE",
        clubId: club.id,
        position,
      });
    });
    for (let i = 1; i <= 4; i++) {
      users.push({
        id: `${club.id}-member-${i}`,
        name: `Member ${i} — ${club.name}`,
        role: "MEMBER",
        clubId: club.id,
      });
    }
  });

  for (let i = 1; i <= 3; i++) {
    users.push({
      id: `unassigned-${i}`,
      name: `New Student ${i}`,
      role: "MEMBER",
      clubId: null,
    });
  }

  const now = new Date().toISOString();
  const cricket = clubs.find((c) => c.id === "cricket")!;
  const theatre = clubs.find((c) => c.id === "theatre-movie-society")!;
  const esports = clubs.find((c) => c.id === "esports")!;
  const dance = clubs.find((c) => c.id === "dance")!;
  const literature = clubs.find((c) => c.id === "literature")!;
  const ngo = clubs.find((c) => c.id === "ngo-social-service")!;
  const basketball = clubs.find((c) => c.id === "basketball")!;
  const videography = clubs.find((c) => c.id === "videography-photography")!;

  const notifications: StoreNotification[] = [
    {
      id: randomUUID(),
      title: "New Sports & Cultural Committee structure now in effect",
      body: "All previously independent clubs have been dissolved. Every activity now runs as a sub-club under the Sports Committee or Cultural Committee, with 12 members each (2 per school) overseeing operations.",
      priority: "high",
      clubId: null,
      createdAt: "2026-07-06T09:00:00.000Z",
    },
    {
      id: randomUUID(),
      title: "Club IDs, passwords and Insta handles being reissued",
      body: "The DSW office is issuing fresh login credentials, mail IDs and Instagram profiles to every sub-club. Old club accounts are no longer valid.",
      priority: "high",
      clubId: null,
      createdAt: "2026-07-05T09:00:00.000Z",
    },
    {
      id: randomUUID(),
      title: "Auditorium and ground booking policy update",
      body: "All sub-clubs must raise booking requests at least 5 working days in advance through the DSW facility calendar.",
      priority: "normal",
      clubId: null,
      createdAt: "2026-07-02T09:00:00.000Z",
    },
  ];

  const postings: StorePosting[] = [
    { id: randomUUID(), clubId: theatre.id, title: "Theatre & Movie Society — auditions open", summary: "Auditions for the Founder's Day production are open to all students. Slots available across acting, direction and production crew.", tag: "Recruitment", status: "APPROVED", createdAt: "2026-07-05T10:00:00.000Z", createdBy: `${theatre.id}-core-1` },
    { id: randomUUID(), clubId: cricket.id, title: "Cricket Club IILM — trials for the university squad", summary: "Open trials for batting, bowling and fielding positions at the sports complex nets.", tag: "Recruitment", status: "APPROVED", createdAt: "2026-07-04T10:00:00.000Z", createdBy: `${cricket.id}-core-1` },
    { id: randomUUID(), clubId: literature.id, title: "Literature Club MUN results declared", summary: "Results for the campus Model United Nations conference are now live on the DSW notice board.", tag: "Result", status: "APPROVED", createdAt: "2026-07-03T10:00:00.000Z", createdBy: `${literature.id}-core-1` },
    { id: randomUUID(), clubId: videography.id, title: "Videography & Photography Club — fest coverage team", summary: "Photographers and video editors needed for full coverage of the Founder's Day celebrations.", tag: "Recruitment", status: "APPROVED", createdAt: "2026-07-01T10:00:00.000Z", createdBy: `${videography.id}-core-1` },
    { id: randomUUID(), clubId: dance.id, title: "Dance Club wins Best Choreography at Zonal Youth Fest", summary: "The crew's performance 'Rhythm Rising' bagged Best Choreography and Best Ensemble at the zonal meet.", tag: "Achievement", status: "APPROVED", createdAt: "2026-06-30T10:00:00.000Z", createdBy: `${dance.id}-core-1` },
    { id: randomUUID(), clubId: esports.id, title: "E-Sports Club — recruiting a five-player roster", summary: "Trials for the competitive gaming squad ahead of the inter-university meet. Awaiting DSW approval.", tag: "Recruitment", status: "PENDING", createdAt: "2026-07-06T11:00:00.000Z", createdBy: `${esports.id}-core-1` },
  ];

  const events: StoreEvent[] = [
    { id: randomUUID(), clubId: ngo.id, title: "NGO Club Donation Drive", date: "2026-07-12", time: "10:00 AM", venue: "Main Lawns", status: "APPROVED", createdBy: `${ngo.id}-core-1` },
    { id: randomUUID(), clubId: basketball.id, title: "Basketball Trials", date: "2026-07-10", time: "5:00 PM", venue: "Sports Complex", status: "APPROVED", createdBy: `${basketball.id}-core-1` },
    { id: randomUUID(), clubId: literature.id, title: "Open Mic & Poetry Slam", date: "2026-07-14", time: "6:00 PM", venue: "Amphitheatre", status: "APPROVED", createdBy: `${literature.id}-core-1` },
    { id: randomUUID(), clubId: theatre.id, title: "Founder's Day Rehearsal", date: "2026-07-25", time: "3:00 PM", venue: "Main Auditorium", status: "APPROVED", createdBy: `${theatre.id}-core-1` },
    { id: randomUUID(), clubId: esports.id, title: "E-Sports LAN Night", date: "2026-07-22", time: "4:00 PM", venue: "Innovation Lab, Block C", status: "PENDING", createdBy: `${esports.id}-core-1` },
  ];

  const joinRequests: StoreJoinRequest[] = [
    { id: randomUUID(), userId: "unassigned-1", clubId: cricket.id, status: "PENDING", createdAt: now },
  ];

  const committeeMembers: StoreCommitteeMember[] = [];
  (["sports", "cultural"] as CommitteeId[]).forEach((committee) => {
    schools.forEach((school) => {
      ([1, 2] as const).forEach((slot) => {
        committeeMembers.push({
          id: `${committee}-${school.id}-${slot}`,
          committee,
          schoolId: school.id,
          slot,
          name: null,
        });
      });
    });
  });

  return {
    users,
    clubs,
    joinRequests,
    postings,
    events,
    notifications,
    committeeMembers,
  };
}

function readDb(): DB {
  if (!fs.existsSync(DB_PATH)) {
    const seed = buildSeed();
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as DB;
}

function writeDb(db: DB) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// --- Users ---
export function getUsers(): StoreUser[] {
  return readDb().users;
}

export function getUserById(id: string): StoreUser | undefined {
  return readDb().users.find((u) => u.id === id);
}

export function getUsersByClub(clubId: string): StoreUser[] {
  return readDb().users.filter((u) => u.clubId === clubId);
}

export function getCoreTeam(clubId: string): StoreUser[] {
  return getUsersByClub(clubId).filter((u) => u.role === "CORE");
}

export function getMembers(clubId: string): StoreUser[] {
  return getUsersByClub(clubId).filter((u) => u.role === "MEMBER");
}

export function getUnassignedStudents(): StoreUser[] {
  return readDb().users.filter((u) => u.role === "MEMBER" && !u.clubId);
}

export function assignCoreRole(userId: string, position: string) {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user || !user.clubId) return;
  const coreCount = db.users.filter((u) => u.clubId === user.clubId && u.role === "CORE").length;
  if (coreCount >= 5) return;
  user.role = "CORE";
  user.position = position;
  writeDb(db);
}

export function removeCoreRole(userId: string) {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return;
  user.role = "MEMBER";
  delete user.position;
  writeDb(db);
}

// --- Clubs ---
export function getClubs(): StoreClub[] {
  return readDb().clubs;
}

export function getClubById(id: string): StoreClub | undefined {
  return readDb().clubs.find((c) => c.id === id);
}

export function getMemberCount(clubId: string): number {
  return getUsersByClub(clubId).length;
}

// --- Join requests ---
export function getJoinRequests(clubId?: string): StoreJoinRequest[] {
  const all = readDb().joinRequests;
  return clubId ? all.filter((j) => j.clubId === clubId) : all;
}

export function getPendingJoinRequestFor(userId: string): StoreJoinRequest | undefined {
  return readDb().joinRequests.find((j) => j.userId === userId && j.status === "PENDING");
}

export function createJoinRequest(userId: string, clubId: string) {
  const db = readDb();
  const existing = db.joinRequests.find((j) => j.userId === userId && j.status === "PENDING");
  if (existing) return;
  db.joinRequests.push({
    id: randomUUID(),
    userId,
    clubId,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  });
  writeDb(db);
}

export function decideJoinRequest(id: string, approve: boolean) {
  const db = readDb();
  const jr = db.joinRequests.find((j) => j.id === id);
  if (!jr) return;
  jr.status = approve ? "APPROVED" : "REJECTED";
  if (approve) {
    const user = db.users.find((u) => u.id === jr.userId);
    if (user) user.clubId = jr.clubId;
  }
  writeDb(db);
}

// --- Postings ---
export function getPostings(filter?: { clubId?: string; status?: ContentStatus }): StorePosting[] {
  let list = readDb().postings;
  if (filter?.clubId) list = list.filter((p) => p.clubId === filter.clubId);
  if (filter?.status) list = list.filter((p) => p.status === filter.status);
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createPosting(input: { clubId: string; title: string; summary: string; tag: PostingTag; createdBy: string }) {
  const db = readDb();
  db.postings.push({
    id: randomUUID(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
    ...input,
  });
  writeDb(db);
}

export function updatePostingStatus(id: string, status: ContentStatus) {
  const db = readDb();
  const p = db.postings.find((x) => x.id === id);
  if (p) p.status = status;
  writeDb(db);
}

// --- Events ---
export function getEvents(filter?: { clubId?: string; status?: ContentStatus }): StoreEvent[] {
  let list = readDb().events;
  if (filter?.clubId) list = list.filter((e) => e.clubId === filter.clubId);
  if (filter?.status) list = list.filter((e) => e.status === filter.status);
  return [...list].sort((a, b) => a.date.localeCompare(b.date));
}

export function createEvent(input: { clubId: string; title: string; date: string; time: string; venue: string; createdBy: string }) {
  const db = readDb();
  db.events.push({
    id: randomUUID(),
    status: "PENDING",
    ...input,
  });
  writeDb(db);
}

export function updateEventStatus(id: string, status: ContentStatus) {
  const db = readDb();
  const e = db.events.find((x) => x.id === id);
  if (e) e.status = status;
  writeDb(db);
}

// --- Notifications ---
export function getNotifications(): StoreNotification[] {
  return [...readDb().notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createNotification(input: { title: string; body: string; priority: "high" | "normal"; clubId: string | null }) {
  const db = readDb();
  db.notifications.push({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  });
  writeDb(db);
}

export function deleteNotification(id: string) {
  const db = readDb();
  db.notifications = db.notifications.filter((n) => n.id !== id);
  writeDb(db);
}

// --- Committee members (school representatives) ---
export function getCommitteeMembers(committee?: CommitteeId): StoreCommitteeMember[] {
  const all = readDb().committeeMembers;
  return committee ? all.filter((m) => m.committee === committee) : all;
}

export function setCommitteeMemberName(id: string, name: string) {
  const db = readDb();
  const m = db.committeeMembers.find((x) => x.id === id);
  if (!m) return;
  m.name = name.trim() || null;
  writeDb(db);
}
