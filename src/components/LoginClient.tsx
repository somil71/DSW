"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { StoreUser, StoreClub } from "@/lib/store";
import { loginAction, type LoginState } from "@/lib/actions";
import { CORE_POSITIONS, DEMO_PASSWORD } from "@/lib/constants";

type Mode = "choose" | "admin" | "club" | "unassigned";

const initialState: LoginState = {};

export default function LoginClient({
  admin,
  clubs,
  unassigned,
}: {
  admin: StoreUser;
  clubs: StoreClub[];
  unassigned: StoreUser[];
}) {
  const [mode, setMode] = useState<Mode>("choose");
  const [clubId, setClubId] = useState(clubs[0]?.id ?? "");
  const [role, setRole] = useState<string>("President");
  const [memberSlot, setMemberSlot] = useState(1);
  const [unassignedId, setUnassignedId] = useState(unassigned[0]?.id ?? "");

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const userId = useMemo(() => {
    if (mode === "admin") return admin.id;
    if (mode === "unassigned") return unassignedId;
    if (mode === "club") {
      if (role === "Member") return `${clubId}-member-${memberSlot}`;
      const positionIndex = CORE_POSITIONS.indexOf(
        role as (typeof CORE_POSITIONS)[number],
      );
      return `${clubId}-core-${positionIndex + 1}`;
    }
    return "";
  }, [mode, clubId, role, memberSlot, unassignedId, admin.id]);

  const selectedClub = clubs.find((c) => c.id === clubId);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="border-b border-black/5 bg-navy">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/dsw-logo.png"
              alt="IILM University — Office of Dean Students' Welfare"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
              priority
            />
            <p className="text-sm font-semibold text-white">
              Dean of Student Welfare — Portal Login
            </p>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-white/70 hover:text-gold-light"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <div className="flex justify-center">
          <Image
            src="/dsw-logo.png"
            alt="IILM University — Office of Dean Students' Welfare"
            width={180}
            height={180}
            className="h-40 w-40 object-contain"
          />
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold text-navy sm:text-left">
          Portal Login
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Select your club and role, then sign in. Each role only sees what
          it&apos;s responsible for.
        </p>

        {mode === "choose" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setMode("admin")}
              className="rounded-2xl border border-maroon/20 bg-maroon/5 p-5 text-left transition hover:border-maroon/40 hover:bg-maroon/10"
            >
              <p className="text-sm font-semibold text-maroon">DSW Office</p>
              <p className="mt-1 text-xs text-gray-500">
                Admin console — oversee every club and committee.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("club")}
              className="rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-navy/40 hover:bg-navy/5"
            >
              <p className="text-sm font-semibold text-navy">Club Member</p>
              <p className="mt-1 text-xs text-gray-500">
                Core team or general member of a sub-club.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("unassigned")}
              className="rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-gold/60 hover:bg-gold/5"
            >
              <p className="text-sm font-semibold text-gold">New Student</p>
              <p className="mt-1 text-xs text-gray-500">
                Not in a club yet — browse and request to join.
              </p>
            </button>
          </div>
        )}

        {mode !== "choose" && (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="mb-5 text-xs font-medium text-gray-400 hover:text-navy"
            >
              ← Choose a different role
            </button>

            {mode === "admin" && (
              <p className="mb-4 text-sm font-semibold text-navy">
                Logging in as: DSW Office Admin
              </p>
            )}

            {mode === "club" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Club
                  </label>
                  <select
                    value={clubId}
                    onChange={(e) => setClubId(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {clubs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Your Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {CORE_POSITIONS.map((p) => (
                      <option key={p} value={p}>
                        {p} (Core Team)
                      </option>
                    ))}
                    <option value="Member">General Member</option>
                  </select>
                </div>
                {role === "Member" && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Which member (demo slot)
                    </label>
                    <select
                      value={memberSlot}
                      onChange={(e) => setMemberSlot(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          Member {n}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  Logging in as{" "}
                  <span className="font-medium text-navy">
                    {role === "Member" ? `Member ${memberSlot}` : role}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-navy">
                    {selectedClub?.name}
                  </span>
                </p>
              </div>
            )}

            {mode === "unassigned" && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Student
                </label>
                <select
                  value={unassignedId}
                  onChange={(e) => setUnassignedId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {unassigned.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <form action={formAction} className="mt-5 space-y-3">
              <input type="hidden" name="userId" value={userId} />
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Demo password for every account:{" "}
                  <span className="font-mono font-medium text-gray-600">
                    {DEMO_PASSWORD}
                  </span>
                </p>
              </div>
              {state.error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {state.error}
                </p>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-navy-dark transition hover:bg-gold-light disabled:opacity-60"
              >
                {isPending ? "Signing in…" : "Login"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
