"use client";

import { PrototypeIdent } from "./PrototypeIdent";
import { ViewportSwitcher } from "./ViewportSwitcher";
import { ToolbarVersionSwitcher } from "./ToolbarVersionSwitcher";
import { ToolbarCommentToggle } from "./ToolbarCommentToggle";
import { DashboardLink } from "./DashboardLink";

export function CanvasToolbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-slate-900 flex items-center justify-between px-4">
      <div className="flex-1 flex items-center gap-3">
        <DashboardLink />
        <div className="h-4 w-px bg-slate-700" aria-hidden="true" />
        <PrototypeIdent />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <ViewportSwitcher />
      </div>
      <div className="flex-1 flex items-center justify-end gap-2">
        <ToolbarVersionSwitcher />
        <ToolbarCommentToggle />
      </div>
    </header>
  );
}
