"use client";

import type { Program } from "../../_components/types";
import V1ApplySection from "./V1ApplySection";

// Inline "Start your application" section for the v6 page. This is a separate
// component/instance from the one rendered inside ApplyModal (which uses
// variant="modal"), so the two never share state or DOM ids.
export default function V1ApplyInlineSection({ program }: { program: Program }) {
  return <V1ApplySection program={program} variant="page" />;
}
