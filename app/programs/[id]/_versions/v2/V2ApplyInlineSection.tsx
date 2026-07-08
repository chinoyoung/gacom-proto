"use client";

import type { Program } from "../../_components/types";
import V2ApplySection from "./V2ApplySection";

// Inline "Start your application" section for the v6 page. This is a separate
// component/instance from the one rendered inside ApplyModal (which uses
// variant="modal"), so the two never share state or DOM ids.
export default function V2ApplyInlineSection({ program }: { program: Program }) {
  return <V2ApplySection program={program} variant="page" />;
}
