"use client";

import { useState } from "react";
import { getAdType } from "./ad-types";
import { DEFAULT_AD_PRICE, TAX_RATE } from "./mock-data";
import type { CartItem, CheckoutStep, PlacementSnapshot } from "./types";

export default function useAdCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("closed");
  const [lastOrder, setLastOrder] = useState<{ count: number; total: number } | null>(null);
  const [addedOpen, setAddedOpen] = useState(false);

  const count = items.length;
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal;

  function addItem(snapshot: PlacementSnapshot) {
    const price = getAdType(snapshot.adType)?.price ?? DEFAULT_AD_PRICE;
    setItems((xs) => [...xs, { ...snapshot, id: crypto.randomUUID(), price }]);
  }

  function removeItem(id: string) {
    setItems((xs) => xs.filter((x) => x.id !== id));
  }

  function clear() {
    setItems([]);
  }

  function openCart() {
    if (count > 0) setCheckoutStep("cart");
  }

  function goToBilling() {
    setCheckoutStep("billing");
  }

  function backToCart() {
    setCheckoutStep("cart");
  }

  function placeOrder() {
    setLastOrder({ count, total });
    setItems([]);
    setCheckoutStep("done");
  }

  function closeCheckout() {
    setCheckoutStep("closed");
  }

  function openAdded() {
    setAddedOpen(true);
  }

  function closeAdded() {
    setAddedOpen(false);
  }

  return {
    items,
    count,
    subtotal,
    tax,
    total,
    addItem,
    removeItem,
    clear,
    checkoutStep,
    lastOrder,
    openCart,
    goToBilling,
    backToCart,
    placeOrder,
    closeCheckout,
    addedOpen,
    openAdded,
    closeAdded,
  };
}
