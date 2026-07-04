import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Mission | Qashew | Luxury Snacking Standards",
  description: "Explore our heritage of excellence, sustainable sourcing, and artisanal craftsmanship behind the world's most premium gourmet cashew nuts.",
};

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
