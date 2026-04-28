import { PrototypeShell } from "@/components/canvas/PrototypeShell";

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeShell>{children}</PrototypeShell>;
}
