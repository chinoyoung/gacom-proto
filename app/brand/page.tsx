"use client";

import BrandHero from "./_components/BrandHero";
import BrandInPageNav from "./_components/BrandInPageNav";
import BrandPrinciples from "./_components/BrandPrinciples";
import BrandColors from "./_components/BrandColors";
import BrandTypography from "./_components/BrandTypography";
import BrandComponents from "./_components/BrandComponents";
import BrandSpacing from "./_components/BrandSpacing";
import BrandUsage from "./_components/BrandUsage";

export default function BrandPage() {
  return (
    <main className="text-neutral-800">
      <BrandHero />
      <BrandInPageNav />
      <BrandPrinciples />
      <BrandColors />
      <BrandTypography />
      <BrandComponents />
      <BrandSpacing />
      <BrandUsage />
    </main>
  );
}
