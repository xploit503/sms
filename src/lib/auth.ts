import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface AuthUser {
  id: string;
  email: string;
  profile: {
    first_name: string;
    last_name: string;
    company?: string;
    phone?: string;
    balance: number;
    remaining_sms: number;
  };
  subscription?: {
    plan_name: string;
    status: string;
    expires_at?: string;
  };
}

export const authService = {
  async signUp(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
  }): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Create user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password_hash: passwordHash,
        })
        .select()
        .single();

      if (userError) {
        return { user: null, error: userError.message };
      }

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          first_name: userData.firstName,
          last_name: userData.lastName,
          company: userData.company,
          balance: 10000, // Starting balance of UGX 100 for testing
          remaining_sms: 67, // Approximately 67 SMS with starting balance
        })
        .select()
        .single();

      if (profileError) {
        return { user: null, error: profileError.message };
      }

      // Get default plan (BASIC)
      const { data: defaultPlan } = await supabase
        .from('pricing_plans')
        .select('id')
        .eq('name', 'BASIC')
        .single();

      if (defaultPlan) {
        // Create subscription
        await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_id: defaultPlan.id,
            status: 'active',
          });
      }

      // Create initial transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'credit',
          amount: 10000,
          balance_after: 10000,
          description: 'Welcome bonus - Free testing credit',
          status: 'completed',
        });

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        profile: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          company: profile.company,
          phone: profile.phone,
          balance: profile.balance,
          remaining_sms: profile.remaining_sms,
        },
        subscription: {
          plan_name: 'BASIC',
          status: 'active',
        },
      };

      return { user: authUser, error: null };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  },

  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // Get user by email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !user) {
        return { user: null, error: 'Invalid email or password' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return { user: null, error: 'Invalid email or password' };
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        return { user: null, error: 'Failed to load user profile' };
      }

      // Get user subscription
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          pricing_plans (name, price)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        profile: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          company: profile.company,
          phone: profile.phone,
          balance: profile.balance,
          remaining_sms: profile.remaining_sms,
        },
        subscription: subscription ? {
          plan_name: subscription.pricing_plans?.name || 'BASIC',
          status: subscription.status,
          expires_at: subscription.expires_at,
        } : undefined,
      };

      return { user: authUser, error: null };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  },

  async updateProfile(userId: string, updates: Partial<{
    first_name: string;
    last_name: string;
    company: string;
    phone: string;
  }>): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  async updateBalance(userId: string, amount: number, description: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // Get current balance
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        return { success: false, error: 'User profile not found' };
      }

      const newBalance = profile.balance + amount;
      const newRemainingSms = Math.floor(newBalance / 150); // UGX 150 per SMS

      // Update balance
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          balance: newBalance,
          remaining_sms: newRemainingSms,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: amount > 0 ? 'credit' : 'debit',
          amount: Math.abs(amount),
          balance_after: newBalance,
          description,
          status: 'completed',
        });

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },
};