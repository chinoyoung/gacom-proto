"use client";

import useCreateAdForm from "../../_shared/useCreateAdForm";
import useAdCart from "../../_shared/useAdCart";
import { NAV_ITEMS, PROGRAM_NAME, PROFILE_COMPLETION } from "../../_shared/mock-data";
import FaithfulSidebar from "../faithful/FaithfulSidebar";
import FaithfulTopChrome from "../faithful/FaithfulTopChrome";
import FaithfulCheckoutModal from "../faithful/FaithfulCheckoutModal";
import AddedToCampaignModal from "../../_components/AddedToCampaignModal";
import StudioBuilder from "./StudioBuilder";

export default function StudioCreateAd() {
  const form = useCreateAdForm();
  const cart = useAdCart();

  const modalOpen = cart.checkoutStep !== "closed" || cart.addedOpen;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      <FaithfulSidebar navItems={NAV_ITEMS} activeKey="image" />

      <div className="flex-1 flex flex-col min-w-0">
        <FaithfulTopChrome
          programName={PROGRAM_NAME}
          profileCompletion={PROFILE_COMPLETION}
          bannerDismissed={form.state.profileBannerDismissed}
          onDismissBanner={form.dismissProfileBanner}
        />

        <main className={`flex-1 ${modalOpen ? "overflow-hidden" : "overflow-y-auto"}`}>
          <StudioBuilder form={form} cart={cart} />
        </main>
      </div>

      <FaithfulCheckoutModal cart={cart} programName={PROGRAM_NAME} />
      <AddedToCampaignModal cart={cart} />
    </div>
  );
}
