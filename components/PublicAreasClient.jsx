"use client";

import { useState } from "react";
import Link from "next/link";
import { usePublicAreas, slugifyAreaName } from "@/hooks/usePublicAreas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, ChevronRight, Loader2, Navigation, Layers } from "lucide-react";

export default function PublicAreasClient({ initialAreas = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: areas = [], isLoading, isError, error } = usePublicAreas(
    {},
    { initialData: initialAreas.length > 0 ? initialAreas : undefined }
  );

  // Filter areas and subareas based on search
  const filteredAreas = areas.filter((area) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const parentMatches = area.name?.toLowerCase().includes(query);
    const childMatches = area.children?.some((child) => child.name?.toLowerCase().includes(query));
    return parentMatches || childMatches;
  });

  return (
    <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed]">
      {/* Hero Section */}
      <section className="px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1d1c50]/5 border border-[#1d1c50]/10 text-xs font-bold uppercase tracking-widest text-[#1d1c50]">
            <MapPin className="w-3.5 h-3.5 text-[#c9b896]" />
            Coverage & Delivery Locations
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1d1c50] tracking-tight font-serif">
            Service Areas
          </h1>
          <p className="text-lg text-[#4a4a6a] max-w-2xl mx-auto">
            Explore regions, main cities, and local subareas where Dr.Prime delivery and support services are available.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by city, region, or subarea..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                className="h-14 bg-white border-[#1d1c50]/15 focus-visible:ring-[#1d1c50] text-[#1d1c50] rounded-2xl shadow-sm text-base placeholder:text-[#4a4a6a]/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4a4a6a] hover:text-[#1d1c50] bg-[#f8f5ed] px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 max-w-6xl mx-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
            <p className="text-sm font-medium text-[#4a4a6a]">Loading service areas...</p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-red-100 shadow-sm">
            <p className="text-red-500 font-semibold mb-2">Failed to load service areas</p>
            <p className="text-sm text-[#4a4a6a]">{error?.message || "An unexpected error occurred."}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredAreas.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#1d1c50]/10 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#f8f5ed] text-[#1d1c50] flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-8 h-8 text-[#c9b896]" />
            </div>
            <h3 className="text-xl font-bold text-[#1d1c50] font-serif">No Areas Found</h3>
            <p className="text-sm text-[#4a4a6a] mt-2">
              {searchQuery
                ? `No service areas matched "${searchQuery}".`
                : "No service areas listed at the moment."}
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery("")}
                className="mt-6 bg-[#1d1c50] text-white hover:bg-[#1d1c50]/90 rounded-xl"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Areas Cards Grid */}
        {!isLoading && !isError && filteredAreas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredAreas.map((area) => {
              const areaSlug = `primeheal-in-${slugifyAreaName(area.name)}`;
              const areaHref = `/service-area/${areaSlug}?id=${area.id}`;

              return (
                <div
                  key={area.id}
                  className="bg-white rounded-3xl p-8 border border-[#1d1c50]/10 shadow-sm hover:shadow-xl hover:shadow-[#1d1c50]/5 transition-all duration-300 space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Parent Area Title */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={areaHref}
                        className="group flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-[#f8f5ed] text-[#1d1c50] flex items-center justify-center font-bold shadow-inner group-hover:bg-[#1d1c50] group-hover:text-[#c9b896] transition-colors">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-[#1d1c50] font-serif group-hover:text-[#c9b896] transition-colors">
                            {area.name}
                          </h2>
                          <span className="text-xs text-[#4a4a6a]/60 font-semibold uppercase tracking-wider">
                            Primary Region
                          </span>
                        </div>
                      </Link>

                      <Link
                        href={areaHref}
                        className="p-2.5 rounded-xl bg-[#f8f5ed] text-[#1d1c50] hover:bg-[#1d1c50] hover:text-[#c9b896] transition-colors"
                        title="View Details"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>

                    {/* Subareas Chips */}
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1d1c50] uppercase tracking-wider">
                        <Layers className="w-3.5 h-3.5 text-[#c9b896]" />
                        <span>Local Subareas ({area.children?.length || 0})</span>
                      </div>

                      {area.children && area.children.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {area.children.map((child) => {
                            const childSlug = `primeheal-in-${slugifyAreaName(child.name)}`;
                            const childHref = `/service-area/${childSlug}?id=${child.id}`;
                            return (
                              <Link
                                key={child.id}
                                href={childHref}
                                className="px-3 py-1.5 rounded-xl bg-[#f8f5ed]/80 hover:bg-[#1d1c50] text-[#1d1c50] hover:text-white border border-[#1d1c50]/10 text-xs font-medium transition-colors"
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-[#4a4a6a]/60 italic">No specific subareas listed under {area.name}.</p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="pt-4 border-t border-[#1d1c50]/5">
                    <Link
                      href={areaHref}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1d1c50] hover:text-[#c9b896] transition-colors"
                    >
                      <span>View Full {area.name} Coverage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
