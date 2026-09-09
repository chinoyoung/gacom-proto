"use client";

import useCreateAdForm from "../../_shared/useCreateAdForm";
import useAdCart from "../../_shared/useAdCart";
import { NAV_ITEMS, PROGRAM_NAME, PROFILE_COMPLETION } from "../../_shared/mock-data";
import FaithfulSidebar from "./FaithfulSidebar";
import FaithfulTopChrome from "./FaithfulTopChrome";
import FaithfulAdTypeCard from "./FaithfulAdTypeCard";
import FaithfulAdPreviewCard from "./FaithfulAdPreviewCard";
import FaithfulAdContentCard from "./FaithfulAdContentCard";
import FaithfulCartSummary from "./FaithfulCartSummary";
import FaithfulCheckoutModal from "./FaithfulCheckoutModal";

export default function FaithfulCreateAd() {
  const form = useCreateAdForm();
  const cart = useAdCart();

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

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6 py-6">
            <h1 className="text-xl font-semibold text-slate-900 mb-6">Create Ad</h1>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
              {/* Left main column: Ad Type + Ad Preview */}
              <div className="space-y-6">
                <FaithfulAdTypeCard form={form} />
                <FaithfulAdPreviewCard form={form} />
              </div>
              {/* Right rail: Ad Content */}
              <div className="space-y-6">
                <FaithfulAdContentCard form={form} cart={cart} />
                <FaithfulCartSummary cart={cart} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <FaithfulCheckoutModal cart={cart} programName={PROGRAM_NAME} />
    </div>
  );
}
