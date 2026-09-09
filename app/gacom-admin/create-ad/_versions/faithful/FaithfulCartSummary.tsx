"use client";

import { ShoppingCart } from "lucide-react";
import type useAdCart from "../../_shared/useAdCart";

type Cart = ReturnType<typeof useAdCart>;

export default function FaithfulCartSummary({ cart }: { cart: Cart }) {
  if (cart.count === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex flex-col items-center text-center gap-2 py-4">
          <ShoppingCart className="h-6 w-6 text-slate-300" aria-hidden="true" />
          <p className="text-sm text-slate-400">
            Your cart is empty — add an ad placement to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="font-bold text-slate-900">Cart</span>
        <span className="text-slate-500 text-sm">
          · {cart.count} ad{cart.count === 1 ? "" : "s"}
        </span>
      </div>

      <ul className="space-y-1 mb-3">
        {cart.items.map((item) => (
          <li key={item.id} className="text-xs text-slate-500 truncate">
            {item.adType}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-slate-600">Total</span>
        <span className="font-semibold text-slate-900">${cart.total.toLocaleString()}</span>
      </div>

      <button
        type="button"
        onClick={cart.openCart}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer"
      >
        Review cart
      </button>
    </div>
  );
}
