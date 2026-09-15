"use client";

import { use } from "react";
import Link from "next/link";
import { usePublicArea } from "@/hooks/usePublicAreas";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Loader2, Navigation, CheckCircle2, ShieldCheck, Truck, Layers } from "lucide-react";

export default function AreaDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const id = params?.id;

  const { data: area, isLoading, isError, error } = usePublicArea(id);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
          <p className="text-sm font-medium text-[#4a4a6a]">Loading service area details...</p>
        </div>
      </main>
    );
  }

  if (isError || !area) {
    return (
      <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed] flex flex-col justify-center items-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-lg border border-[#1d1c50]/10">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Navigation className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#1d1c50] font-serif">Service Area Not Found</h1>
          <p className="text-sm text-[#4a4a6a] mt-2 mb-6">
            The requested location could not be found or is no longer listed in our service registry.
          </p>
          <Link href="/areas">
            <Button className="bg-[#1d1c50] text-white hover:bg-[#1d1c50]/90 px-6 py-2.5 rounded-xl inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to All Service Areas
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const isSubarea = !!area.parent_id || !!area.parent;
  const parentName = area.parent?.name;
  const children = area.children || [];

  return (
    <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed] px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/areas"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Service Areas
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#1d1c50]/10 relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f8f5ed] border border-[#1d1c50]/10 text-xs font-bold uppercase tracking-wider text-[#1d1c50]">
                <MapPin className="w-3.5 h-3.5 text-[#c9b896]" />
                {isSubarea ? `Subarea of ${parentName || "Parent Region"}` : "Primary Coverage Region"}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-[#1d1c50] font-serif leading-tight">
                {area.name}
              </h1>

              {isSubarea && parentName && (
                <p className="text-sm text-[#4a4a6a]">
                  Located in the region of{" "}
                  <Link
                    href={`/areas/${area.parent_id}`}
                    className="font-semibold text-[#1d1c50] hover:text-[#c9b896] underline"
                  >
                    {parentName}
                  </Link>
                </p>
              )}
            </div>

            <div className="w-16 h-16 rounded-2xl bg-[#1d1c50] text-[#c9b896] flex items-center justify-center shrink-0 shadow-lg">
              <Truck className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Subareas List (if Parent Area) */}
            {!isSubarea && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#1d1c50]/10 space-y-6">
                <h2 className="text-xl font-bold text-[#1d1c50] font-serif border-b border-[#1d1c50]/10 pb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#c9b896]" />
                  Included Subareas & Districts ({children.length})
                </h2>

                {children.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/areas/${child.id}`}
                        className="p-4 rounded-2xl bg-[#f8f5ed]/60 hover:bg-[#1d1c50] text-[#1d1c50] hover:text-white border border-[#1d1c50]/5 font-medium text-sm transition-all flex items-center justify-between group"
                      >
                        <span>{child.name}</span>
                        <MapPin className="w-4 h-4 text-[#c9b896] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#4a4a6a] italic">
                    All addresses within {area.name} are covered directly under standard delivery.
                  </p>
                )}
              </div>
            )}

            {/* Service & Delivery Guarantee */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#1d1c50]/10 space-y-4">
              <h2 className="text-xl font-bold text-[#1d1c50] font-serif flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Delivery & Trial Eligibility
              </h2>
              <p className="text-sm text-[#4a4a6a] leading-relaxed">
                Orders placed from <strong>{area.name}</strong> are eligible for fast home delivery, our 30-night risk-free trial, and full warranty support for the Dr.Prime PrimeHeal cervical pillow.
              </p>
            </div>
          </div>

          {/* Sidebar Highlights */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#1d1c50] to-[#2c2b6e] text-white rounded-3xl p-8 shadow-lg space-y-4">
              <ShieldCheck className="w-8 h-8 text-[#c9b896]" />
              <h3 className="text-xl font-bold font-serif">30-Night Trial</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Experience orthopedic sleep relief in {area.name} with free returns and 24/7 customer care support.
              </p>
              <Link href="/product" className="inline-block pt-2">
                <Button className="bg-[#c9b896] text-[#1d1c50] hover:bg-white font-semibold rounded-xl w-full text-xs">
                  Shop PrimeHeal Pillow
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
