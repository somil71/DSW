"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const NAVY = "#0b2545";
const MAROON = "#7a1f2b";
const GREEN = "#059669";
const AMBER = "#d97706";
const RED = "#dc2626";

export interface MembersByClub {
  name: string;
  members: number;
}

export interface CommitteeSplit {
  name: string;
  value: number;
}

export interface ContentStatusRow {
  name: string;
  Approved: number;
  Pending: number;
  Rejected: number;
}

export function MembersByClubChart({ data }: { data: MembersByClub[] }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        Members per Sub-Club
      </h3>
      <div className="mt-4" style={{ width: "100%", height: 460 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, bottom: 4, left: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <Bar dataKey="members" fill={NAVY} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CommitteeSplitChart({ data }: { data: CommitteeSplit[] }) {
  const colors = [MAROON, NAVY];
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        Committee Membership Split
      </h3>
      <div className="mt-4" style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ContentStatusChart({ data }: { data: ContentStatusRow[] }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        Postings &amp; Events by Approval Status
      </h3>
      <div className="mt-4" style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Approved" fill={GREEN} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pending" fill={AMBER} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Rejected" fill={RED} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
