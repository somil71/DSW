const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { neon } = require('@neondatabase/serverless');

// 1. Read environment variables from .env.local
const envLocalPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  const dotenvFile = fs.readFileSync(envLocalPath, 'utf-8');
  dotenvFile.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[match[1]] = value;
    }
  });
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Error: DATABASE_URL environment variable is missing from .env.local.");
  process.exit(1);
}

// Initialize Neon Client
const sql = neon(databaseUrl);

const CORE_POSITIONS = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Event Head",
];

const schools = [
  { id: "cse", name: "School of Computer Science and Engineering", shortName: "CSE" },
  { id: "engineering", name: "School of Engineering", shortName: "Engineering" },
  { id: "management", name: "School of Management", shortName: "Management" },
  { id: "law", name: "School of Law", shortName: "Law" },
  { id: "sciences", name: "School of Sciences", shortName: "Sciences" },
  { id: "humanities", name: "School of Humanities and Social Sciences", shortName: "Humanities & Social Sciences" },
];

const CLUB_SEED = [
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

async function run() {
  console.log("Connecting to Neon PostgreSQL...");

  // 2. Drop existing tables to ensure clean rebuild
  console.log("Dropping existing tables (if any)...");
  const tables = ['users', 'clubs', 'join_requests', 'postings', 'events', 'notifications', 'committee_members'];
  for (const t of tables) {
    await sql.query(`DROP TABLE IF EXISTS ${t} CASCADE;`);
  }

  // 3. Create tables
  console.log("Creating tables...");

  await sql.query(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      club_id TEXT,
      position TEXT
    );
  `);

  await sql.query(`
    CREATE TABLE clubs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      committee TEXT NOT NULL,
      description TEXT NOT NULL,
      meeting_day TEXT NOT NULL
    );
  `);

  await sql.query(`
    CREATE TABLE join_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      club_id TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await sql.query(`
    CREATE TABLE postings (
      id TEXT PRIMARY KEY,
      club_id TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      tag TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      created_by TEXT NOT NULL
    );
  `);

  await sql.query(`
    CREATE TABLE events (
      id TEXT PRIMARY KEY,
      club_id TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      venue TEXT NOT NULL,
      status TEXT NOT NULL,
      created_by TEXT NOT NULL
    );
  `);

  await sql.query(`
    CREATE TABLE notifications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      priority TEXT NOT NULL,
      club_id TEXT,
      created_at TEXT NOT NULL
    );
  `);

  await sql.query(`
    CREATE TABLE committee_members (
      id TEXT PRIMARY KEY,
      committee TEXT NOT NULL,
      school_id TEXT NOT NULL,
      slot INTEGER NOT NULL,
      name TEXT
    );
  `);

  // 4. Build Seed Data
  console.log("Building seed data...");

  const clubs = CLUB_SEED;
  const users = [
    { id: "admin-dsw", name: "DSW Office Admin", role: "ADMIN", clubId: null, position: null },
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
        name: `Member {i} — ${club.name}`,
        role: "MEMBER",
        clubId: club.id,
        position: null,
      });
    }
  });

  // Fix template literal in Member naming
  users.forEach(u => {
    if (u.name.includes('{i}')) {
      const match = u.id.match(/-member-(\d+)$/);
      const index = match ? match[1] : '1';
      const clubName = clubs.find(c => c.id === u.clubId).name;
      u.name = `Member ${index} — ${clubName}`;
    }
  });

  for (let i = 1; i <= 3; i++) {
    users.push({
      id: `unassigned-${i}`,
      name: `New Student ${i}`,
      role: "MEMBER",
      clubId: null,
      position: null,
    });
  }

  const now = new Date().toISOString();
  const cricket = clubs.find((c) => c.id === "cricket");
  const theatre = clubs.find((c) => c.id === "theatre-movie-society");
  const esports = clubs.find((c) => c.id === "esports");
  const dance = clubs.find((c) => c.id === "dance");
  const literature = clubs.find((c) => c.id === "literature");
  const ngo = clubs.find((c) => c.id === "ngo-social-service");
  const basketball = clubs.find((c) => c.id === "basketball");
  const videography = clubs.find((c) => c.id === "videography-photography");

  const notifications = [
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

  const postings = [
    { id: randomUUID(), clubId: theatre.id, title: "Theatre & Movie Society — auditions open", summary: "Auditions for the Founder's Day production are open to all students. Slots available across acting, direction and production crew.", tag: "Recruitment", status: "APPROVED", createdAt: "2026-07-05T10:00:00.000Z", createdBy: `${theatre.id}-core-1` },
    { id: randomUUID(), clubId: cricket.id, title: "Cricket Club IILM — trials for the university squad", summary: "Open trials for batting, bowling and fielding positions at the sports complex nets.", tag: "Recruitment", status: "APPROVED", createdAt: "2026-07-04T10:00:00.000Z", createdBy: `${cricket.id}-core-1` },
    { id: randomUUID(), clubId: literature.id, title: "Literature Club MUN results declared", summary: "Results for the campus Model United Nations conference are now live on the DSW notice board.", tag: "Result", status: "APPROVED", createdAt: "2026-07-03T10:00:00.000Z", createdBy: `${literature.id}-core-1` },
    { id: randomUUID(), clubId: videography.id, title: "Videography & Photography Club — fest coverage team", summary: "Photographers and video editors needed for full coverage of the Founder's Day celebrations.", tag: "Recruitment", status: "APPROVED", createdAt: "2026-07-01T10:00:00.000Z", createdBy: `${videography.id}-core-1` },
    { id: randomUUID(), clubId: dance.id, title: "Dance Club wins Best Choreography at Zonal Youth Fest", summary: "The crew's performance 'Rhythm Rising' bagged Best Choreography and Best Ensemble at the zonal meet.", tag: "Achievement", status: "APPROVED", createdAt: "2026-06-30T10:00:00.000Z", createdBy: `${dance.id}-core-1` },
    { id: randomUUID(), clubId: esports.id, title: "E-Sports Club — recruiting a five-player roster", summary: "Trials for the competitive gaming squad ahead of the inter-university meet. Awaiting DSW approval.", tag: "Recruitment", status: "PENDING", createdAt: "2026-07-06T11:00:00.000Z", createdBy: `${esports.id}-core-1` },
  ];

  const events = [
    { id: randomUUID(), clubId: ngo.id, title: "NGO Club Donation Drive", date: "2026-07-12", time: "10:00 AM", venue: "Main Lawns", status: "APPROVED", createdBy: `${ngo.id}-core-1` },
    { id: randomUUID(), clubId: basketball.id, title: "Basketball Trials", date: "2026-07-10", time: "5:00 PM", venue: "Sports Complex", status: "APPROVED", createdBy: `${basketball.id}-core-1` },
    { id: randomUUID(), clubId: literature.id, title: "Open Mic & Poetry Slam", date: "2026-07-14", time: "6:00 PM", venue: "Amphitheatre", status: "APPROVED", createdBy: `${literature.id}-core-1` },
    { id: randomUUID(), clubId: theatre.id, title: "Founder's Day Rehearsal", date: "2026-07-25", time: "3:00 PM", venue: "Main Auditorium", status: "APPROVED", createdBy: `${theatre.id}-core-1` },
    { id: randomUUID(), clubId: esports.id, title: "E-Sports LAN Night", date: "2026-07-22", time: "4:00 PM", venue: "Innovation Lab, Block C", status: "PENDING", createdBy: `${esports.id}-core-1` },
  ];

  const joinRequests = [
    { id: randomUUID(), userId: "unassigned-1", clubId: cricket.id, status: "PENDING", createdAt: now },
  ];

  const committeeMembers = [];
  ["sports", "cultural"].forEach((committee) => {
    schools.forEach((school) => {
      [1, 2].forEach((slot) => {
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

  // 5. Seed database
  console.log("Seeding users...");
  for (const u of users) {
    await sql.query(`INSERT INTO users (id, name, role, club_id, position) VALUES ($1, $2, $3, $4, $5);`, [u.id, u.name, u.role, u.clubId, u.position]);
  }

  console.log("Seeding clubs...");
  for (const c of clubs) {
    await sql.query(`INSERT INTO clubs (id, name, committee, description, meeting_day) VALUES ($1, $2, $3, $4, $5);`, [c.id, c.name, c.committee, c.description, c.meetingDay]);
  }

  console.log("Seeding join_requests...");
  for (const j of joinRequests) {
    await sql.query(`INSERT INTO join_requests (id, user_id, club_id, status, created_at) VALUES ($1, $2, $3, $4, $5);`, [j.id, j.userId, j.clubId, j.status, j.createdAt]);
  }

  console.log("Seeding postings...");
  for (const p of postings) {
    await sql.query(`INSERT INTO postings (id, club_id, title, summary, tag, status, created_at, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`, [p.id, p.clubId, p.title, p.summary, p.tag, p.status, p.createdAt, p.createdBy]);
  }

  console.log("Seeding events...");
  for (const e of events) {
    await sql.query(`INSERT INTO events (id, club_id, title, date, time, venue, status, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`, [e.id, e.clubId, e.title, e.date, e.time, e.venue, e.status, e.createdBy]);
  }

  console.log("Seeding notifications...");
  for (const n of notifications) {
    await sql.query(`INSERT INTO notifications (id, title, body, priority, club_id, created_at) VALUES ($1, $2, $3, $4, $5, $6);`, [n.id, n.title, n.body, n.priority, n.clubId, n.createdAt]);
  }

  console.log("Seeding committee_members...");
  for (const m of committeeMembers) {
    await sql.query(`INSERT INTO committee_members (id, committee, school_id, slot, name) VALUES ($1, $2, $3, $4, $5);`, [m.id, m.committee, m.schoolId, m.slot, m.name]);
  }

  console.log("Database successfully initialized and seeded!");
}

run().catch((err) => {
  console.error("Database seeding failed:", err);
  process.exit(1);
});
