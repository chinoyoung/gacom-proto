import {
  ShieldCheck,
  LayoutGrid,
  Contact,
  Image as ImageIcon,
  Quote,
  List,
  Gift,
  DollarSign,
  MessageSquare,
  Power,
  type LucideIcon,
} from "lucide-react";
import type { NavItem } from "../../_shared/types";

const ICON_MAP: Record<string, LucideIcon> = {
  verified: ShieldCheck,
  dashboard: LayoutGrid,
  contacts: Contact,
  image: ImageIcon,
  quotes: Quote,
  articles: List,
  gift: Gift,
  billing: DollarSign,
  messages: MessageSquare,
};

interface FaithfulSidebarProps {
  navItems: NavItem[];
  activeKey: string;
}

export default function FaithfulSidebar({ navItems, activeKey }: FaithfulSidebarProps) {
  return (
    <nav className="w-16 shrink-0 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-1 min-h-screen">
      <div className="relative mb-4">
        <div className="w-9 h-9 rounded-full bg-pink-500 text-white grid place-items-center font-semibold">
          H
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-pink-400 ring-2 ring-white" />
      </div>

      {navItems.map((item) => {
        const Icon = ICON_MAP[item.key];
        if (!Icon) return null;
        const isActive = item.key === activeKey;

        return (
          <button
            key={item.key}
            type="button"
            title={item.label}
            aria-label={item.label}
            className={[
              "w-10 h-10 rounded-lg grid place-items-center cursor-pointer",
              isActive ? "bg-sky-50 text-sky-600" : "text-slate-400 hover:bg-slate-100",
            ].join(" ")}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}

      <button
        type="button"
        title="Log out"
        aria-label="Log out"
        className="mt-auto w-10 h-10 rounded-lg grid place-items-center text-slate-400 hover:bg-slate-100 cursor-pointer"
      >
        <Power className="w-5 h-5" />
      </button>
    </nav>
  );
}
