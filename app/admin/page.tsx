"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import BookingsTable from "@/components/BookingsTable";
import CalendarView from "@/components/CalendarView";
import { BookingStatus, useBookings } from "@/lib/bookings-context";

type Filter = "all" | BookingStatus;
type View = "table" | "calendar";

const FILTER_TABS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
];

export default function AdminPage() {
  const { bookings } = useBookings();
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("table");

  const filtered = useMemo(
    () =>
      filter === "all" ? bookings : bookings.filter((b) => b.status === filter),
    [bookings, filter]
  );

  const counts = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
    }),
    [bookings]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Bookings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and update the status of all bookings.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total" value={counts.total} color="indigo" />
          <StatCard label="Pending" value={counts.pending} color="amber" />
          <StatCard label="Confirmed" value={counts.confirmed} color="emerald" />
          <StatCard label="Completed" value={counts.completed} color="slate" />
        </div>

        {/* Controls */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {FILTER_TABS.map(({ value, label }) => {
              const count =
                value === "all"
                  ? counts.total
                  : counts[value as BookingStatus];
              return (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                    filter === value
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {label}
                  {count > 0 && (
                    <span
                      className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                        filter === value
                          ? "bg-indigo-500 text-indigo-100"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setView("table")}
              title="Table view"
              className={`rounded-lg p-2 transition-colors ${
                view === "table"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <TableIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("calendar")}
              title="Calendar view"
              className={`rounded-lg p-2 transition-colors ${
                view === "calendar"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {view === "table" ? (
          <BookingsTable bookings={filtered} />
        ) : (
          <CalendarView bookings={filtered} />
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "indigo" | "amber" | "emerald" | "slate";
}) {
  const styles = {
    indigo: {
      bg: "bg-indigo-50",
      dot: "bg-indigo-500",
      text: "text-indigo-700",
      value: "text-indigo-900",
    },
    amber: {
      bg: "bg-amber-50",
      dot: "bg-amber-500",
      text: "text-amber-700",
      value: "text-amber-900",
    },
    emerald: {
      bg: "bg-emerald-50",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      value: "text-emerald-900",
    },
    slate: {
      bg: "bg-slate-100",
      dot: "bg-slate-400",
      text: "text-slate-500",
      value: "text-slate-800",
    },
  }[color];

  return (
    <div className={`card px-5 py-4 ${styles.bg} border-0`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
        <p className={`text-xs font-semibold uppercase tracking-wide ${styles.text}`}>
          {label}
        </p>
      </div>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${styles.value}`}>
        {value}
      </p>
    </div>
  );
}

function TableIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c-.621 0-1.125.504-1.125 1.125v1.5m2.25-2.625h7.5m-7.5 0A1.125 1.125 0 0110.875 12m7.5-1.125c.621 0 1.125.504 1.125 1.125v1.5m-9.75 0c0 .621.504 1.125 1.125 1.125h7.5c.621 0 1.125-.504 1.125-1.125v-1.5" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}
