/*
  # SMS Platform Database Schema

  1. New Tables
    - `users` - User accounts with authentication
    - `user_profiles` - Extended user profile information
    - `pricing_plans` - Available pricing plans
    - `user_subscriptions` - User subscription management
    - `sms_messages` - SMS message history
    - `contacts` - User contacts
    - `contact_groups` - Contact groups
    - `message_templates` - SMS templates
    - `campaigns` - SMS campaigns
    - `api_keys` - User API keys
    - `transactions` - Payment and balance transactions

  2. Security
    - Enable RLS on all tables
    - Add policies for user data isolation
    - Secure API key management
*/

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User profiles for extended information
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  company text,
  phone text,
  avatar_url text,
  balance integer DEFAULT 0,
  remaining_sms integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pricing plans
CREATE TABLE IF NOT EXISTS pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  original_price integer,
  sms_limit integer,
  contacts_limit integer,
  templates_limit integer,
  support_level text DEFAULT 'email',
  features jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES pricing_plans(id),
  status text DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- SMS messages
CREATE TABLE IF NOT EXISTS sms_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_phone text NOT NULL,
  recipient_name text,
  message_content text NOT NULL,
  status text DEFAULT 'pending',
  gateway text,
  cost integer DEFAULT 0,
  campaign_id uuid,
  direction text DEFAULT 'outbound',
  sent_at timestamptz DEFAULT now(),
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  location text,
  tags jsonb DEFAULT '[]',
  status text DEFAULT 'active',
  total_messages integer DEFAULT 0,
  last_contact timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contact groups
CREATE TABLE IF NOT EXISTS contact_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  color text DEFAULT '#3b82f6',
  contact_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Contact group memberships
CREATE TABLE IF NOT EXISTS contact_group_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES contact_groups(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(group_id, contact_id)
);

-- Message templates
CREATE TABLE IF NOT EXISTS message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  variables jsonb DEFAULT '[]',
  usage_count integer DEFAULT 0,
  last_used timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SMS campaigns
CREATE TABLE IF NOT EXISTS sms_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  message_content text NOT NULL,
  campaign_type text DEFAULT 'promotional',
  status text DEFAULT 'draft',
  recipient_count integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- API keys
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL,
  key_preview text NOT NULL,
  status text DEFAULT 'active',
  last_used timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'credit', 'debit', 'payment'
  amount integer NOT NULL,
  balance_after integer NOT NULL,
  description text NOT NULL,
  reference text,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (users can only see their own data)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for pricing_plans (public read)
CREATE POLICY "Anyone can read pricing plans" ON pricing_plans
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can read own subscriptions" ON user_subscriptions
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for sms_messages
CREATE POLICY "Users can manage own messages" ON sms_messages
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for contacts
CREATE POLICY "Users can manage own contacts" ON contacts
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for contact_groups
CREATE POLICY "Users can manage own contact groups" ON contact_groups
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for contact_group_memberships
CREATE POLICY "Users can manage own group memberships" ON contact_group_memberships
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM contact_groups cg 
      WHERE cg.id = group_id AND cg.user_id = auth.uid()
    )
  );

-- RLS Policies for message_templates
CREATE POLICY "Users can manage own templates" ON message_templates
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for sms_campaigns
CREATE POLICY "Users can manage own campaigns" ON sms_campaigns
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for api_keys
CREATE POLICY "Users can manage own API keys" ON api_keys
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Insert default pricing plans
INSERT INTO pricing_plans (name, price, original_price, sms_limit, contacts_limit, templates_limit, support_level, features) VALUES
('BASIC', 40, 50, 1000, 500, 5, 'email', '["Free SMS Account", "UGX 100 for Testing", "Negotiable", "Reseller Account"]'),
('STANDARD', 30, 40, 5000, 2500, 15, 'email', '["Free SMS Account", "UGX 100 for Testing", "Negotiable", "Reseller Account"]'),
('PRO', 25, 35, 15000, 10000, -1, 'phone', '["Free SMS Account", "UGX 100 for Testing", "Negotiable", "Reseller Account"]'),
('EXCLUSIVE', 20, 30, -1, -1, -1, '24/7', '["Free SMS Account", "UGX 100 for Testing", "Negotiable", "Reseller Account"]');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_user_id ON sms_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_groups_user_id ON contact_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_user_id ON message_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_user_id ON sms_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);