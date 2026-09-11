"use client";

import { useState } from "react";
import { ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";
import type useCreateAdForm from "../../_shared/useCreateAdForm";
import type useAdCart from "../../_shared/useAdCart";

type Form = ReturnType<typeof useCreateAdForm>;
type Cart = ReturnType<typeof useAdCart>;

interface StudioCampaignBarProps {
  form: Form;
  cart: Cart;
}

export default function StudioCampaignBar({ form, cart }: StudioCampaignBarProps) {
  const [addError, setAddError] = useState<string | null>(null);

  function handleAdd() {
    if (!form.usesPrograms && form.placementCount === 0) {
      setAddError("Add at least one placement first.");
      return;
    }
    if (form.requiresDirectory && form.state.directories.length === 0) {
      setAddError("Choose a directory.");
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
      directories: form.state.directories,
      startDate: form.state.startDate,
      endDate: form.state.endDate,
    });
    form.resetPlacementFields();
    cart.openAdded();
  }

  return (
    <div className="fixed bottom-0 left-16 right-0 z-40 bg-white border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-4">
        <ShoppingBag className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
        {cart.count === 0 ? (
          <span className="text-sm text-slate-500">Add this placement to start your campaign.</span>
        ) : (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-800">
              Your campaign &middot; {cart.count} placement{cart.count === 1 ? "" : "s"}
            </span>
            <span className="text-lg font-bold text-roman-600">${cart.total.toLocaleString()}</span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          {addError ? (
            <p role="alert" className="text-xs text-red-600">
              {addError}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleAdd}
            className="bg-roman-500 hover:bg-roman-600 text-white text-sm font-semibold px-4 py-2 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Add to campaign
          </button>
          {cart.count > 0 ? (
            <button
              type="button"
              onClick={cart.openCart}
              className="border border-slate-300 text-slate-700 text-sm font-semibold px-4 py-2 rounded-md hover:bg-slate-50 cursor-pointer inline-flex items-center gap-1.5"
            >
              Review campaign
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
