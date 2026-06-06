import { Plane, Bed, Utensils, Bus, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <div className="group flex flex-col h-full bg-white rounded-2xl shadow-ambient hover:shadow-ambient-deep transition-[transform,box-shadow] duration-300 hover:scale-[1.02] ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden">
      {/* Thumbnail Block */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        {tour.image_url ? (
          <Image 
            src={tour.image_url} 
            alt={tour.package_title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105 duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 gap-2">
            <Image 
              src="/logo.png" 
              alt="TourBay Logo Placeholder" 
              width={40} 
              height={40} 
              className="opacity-20 grayscale"
            />
            <span className="text-slate-400 font-mono tracking-wider text-[10px] uppercase">
              {tour.destination_region || "HIMALAYAN ESCAPE"}
            </span>
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4">
          {tour.destination_region && (
            <Badge className="bg-white/80 hover:bg-white/90 text-slate-900 border-none backdrop-blur-md shadow-sm text-xs font-semibold px-2.5 py-1">
              {tour.destination_region}
            </Badge>
          )}
        </div>

        {/* Price Glassmorphism Overlay */}
        <div className="absolute bottom-4 right-4 backdrop-blur-md bg-white/75 border border-white/20 px-3.5 py-2 rounded-xl shadow-sm">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider leading-none mb-1">Starting from</p>
          <p className="text-lg font-bold text-slate-950 leading-none">
            {tour.price_inr && tour.price_inr > 0 ? formattedPrice : "On Request"}
          </p>
        </div>
      </div>
      
      {/* Content Block */}
      <div className="flex flex-col flex-grow p-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
            {tour.provider_name}
          </span>
          <h3 className="font-heading text-xl font-semibold tracking-tight text-slate-950 leading-snug mt-1.5 mb-4 line-clamp-2">
            {tour.package_title}
          </h3>
        </div>
        
        {/* Duration / Meta Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tour.duration_days && (
            <span className="font-mono text-xs bg-slate-50 px-2.5 py-1 rounded-md text-slate-600 font-medium">
              {tour.duration_days} Days
            </span>
          )}
          {tour.duration_nights !== null && (
            <span className="font-mono text-xs bg-slate-50 px-2.5 py-1 rounded-md text-slate-600 font-medium">
              {tour.duration_nights} Nights
            </span>
          )}
          {tour.theme && (
            <span className="font-mono text-xs bg-slate-50 px-2.5 py-1 rounded-md text-slate-600 font-medium">
              {tour.theme}
            </span>
          )}
        </div>

        {/* Inclusions */}
        <div className="flex flex-col gap-2 mb-8 mt-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Included</span>
          <div className="flex gap-4 items-center min-h-[24px]">
            {inclusions.flights && <span title="Flights"><Plane className="w-4.5 h-4.5 text-slate-500" strokeWidth={2} /></span>}
            {inclusions.hotels && <span title="Hotels"><Bed className="w-4.5 h-4.5 text-slate-500" strokeWidth={2} /></span>}
            {inclusions.meals && <span title="Meals"><Utensils className="w-4.5 h-4.5 text-slate-500" strokeWidth={2} /></span>}
            {inclusions.transfers && <span title="Transfers"><Bus className="w-4.5 h-4.5 text-slate-500" strokeWidth={2} /></span>}
            {inclusions.sightseeing && <span title="Sightseeing"><Camera className="w-4.5 h-4.5 text-slate-500" strokeWidth={2} /></span>}
            
            {!inclusions.flights && !inclusions.hotels && !inclusions.meals && !inclusions.transfers && !inclusions.sightseeing && (
              <span className="text-xs text-slate-400 italic">Details on request</span>
            )}
          </div>
        </div>

        {/* Action Button Section */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <span className="text-xs text-slate-400 font-mono">
            Best Price Guranteed
          </span>
          <a 
            href={tour.package_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-[transform,background-color] active:scale-[0.97] bg-[#0047ab] text-white hover:bg-[#00327d] h-10 px-5 shadow-sm duration-200 ease-out"
          >
            View Deal
          </a>
        </div>
      </div>
    </div>
  );
}
