import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VersionSwitcherWrapper } from "./_components/VersionSwitcherWrapper";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <VersionSwitcherWrapper />
    </>
  );
}
