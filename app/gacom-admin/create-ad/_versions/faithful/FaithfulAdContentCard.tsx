"use client";

import { useState } from "react";
import { PanelsTopLeft, Save, ShoppingCart } from "lucide-react";
import AdContentFields from "../../_components/AdContentFields";
import type useCreateAdForm from "../../_shared/useCreateAdForm";
import type useAdCart from "../../_shared/useAdCart";

type Form = ReturnType<typeof useCreateAdForm>;
type Cart = ReturnType<typeof useAdCart>;

export default function FaithfulAdContentCard({ form, cart }: { form: Form; cart: Cart }) {
  const [addError, setAddError] = useState<string | null>(null);

  function handleAddToCart() {
    if (form.placementCount === 0) {
      setAddError("Add at least one placement first.");
      return;
    }
    if (!form.contentComplete) {
      setAddError("Fill in all required fields: " + form.missingFieldLabels.join(", "));
      return;
    }
    setAddError(null);
    cart.addItem({
      adType: form.state.adType,
      locations: form.state.locations,
      timings: form.state.timings,
      types: form.state.types,
      startDate: form.state.startDate,
      endDate: form.state.endDate,
    });
    form.resetPlacementFields();
    cart.openAdded();
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
        <PanelsTopLeft className="h-4 w-4 text-slate-500" aria-hidden="true" />
        <span className="font-bold text-slate-900">Ad Content</span>
      </div>

      <div className="p-5">
        <AdContentFields form={form} />
      </div>

      <div className="px-5 py-3 border-t border-slate-200 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="border border-slate-300 text-slate-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-slate-50 hover:border-slate-400 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Add to cart
          </button>
        </div>
        {addError ? (
          <p role="alert" className="text-xs text-red-600">
            {addError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
