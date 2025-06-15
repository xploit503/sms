import React from 'react';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  CreditCard,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Plus,
  Upload
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  user?: any;
  setActiveSection?: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setActiveSection }) => {
  const stats = [
    {
      title: 'Total Contacts',
      value: '12,847',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'blue',
      trend: [1200, 1400, 1300, 1600, 1800, 1700, 1900]
    },
    {
      title: 'Messages Sent',
      value: '8,429',
      change: '+18%',
      changeType: 'increase',
      icon: Send,
      color: 'green',
      trend: [800, 900, 850, 1100, 1200, 1150, 1300]
    },
    {
      title: 'Delivery Rate',
      value: '97.8%',
      change: '+2.1%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'emerald',
      trend: [95, 96, 95.5, 97, 97.5, 97.2, 97.8]
    },
    {
      title: 'Account Balance',
      value: user ? `UGX ${user.balance?.toLocaleString() || '0'}` : 'UGX 1.83M',
      change: '-5%',
      changeType: 'decrease',
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
      gateway: 'Africa\'s Talking',
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
      gateway: 'Africa\'s Talking',
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
    if (setActiveSection) {
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
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back{user ? `, ${user.name}` : ''}!
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
      {user && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Current Plan: {user.plan}</h3>
              <p className="text-sm text-gray-600">Account Balance: UGX {user.balance?.toLocaleString() || '0'}</p>
            </div>
            <button 
              onClick={() => setActiveSection && setActiveSection('balance')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Top Up</span>
            </button>
          </div>
        </div>
      )}

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