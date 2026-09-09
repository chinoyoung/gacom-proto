# GAcom Admin — Create Ad cart + checkout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "add to cart" + mock full-checkout feature to the faithful Create Ad page — configure a placement, add it, accumulate several, then review, pay (no-op), and confirm.

**Architecture:** A presentation-agnostic `useAdCart` hook owns cart + checkout state; the faithful page composition wires it to the Ad Content card (Add to cart), a persistent right-rail cart summary (Concept B), and a 3-step checkout modal. `useCreateAdForm` gains one reset method. Pricing is a flat lookup by ad type.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, lucide-react. No backend.

**Spec:** `docs/superpowers/specs/2026-09-03-gacom-admin-cart-checkout-design.md`

## Global Constraints

- No React component test harness in this repo; verify with `npx tsc --noEmit`, `npx eslint <files>`, and a browser drive of the running dev server (`http://localhost:3000`, authed session in the in-app Browser pane). Do NOT invent component unit tests.
- Do NOT run any git command (files uncommitted; git checkout/restore would destroy work). Fix mistakes with Edit only.
- Faithful variant ONLY. Standard Tailwind palette (slate/sky) is correct here; NO inline hex in className.
- All mock — NO backend, NO network, NO persistence, NO real payment. The checkout card field is an inert plain text input whose value is never transmitted. Show a visible "Test mode — no real charge" line in the billing step.
- Client components (`"use client"`). lucide-react icons.
- Money values are integer dollars; format with `toLocaleString()` and a `$` prefix. `TAX_RATE = 0.08`; `tax = Math.round(subtotal * TAX_RATE)`; `total = subtotal + tax`.
- Concept A (drawer) / C (bottom bar) are future presentation swaps over `useAdCart` — do not build them; just keep cart logic in the hook, not in the presentation components.
- No horizontal body overflow; modal panel `max-h-[90vh] overflow-y-auto`.

---

### Task 1: Shared cart logic (types, pricing, `useAdCart`, form reset)

**Files:**
- Modify: `app/gacom-admin/create-ad/_shared/types.ts`
- Modify: `app/gacom-admin/create-ad/_shared/mock-data.ts`
- Create: `app/gacom-admin/create-ad/_shared/useAdCart.ts`
- Modify: `app/gacom-admin/create-ad/_shared/useCreateAdForm.ts`

**Interfaces (produced):**
```ts
// types.ts
export type CheckoutStep = "closed" | "cart" | "billing" | "done";
export interface PlacementSnapshot {
  adType: string; location: string; adPlacementType: string;
  timing: string; startDate: string; endDate: string;
}
export interface CartItem extends PlacementSnapshot { id: string; price: number; }

// mock-data.ts
export const AD_TYPE_PRICES: Record<string, number>;
export const DEFAULT_AD_PRICE = 400;
export const TAX_RATE = 0.08;

// useAdCart.ts default export hook returns:
{
  items: CartItem[]; count: number; subtotal: number; tax: number; total: number;
  addItem(snapshot: PlacementSnapshot): void;
  removeItem(id: string): void;
  clear(): void;
  checkoutStep: CheckoutStep;
  lastOrder: { count: number; total: number } | null;
  openCart(): void; goToBilling(): void; backToCart(): void;
  placeOrder(): void; closeCheckout(): void;
}

// useCreateAdForm.ts return gains:
resetPlacementFields(): void;
```

- [ ] **Step 1: Add types** to `types.ts` — `CheckoutStep`, `PlacementSnapshot`, `CartItem` exactly as above (append; don't disturb existing `CreateAdState`/`PreviewDevice`/`NavItem`).

- [ ] **Step 2: Add pricing to `mock-data.ts`.** First READ the existing `AD_TYPES` array in that file and key `AD_TYPE_PRICES` on those exact strings (do not invent new ad-type strings). Assign plausible flat prices (e.g. the Intern/Study directory features 450, a Homepage feature 800, a Sidebar banner 300 — map to whatever the real 4 entries are). Add `DEFAULT_AD_PRICE = 400` and `TAX_RATE = 0.08`.

- [ ] **Step 3: Write `useAdCart.ts`** (`"use client"`, default export). Implementation notes:
  - `const [items, setItems] = useState<CartItem[]>([])`; `const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("closed")`; `const [lastOrder, setLastOrder] = useState<{count:number;total:number}|null>(null)`.
  - Derived: `count = items.length`; `subtotal = items.reduce((s,i)=>s+i.price,0)`; `tax = Math.round(subtotal * TAX_RATE)`; `total = subtotal + tax`.
  - `addItem(snapshot)`: `const price = AD_TYPE_PRICES[snapshot.adType] ?? DEFAULT_AD_PRICE; setItems(xs => [...xs, { ...snapshot, id: crypto.randomUUID(), price }]);`
  - `removeItem(id)`: `setItems(xs => xs.filter(x => x.id !== id));`
  - `clear()`: `setItems([])`.
  - `openCart()`: only when `count > 0` → `setCheckoutStep("cart")`.
  - `goToBilling()`: `setCheckoutStep("billing")`; `backToCart()`: `setCheckoutStep("cart")`.
  - `placeOrder()`: capture summary BEFORE clearing → `setLastOrder({ count, total }); setItems([]); setCheckoutStep("done");`
  - `closeCheckout()`: `setCheckoutStep("closed")`.
  - Return the exact object shape above.

- [ ] **Step 4: Add `resetPlacementFields` to `useCreateAdForm.ts`.** A function that does `setState(s => ({ ...s, location: "", adPlacementType: "", timing: "", title: "", clientLink: "", uploadedFileName: null, uploadedPreviewUrl: null }))` and add it to the returned object. Leave `adType`, `startDate`, `endDate`, `previewDevice`, `profileBannerDismissed` untouched.

- [ ] **Step 5: Typecheck.** `npx tsc --noEmit` — no errors.
- [ ] **Step 6: Lint.** `npx eslint "app/gacom-admin/create-ad/_shared/"*.ts` — clean.
- [ ] **Step 7: Stop for review (no git).**

---

### Task 2: Add to cart + right-rail cart summary

**Files:**
- Modify: `app/gacom-admin/create-ad/_versions/faithful/FaithfulAdContentCard.tsx` (add `cart` prop + Add to cart button)
- Create: `app/gacom-admin/create-ad/_versions/faithful/FaithfulCartSummary.tsx`
- Modify: `app/gacom-admin/create-ad/_versions/faithful/FaithfulCreateAd.tsx` (create `cart`, pass to card + summary, mount summary in right column)

**Interfaces:**
- Consumes: `useAdCart` (Task 1) as `type Cart = ReturnType<typeof useAdCart>`; `useCreateAdForm` return (`form`) incl. new `resetPlacementFields`; `PlacementSnapshot` type.
- Produces: `FaithfulCartSummary({ cart }: { cart: Cart })` default export; `FaithfulAdContentCard` now takes `{ form, cart }`.

- [ ] **Step 1: Update `FaithfulAdContentCard.tsx`** to take `{ form, cart }` (`cart: ReturnType<typeof useAdCart>`; import the hook for the type). Add local state: `const [addError, setAddError] = useState<string | null>(null); const [justAdded, setJustAdded] = useState(false);`. Add a handler:
```tsx
function handleAddToCart() {
  if (!form.state.location || !form.state.adPlacementType || !form.state.timing) {
    setAddError("Select a location, type, and timing first.");
    return;
  }
  setAddError(null);
  cart.addItem({
    adType: form.state.adType, location: form.state.location,
    adPlacementType: form.state.adPlacementType, timing: form.state.timing,
    startDate: form.state.startDate, endDate: form.state.endDate,
  });
  form.resetPlacementFields();
  setJustAdded(true);
  setTimeout(() => setJustAdded(false), 1500);
}
```
  Add an **"Add to cart"** button in the footer area, before/besides Save as Draft & Submit for Approval. Secondary/outline style (e.g. `border border-slate-300 text-slate-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-slate-50 inline-flex items-center gap-1.5`) with a `ShoppingCart` (or `Plus`) icon; when `justAdded`, show a `Check` icon + "Added" and swap to a subtle green style (`border-green-500 text-green-600`). Render `addError` as inline `text-xs text-red-600 mt-1` near the button (`role="alert"`). Keep Save as Draft / Submit for Approval as-is (no-ops). The sky "Submit for Approval" remains the primary. Clearing the error on next successful add is handled by the handler; that's sufficient.

- [ ] **Step 2: Write `FaithfulCartSummary.tsx`** (`"use client"`, default export, `{ cart }`). Card `bg-white rounded-lg border border-slate-200 p-5`.
  - Empty (`cart.count === 0`): a `ShoppingCart` icon (slate-300) + muted text "Your cart is empty — add an ad placement to get started." (`text-sm text-slate-400`).
  - Non-empty: header row with "Cart" bold + a `text-slate-500` count e.g. `· {cart.count} ad{cart.count === 1 ? "" : "s"}`; a totals line showing `Total` label and `${cart.total.toLocaleString()}` (font-semibold); a full-width **Review cart** button (sky primary: `w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-md`) calling `cart.openCart()`. Optionally list item ad-type names compactly (`text-xs text-slate-500 truncate` per line) above the total.

- [ ] **Step 3: Wire `FaithfulCreateAd.tsx`.** Add `const cart = useAdCart();` next to the existing `const form = useCreateAdForm();`. Change `<FaithfulAdContentCard form={form} />` to `<FaithfulAdContentCard form={form} cart={cart} />`. Append `<FaithfulCartSummary cart={cart} />` after the Ad Content card in the right column's `space-y-6` stack. (Checkout modal is mounted in Task 3 — not yet.)

- [ ] **Step 4: Typecheck + lint** the three files.

- [ ] **Step 5: Browser verify.** In the in-app Browser pane, open `http://localhost:3000/gacom-admin/create-ad`. Select a Location, Type, and Timing, click **Add to cart** → button flips to "Added", the three selects reset, and the right-rail summary shows "Cart · 1 ad" with a total. Add a second placement → count 2, total updates. Try Add to cart with the selects empty → inline error appears, nothing added. Screenshot.

- [ ] **Step 6: Stop for review (no git).**

---

### Task 3: Checkout modal (cart → billing → done)

**Files:**
- Create: `app/gacom-admin/create-ad/_versions/faithful/FaithfulCheckoutModal.tsx`
- Modify: `app/gacom-admin/create-ad/_versions/faithful/FaithfulCreateAd.tsx` (mount the modal)

**Interfaces:**
- Consumes: `Cart = ReturnType<typeof useAdCart>`, `PROGRAM_NAME` from `mock-data.ts`.
- Produces: `FaithfulCheckoutModal({ cart, programName }: { cart: Cart; programName: string })` default export.

- [ ] **Step 1: Write `FaithfulCheckoutModal.tsx`** (`"use client"`). Return `null` when `cart.checkoutStep === "closed"`. Otherwise render an overlay:
  - Backdrop: `fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4` with `onClick` (on the backdrop only) → `cart.closeCheckout()`.
  - Panel: `bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl` with `onClick={e => e.stopPropagation()}`. A header row with a step-appropriate title and an `X` close button (`cart.closeCheckout()`).
  - `useEffect`: while open (step !== "closed"), add a `keydown` listener that calls `cart.closeCheckout()` on `Escape`; clean up on unmount/close.
  - Body by `cart.checkoutStep`:
    - `"cart"`: heading "Your cart". If `cart.items.length === 0`, show "Your cart is empty." and no proceed button. Else map `cart.items`: each row `flex items-start justify-between gap-3 border border-slate-200 rounded-md p-3` — left: ad type (`text-sm font-medium text-slate-800`) + a sub-line `text-xs text-slate-500` = `{location} · {timing}` and a second `text-xs text-slate-400` = `{startDate} → {endDate}`; right: `${price.toLocaleString()}` (`text-sm font-medium`) and a `Trash2` icon button (`text-slate-400 hover:text-red-600`, `aria-label="Remove"`) → `cart.removeItem(item.id)`. Totals block (border-top): Subtotal `${cart.subtotal.toLocaleString()}`, Tax `${cart.tax.toLocaleString()}`, Total `${cart.total.toLocaleString()}` (bold). Footer: a primary "Proceed to payment" button (`bg-sky-500 hover:bg-sky-600 text-white ...`) → `cart.goToBilling()` (only when items > 0).
    - `"billing"`: heading "Billing & payment". Local state `billedTo` (init `programName`), `cardNumber`, `expiry`, `cvc`, and `payError: string|null`. Fields (each a standard faithful input `h-10 w-full rounded-md border border-slate-300 px-3 text-sm`): "Billed to" (text, value billedTo), "Card number" (text, placeholder `4242 4242 4242 4242`, leading `CreditCard` icon optional), a row of "Expiry" (placeholder `MM / YY`) + "CVC" (placeholder `CVC`). A muted line `text-xs text-slate-400` with a note: "Test mode — no real charge." Footer: a "Back" button (`ArrowLeft` + text, subtle) → `cart.backToCart()`, and a primary "Pay ${cart.total.toLocaleString()}" button. Pay handler: if any of `billedTo/cardNumber/expiry/cvc` is empty (trimmed), `setPayError("Fill in all payment fields.")` and stop; else `cart.placeOrder()`. Show `payError` inline (`text-xs text-red-600`, role="alert"). The card field is inert — never send it anywhere.
    - `"done"`: a centered success state — a `w-14 h-14 rounded-full bg-green-50` circle with a `Check` icon (`text-green-600`), heading "Order placed", body `text-sm text-slate-600` = `{cart.lastOrder?.count ?? 0} placement{(cart.lastOrder?.count ?? 0) === 1 ? "" : "s"} submitted for approval. Receipt sent to your email.`, and a primary "Done" button → `cart.closeCheckout()`.
  - lucide-react: `X`, `Trash2`, `CreditCard`, `ArrowLeft`, `Check`.

- [ ] **Step 2: Mount in `FaithfulCreateAd.tsx`.** Import `PROGRAM_NAME` (already imported for top chrome) and add `<FaithfulCheckoutModal cart={cart} programName={PROGRAM_NAME} />` at the end of the composition (after the main layout, inside the root element).

- [ ] **Step 3: Typecheck + lint.**

- [ ] **Step 4: Browser verify.** Add 2 placements, click Review cart → modal opens on the cart step with 2 line items + totals. Remove one → updates. Proceed to payment → billing step; click Pay with a field emptied → inline error; fill fields → Pay → done step shows "1 placement submitted…"; Done closes the modal and the right-rail cart is now empty. Escape and backdrop-click also close. Screenshot the cart and done steps.

- [ ] **Step 5: Stop for review (no git).**

---

### Task 4: Whole-feature verification

**Files:** none.

- [ ] **Step 1:** `npx tsc --noEmit` — no errors in `app/gacom-admin/**`.
- [ ] **Step 2:** `npx eslint "app/gacom-admin/**/*.{ts,tsx}"` — clean.
- [ ] **Step 3:** `npm run build` — completes; `/gacom-admin/create-ad` builds with no errors.
- [ ] **Step 4:** Browser drive the full journey in one pass: add 2–3 ads (with the "select first" error path), verify running total, open Review cart, remove an item, proceed to payment, hit the empty-field error, pay, see confirmation, confirm cart clears and modal closes; verify no horizontal overflow and the modal scrolls if tall. Capture screenshots to `docs/screenshots/`.
- [ ] **Step 5:** Report; stop for review (no git).

---

## Self-Review

**Spec coverage:**
- Presentation-agnostic `useAdCart` (cart + checkout state) → Task 1 Step 3. ✓
- Flat per-ad-type pricing + tax → Task 1 Step 2. ✓
- `resetPlacementFields` → Task 1 Step 4. ✓
- Add to cart (validate 3 selects, snapshot, reset, transient) → Task 2 Step 1. ✓
- Right-rail summary Concept B (empty + populated, Review cart) → Task 2 Step 2. ✓
- Checkout modal cart→billing→done, remove, totals, mock pay no-op, test-mode note, Escape/backdrop close → Task 3 Step 1. ✓
- Wiring → Task 2 Step 3 + Task 3 Step 2. ✓
- Mock only / no payment transmission / faithful palette / no overflow → Global Constraints + task styling. ✓

**Placeholder scan:** No TBD/TODO; handlers and state given as concrete code; component structure/copy/classes specified. ✓

**Type consistency:** `Cart = ReturnType<typeof useAdCart>` used as the prop type in Tasks 2–3; `PlacementSnapshot` fields match the `addItem` call in Task 2; `cart` methods (`addItem/removeItem/openCart/goToBilling/backToCart/placeOrder/closeCheckout`) and fields (`items/count/subtotal/tax/total/checkoutStep/lastOrder`) match across the hook (Task 1) and consumers (Tasks 2–3); `resetPlacementFields` defined in Task 1 and called in Task 2. ✓
