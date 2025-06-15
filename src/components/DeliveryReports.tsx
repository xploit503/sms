import React from 'react';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  DollarSign,
  Download,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DeliveryReports: React.FC = () => {
  const deliveryData = [
    { name: 'Mon', delivered: 1200, failed: 45 },
    { name: 'Tue', delivered: 1900, failed: 67 },
    { name: 'Wed', delivered: 1400, failed: 23 },
    { name: 'Thu', delivered: 2100, failed: 89 },
    { name: 'Fri', delivered: 1800, failed: 56 },
    { name: 'Sat', delivered: 1600, failed: 34 },
    { name: 'Sun', delivered: 1300, failed: 28 }
  ];

  const gatewayData = [
    { name: 'Africa\'s Talking', value: 45, color: '#3b82f6' },
    { name: 'Yo! Uganda', value: 35, color: '#10b981' },
    { name: 'SMSOne', value: 20, color: '#f59e0b' }
  ];

  const recentReports = [
    {
      id: 1,
      campaign: 'Monthly Newsletter',
      sent: 1245,
      delivered: 1189,
      failed: 56,
      deliveryRate: 95.5,
      cost: 'UGX 186,750',
      date: '2024-01-16'
    },
    {
      id: 2,
      campaign: 'Appointment Reminders',
      sent: 89,
      delivered: 87,
      failed: 2,
      deliveryRate: 97.8,
      cost: 'UGX 13,350',
      date: '2024-01-15'
    },
    {
      id: 3,
      campaign: 'Payment Reminders',
      sent: 234,
      delivered: 198,
      failed: 36,
      deliveryRate: 84.6,
      cost: 'UGX 35,100',
      date: '2024-01-14'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Reports</h1>
          <p className="text-gray-600">Track your SMS delivery performance and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Date Range</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">8,429</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12%</span>
              </div>
            </div>
            <MessageSquare className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivery Rate</p>
              <p className="text-2xl font-bold text-gray-900">97.8%</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+2.1%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed Messages</p>
              <p className="text-2xl font-bold text-gray-900">184</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1 rotate-180" />
                <span className="text-sm text-red-600">-8%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">UGX 1.2M</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">+5%</span>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Delivery Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Trends (Last 7 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="delivered" fill="#10b981" name="Delivered" />
                <Bar dataKey="failed" fill="#ef4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gateway Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gateway Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gatewayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gatewayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {gatewayData.map((gateway, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: gateway.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{gateway.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{gateway.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Campaign Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Campaign Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Campaign</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Total Sent</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Delivered</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Failed</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Delivery Rate</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Cost</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{report.campaign}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.sent.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 font-medium">{report.delivered.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-red-600 font-medium">{report.failed.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        report.deliveryRate >= 95 ? 'bg-green-100 text-green-600' :
                        report.deliveryRate >= 85 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {report.deliveryRate}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.cost}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReports;