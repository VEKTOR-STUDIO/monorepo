-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'student'::text CHECK (role = ANY (ARRAY['admin'::text, 'student'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.assignments (
  title text NOT NULL,
  video_url text NOT NULL,
  notes text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  scheduled_for date NOT NULL DEFAULT ((now() AT TIME ZONE 'America/Caracas'::text))::date,
  CONSTRAINT assignments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.assignment_completions (
  assignment_id uuid NOT NULL,
  student_id uuid NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT assignment_completions_pkey PRIMARY KEY (assignment_id, student_id),
  CONSTRAINT assignment_completions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id),
  CONSTRAINT assignment_completions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.polls (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question text NOT NULL DEFAULT '¿Qué estudiamos en la próxima clase?'::text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT polls_pkey PRIMARY KEY (id)
);
CREATE TABLE public.poll_options (
  poll_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT poll_options_pkey PRIMARY KEY (id),
  CONSTRAINT poll_options_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.polls(id)
);
CREATE TABLE public.poll_votes (
  poll_id uuid NOT NULL,
  option_id uuid NOT NULL,
  student_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT poll_votes_pkey PRIMARY KEY (poll_id, student_id),
  CONSTRAINT poll_votes_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.poll_options(id),
  CONSTRAINT poll_votes_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id),
  CONSTRAINT poll_votes_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.polls(id)
);
CREATE TABLE public.point_events (
  student_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind = ANY (ARRAY['signup'::text, 'profile_completed'::text, 'assignment_completed'::text, 'poll_voted'::text, 'comment_posted'::text, 'tournament_participation'::text, 'tournament_finalist'::text, 'tournament_champion'::text])),
  points integer NOT NULL CHECK (points > 0),
  ref_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT point_events_pkey PRIMARY KEY (id),
  CONSTRAINT point_events_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.assignment_comments (
  assignment_id uuid NOT NULL,
  student_id uuid NOT NULL,
  body text NOT NULL CHECK (char_length(btrim(body)) >= 1 AND char_length(btrim(body)) <= 1000),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT assignment_comments_pkey PRIMARY KEY (id),
  CONSTRAINT assignment_comments_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id),
  CONSTRAINT assignment_comments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.tournaments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Tope interno'::text CHECK (char_length(btrim(title)) >= 1 AND char_length(btrim(title)) <= 80),
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'completed'::text])),
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  CONSTRAINT tournaments_pkey PRIMARY KEY (id),
  CONSTRAINT tournaments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.tournament_participants (
  tournament_id uuid NOT NULL,
  student_id uuid NOT NULL,
  seed integer NOT NULL CHECK (seed >= 1),
  CONSTRAINT tournament_participants_pkey PRIMARY KEY (tournament_id, student_id),
  CONSTRAINT tournament_participants_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id),
  CONSTRAINT tournament_participants_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.tournament_matches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL,
  round integer NOT NULL CHECK (round >= 1),
  slot integer NOT NULL CHECK (slot >= 0),
  student1_id uuid,
  student2_id uuid,
  winner_id uuid,
  method text CHECK (method = ANY (ARRAY['submission'::text, 'points'::text, 'decision'::text, 'dq'::text, 'walkover'::text])),
  decided_at timestamp with time zone,
  CONSTRAINT tournament_matches_pkey PRIMARY KEY (id),
  CONSTRAINT tournament_matches_tournament_round_slot_key UNIQUE (tournament_id, round, slot),
  CONSTRAINT tournament_matches_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id),
  CONSTRAINT tournament_matches_student1_id_fkey FOREIGN KEY (student1_id) REFERENCES public.profiles(id),
  CONSTRAINT tournament_matches_student2_id_fkey FOREIGN KEY (student2_id) REFERENCES public.profiles(id),
  CONSTRAINT tournament_matches_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.profiles(id)
);