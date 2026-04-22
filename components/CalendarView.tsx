"use client";

import { Booking, BookingStatus, useBookings } from "@/lib/bookings-context";
import StatusBadge from "./StatusBadge";

function formatFullDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" }
  );
}

function isToday(dateStr: string) {
  return dateStr === new Date().toISOString().split("T")[0];
}

interface Props {
  bookings: Booking[];
}

export default function CalendarView({ bookings }: Props) {
  const { updateStatus } = useBookings();

  if (bookings.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <CalendarEmptyIcon className="h-7 w-7 text-slate-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-700">No bookings yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Bookings will appear grouped by date.
          </p>
        </div>
      </div>
    );
  }

  // Group by date, sorted ascending
  const byDate = bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    (acc[b.date] ??= []).push(b);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {sortedDates.map((date) => {
        const dayBookings = byDate[date].sort((a, b) =>
          a.time.localeCompare(b.time)
        );
        const today = isToday(date);

        return (
          <div
            key={date}
            className={`card flex flex-col overflow-hidden ${
              today ? "ring-2 ring-indigo-500" : ""
            }`}
          >
            {/* Date header */}
            <div
              className={`flex items-center justify-between px-5 py-3.5 ${
                today ? "bg-indigo-600" : "bg-slate-50"
              }`}
            >
              <div>
                <p
                  className={`text-sm font-semibold ${
                    today ? "text-white" : "text-slate-800"
                  }`}
                >
                  {formatFullDate(date)}
                </p>
                {today && (
                  <p className="text-xs font-medium text-indigo-200">Today</p>
                )}
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  today
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {dayBookings.length} slot{dayBookings.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Booking list */}
            <div className="divide-y divide-slate-100">
              {dayBookings.map((b) => (
                <div key={b.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {b.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {b.email}
                      </p>
                    </div>
                    <span className="mt-0.5 flex-shrink-0 text-xs font-semibold tabular-nums text-indigo-600">
                      {b.time}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {b.notes ? (
                      <p className="truncate text-xs italic text-slate-400">
                        "{b.notes}"
                      </p>
                    ) : (
                      <span />
                    )}
                    <select
                      value={b.status}
                      onChange={(e) =>
                        updateStatus(b.id, e.target.value as BookingStatus)
                      }
                      className={`cursor-pointer rounded-md border px-2 py-0.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 flex-shrink-0 ${
                        b.status === "pending"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : b.status === "confirmed"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarEmptyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
      />
    </svg>
  );
}
