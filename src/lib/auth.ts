import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  provider?: string;
  avatar_url?: string;
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
  // Sign up with email and password
  async signUp(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
  }): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            full_name: `${userData.firstName} ${userData.lastName}`,
            company: userData.company,
          }
        }
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Create user profile manually
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            company: userData.company || null,
            balance: 1000, // Initial balance of UGX 1000
            remaining_sms: 6, // 1000 / 150 = 6 SMS
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail the signup if profile creation fails
        }

        const authUser = await this.getUserProfile(data.user.id);
        return { user: authUser, error: null };
      }

      return { user: null, error: 'Failed to create user' };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const authUser = await this.getUserProfile(data.user.id);
        return { user: authUser, error: null };
      }

      return { user: null, error: 'Failed to sign in' };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      return await this.getUserProfile(user.id);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get user profile with all related data
  async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      // Get user data
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Profile error:', profileError);
        return null;
      }

      // If no profile exists, create one
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            first_name: userData.user.user_metadata?.first_name || '',
            last_name: userData.user.user_metadata?.last_name || '',
            company: userData.user.user_metadata?.company || null,
            balance: 1000,
            remaining_sms: 6,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return null;
        }

        // Use the newly created profile
        const profile = newProfile;
      }
      // Get user subscription
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          pricing_plans (name, price)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      const authUser: AuthUser = {
        id: userData.user.id,
        email: userData.user.email || '',
        provider: userData.user.app_metadata?.provider || 'email',
        avatar_url: userData.user.user_metadata?.avatar_url,
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

      return authUser;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Sign out
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  // Update user profile
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

  // Update balance
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

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser = await this.getUserProfile(session.user.id);
        callback(authUser);
      } else {
        callback(null);
      }
    });
  },

  // Reset password
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  // Update password
  async updatePassword(password: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
};