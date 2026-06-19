"use client";

import type { Program } from "../../_components/types";
import Apply2026Section from "./Apply2026Section";

// Inline "Start your application" section for the v6 page. This is a separate
// component/instance from the one rendered inside ApplyModal (which uses
// variant="modal"), so the two never share state or DOM ids.
export default function ApplyInlineSection({ program }: { program: Program }) {
  return <Apply2026Section program={program} variant="page" />;
}
