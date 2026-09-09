"use client";

import { useEffect } from "react";
import { Check, Plus } from "lucide-react";
import type useAdCart from "../_shared/useAdCart";

type Cart = ReturnType<typeof useAdCart>;

export default function AddedToCampaignModal({ cart }: { cart: Cart }) {
  const open = cart.addedOpen;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") cart.closeAdded();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, cart]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 cursor-pointer"
      onClick={cart.closeAdded}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-lg w-full max-w-sm shadow-xl p-6 text-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-green-50 grid place-items-center mx-auto mb-3">
          <Check className="h-7 w-7 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Added to your campaign</h2>
        <p className="text-sm text-slate-600 mb-5">
          {cart.count} ad{cart.count === 1 ? "" : "s"} in your campaign &middot; ${cart.total.toLocaleString()}
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={cart.closeAdded}
            className="w-full bg-roman-500 hover:bg-roman-600 text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create more ads
          </button>
          <button
            type="button"
            onClick={() => {
              cart.closeAdded();
              cart.openCart();
            }}
            className="w-full border border-slate-300 text-slate-700 text-sm font-semibold px-4 py-2 rounded-md hover:bg-slate-50 cursor-pointer"
          >
            Review campaign
          </button>
        </div>
      </div>
    </div>
  );
}
