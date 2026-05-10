export type Inclusions = {
  flights: boolean;
  hotels: boolean;
  meals: boolean;
  transfers: boolean;
  sightseeing: boolean;
};

export type Package = {
  id: string;
  provider_name: string;
  destination_region: string | null;
  package_title: string;
  duration_days: number;
  duration_nights: number | null;
  price_inr: number;
  inclusions: Inclusions;
  theme: string | null;
  package_url: string;
  image_url: string | null;
  last_scraped_at: string;
};
