"use server";

import { createClient } from "@/lib/supabase/server";

// Fallback mock packages URLs in case database is down or we are in demo mode
const MOCK_URLS: Record<string, { url: string; providerName: string }> = {
  "mock-1": { 
    url: "https://www.veenaworld.com/package/magical-kashmir-tour-package-haqm?utm_source=tourbay.in&utm_medium=aggregator&utm_campaign=himalayan_escape", 
    providerName: "Veena World" 
  },
  "mock-2": { 
    url: "https://www.thrillophilia.com/tours/leh-ladakh-tour-packages?utm_source=tourbay.in&utm_medium=aggregator&utm_campaign=himalayan_escape", 
    providerName: "Thrillophilia" 
  },
  "mock-3": { 
    url: "https://www.thrillophilia.com/tours/manali-tour-packages?utm_source=tourbay.in&utm_medium=aggregator&utm_campaign=himalayan_escape", 
    providerName: "Thrillophilia" 
  },
  "mock-4": { 
    url: "https://www.veenaworld.com/package/shimla-manali-tour-package-shms?utm_source=tourbay.in&utm_medium=aggregator&utm_campaign=himalayan_escape", 
    providerName: "Veena World" 
  },
  "mock-5": { 
    url: "https://www.veenaworld.com/package/magical-kashmir-tour-package-haqm?utm_source=tourbay.in&utm_medium=aggregator&utm_campaign=himalayan_escape", 
    providerName: "Kesari Tours" 
  },
};

export async function trackClick(packageId: string): Promise<{ url: string; providerName: string }> {
  try {
    // If it's a mock package, return it directly to preserve the user journey
    if (packageId in MOCK_URLS) {
      return MOCK_URLS[packageId];
    }

    const supabase = await createClient();

    // 1. Fetch package details
    const { data: pkg, error: fetchError } = await supabase
      .from("packages")
      .select("package_url, provider_name")
      .eq("id", packageId)
      .single();

    if (fetchError || !pkg) {
      console.error("Error fetching package for redirect tracking:", fetchError?.message);
      return { url: "/", providerName: "Travel Partner" };
    }

    // 2. Silently insert tracking row (if database fails, still return url)
    try {
      const { error: insertError } = await supabase
        .from("clicks")
        .insert({
          package_id: packageId,
          provider_name: pkg.provider_name
        });

      if (insertError) {
        console.error("Error inserting click tracking row:", insertError.message);
      }
    } catch (insertErr) {
      console.error("Failed to insert click record silently:", insertErr);
    }

    return {
      url: pkg.package_url,
      providerName: pkg.provider_name,
    };
  } catch (err) {
    console.error("Unhandled exception in trackClick Server Action:", err);
    // Graceful fallback to prevent user journey disruption
    return { url: "/", providerName: "Travel Partner" };
  }
}
