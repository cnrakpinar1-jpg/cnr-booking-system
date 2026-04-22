"use client";

import { useState } from "react";
import { useBookings } from "@/lib/bookings-context";

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

interface FormState {
  name: string;
  email: string;
  date: string;
  time: string;
  notes: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  date: "",
  time: "",
  notes: "",
};

export default function BookingForm() {
  const { addBooking } = useBookings();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function validate(): boolean {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.date) errs.date = "Please select a date.";
    if (!form.time) errs.time = "Please select a time slot.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    addBooking(form);
    setSubmitted(true);
  }

  function handleReset() {
    setForm(EMPTY);
    setErrors({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="card flex flex-col items-center gap-5 px-8 py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckIcon className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Booking received!
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            We&apos;ll confirm your slot at{" "}
            <span className="font-medium text-slate-700">{form.email}</span>{" "}
            shortly.
          </p>
        </div>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-6 py-4 text-left text-sm">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-slate-600">
            <span className="font-medium text-slate-500">Name</span>
            <span>{form.name}</span>
            <span className="font-medium text-slate-500">Date</span>
            <span>{formatDate(form.date)}</span>
            <span className="font-medium text-slate-500">Time</span>
            <span>{form.time}</span>
          </div>
        </div>
        <button onClick={handleReset} className="btn-secondary mt-2">
          Book another slot
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8">
      <div className="grid gap-5">
        {/* Name */}
        <Field label="Full name" error={errors.name} required>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            className={`input ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
          />
        </Field>

        {/* Email */}
        <Field label="Email address" error={errors.email} required>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className={`input ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
          />
        </Field>

        {/* Date + Time */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Date" error={errors.date} required>
            <input
              name="date"
              type="date"
              value={form.date}
              min={today}
              onChange={handleChange}
              className={`input ${errors.date ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
            />
          </Field>

          <Field label="Time slot" error={errors.time} required>
            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              className={`input ${errors.time ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
            >
              <option value="">Select a time</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Notes */}
        <Field label="Notes" hint="Optional">
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Anything we should know…"
            className="input resize-none"
          />
        </Field>

        <button type="submit" className="btn-primary w-full py-3 text-base">
          Request booking
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-indigo-500">*</span>}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
    "en-US",
    { weekday: "short", year: "numeric", month: "long", day: "numeric" }
  );
}
