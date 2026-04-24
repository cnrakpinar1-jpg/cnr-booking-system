"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

export type BookingStatus = "pending" | "confirmed" | "completed";

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
}

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (data: Omit<Booking, "id" | "status" | "createdAt">) => void;
  updateStatus: (id: string, status: BookingStatus) => void;
}

const SEED: Booking[] = [
  {
    id: "seed-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    date: "2026-04-24",
    time: "10:00",
    notes: "First-time client, prefers morning slots.",
    status: "confirmed",
    createdAt: new Date("2026-04-20").toISOString(),
  },
  {
    id: "seed-2",
    name: "Bob Martinez",
    email: "bob@example.com",
    date: "2026-04-24",
    time: "14:00",
    notes: "",
    status: "pending",
    createdAt: new Date("2026-04-21").toISOString(),
  },
  {
    id: "seed-3",
    name: "Carol White",
    email: "carol@example.com",
    date: "2026-04-25",
    time: "11:00",
    notes: "Prefers video call over in-person.",
    status: "pending",
    createdAt: new Date("2026-04-21").toISOString(),
  },
  {
    id: "seed-4",
    name: "David Chen",
    email: "david@example.com",
    date: "2026-04-23",
    time: "09:00",
    notes: "Follow-up from last month.",
    status: "completed",
    createdAt: new Date("2026-04-18").toISOString(),
  },
  {
    id: "seed-5",
    name: "Emma Davis",
    email: "emma@example.com",
    date: "2026-04-26",
    time: "16:00",
    notes: "",
    status: "pending",
    createdAt: new Date("2026-04-22").toISOString(),
  },
];

const BookingsContext = createContext<BookingsContextType | null>(null);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window === "undefined") {
      return SEED;
    }

    try {
      const stored = window.localStorage.getItem("bookings");
      return stored ? JSON.parse(stored) : SEED;
    } catch {
      return SEED;
    }
  });
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = useCallback(
    (data: Omit<Booking, "id" | "status" | "createdAt">) => {
      const booking: Booking = {
        ...data,
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setBookings((prev) => [booking, ...prev]);
    },
    []
  );

  const updateStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }, []);

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, updateStatus }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
}
