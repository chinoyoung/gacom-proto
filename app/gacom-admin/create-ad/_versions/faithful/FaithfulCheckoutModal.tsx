"use client";

import { useEffect, useState } from "react";
import { X, Trash2, CreditCard, ArrowLeft, Check, Image as ImageIcon, Calendar } from "lucide-react";
import type useAdCart from "../../_shared/useAdCart";
import { getAdType, adExampleThumb } from "../../_shared/ad-types";

type Cart = ReturnType<typeof useAdCart>;

const STEP_TITLES: Record<string, string> = {
  cart: "Your cart",
  billing: "Billing & payment",
  done: "Order placed",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const inputClass = "h-10 w-full rounded-md border border-slate-300 px-3 text-sm";

export default function FaithfulCheckoutModal({
  cart,
  programName,
}: {
  cart: Cart;
  programName: string;
}) {
  const isOpen = cart.checkoutStep !== "closed";

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") cart.closeCheckout();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, cart]);

  if (cart.checkoutStep === "closed") return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 cursor-pointer"
      onClick={cart.closeCheckout}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            {STEP_TITLES[cart.checkoutStep]}
          </h2>
          <button
            type="button"
            onClick={cart.closeCheckout}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {cart.checkoutStep === "cart" && <CartStep cart={cart} />}
          {cart.checkoutStep === "billing" && <BillingStep cart={cart} programName={programName} />}
          {cart.checkoutStep === "done" && <DoneStep cart={cart} />}
        </div>
      </div>
    </div>
  );
}

function CartStep({ cart }: { cart: Cart }) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (cart.items.length === 0) {
    return <p className="text-sm text-slate-500">Your cart is empty.</p>;
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {cart.items.map((item) => {
          const spec = getAdType(item.adType);
          const thumb = adExampleThumb(spec);
          const tags = [...item.locations, ...item.timings, ...item.types];
          return (
            <li
              key={item.id}
              className="flex items-start gap-3 border border-slate-200 rounded-md p-3"
            >
              <div className="relative w-28 aspect-video shrink-0 rounded-md bg-slate-200 overflow-hidden">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <ImageIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                {spec ? (
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 mb-1">
                    {spec.area}
                  </span>
                ) : null}
                <p className="text-sm font-medium text-slate-800 truncate">{item.adType}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  {formatDate(item.startDate)} → {formatDate(item.endDate)}
                </p>
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center bg-roman-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-medium text-slate-800">
                  ${item.price.toLocaleString()}
                </span>
                {confirmId === item.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        cart.removeItem(item.id);
                        setConfirmId(null);
                      }}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmId(item.id)}
                    aria-label="Remove"
                    className="text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-slate-200 pt-3 space-y-1">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span>${cart.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Tax</span>
          <span>${cart.tax.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-bold text-slate-900">
          <span>Total</span>
          <span>${cart.total.toLocaleString()}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={cart.goToBilling}
        className="w-full bg-cobalt-500 hover:bg-cobalt-600 text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer"
      >
        Proceed to payment
      </button>
    </div>
  );
}

function BillingStep({ cart, programName }: { cart: Cart; programName: string }) {
  const [billedTo, setBilledTo] = useState(programName);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [payError, setPayError] = useState<string | null>(null);

  function handlePay() {
    if (!billedTo.trim() || !cardNumber.trim() || !expiry.trim() || !cvc.trim()) {
      setPayError("Fill in all payment fields.");
      return;
    }
    setPayError(null);
    cart.placeOrder();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Billed to</label>
        <input
          type="text"
          value={billedTo}
          onChange={(e) => setBilledTo(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Card number</label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="4242 4242 4242 4242"
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-slate-600">Expiry</label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="MM / YY"
            className={inputClass}
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-slate-600">CVC</label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder="CVC"
            className={inputClass}
          />
        </div>
      </div>

      <p className="text-xs text-slate-400">Test mode — no real charge.</p>

      {payError && (
        <p className="text-xs text-red-600" role="alert">
          {payError}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={cart.backToCart}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={handlePay}
          className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer"
        >
          Pay ${cart.total.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

function DoneStep({ cart }: { cart: Cart }) {
  const count = cart.lastOrder?.count ?? 0;
  return (
    <div className="flex flex-col items-center text-center gap-3 py-4">
      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
        <Check className="h-7 w-7 text-green-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">Order placed</h3>
      <p className="text-sm text-slate-600">
        {count} placement{count === 1 ? "" : "s"} purchased and submitted for approval. Receipt
        sent to your email.
      </p>
      <button
        type="button"
        onClick={cart.closeCheckout}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer"
      >
        Done
      </button>
    </div>
  );
}
