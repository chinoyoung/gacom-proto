"use client";

import AdContentFields from "../../_components/AdContentFields";
import type useCreateAdForm from "../../_shared/useCreateAdForm";

type Form = ReturnType<typeof useCreateAdForm>;

const CARD = "bg-white rounded-xl border border-slate-200 p-5";

export default function StudioContentPanel({ form }: { form: Form }) {
  return (
    <div className="space-y-6">
      <div className={CARD}>
        <h2 className="text-sm font-bold text-slate-900 mb-4">Content</h2>
        <AdContentFields form={form} />
      </div>
    </div>
  );
}
