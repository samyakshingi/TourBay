-- Create click tracking analytics table
CREATE TABLE IF NOT EXISTS public.clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  provider_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable Row Level Security for raw telemetry collection in this phase
ALTER TABLE public.clicks DISABLE ROW LEVEL SECURITY;
