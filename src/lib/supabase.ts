import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  content: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  course_id: string;
  message: string;
  response: string;
  role: 'user' | 'assistant';
  created_at: string;
};

export type SavedContent = {
  id: string;
  user_id: string;
  course_id: string;
  content: string;
  title: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  user_id: string;
  course_id: string | null;
  message: string;
  rating: number;
  created_at: string;
};
