import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your EliteBet notifications",
};

export default function NotificationsPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="mb-2 text-xl font-bold">Notifications</h1>
      <p className="text-[#888888]">No notifications yet.</p>
    </div>
  );
}
