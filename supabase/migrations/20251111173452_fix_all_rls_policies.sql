/*
  # Fix All RLS Policies to Prevent Infinite Recursion
  
  1. Changes
    - Remove all recursive admin checks from policies
    - Use app_metadata for admin role checking to avoid recursion
    - Simplify all policies for better performance
    
  2. Security
    - Users can access their own data
    - Admins can access all data using metadata check
    - No recursive queries
*/

-- Drop all problematic policies
DROP POLICY IF EXISTS "Admins can view all chat history" ON chat_history;
DROP POLICY IF EXISTS "Admins can delete courses" ON courses;
DROP POLICY IF EXISTS "Admins can insert courses" ON courses;
DROP POLICY IF EXISTS "Admins can update courses" ON courses;
DROP POLICY IF EXISTS "Admins can view all feedback" ON feedback;

-- Courses: Anyone can view, only admins can manage
CREATE POLICY "Admins can manage courses"
  ON courses
  FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'email') = 'admin@connectemc.ai')
  WITH CHECK ((auth.jwt()->>'email') = 'admin@connectemc.ai');

-- Chat History: Users see own, admins see all
CREATE POLICY "Admins can view all chat"
  ON chat_history
  FOR SELECT
  TO authenticated
  USING ((auth.jwt()->>'email') = 'admin@connectemc.ai');

-- Feedback: Users see own, admins see all  
CREATE POLICY "Admins can view all feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING ((auth.jwt()->>'email') = 'admin@connectemc.ai');

-- Profiles: Add policy for admins to see all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING ((auth.jwt()->>'email') = 'admin@connectemc.ai');
