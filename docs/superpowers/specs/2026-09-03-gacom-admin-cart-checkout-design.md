# GAcom Admin — Create Ad cart + checkout (design)

Adds an "add to cart" + full (mock) checkout feature to the Create Ad page (`/gacom-admin/create-ad`). An ad is a purchased placement; the cart lets someone configure a placement, add it, accumulate several, then review + pay + confirm. Built into the **faithful** variant only for now (brand port later). Everything is mock — no backend, no network, no real payment.

Chosen directions (from brainstorm): cart pattern **B — persistent right-rail cart**; end action **full checkout** (prices + billing/payment + confirmation); pricing **flat per ad type**; checkout surface **modal overlay**.

Concept A (top-bar cart + slide-out drawer) and C (sticky bottom bar) are explicitly kept as FUTURE options: the cart state/logic lives in a presentation-agnostic hook (`useAdCart`) so A or C can later be added as alternative presentation layers over the same hook without reworking cart logic.

## Architecture

- New `useAdCart` hook owns all cart + checkout state, separate from `useCreateAdForm` (which keeps owning the create-form fields). The faithful page composition calls both and wires them together.
- `useCreateAdForm` gains one method, `resetPlacementFields()`, so "Add to cart" can clear the per-placement fields for the next ad.
- Pricing is a flat lookup by ad type in `mock-data.ts`.
- The checkout is a single modal component that renders one of three steps based on `useAdCart`'s `checkoutStep`.

## Files

```
app/gacom-admin/create-ad/_shared/
  types.ts            # + CheckoutStep, PlacementSnapshot, CartItem
  mock-data.ts        # + AD_TYPE_PRICES, DEFAULT_AD_PRICE, TAX_RATE
  useAdCart.ts        # NEW — cart + checkout state hook
  useCreateAdForm.ts  # + resetPlacementFields()
_versions/faithful/
  FaithfulAdContentCard.tsx  # + "Add to cart" button (takes cart prop)
  FaithfulCartSummary.tsx    # NEW — right-rail persistent cart block (Concept B)
  FaithfulCheckoutModal.tsx  # NEW — 3-step modal (cart → billing → done)
  FaithfulCreateAd.tsx       # wire useAdCart, pass to card + summary, mount modal
```

## Types (`types.ts` additions)

```ts
export type CheckoutStep = "closed" | "cart" | "billing" | "done";
export interface PlacementSnapshot {
  adType: string;
  location: string;
  adPlacementType: string;
  timing: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;   // ISO YYYY-MM-DD
}
export interface CartItem extends PlacementSnapshot {
  id: string;
  price: number;
}
```

## Pricing (`mock-data.ts` additions)

- `AD_TYPE_PRICES: Record<string, number>` — one flat price per entry of `AD_TYPES`. Use plausible values, e.g.:
  - "Article Directory Destination Feature - Intern Abroad": 450
  - "Article Directory Destination Feature - Study Abroad": 450
  - "Homepage Feature - Volunteer Abroad": 800
  - "Sidebar Banner - Intern Abroad": 300
  (Match keys to the actual `AD_TYPES` strings created in the earlier task; if a name differs, key on the real values.)
- `DEFAULT_AD_PRICE = 400` — fallback for any ad type not in the map.
- `TAX_RATE = 0.08` — flat mock tax.

## `useAdCart` hook

`"use client"`, default export. Returns:

```ts
{
  items: CartItem[];
  count: number;                // items.length
  subtotal: number;             // sum of item.price
  tax: number;                  // Math.round(subtotal * TAX_RATE)
  total: number;                // subtotal + tax
  addItem(snapshot: PlacementSnapshot): void;  // price = AD_TYPE_PRICES[snapshot.adType] ?? DEFAULT_AD_PRICE; id via crypto.randomUUID(); appends
  removeItem(id: string): void;
  clear(): void;
  checkoutStep: CheckoutStep;   // default "closed"
  lastOrder: { count: number; total: number } | null; // default null
  openCart(): void;             // sets "cart" only when count > 0
  goToBilling(): void;          // "cart" -> "billing"
  backToCart(): void;           // "billing" -> "cart"
  placeOrder(): void;           // snapshot lastOrder = {count,total}; clear(); step -> "done"
  closeCheckout(): void;        // step -> "closed"
}
```

- Money values are whole dollars (integers); format for display with `toLocaleString()` and a `$` prefix.
- `id` uses `crypto.randomUUID()` (available in the browser). If unavailable in the render environment, fall back to `Date.now()+Math.random()` — but `crypto.randomUUID()` is fine for a client component.
- `placeOrder` MUST capture `lastOrder` before clearing so the confirmation step can show the count/total after the cart is emptied.

## `useCreateAdForm` addition

Add `resetPlacementFields(): void` that resets the per-placement fields to their empty defaults — `location: ""`, `adPlacementType: ""`, `timing: ""`, `title: ""`, `clientLink: ""`, `uploadedFileName: null`, `uploadedPreviewUrl: null` — and LEAVES `adType`, `startDate`, `endDate`, `previewDevice`, `profileBannerDismissed` unchanged (so the next placement keeps the same ad type/date range by default). Include it in the hook's returned object.

## Add to cart (in `FaithfulAdContentCard`)

The card now takes both `form` and `cart` props (`cart: ReturnType<typeof useAdCart>`). Add an **"Add to cart"** button in the footer, before Save as Draft / Submit for Approval (or grouped sensibly). Behavior:

- On click, validate that `form.state.location`, `form.state.adPlacementType`, and `form.state.timing` are all non-empty (these three define the placement; adType and dates always have defaults). If any is missing, show an inline error near the button — "Select a location, type, and timing first." — and do not add.
- On success: build a `PlacementSnapshot` from `form.state` (adType, location, adPlacementType, timing, startDate, endDate), call `cart.addItem(snapshot)`, then `form.resetPlacementFields()`, and show a transient "Added" confirmation on the button (flip label to "Added" with a check for ~1.5s via local state + timeout, then revert). Clear any prior inline error on edit.
- Style consistent with the faithful variant (standard Tailwind palette; the Add to cart button can be a secondary/outline style so the sky "Submit for Approval" stays the primary).

Save as Draft and Submit for Approval remain no-ops as before.

## Right-rail cart summary (`FaithfulCartSummary`, Concept B)

Takes `cart`. Rendered at the bottom of the right rail (after the Ad Content card) in `FaithfulCreateAd`.

- When `cart.count === 0`: a quiet empty state — a small card with a cart icon and muted text "Your cart is empty — add an ad placement to get started." (or render nothing; prefer the quiet empty state so the region isn't jarringly absent).
- When `cart.count > 0`: a card showing a header "Cart" with the count (e.g. "Cart · 2 ads"), the running `total` (formatted), and a full-width **Review cart** button that calls `cart.openCart()`. Optionally list item names compactly; keep it summary-level.
- Faithful styling: white card, slate borders; the Review cart button is the sky primary (this is the rail's main forward action once items exist).

## Checkout modal (`FaithfulCheckoutModal`)

Takes `cart` and `programName: string`. Renders `null` when `cart.checkoutStep === "closed"`. Otherwise a fixed full-screen overlay (`fixed inset-0 z-50 bg-black/40` + centered panel `bg-white rounded-lg max-w-lg w-full`), with `Escape`/backdrop click calling `cart.closeCheckout()` and a close (X) button. Three steps by `checkoutStep`:

1. **"cart"** — heading "Your cart"; list each `cart.items` line (ad type as title; a sub-line with location · timing and the date range; the formatted price; a remove button calling `cart.removeItem(id)`); a totals block (Subtotal, Tax, Total, all formatted); a primary "Proceed to payment" button calling `cart.goToBilling()`. If the list becomes empty via removes, show an empty message and hide "Proceed to payment".
2. **"billing"** — heading "Billing & payment"; local component state for `billedTo` (prefilled with `programName`), `cardNumber` (placeholder `4242 4242 4242 4242`), `expiry` (placeholder `MM / YY`), `cvc` (placeholder `CVC`); a muted "Test mode — no real charge" line; a "Back" button (`cart.backToCart()`) and a primary "Pay ${total}" button. Light validation: if any of the four fields is empty, show an inline error and do not proceed; otherwise call `cart.placeOrder()`. The card field is a plain text input that goes nowhere — never send it anywhere.
3. **"done"** — a success check, "Order placed", body "{cart.lastOrder.count} placement(s) submitted for approval. Receipt sent to your email." (guard `lastOrder` for null), and a "Done" button calling `cart.closeCheckout()`.

Modal notes: the real Next app may use `fixed` positioning (this is production React, not the visualize widget). Prefer `useEffect` to add/remove a `keydown` Escape listener while open. Keep focus trapping simple (not required for the prototype) but do make the backdrop and X close it.

## Wiring (`FaithfulCreateAd`)

- `const form = useCreateAdForm(); const cart = useAdCart();`
- Pass `cart` to `FaithfulAdContentCard` (in addition to `form`) and to `FaithfulCartSummary`.
- Right column becomes: Settings card, Ad Content card, then `<FaithfulCartSummary cart={cart} />`.
- Mount `<FaithfulCheckoutModal cart={cart} programName={PROGRAM_NAME} />` at the end of the composition.

## Interactivity summary (all mock, no backend)

- Add to cart validates the three placement selects, snapshots the config with a flat per-ad-type price, appends to the cart, resets placement fields, shows a transient "Added".
- Right-rail summary shows live count + total and opens the checkout.
- Checkout modal walks cart → billing → done; "Pay" is a no-op that records the order summary, clears the cart, and shows confirmation; "Done" closes.
- No network requests, no persistence, no real payment. A visible "Test mode — no real charge" line makes this explicit.

## Constraints

- Faithful variant only; standard Tailwind palette (slate/sky), no inline hex. Brand port is out of scope here.
- Client components. lucide-react icons (e.g. `ShoppingCart`, `Plus`, `Check`, `Trash2`, `CreditCard`, `X`, `ArrowLeft`).
- Do not collect or transmit real payment data; the card input is inert.
- No horizontal body overflow; modal must be scrollable if content exceeds viewport height (`max-h-[90vh] overflow-y-auto` on the panel).

## Out of scope

- Concept A (drawer) and C (bottom bar) presentations — future swaps over `useAdCart`.
- Brand variant of the cart/checkout.
- Real pricing logic beyond flat-per-ad-type; duration-based pricing.
- Any real payment, order persistence, or email.
