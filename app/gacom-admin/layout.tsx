import { Suspense } from "react";
import CreateAdVersionSwitcher from "./create-ad/_components/CreateAdVersionSwitcher";

export default function GacomAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
      <Suspense fallback={null}>
        <CreateAdVersionSwitcher />
      </Suspense>
    </div>
  );
}
