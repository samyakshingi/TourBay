import { createClient } from "@/lib/supabase/server";
import { Package } from "@/types/database";
import { TourCard } from "@/components/TourCard";
import { TourCardSkeleton } from "@/components/TourCardSkeleton";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch packages directly using the server client
  const { data: packages, error } = await supabase
    .from("packages")
    .select("*")
    .order("last_scraped_at", { ascending: false });

  if (error) {
    console.error("Error fetching packages:", error);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            TourBay.in
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto">
            One North, All Options. AI-Driven Clarity for Your Next Himalayan Escape.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Curated Packages</h2>
            <p className="text-zinc-400 mt-1">Aggregated in real-time from top providers.</p>
          </div>
          <div className="text-sm text-zinc-500">
            Showing {packages?.length || 0} deals
          </div>
        </div>

        {/* Loading / Empty / Data States */}
        {!packages ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <TourCardSkeleton key={i} />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-xl border border-white/10 border-dashed">
            <h3 className="text-xl font-medium text-white mb-2">No packages found</h3>
            <p className="text-zinc-400 max-w-sm mx-auto">We are currently updating our systems. Please check back soon for the latest Himalayan tours.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg: Package, i: number) => (
              <div 
                key={pkg.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <TourCard tour={pkg} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
