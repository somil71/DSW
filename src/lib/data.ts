export type CommitteeId = "sports" | "cultural";

export interface School {
  id: string;
  name: string;
  shortName: string;
  membersPerCommittee: number;
}

export interface Committee {
  id: CommitteeId;
  name: string;
  tagline: string;
  totalMembers: number;
}

export const schools: School[] = [
  {
    id: "cse",
    name: "School of Computer Science and Engineering",
    shortName: "CSE",
    membersPerCommittee: 2,
  },
  {
    id: "engineering",
    name: "School of Engineering",
    shortName: "Engineering",
    membersPerCommittee: 2,
  },
  {
    id: "management",
    name: "School of Management",
    shortName: "Management",
    membersPerCommittee: 2,
  },
  {
    id: "law",
    name: "School of Law",
    shortName: "Law",
    membersPerCommittee: 2,
  },
  {
    id: "sciences",
    name: "School of Sciences",
    shortName: "Sciences",
    membersPerCommittee: 2,
  },
  {
    id: "humanities",
    name: "School of Humanities and Social Sciences",
    shortName: "Humanities & Social Sciences",
    membersPerCommittee: 2,
  },
];

export const committees: Committee[] = [
  {
    id: "sports",
    name: "Sports Committee",
    tagline: "Building structure. Ensuring transparency.",
    totalMembers: 12,
  },
  {
    id: "cultural",
    name: "Cultural Committee",
    tagline: "Building structure. Ensuring transparency.",
    totalMembers: 12,
  },
];

export const governancePolicies: string[] = [
  "All previously independent clubs stand discontinued — every activity now runs as a sub-club under the Sports or Cultural Committee.",
  "No club or committee member may use a club for private or commercial purposes.",
  "Every sub-club carries the official IILM logo. Login IDs, passwords, Instagram profiles and mail IDs are issued solely by the DSW office.",
  "The DSW office is the single point of contact for all clubs, committees and their events.",
  "All clubs and events function under the guidance and approval of the DSW office.",
];
