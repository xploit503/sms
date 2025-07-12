import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  company?: string;
  phone?: string;
  avatar_url?: string;
  balance: number;
  remaining_sms: number;
  created_at: string;
  updated_at: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  sms_limit: number;
  contacts_limit: number;
  templates_limit: number;
  support_level: string;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  started_at: string;
  expires_at?: string;
  auto_renew: boolean;
  created_at: string;
  pricing_plans?: PricingPlan;
}

export interface SMSMessage {
  id: string;
  user_id: string;
  recipient_phone: string;
  recipient_name?: string;
  message_content: string;
  status: string;
  gateway?: string;
  cost: number;
  campaign_id?: string;
  direction: string;
  sent_at: string;
  delivered_at?: string;
  created_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  tags: string[];
  status: string;
  total_messages: number;
  last_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactGroup {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  contact_count: number;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  user_id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  usage_count: number;
  last_used?: string;
  created_at: string;
  updated_at: string;
}

export interface SMSCampaign {
  id: string;
  user_id: string;
  name: string;
  message_content: string;
  campaign_type: string;
  status: string;
  recipient_count: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string;
  reference?: string;
  status: string;
  created_at: string;
}