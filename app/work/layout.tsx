import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Archive | Websites We've Built | Qashew",
  description: "Discover our physical archive of high-performance digital systems and custom bespoke web designs crafted for industry leaders.",
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
