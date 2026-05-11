import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TourCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-zinc-900/40 backdrop-blur-md">
      <Skeleton className="w-full aspect-[4/3] rounded-none bg-white/5" />
      
      <CardHeader className="pb-3">
        <Skeleton className="h-3 w-24 mb-2 bg-white/10" />
        <Skeleton className="h-7 w-3/4 bg-white/10" />
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="flex gap-4 mb-5">
          <Skeleton className="h-4 w-16 bg-white/10" />
          <Skeleton className="h-4 w-16 bg-white/10" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 bg-white/10" />
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16 bg-white/10" />
          <Skeleton className="h-7 w-24 bg-white/10" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md bg-white/10" />
      </CardFooter>
    </Card>
  );
}
