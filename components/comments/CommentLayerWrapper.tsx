"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CommentLayer } from "./CommentLayer";
import { useDevice } from "./use-device";

function Inner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const v = params.get("v");
  const device = useDevice();
  const pageKey = `${pathname}${v ? `?v=${v}` : ""}::${device}`;
  return <CommentLayer pageKey={pageKey} />;
}

export function CommentLayerWrapper() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}
