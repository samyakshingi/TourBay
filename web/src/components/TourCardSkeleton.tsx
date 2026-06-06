import { Skeleton } from "@/components/ui/skeleton";

export function TourCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-ambient overflow-hidden">
      {/* Thumbnail Block */}
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        <Skeleton className="w-full h-full bg-slate-200/60" />
        
        {/* Price Glassmorphism Overlay Skeleton */}
        <div className="absolute bottom-4 right-4 bg-white/70 border border-white/20 px-3.5 py-2 rounded-xl shadow-sm w-28 h-12 flex flex-col justify-center gap-1.5">
          <Skeleton className="h-2 w-12 bg-slate-200" />
          <Skeleton className="h-4 w-16 bg-slate-200" />
        </div>
      </div>
      
      {/* Content Block */}
      <div className="flex flex-col flex-grow p-8">
        <div>
          <Skeleton className="h-3 w-16 bg-slate-200/80 mb-2" />
          <div className="space-y-1.5 mb-4">
            <Skeleton className="h-5 w-full bg-slate-200/80" />
            <Skeleton className="h-5 w-4/5 bg-slate-200/80" />
          </div>
        </div>
        
        {/* Duration / Meta Chips */}
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-6 w-16 rounded-md bg-slate-200/80" />
          <Skeleton className="h-6 w-16 rounded-md bg-slate-200/80" />
        </div>

        {/* Inclusions */}
        <div className="flex flex-col gap-2 mb-8 mt-auto">
          <Skeleton className="h-2.5 w-10 bg-slate-200/80" />
          <div className="flex gap-4 items-center h-[24px]">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4.5 w-4.5 rounded bg-slate-200/80" />
            ))}
          </div>
        </div>

        {/* Action Button Section */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <Skeleton className="h-3.5 w-24 bg-slate-200/80" />
          <Skeleton className="h-10 w-24 rounded-lg bg-slate-200/80" />
        </div>
      </div>
    </div>
  );
}
