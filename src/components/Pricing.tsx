import React, { useState } from 'react';
import { Check, Star, ArrowRight, MessageSquare, Users, BarChart3, Shield, CreditCard, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, PricingPlan } from '../lib/supabase';
import { AuthUser, authService } from '../lib/auth';

interface PricingProps {
  user?: AuthUser;
}

const Pricing: React.FC<PricingProps> = ({ user }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  React.useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleProceedToPayment = async (plan: PricingPlan) => {
    if (!user) {
      alert('Please sign in to subscribe to a plan');
      return;
    }

    setProcessingPlan(plan.id);
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user subscription
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          plan_id: plan.id,
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: billingCycle === 'yearly' ? 
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() :
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (subscriptionError) throw subscriptionError;

      // Add bonus credits for new subscription
      const bonusAmount = plan.price * 1000; // Convert to UGX
      await authService.updateBalance(
        user.id, 
        bonusAmount, 
        `Subscription bonus for ${plan.name} plan`
      );

      // Create payment transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'payment',
          amount: plan.price * (billingCycle === 'yearly' ? 12 : 1),
          balance_after: user.profile.balance + bonusAmount,
          description: `${plan.name} plan subscription (${billingCycle})`,
          reference: `PAY_${Date.now()}`,
          status: 'completed',
        });

      alert(`Successfully subscribed to ${plan.name} plan! Bonus credits have been added to your account.`);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
      setProcessingPlan(null);
    }
  };

  const getPlanColor = (planName: string) => {
    const colors = {
      'BASIC': { gradient: 'from-gray-500 to-gray-600', border: 'border-gray-200' },
      'STANDARD': { gradient: 'from-blue-500 to-blue-600', border: 'border-blue-200' },
      'PRO': { gradient: 'from-orange-500 to-red-500', border: 'border-orange-200' },
      'EXCLUSIVE': { gradient: 'from-purple-500 to-indigo-600', border: 'border-purple-200' }
    };
    return colors[planName as keyof typeof colors] || colors.BASIC;
  };

  const getPlanLimits = (plan: PricingPlan) => {
    return {
      sms: plan.sms_limit === -1 ? 'Unlimited SMS' : `${plan.sms_limit.toLocaleString()} SMS/month`,
      contacts: plan.contacts_limit === -1 ? 'Unlimited contacts' : `${plan.contacts_limit.toLocaleString()} contacts`,
      templates: plan.templates_limit === -1 ? 'Unlimited templates' : `${plan.templates_limit} templates`,
      support: plan.support_level === '24/7' ? '24/7 dedicated support' : 
               plan.support_level === 'phone' ? 'Phone & email support' : 
               'Email support'
    };
  };

  const features = [
    {
      icon: MessageSquare,
      title: 'Bulk SMS Sending',
      description: 'Send thousands of SMS messages instantly to your contacts'
    },
    {
      icon: Users,
      title: 'Contact Management',
      description: 'Organize and manage your contacts with groups and tags'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Track delivery rates, engagement, and campaign performance'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SMS Platform</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </Link>
                </>
              ) : (
                <span className="text-gray-600">Welcome, {user.name}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-blue-600">SMS Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Sending Bulk SMS in Uganda provides effective communication to the consumer. 
            It is estimated that 80% of SMS recipients open and read. Note: If not satisfied with the prices here, please call us chart.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 text-green-600 font-medium">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 ${getPlanColor(plan.name).border} hover:shadow-xl transition-all duration-300 ${
                plan.name === 'PRO' ? 'scale-105 ring-2 ring-orange-500 ring-opacity-50' : ''
              }`}
            >
              {plan.name === 'PRO' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Popular</span>
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">UGX{plan.price}</span>
                    {plan.original_price && (
                      <span className="text-lg text-gray-500 line-through">UGX{plan.original_price}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Per SMS/Month</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limits */}
                {(() => {
                  const limits = getPlanLimits(plan);
                  return (
                <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 font-medium">PLAN LIMITS:</div>
                      <div className="text-xs text-gray-600">{limits.sms}</div>
                      <div className="text-xs text-gray-600">{limits.contacts}</div>
                      <div className="text-xs text-gray-600">{limits.templates}</div>
                      <div className="text-xs text-gray-600">{limits.support}</div>
                </div>
                  );
                })()}

                {/* CTA Button */}
                <button
                  className={`w-full bg-gradient-to-r ${getPlanColor(plan.name).gradient} text-white py-3 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => handleProceedToPayment(plan)}
                  disabled={loading || !user}
                >
                  {processingPlan === plan.id ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>{user ? 'Subscribe Now' : 'Sign In to Subscribe'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features to help you manage and grow your SMS campaigns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What SMS gateways do you support?
              </h3>
              <p className="text-gray-600 mb-4">
                We support major Ugandan SMS gateways including Africa's Talking, Yo! Uganda, and SMSOne for reliable message delivery.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600 mb-4">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer bulk discounts?
              </h3>
              <p className="text-gray-600 mb-4">
                Yes, we offer custom pricing for high-volume users. Contact our sales team for enterprise pricing.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 mb-4">
                All plans come with UGX 100 free credit for testing. No credit card required to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;