import { createClient } from "@/lib/supabase/server";
import { Package } from "@/types/database";
import { TourCard } from "@/components/TourCard";
import { TourCardSkeleton } from "@/components/TourCardSkeleton";
import { SidebarFilter } from "@/components/SidebarFilter";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    maxPrice?: string;
    duration?: string;
    inclusions?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const supabase = await createClient();
  
  // Resolve filter state from search parameters
  const resolvedSearchParams = await searchParams;
  const maxPrice = Number(resolvedSearchParams.maxPrice || "200000");
  const duration = resolvedSearchParams.duration || "all";
  const inclusions = resolvedSearchParams.inclusions?.split(",")?.filter(Boolean) || [];

  // Fetch packages directly using the server client
  const { data: packages, error } = await supabase
    .from("packages")
    .select("*")
    .order("last_scraped_at", { ascending: false });

  if (error) {
    console.error("Error fetching packages:", error);
  }

  // Filter package data on server-side
  let filteredPackages = packages || [];

  // Filter by Max Price
  filteredPackages = filteredPackages.filter((pkg) => pkg.price_inr <= maxPrice);

  // Filter by Duration
  if (duration !== "all") {
    filteredPackages = filteredPackages.filter((pkg) => {
      const days = pkg.duration_days;
      if (duration === "short") return days <= 5;
      if (duration === "medium") return days >= 6 && days <= 9;
      if (duration === "long") return days >= 10;
      return true;
    });
  }

  // Filter by Inclusions
  if (inclusions.length > 0) {
    filteredPackages = filteredPackages.filter((pkg) => {
      return inclusions.every((inc) => pkg.inclusions[inc as keyof typeof pkg.inclusions] === true);
    });
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-ambient px-6 lg:px-8 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold text-slate-900 tracking-tight">
              TourBay<span className="text-[#0047ab]">.in</span>
            </span>
          </div>
          <nav className="flex items-center gap-6 md:gap-8 text-sm font-semibold text-slate-500">
            <a href="#" className="text-slate-900 transition-colors">North India</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Kashmir</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Ladakh</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Himachal</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-50/60 py-16 md:py-20 px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto text-center space-y-4">
          <span className="font-mono text-xs uppercase tracking-wider text-[#0047ab] font-bold">
            One North, All Options
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950">
            Discover North India
          </h1>
          <p className="font-sans text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            AI-driven aggregates and comparison for Himalayan tour packages. Clear, transparent choice engine.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-[1200px] w-full mx-auto px-6 lg:px-8 py-16 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar Area */}
          <aside className="md:col-span-4 lg:col-span-3">
            <Suspense fallback={<div className="bg-slate-50 rounded-2xl p-6 h-96 animate-pulse" />}>
              <SidebarFilter />
            </Suspense>
          </aside>

          {/* Cards Grid Area */}
          <section className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-950">Available Escape Packages</h2>
                <p className="text-xs text-slate-500 mt-0.5">Showing aggregated travel choices</p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                {filteredPackages.length} package{filteredPackages.length !== 1 && "s"} found
              </div>
            </div>

            {/* List / Grid Display */}
            {!packages ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <TourCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">No packages match the filters</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try adjusting your budget, package duration, or inclusion preferences.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPackages.map((pkg: Package, i: number) => (
                  <div
                    key={pkg.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <TourCard tour={pkg} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
