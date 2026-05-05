-- 1. Create Tables

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Subjects table
CREATE TABLE public.subjects (
  id text PRIMARY KEY,
  name text NOT NULL
);

-- Topics table
CREATE TABLE public.topics (
  id text PRIMARY KEY,
  subject_id text REFERENCES public.subjects(id) ON DELETE CASCADE,
  name text NOT NULL
);

-- Subtopics table
CREATE TABLE public.subtopics (
  id text PRIMARY KEY,
  topic_id text REFERENCES public.topics(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index integer NOT NULL
);

-- Attempts table
CREATE TABLE public.attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subtopic_id text REFERENCES public.subtopics(id) ON DELETE CASCADE NOT NULL,
  question_id text NOT NULL,
  user_answer text,
  is_correct boolean NOT NULL,
  score numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Progress table
CREATE TABLE public.progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject_id text,
  topic_id text,
  subtopic_id text REFERENCES public.subtopics(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  score numeric DEFAULT 0,
  last_position jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, subtopic_id)
);


-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
-- Subjects, topics, and subtopics are read-only for all authenticated users
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;


-- 3. Create RLS Policies

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Attempts: Users can only read and insert their own attempts
CREATE POLICY "Users can read own attempts" ON public.attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON public.attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress: Users can only read, insert, and update their own progress
CREATE POLICY "Users can read own progress" ON public.progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Curriculum data: Anyone authenticated can read
CREATE POLICY "Anyone can read subjects" ON public.subjects
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read topics" ON public.topics
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read subtopics" ON public.subtopics
  FOR SELECT USING (true);


-- 4. Triggers

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to update 'updated_at' on progress
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE
    ON public.progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
