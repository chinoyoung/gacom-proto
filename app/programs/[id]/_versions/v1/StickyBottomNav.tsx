import {
  Star,
  FileText,
  ListOrdered,
  HelpCircle,
  MessageSquare,
  GraduationCap,
} from "lucide-react";

export const NAV_LINKS = [
  { hash: "#overview", label: "Overview", Icon: ListOrdered },
  { hash: "#reviews", label: "Reviews", Icon: Star },
  { hash: "#details", label: "Details", Icon: FileText },
  { hash: "#faqs", label: "FAQs", Icon: HelpCircle },
  { hash: "#interviews", label: "Interviews", Icon: MessageSquare },
  { hash: "#programs", label: "Programs", Icon: GraduationCap },
];

export function StickyBottomNav({
  visible,
  activeHash,
}: {
  visible: boolean;
  activeHash: string;
}) {
  const stickyClass = visible ? "flex" : "hidden";

  return (
    <section
      className={`z-50 w-full bg-white justify-center shadow-lg fixed bottom-0 left-0 ${stickyClass}`}
    >
      <div className="w-full max-w-7xl md:px-4">
        <ul className="flex text-xs justify-center w-full text-slate-700">
          {NAV_LINKS.map((link) => {
            const isActive = activeHash === link.hash;
            return (
              <li key={link.hash} className="w-full">
                <a
                  href={link.hash}
                  className={`flex flex-col md:flex-row md:gap-2 font-bold items-center justify-center gap-1 w-full py-4 md:py-5 px-2 ${
                    isActive ? "text-cobalt-500" : ""
                  }`}
                >
                  <link.Icon className="w-4 h-4" />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
