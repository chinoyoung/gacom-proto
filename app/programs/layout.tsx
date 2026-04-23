import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VersionSwitcherWrapper } from "./_components/VersionSwitcherWrapper";
import { CommentLayerWrapper } from "@/components/comments/CommentLayerWrapper";

export default function PrototypeLayout({
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
      <CommentLayerWrapper />
    </>
  );
}
