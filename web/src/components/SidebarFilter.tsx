"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Plane, Bed, Utensils, Bus, Camera } from "lucide-react";

const INCLUSIONS_LIST = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Bed },
  { id: "meals", label: "Meals", icon: Utensils },
  { id: "transfers", label: "Transfers", icon: Bus },
  { id: "sightseeing", label: "Sightseeing", icon: Camera },
];

export function SidebarFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read current filters from URL search parameters
  const maxPrice = searchParams.get("maxPrice") || "200000";
  const duration = searchParams.get("duration") || "all";
  const selectedInclusions = searchParams.get("inclusions")?.split(",")?.filter(Boolean) || [];

  // Centralized search params modifier
  const updateFilters = useCallback((newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [pathname, router, searchParams]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ maxPrice: e.target.value });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ duration: e.target.value });
  };

  const handleInclusionToggle = (inclusionId: string) => {
    let nextInclusions = [...selectedInclusions];
    if (nextInclusions.includes(inclusionId)) {
      nextInclusions = nextInclusions.filter((id) => id !== inclusionId);
    } else {
      nextInclusions.push(inclusionId);
    }
    updateFilters({ inclusions: nextInclusions.length > 0 ? nextInclusions.join(",") : null });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div className="bg-slate-50/70 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-8 sticky top-24 self-start">
      <div>
        <h3 className="font-heading text-lg font-semibold text-slate-950">Filters</h3>
        <p className="text-xs text-slate-500 mt-1">Refine Himalayan escape listings</p>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-mono uppercase tracking-wider font-semibold">Max Budget</span>
          <span className="font-mono font-bold text-slate-950">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(Number(maxPrice))}
          </span>
        </div>
        <input
          type="range"
          min="20000"
          max="200000"
          step="5000"
          value={maxPrice}
          onChange={handlePriceChange}
          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0047ab] focus:outline-none"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>₹20K</span>
          <span>₹200K+</span>
        </div>
      </div>

      {/* Duration Dropdown */}
      <div className="space-y-2">
        <label className="text-slate-400 font-mono text-xs uppercase tracking-wider font-semibold block">
          Duration
        </label>
        <div className="relative">
          <select
            value={duration}
            onChange={handleDurationChange}
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#0047ab]/20 focus:border-[#0047ab] p-2.5 appearance-none pr-8 cursor-pointer font-sans"
          >
            <option value="all">All Durations</option>
            <option value="short">1 - 5 Days</option>
            <option value="medium">6 - 9 Days</option>
            <option value="long">10+ Days</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Inclusions Checkboxes */}
      <div className="space-y-3">
        <span className="text-slate-400 font-mono text-xs uppercase tracking-wider font-semibold block">
          Inclusions
        </span>
        <div className="space-y-2.5">
          {INCLUSIONS_LIST.map((inclusion) => {
            const Icon = inclusion.icon;
            const isChecked = selectedInclusions.includes(inclusion.id);

            return (
              <button
                key={inclusion.id}
                type="button"
                onClick={() => handleInclusionToggle(inclusion.id)}
                className="flex items-center gap-3 w-full text-left group cursor-pointer focus:outline-none"
              >
                {/* Custom Checkbox adhering to Stitch checked/unchecked guidelines */}
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    isChecked
                      ? "bg-[#0047ab] text-white"
                      : "border-2 border-slate-200 bg-transparent text-transparent group-hover:border-slate-300"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5 stroke-[3]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="flex items-center gap-2 text-slate-700 group-hover:text-slate-950 transition-colors">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <span className="text-sm font-medium">{inclusion.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Filter Button */}
      <button
        onClick={handleReset}
        disabled={isPending}
        className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200/60 rounded-lg active:scale-[0.97] transition-transform duration-150 cursor-pointer"
      >
        {isPending ? "Filtering..." : "Reset Filters"}
      </button>
    </div>
  );
}
