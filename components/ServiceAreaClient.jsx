"use client";

import { useState } from "react";
import Link from "next/link";
import { usePublicArea, usePublicAreaBySlugOrId, slugifyAreaName } from "@/hooks/usePublicAreas";
import { PRODUCT_FAQS, CUSTOMER_SAY_REVIEWS } from "@/lib/content";
import { AMAZON_URL, PRODUCT_PRICE } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ArrowLeft,
  Loader2,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Award,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";

export default function ServiceAreaClient({ initialArea = null, slug = "", queryId = null }) {
  // Client queries as fallback if initialArea wasn't rendered on server
  const { data: areaById, isLoading: isLoadingById } = usePublicArea(queryId, {
    initialData: queryId && initialArea ? initialArea : undefined,
  });

  const { data: areaBySlug, isLoading: isLoadingBySlug } = usePublicAreaBySlugOrId(!queryId ? slug : null, {
    initialData: !queryId && initialArea ? initialArea : undefined,
  });

  const area = initialArea || areaById || areaBySlug;
  const isLoading = !area && (queryId ? isLoadingById : isLoadingBySlug);

  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
          <p className="text-sm font-medium text-[#4a4a6a]">Loading service area & product information...</p>
        </div>
      </main>
    );
  }

  if (!area) {
    return (
      <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed] flex flex-col justify-center items-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-lg border border-[#1d1c50]/10">
          <div className="w-16 h-16 rounded-2xl bg-[#f8f5ed] text-[#1d1c50] flex items-center justify-center mx-auto mb-4 border border-[#1d1c50]/10">
            <MapPin className="w-8 h-8 text-[#c9b896]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1d1c50] font-serif">Location Info Unavailable</h1>
          <p className="text-sm text-[#4a4a6a] mt-2 mb-6">
            We couldn&apos;t find details for this location. Please choose a location from our service directory.
          </p>
          <Link href="/service-area">
            <Button className="bg-[#1d1c50] text-white hover:bg-[#1d1c50]/90 px-6 py-2.5 rounded-xl inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              View All Service Areas
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const rawAreaName = area.name || "Service Area";
  const areaName = rawAreaName
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const isSubarea = !!area.parent_id || !!area.parent;
  const parentName = area.parent?.name
    ? area.parent.name
        .split(/[\s-]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : null;
  const children = area.children || [];

  return (
    <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed] px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/service-area"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Service Areas
          </Link>
          <span className="text-xs font-bold text-[#c9b896] uppercase tracking-wider bg-[#1d1c50] px-3.5 py-1.5 rounded-full">
            Official Location Page &bull; {areaName}
          </span>
        </div>

        {/* Hero Banner Section */}
        <div className="bg-gradient-to-r from-[#1d1c50] via-[#242360] to-[#2c2b6e] rounded-3xl p-8 sm:p-14 text-white shadow-xl shadow-[#1d1c50]/15 relative overflow-hidden space-y-6">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#c9b896]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#c9b896] border border-white/10">
              <MapPin className="w-3.5 h-3.5" />
              <span>{isSubarea ? `Subarea of ${parentName || "Region"}` : "Primary Coverage Region"}</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl font-bold font-serif leading-tight tracking-tight !text-white"
              style={{ color: "#ffffff" }}
            >
              Dr.Prime PrimeHeal Pillow in <span className="text-[#c9b896]" style={{ color: "#c9b896" }}>{areaName}</span>
            </h1>

            <p className="text-base sm:text-lg text-white/90 max-w-3xl leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
              Experience cervical neck support, pressure-relieving 60D memory foam, and cooler sleep. Delivered directly to home addresses in <strong>{areaName}</strong> with our 30-night risk-free trial.
            </p>

            {/* Badges bar */}
            <div className="pt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
                <Truck className="w-4 h-4 text-[#c9b896]" />
                Express Delivery to {areaName}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#c9b896]" />
                30-Night Risk-Free Trial
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
                <Award className="w-4 h-4 text-[#c9b896]" />
                CertiPUR-US® & OEKO-TEX® Certified
              </span>
            </div>
          </div>
        </div>

        {/* Product Showcase + Area Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Area Subareas / Districts List */}
            {!isSubarea && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#1d1c50]/10 space-y-6">
                <div className="flex items-center justify-between border-b border-[#1d1c50]/10 pb-4">
                  <h2 className="text-xl font-bold text-[#1d1c50] font-serif flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#c9b896]" />
                    Coverage Districts in {areaName} ({children.length})
                  </h2>
                </div>

                {children.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/service-area/primeheal-in-${slugifyAreaName(child.name)}?id=${child.id}`}
                        className="p-4 rounded-2xl bg-[#f8f5ed]/70 hover:bg-[#1d1c50] text-[#1d1c50] hover:text-white border border-[#1d1c50]/5 font-medium text-sm transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#c9b896]" />
                          <span>{child.name}</span>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-[#c9b896] rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#4a4a6a] italic">
                    Full direct coverage available across all postal areas in {areaName}.
                  </p>
                )}
              </div>
            )}

            {/* Subarea Parent Link */}
            {isSubarea && parentName && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#1d1c50]/10 space-y-4">
                <h2 className="text-xl font-bold text-[#1d1c50] font-serif flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#c9b896]" />
                  Parent Region: {parentName}
                </h2>
                <p className="text-sm text-[#4a4a6a]">
                  {areaName} is a subarea within <strong>{parentName}</strong>. Direct delivery and warranty coverage apply.
                </p>
                {area.parent_id && (
                  <Link href={`/service-area/primeheal-in-${slugifyAreaName(parentName)}?id=${area.parent_id}`}>
                    <Button variant="outline" className="rounded-xl border-[#1d1c50]/20 text-[#1d1c50] text-xs">
                      View Main {parentName} Coverage &rarr;
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Static Product Specifications Grid */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#1d1c50]/10 space-y-6">
              <h2 className="text-2xl font-bold text-[#1d1c50] font-serif flex items-center gap-2">
                <Package className="w-6 h-6 text-[#c9b896]" />
                PrimeHeal Orthopedic Pillow Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#f8f5ed]/60 border border-[#1d1c50]/5 space-y-1">
                  <span className="text-xs font-semibold uppercase text-[#4a4a6a]/60">Foam Core Density</span>
                  <p className="text-base font-bold text-[#1d1c50]">60D High-Density Memory Foam</p>
                  <p className="text-xs text-[#4a4a6a]">Orthopedic support that retains shape without flattening.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8f5ed]/60 border border-[#1d1c50]/5 space-y-1">
                  <span className="text-xs font-semibold uppercase text-[#4a4a6a]/60">Dimensions & Weight</span>
                  <p className="text-base font-bold text-[#1d1c50]">63 x 36 x 12 cm &bull; ~1259g</p>
                  <p className="text-xs text-[#4a4a6a]">Standard adult cervical pillow size for all bed sizes.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8f5ed]/60 border border-[#1d1c50]/5 space-y-1">
                  <span className="text-xs font-semibold uppercase text-[#4a4a6a]/60">Cover Materials</span>
                  <p className="text-base font-bold text-[#1d1c50]">90% Nylon / 10% Spandex Top</p>
                  <p className="text-xs text-[#4a4a6a]">Cooling, breathable stretch top with 100% polyester base.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8f5ed]/60 border border-[#1d1c50]/5 space-y-1">
                  <span className="text-xs font-semibold uppercase text-[#4a4a6a]/60">Certifications & Safety</span>
                  <p className="text-base font-bold text-[#1d1c50]">CertiPUR-US® & OEKO-TEX®</p>
                  <p className="text-xs text-[#4a4a6a]">Tested free from heavy metals, VOCs, and harmful chemicals.</p>
                </div>
              </div>
            </div>

            {/* Static Product FAQs Accordion */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#1d1c50]/10 space-y-6">
              <h2 className="text-2xl font-bold text-[#1d1c50] font-serif">
                Pillow Questions & Answers for {areaName}
              </h2>

              <div className="space-y-3">
                {PRODUCT_FAQS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-[#1d1c50]/10 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        className="w-full text-left p-4 sm:p-5 font-bold text-[#1d1c50] flex items-center justify-between gap-4 bg-[#f8f5ed]/50 hover:bg-[#f8f5ed] transition-colors"
                      >
                        <span className="font-serif text-base">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-[#c9b896] shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#1d1c50]/50 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-4 sm:p-5 text-sm text-[#4a4a6a] leading-relaxed bg-white border-t border-[#1d1c50]/5">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#1d1c50]/10 space-y-6">
              <div className="flex items-center justify-between border-b border-[#1d1c50]/10 pb-4">
                <h2 className="text-2xl font-bold text-[#1d1c50] font-serif flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#c9b896] fill-[#c9b896]" />
                  Verified Buyer Reviews
                </h2>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  5.0 ★ Rating
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CUSTOMER_SAY_REVIEWS.slice(0, 4).map((rev, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#f8f5ed]/60 border border-[#1d1c50]/5 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-[#c9b896]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#c9b896]" />
                        ))}
                      </div>
                      <h4 className="font-bold text-[#1d1c50] text-sm">{rev.title}</h4>
                      <p className="text-xs text-[#4a4a6a] italic leading-relaxed">&ldquo;{rev.quote}&rdquo;</p>
                    </div>
                    <p className="text-[11px] font-semibold text-[#1d1c50]/60 pt-2">&bull; {rev.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Purchase Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#1d1c50]/10 text-center space-y-6 sticky top-36">
              {/* Product Pillow Image */}
              <div className="relative rounded-2xl overflow-hidden bg-[#f8f5ed] p-4 border border-[#1d1c50]/5">
                <img
                  src="/assets/slider-pillow.png"
                  alt="Dr.Prime PrimeHeal Orthopedic Cervical Pillow"
                  className="w-full h-auto object-contain mx-auto max-h-48 drop-shadow-md"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1d1c50] font-serif">PrimeHeal Cervical Pillow</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-[#1d1c50]">${PRODUCT_PRICE}</span>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                    Free Delivery
                  </span>
                </div>
                <p className="text-xs text-[#4a4a6a]">
                  Direct express delivery to all postal codes in <strong>{areaName}</strong>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={AMAZON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-[#1d1c50] hover:bg-[#1d1c50]/90 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Buy Now on Amazon</span>
                  <ExternalLink className="w-4 h-4 text-[#c9b896]" />
                </a>

                <Link href="/contact" className="block">
                  <Button variant="outline" className="w-full h-11 rounded-xl border-[#1d1c50]/20 text-[#1d1c50] text-xs">
                    Ask Questions
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-[#1d1c50]/10 text-xs text-[#4a4a6a] space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>30-Night Risk-Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CertiPUR-US® Memory Foam</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>OEKO-TEX® Cooling Cover</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
