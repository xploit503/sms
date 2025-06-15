import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Send, 
  Download,
  Eye,
  Reply,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const MessageHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const messages = [
    {
      id: 1,
      recipient: '+256701234567',
      recipientName: 'John Doe',
      message: 'Your appointment is confirmed for tomorrow at 2:00 PM. Please arrive 15 minutes early.',
      status: 'delivered',
      timestamp: '2024-01-16 14:30:00',
      gateway: 'Africa\'s Talking',
      cost: 'UGX 150',
      campaign: 'Appointment Reminders',
      direction: 'outbound'
    },
    {
      id: 2,
      recipient: '+256708765432',
      recipientName: 'Sarah Johnson',
      message: 'Thank you for the reminder. I will be there on time.',
      status: 'received',
      timestamp: '2024-01-16 14:45:00',
      gateway: 'Africa\'s Talking',
      cost: null,
      campaign: null,
      direction: 'inbound'
    },
    {
      id: 3,
      recipient: '+256702345678',
      recipientName: 'Michael Brown',
      message: 'Welcome to our service! Your account has been successfully created.',
      status: 'delivered',
      timestamp: '2024-01-16 13:15:00',
      gateway: 'Yo! Uganda',
      cost: 'UGX 150',
      campaign: 'Welcome Messages',
      direction: 'outbound'
    },
    {
      id: 4,
      recipient: '+256709876543',
      recipientName: 'Emily Davis',
      message: 'Payment reminder: Your subscription expires in 3 days.',
      status: 'failed',
      timestamp: '2024-01-16 12:00:00',
      gateway: 'SMSOne',
      cost: 'UGX 150',
      campaign: 'Payment Reminders',
      direction: 'outbound'
    },
    {
      id: 5,
      recipient: '+256703456789',
      recipientName: 'David Wilson',
      message: 'Your order #12345 has been shipped and will arrive within 2-3 business days.',
      status: 'pending',
      timestamp: '2024-01-16 11:30:00',
      gateway: 'Africa\'s Talking',
      cost: 'UGX 300',
      campaign: 'Order Updates',
      direction: 'outbound'
    }
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.recipient.includes(searchTerm) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'received':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'delivered': 'text-green-600 bg-green-100',
      'pending': 'text-yellow-600 bg-yellow-100',
      'failed': 'text-red-600 bg-red-100',
      'received': 'text-blue-600 bg-blue-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getDirectionColor = (direction: string) => {
    return direction === 'outbound' ? 'text-blue-600' : 'text-green-600';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-gray-900">Message History</h1>
          <p className="text-gray-600">View all sent and received messages</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">8,429</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">8,245</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">95</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="received">Received</option>
              </select>
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages ({filteredMessages.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredMessages.map((message) => (
            <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(message.status)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${getDirectionColor(message.direction)}`}>
                      {message.direction.toUpperCase()}
                    </span>
                    {message.campaign && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {message.campaign}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{message.recipientName}</p>
                      <p className="text-sm text-gray-600">{message.recipient}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {message.timestamp}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">
                    {message.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>Gateway: {message.gateway}</span>
                      {message.cost && <span>Cost: {message.cost}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Eye className="w-4 h-4" />
                  </button>
                  {message.direction === 'inbound' && (
                    <button className="text-blue-600 hover:text-blue-700 p-1">
                      <Reply className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageHistory;