import { BookingStatus } from "@/lib/bookings-context";

const styles: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  completed: "bg-slate-100 text-slate-600 ring-slate-200",
};

const labels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === "pending"
            ? "bg-amber-500"
            : status === "confirmed"
            ? "bg-emerald-500"
            : "bg-slate-400"
        }`}
      />
      {labels[status]}
    </span>
  );
}
