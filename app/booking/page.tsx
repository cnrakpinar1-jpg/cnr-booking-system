import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Book a session
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Pick a date and time that works for you. We&apos;ll confirm within 24 hours.
          </p>
        </div>

        <BookingForm />

        <p className="mt-6 text-center text-xs text-slate-400">
          By submitting you agree to our{" "}
          <span className="underline cursor-pointer">terms of service</span>.
        </p>
      </main>
    </div>
  );
}
