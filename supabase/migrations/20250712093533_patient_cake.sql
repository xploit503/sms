/*
  # Add Row Level Security Policies for Users Table

  1. Security Updates
    - Enable RLS on users table
    - Add policy for users to read their own data
    - Add policy for users to update their own data
    - Add policy for authenticated users to insert (for registration)

  2. Authentication Enhancements
    - Add Google OAuth support columns
    - Update existing policies to work with Supabase Auth
*/

-- Enable RLS on users table if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Add new RLS policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id::uuid);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id::uuid);

CREATE POLICY "Users can insert during registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id::uuid);

-- Add Google OAuth support columns to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'provider'
  ) THEN
    ALTER TABLE users ADD COLUMN provider text DEFAULT 'email';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'provider_id'
  ) THEN
    ALTER TABLE users ADD COLUMN provider_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url text;
  END IF;
END $$;

-- Update user_profiles RLS policies to work with Supabase Auth
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id::uuid);

-- Update other tables to use proper auth.uid() function
DROP POLICY IF EXISTS "Users can manage own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can manage own subscriptions"
  ON user_subscriptions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id::uuid);

DROP POLICY IF EXISTS "Users can manage own messages" ON sms_messages;
CREATE POLICY "Users can manage own messages"
  ON sms_messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id::uuid);

DROP POLICY IF EXISTS "Users can manage own contacts" ON contacts;
CREATE POLICY "Users can manage own contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id::uuid);

DROP POLICY IF EXISTS "Users can manage own contact groups" ON contact_groups;
CREATE POLICY "Users can manage own contact groups"
  ON contact_groups
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id::uuid);

DROP POLICY IF EXISTS "Users can manage own group memberships" ON contact_group_memberships;
CREATE POLICY "Users can manage own group memberships"
  ON contact_group_memberships
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM contact_groups cg
    WHERE cg.id = contact_group_memberships.group_id 
    AND auth.uid() = cg.user_id::uuid
  ));

DROP POLICY IF EXISTS "Users can manage own templates" ON message_templates;
CREATE POLICY "Users can manage own templates"
  ON message_templates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id::uuid);

DROP POLICY IF EXISTS "Users can manage own campaigns" ON sms_campaigns;
CREATE POLICY "Users can manage own campaigns"
  ON sms_campaigns
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id::uuid);

DROP POLICY IF EXISTS "Users can manage own API keys" ON api_keys;
CREATE POLICY "Users can manage own API keys"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id::uuid);

DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id::uuid);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO users (id, email, provider, provider_id, avatar_url, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    NEW.raw_user_meta_data->>'provider_id',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email_confirmed_at IS NOT NULL
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    provider = EXCLUDED.provider,
    provider_id = EXCLUDED.provider_id,
    avatar_url = EXCLUDED.avatar_url,
    email_verified = EXCLUDED.email_verified,
    updated_at = now();

  -- Insert into user_profiles table
  INSERT INTO user_profiles (
    user_id,
    first_name,
    last_name,
    company,
    balance,
    remaining_sms
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1), ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', split_part(NEW.raw_user_meta_data->>'full_name', ' ', 2), ''),
    NEW.raw_user_meta_data->>'company',
    10000, -- Starting balance
    67     -- Starting SMS count
  )
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
    updated_at = now();

  -- Get default plan and create subscription
  INSERT INTO user_subscriptions (user_id, plan_id, status)
  SELECT NEW.id, id, 'active'
  FROM pricing_plans
  WHERE name = 'BASIC'
  ON CONFLICT (user_id, plan_id) DO NOTHING;

  -- Create welcome transaction
  INSERT INTO transactions (
    user_id,
    type,
    amount,
    balance_after,
    description,
    status
  )
  VALUES (
    NEW.id,
    'credit',
    10000,
    10000,
    'Welcome bonus - Free testing credit',
    'completed'
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();