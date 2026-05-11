import { Plane, Bed, Utensils, Bus, Camera, Calendar, Moon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package } from "@/types/database";
import Image from "next/image";

export function TourCard({ tour }: { tour: Package }) {
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(tour.price_inr || 0);

  const inclusions = tour.inclusions;

  return (
    <Card className="overflow-hidden border-0 bg-zinc-900/40 backdrop-blur-md transition-[transform,box-shadow] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2),_0_16px_32px_rgba(0,0,0,0.4)] hover:scale-[1.02] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">
      <div className="relative aspect-[4/3] w-full bg-zinc-900 overflow-hidden">
        {tour.image_url ? (
          <Image 
            src={tour.image_url} 
            alt={tour.package_title} 
            fill 
            className="object-cover transition-[transform,opacity] opacity-0 hover:scale-105 duration-700 ease-out"
            onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
            <span className="text-zinc-500 font-medium tracking-widest uppercase text-xs">
              {tour.destination_region || "Explore"}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {tour.destination_region && (
            <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border-none">
              {tour.destination_region}
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardDescription className="text-xs font-semibold tracking-wider uppercase text-primary/80 mb-1">
              {tour.provider_name}
            </CardDescription>
            <CardTitle className="text-xl leading-tight font-bold line-clamp-2">
              {tour.package_title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
          {tour.duration_days && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{tour.duration_days} Days</span>
            </div>
          )}
          {tour.duration_nights !== null && (
            <>
              {tour.duration_days && <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />}
              <div className="flex items-center gap-1.5">
                <Moon className="w-4 h-4" />
                <span>{tour.duration_nights} Nights</span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-normal uppercase tracking-wider">Inclusions</p>
          <div className="flex gap-3">
            {inclusions.flights && <div className="p-2 rounded-full bg-primary/10 text-primary" title="Flights Included"><Plane className="w-4 h-4" /></div>}
            {inclusions.hotels && <div className="p-2 rounded-full bg-primary/10 text-primary" title="Hotels Included"><Bed className="w-4 h-4" /></div>}
            {inclusions.meals && <div className="p-2 rounded-full bg-primary/10 text-primary" title="Meals Included"><Utensils className="w-4 h-4" /></div>}
            {inclusions.transfers && <div className="p-2 rounded-full bg-primary/10 text-primary" title="Transfers Included"><Bus className="w-4 h-4" /></div>}
            {inclusions.sightseeing && <div className="p-2 rounded-full bg-primary/10 text-primary" title="Sightseeing Included"><Camera className="w-4 h-4" /></div>}
            
            {!inclusions.flights && !inclusions.hotels && !inclusions.meals && !inclusions.transfers && !inclusions.sightseeing && (
              <span className="text-xs text-muted-foreground italic">Details on request</span>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Rely on proximity over lines */}
      
      <CardFooter className="pt-2 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Starting from</p>
          <p className="text-2xl font-bold tracking-tight text-primary">
            {tour.price_inr && tour.price_inr > 0 ? formattedPrice : "On Request"}
          </p>
        </div>
        <a 
          href={tour.package_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-[transform,background-color] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-9 px-4 py-2"
        >
          View Deal
        </a>
      </CardFooter>
    </Card>
  );
}
