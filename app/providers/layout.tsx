import { PrototypeShell } from "@/components/canvas/PrototypeShell";

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeShell>{children}</PrototypeShell>;
}
