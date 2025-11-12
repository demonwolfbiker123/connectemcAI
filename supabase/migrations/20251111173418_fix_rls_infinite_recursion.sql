/*
  # Fix RLS Infinite Recursion
  
  1. Changes
    - Remove the recursive admin policy that causes infinite loop
    - Keep only simple self-access policies
    - Admins will see their own profile like regular users
    
  2. Security
    - Users can read and update only their own profile
    - No recursive queries
*/

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for admins" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
