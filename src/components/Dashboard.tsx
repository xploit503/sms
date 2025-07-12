import React, { useState, KeyboardEvent } from 'react';
import { 
  Users, 
  MessageSquare, 
  CreditCard,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Upload,
  User,
  Calendar,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AuthUser } from '../lib/auth';

interface DashboardProps {
  user?: AuthUser;
  setActiveSection?: (section: string) => void;
}

const UserAccountCard: React.FC<{user: AuthUser; setActiveSection?: (section: string) => void}> = ({ user, setActiveSection }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {user.profile.first_name} {user.profile.last_name}
            </h2>
            <p className="text-blue-100 text-sm">{user.email}</p>
            {user.profile.company && (
              <p className="text-blue-200 text-sm">{user.profile.company}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">{user.subscription?.plan_name || 'BASIC'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-green-300" />
              <span className="text-sm text-blue-100">Balance</span>
            </div>
            <TrendingUp className="w-4 h-4 text-green-300" />
          </div>
          <p className="text-2xl font-bold text-white">
            UGX {user.profile.balance.toLocaleString()}
          </p>
          <p className="text-xs text-blue-200 mt-1">Available funds</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-300" />
              <span className="text-sm text-blue-100">SMS Credits</span>
            </div>
            <Zap className="w-4 h-4 text-purple-300" />
          </div>
          <p className="text-2xl font-bold text-white">
            {user.profile.remaining_sms.toLocaleString()}
          </p>
          <p className="text-xs text-blue-200 mt-1">Messages remaining</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-300" />
              <span className="text-sm text-blue-100">Plan Status</span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <p className="text-lg font-bold text-white capitalize">
            {user.subscription?.status || 'Active'}
          </p>
          <p className="text-xs text-blue-200 mt-1">
            {user.subscription?.expires_at ? 
              `Expires ${new Date(user.subscription.expires_at).toLocaleDateString()}` : 
              'No expiration'
            }
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
        <button 
          onClick={() => setActiveSection && setActiveSection('balance')}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-white/30"
        >
          Manage Balance
        </button>
        <button 
          onClick={() => setActiveSection && setActiveSection('pricing')}
          className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
        >
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ user, setActiveSection }) => {
  const stats = [
    {
      title: 'Total Contacts',
      value: '12,847',
      change: '+12%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'blue',
      trend: [1200, 1400, 1300, 1600, 1800, 1700, 1900]
    },
    {
      title: 'Messages Sent',
      value: '8,429',
      change: '+18%',
      changeType: 'increase' as const,
      icon: Send,
      color: 'green',
      trend: [800, 900, 850, 1100, 1200, 1150, 1300]
    },
    {
      title: 'Delivery Rate',
      value: '97.8%',
      change: '+2.1%',
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'emerald',
      trend: [95, 96, 95.5, 97, 97.5, 97.2, 97.8]
    },
    {
      title: 'Account Balance',
      value: user ? `UGX ${user.profile.balance.toLocaleString()}` : 'UGX 1.83M',
      change: '-5%',
      changeType: 'decrease' as const,
      icon: CreditCard,
      color: 'purple',
      trend: [2.1, 2.0, 1.95, 1.92, 1.87, 1.84, 1.83]
    }
  ];

  const recentMessages = [
    {
      id: 1,
      recipient: '+256701234567',
      recipientName: 'John Doe',
      message: 'Your appointment is confirmed for tomorrow at 2:00 PM',
      status: 'delivered',
      timestamp: '2 minutes ago',
      gateway: "Africa's Talking",
      priority: 'high'
    },
    {
      id: 2,
      recipient: '+256708765432',
      recipientName: 'Sarah Johnson',
      message: 'Welcome to our service! Thank you for signing up.',
      status: 'pending',
      timestamp: '5 minutes ago',
      gateway: 'Yo! Uganda',
      priority: 'normal'
    },
    {
      id: 3,
      recipient: '+256702345678',
      recipientName: 'Michael Brown',
      message: 'Payment reminder: Your subscription expires in 3 days',
      status: 'delivered',
      timestamp: '12 minutes ago',
      gateway: 'SMSOne',
      priority: 'medium'
    },
    {
      id: 4,
      recipient: '+256709876543',
      recipientName: 'Emily Davis',
      message: 'Your order has been shipped and will arrive soon',
      status: 'failed',
      timestamp: '18 minutes ago',
      gateway: "Africa's Talking",
      priority: 'high'
    }
  ];

  const chartData = [
    { name: 'Mon', messages: 1200, delivered: 1180 },
    { name: 'Tue', messages: 1900, delivered: 1850 },
    { name: 'Wed', messages: 1400, delivered: 1370 },
    { name: 'Thu', messages: 2100, delivered: 2050 },
    { name: 'Fri', messages: 1800, delivered: 1760 },
    { name: 'Sat', messages: 1600, delivered: 1580 },
    { name: 'Sun', messages: 1300, delivered: 1270 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'failed': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleQuickAction = (action: string) => {
    if (!setActiveSection) return;
    switch (action) {
      case 'upload-contacts':
        setActiveSection('contacts');
        break;
      case 'create-campaign':
        setActiveSection('campaigns');
        break;
      case 'view-reports':
        setActiveSection('reports');
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back{user ? `, ${user.profile.first_name}` : ''}!
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your SMS campaigns.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setActiveSection && setActiveSection('reports')}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button 
            onClick={() => setActiveSection && setActiveSection('send-sms')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Send SMS</span>
          </button>
        </div>
      </div>

      {/* User Plan Info */}
      {user && <UserAccountCard user={user} setActiveSection={setActiveSection} />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600 border-blue-200',
            green: 'bg-green-100 text-green-600 border-green-200',
            emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
            purple: 'bg-purple-100 text-purple-600 border-purple-200'
          };

          return (
            <div key={stat.title} className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center border ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? 
                    <ArrowUpRight className="w-4 h-4" /> : 
                    <ArrowDownRight className="w-4 h-4" />
                  }
                  <span className="font-medium">{stat.change}</span>
                </div>
              </div>
              <div className="mb-3">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
              </div>
              {/* Mini trend chart */}
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.trend.map((value, index) => ({ value, index }))}>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={stat.changeType === 'increase' ? '#10b981' : '#ef4444'} 
                      fill={stat.changeType === 'increase' ? '#10b981' : '#ef4444'}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Message Volume Chart */}
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-lg font-semibold text-gray-900">Message Volume</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last 7 days</span>
            </div>
          </div>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  name="Sent"
                />
                <Line 
                  type="monotone" 
                  dataKey="delivered" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  name="Delivered"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
            <button 
              onClick={() => setActiveSection && setActiveSection('messages')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    message.status === 'delivered' ? 'bg-green-500' : 
                    message.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{message.recipientName}</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`}></div>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{message.recipient}</p>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{message.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{message.gateway}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleQuickAction('upload-contacts')}
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Upload Contacts</h3>
              <p className="text-sm text-gray-500">Import from CSV file</p>
            </div>
          </button>
          <button 
            onClick={() => handleQuickAction('create-campaign')}
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <MessageSquare className="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Create Campaign</h3>
              <p className="text-sm text-gray-500">Schedule bulk messages</p>
            </div>
          </button>
          <button 
            onClick={() => handleQuickAction('view-reports')}
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <AlertCircle className="w-8 h-8 text-gray-400 group-hover:text-purple-500 transition-colors" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">View Reports</h3>
              <p className="text-sm text-gray-500">Delivery analytics</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
