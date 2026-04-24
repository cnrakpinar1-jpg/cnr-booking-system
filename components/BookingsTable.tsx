"use client";

import { Booking, BookingStatus, useBookings } from "@/lib/bookings-context";
import StatusBadge from "./StatusBadge";

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "completed"];

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );
}

interface Props {
  bookings: Booking[];
}

export default function BookingsTable({ bookings }: Props) {
  const { updateStatus } = useBookings();

  if (bookings.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <InboxIcon className="h-7 w-7 text-slate-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-700">No bookings yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Submitted bookings will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block">
        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr className="bg-slate-50">
              {["Name", "Email", "Date", "Time", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((b) => (
              <tr key={b.id} className="group transition-colors hover:bg-slate-50/60">
                <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-900">
                  {b.name}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  {b.email}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  {formatDate(b.date)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  {b.time}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <StatusSelect
                    value={b.status}
                    onChange={(s) => updateStatus(b.id, s)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 sm:hidden">
        {bookings.map((b) => (
          <div key={b.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {b.name}
                </p>
                <p className="truncate text-xs text-slate-500">{b.email}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                {formatDate(b.date)} {" · "} {b.time}
              </p>
              <StatusSelect
                value={b.status}
                onChange={(s) => updateStatus(b.id, s)}
              />
            </div>
            {b.notes && (
              <p className="mt-2 text-xs italic text-slate-400">{`"${b.notes}"`}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: BookingStatus;
  onChange: (s: BookingStatus) => void;
}) {
  const colors: Record<BookingStatus, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    completed: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as BookingStatus)}
      className={`cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors ${colors[value]}`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s} className="bg-white text-slate-800">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}

function InboxIcon({ className }: { className?: string }) {
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
        d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
      />
    </svg>
  );
}
