/*
  # Fix user_profiles table default values

  1. Changes
    - Add default values for balance and remaining_sms columns
    - Ensure first_name and last_name can be nullable initially
    - Update the trigger function to handle missing profile data gracefully

  2. Security
    - Maintains existing RLS policies
*/

-- Make first_name and last_name nullable to handle cases where they might not be provided
ALTER TABLE user_profiles 
ALTER COLUMN first_name DROP NOT NULL,
ALTER COLUMN last_name DROP NOT NULL;

-- Ensure balance and remaining_sms have proper defaults
ALTER TABLE user_profiles 
ALTER COLUMN balance SET DEFAULT 0,
ALTER COLUMN remaining_sms SET DEFAULT 0;

-- Update the trigger function to handle new user creation more gracefully
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    first_name,
    last_name,
    company,
    balance,
    remaining_sms
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', NULL),
    0,
    0
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();