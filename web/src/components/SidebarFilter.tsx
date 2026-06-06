"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Plane, Bed, Utensils, Bus, Camera } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

  const handlePriceChange = (value: number | readonly number[]) => {
    const numericValue = Array.isArray(value) ? value[0] : value;
    updateFilters({ maxPrice: String(numericValue) });
  };

  const handleDurationChange = (val: string | null) => {
    updateFilters({ duration: val });
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
    <div className="bg-slate-50/70 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-8 sticky top-24 self-start select-none">
      <div>
        <h3 className="font-heading text-lg font-semibold text-slate-950">Filters</h3>
        <p className="text-xs text-slate-500 mt-1">Refine Himalayan escape listings</p>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-4">
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
        <Slider
          value={[Number(maxPrice)]}
          onValueChange={handlePriceChange}
          min={20000}
          max={200000}
          step={5000}
          className="py-1 cursor-pointer"
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
        <Select value={duration} onValueChange={handleDurationChange}>
          <SelectTrigger className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg hover:border-slate-300 transition-colors cursor-pointer active:scale-[0.97] transition-transform duration-150">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-slate-200 shadow-md">
            <SelectItem value="all" className="cursor-pointer active:scale-[0.97] transition-transform duration-100">All Durations</SelectItem>
            <SelectItem value="short" className="cursor-pointer active:scale-[0.97] transition-transform duration-100">1 - 5 Days</SelectItem>
            <SelectItem value="medium" className="cursor-pointer active:scale-[0.97] transition-transform duration-100">6 - 9 Days</SelectItem>
            <SelectItem value="long" className="cursor-pointer active:scale-[0.97] transition-transform duration-100">10+ Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inclusions Checkboxes */}
      <div className="space-y-3">
        <span className="text-slate-400 font-mono text-xs uppercase tracking-wider font-semibold block">
          Inclusions
        </span>
        <div className="space-y-3">
          {INCLUSIONS_LIST.map((inclusion) => {
            const Icon = inclusion.icon;
            const isChecked = selectedInclusions.includes(inclusion.id);

            return (
              <div 
                key={inclusion.id}
                className="flex items-center gap-3 w-full group cursor-pointer active:scale-[0.97] transition-transform duration-150"
              >
                <Checkbox
                  id={`inclusion-${inclusion.id}`}
                  checked={isChecked}
                  onCheckedChange={() => handleInclusionToggle(inclusion.id)}
                  className="cursor-pointer"
                />
                <label
                  htmlFor={`inclusion-${inclusion.id}`}
                  className="flex items-center gap-2 text-slate-700 group-hover:text-slate-950 transition-colors text-sm font-medium cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <span>{inclusion.label}</span>
                </label>
              </div>
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
