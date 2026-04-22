import type { Metadata } from "next";
import "./globals.css";
import { BookingsProvider } from "@/lib/bookings-context";

export const metadata: Metadata = {
  title: "Bookings — Admin",
  description: "Simple booking and calendar admin system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BookingsProvider>{children}</BookingsProvider>
      </body>
    </html>
  );
}
