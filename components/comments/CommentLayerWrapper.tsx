"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CommentLayer } from "./CommentLayer";

function Inner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const v = params.get("v");
  const pageKey = pathname + (v ? `?v=${v}` : "");
  return <CommentLayer pageKey={pageKey} />;
}

export function CommentLayerWrapper() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}
