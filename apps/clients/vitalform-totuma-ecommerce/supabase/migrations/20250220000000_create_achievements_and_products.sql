-- Barbara Felizola: achievements (BJJ) and products (bakery)
-- Run this in Supabase SQL Editor or via Supabase CLI.

-- Achievements (logros BJJ)
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  year int NOT NULL,
  organization text,
  medal_type text CHECK (medal_type IN ('gold', 'silver', 'bronze', 'other')),
  medal_count int DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements public read" ON public.achievements
  FOR SELECT USING (true);

-- Añadir medal_count si la tabla ya existía sin ella
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'achievements' AND column_name = 'medal_count'
  ) THEN
    ALTER TABLE public.achievements ADD COLUMN medal_count int DEFAULT 1;
  END IF;
END $$;

-- Seed: palmarés Barbara Felizola (ejecutar una sola vez en SQL Editor; si la tabla ya tiene datos, comentar o omitir)
-- INSERT INTO public.achievements (title, year, organization, medal_type, medal_count) VALUES
--   ('IBJJF Master European Champion', 2026, 'IBJJF', 'gold', 2),
--   ('IBJJF World Master Champion', 2024, 'IBJJF', 'gold', 1),
--   ('IBJJF Open Champion', 2025, 'IBJJF', 'gold', 2),
--   ('IBJJF Open NoGi Champion', 2025, 'IBJJF', 'gold', 2);

-- Products (repostería)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  ingredients text,
  category text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products public read" ON public.products
  FOR SELECT USING (true);

-- Optional: lead_type on leads for seminar / bakery / newsletter
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'lead_type'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN lead_type text;
  END IF;
END $$;
