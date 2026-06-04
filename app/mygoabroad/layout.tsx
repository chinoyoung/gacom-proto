import { PrototypeShell } from "@/components/canvas/PrototypeShell";

export default function MyGoAbroadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeShell>{children}</PrototypeShell>;
}
