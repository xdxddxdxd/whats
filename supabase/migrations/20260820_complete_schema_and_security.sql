// ==============================================================================
-- WHATS App - Complete Supabase Schema, Security RLS, Indices & Atomic Functions
-- Migration: 20260820_complete_schema_and_security.sql
-- ==============================================================================

-- 1. Tabloların Oluşturulması (Idempotent)

CREATE TABLE IF NOT EXISTS public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_token text NOT NULL,
  title text NOT NULL,
  chat_type text NOT NULL DEFAULT 'direct',
  total_messages integer NOT NULL DEFAULT 0,
  total_participants integer NOT NULL DEFAULT 2,
  first_message_date timestamptz,
  last_message_date timestamptz,
  last_message_hash text,
  ask_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  invite_code text NOT NULL UNIQUE,
  password_pin text NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '30 days'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.guest_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  session_token text NOT NULL,
  is_revoked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  superlatives jsonb NOT NULL DEFAULT '[]'::jsonb,
  wrapped_slides jsonb NOT NULL DEFAULT '[]'::jsonb,
  ai_summary text,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_asks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  facts_used jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pin_attempts (
  key text PRIMARY KEY,
  count integer NOT NULL DEFAULT 0,
  lock_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 2. Performans İndeksleri
-- ==============================================================================

CREATE INDEX IF NOT EXISTS chats_owner_token_idx 
  ON public.chats (owner_token);

CREATE INDEX IF NOT EXISTS chats_created_at_idx 
  ON public.chats (created_at DESC);

CREATE INDEX IF NOT EXISTS invites_chat_id_idx 
  ON public.invites (chat_id);

CREATE INDEX IF NOT EXISTS invites_invite_code_idx 
  ON public.invites (invite_code);

CREATE INDEX IF NOT EXISTS guest_sessions_chat_id_session_token_idx 
  ON public.guest_sessions (chat_id, session_token);

CREATE INDEX IF NOT EXISTS chat_analyses_chat_id_created_at_idx 
  ON public.chat_analyses (chat_id, created_at DESC);

CREATE INDEX IF NOT EXISTS chat_asks_chat_id_created_at_idx 
  ON public.chat_asks (chat_id, created_at DESC);

-- ==============================================================================
-- 3. Row Level Security (RLS) - Anon & Authenticated İzolasyonu
-- Backend, service_role anahtarı ile RLS bypass ederek güvenli şekilde çalışır.
-- ==============================================================================

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_asks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pin_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deny_all_anon_chats" ON public.chats;
CREATE POLICY "deny_all_anon_chats" 
  ON public.chats FOR ALL TO anon, authenticated 
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "deny_all_anon_invites" ON public.invites;
CREATE POLICY "deny_all_anon_invites" 
  ON public.invites FOR ALL TO anon, authenticated 
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "deny_all_anon_guest_sessions" ON public.guest_sessions;
CREATE POLICY "deny_all_anon_guest_sessions" 
  ON public.guest_sessions FOR ALL TO anon, authenticated 
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "deny_all_anon_chat_analyses" ON public.chat_analyses;
CREATE POLICY "deny_all_anon_chat_analyses" 
  ON public.chat_analyses FOR ALL TO anon, authenticated 
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "deny_all_anon_chat_asks" ON public.chat_asks;
CREATE POLICY "deny_all_anon_chat_asks" 
  ON public.chat_asks FOR ALL TO anon, authenticated 
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "deny_all_anon_pin_attempts" ON public.pin_attempts;
CREATE POLICY "deny_all_anon_pin_attempts" 
  ON public.pin_attempts FOR ALL TO anon, authenticated 
  USING (false) WITH CHECK (false);

-- ==============================================================================
-- 4. Atomik Soru Sayacı Fonksiyonu (Race Condition Önleyici)
-- ==============================================================================

CREATE OR REPLACE FUNCTION increment_chat_ask_count(target_chat_id uuid, max_allowed int DEFAULT 5)
RETURNS int AS $$
DECLARE
  new_val int;
BEGIN
  UPDATE public.chats
  SET ask_count = ask_count + 1,
      updated_at = now()
  WHERE id = target_chat_id AND ask_count < max_allowed
  RETURNING ask_count INTO new_val;
  
  IF new_val IS NULL THEN
    RETURN -1; -- Limit aşıldı
  END IF;
  
  RETURN new_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
