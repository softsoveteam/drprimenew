"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import StickyBuyButton from "@/components/StickyBuyButton";
import GoToTop from "@/components/GoToTop";
import TemplateScripts from "@/components/TemplateScripts";
import PwaRegister from "@/components/PwaRegister";
import ChatBot from "@/components/ChatBot";
import ShopRouteGuard from "@/components/ShopRouteGuard";

export default function PublicLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/auth-cp");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Preloader />
      <Header />
      <ShopRouteGuard>{children}</ShopRouteGuard>
      <Footer />
      <StickyBuyButton />
      <GoToTop />
      <ChatBot />
      <TemplateScripts />
      <PwaRegister />
      <Toaster position="top-right" />
    </>
  );
}
