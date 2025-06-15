import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Download,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BalanceManager: React.FC = () => {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile-money');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const balanceHistory = [
    { date: '2024-01-10', balance: 2100000 },
    { date: '2024-01-11', balance: 2050000 },
    { date: '2024-01-12', balance: 1980000 },
    { date: '2024-01-13', balance: 1920000 },
    { date: '2024-01-14', balance: 1875000 },
    { date: '2024-01-15', balance: 1834000 },
    { date: '2024-01-16', balance: 1834000 }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'debit',
      description: 'SMS Campaign - Monthly Newsletter',
      amount: 186750,
      balance: 1834000,
      timestamp: '2024-01-16 10:30:00',
      status: 'completed'
    },
    {
      id: 2,
      type: 'credit',
      description: 'Account Top-up',
      amount: 500000,
      balance: 2020750,
      timestamp: '2024-01-15 14:20:00',
      status: 'completed'
    },
    {
      id: 3,
      type: 'debit',
      description: 'SMS Campaign - Appointment Reminders',
      amount: 13350,
      balance: 1520750,
      timestamp: '2024-01-15 09:15:00',
      status: 'completed'
    },
    {
      id: 4,
      type: 'debit',
      description: 'SMS Campaign - Payment Reminders',
      amount: 35100,
      balance: 1534100,
      timestamp: '2024-01-14 16:45:00',
      status: 'completed'
    },
    {
      id: 5,
      type: 'credit',
      description: 'Account Top-up',
      amount: 1000000,
      balance: 1569200,
      timestamp: '2024-01-13 11:30:00',
      status: 'completed'
    }
  ];

  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const handleQuickAmount = (amount: number) => {
    setTopUpAmount(amount.toString());
  };

  const handleTopUp = () => {
    if (topUpAmount && parseInt(topUpAmount) > 0) {
      setShowTopUpModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setTopUpAmount('');
        setPaymentMethod('mobile-money');
      }, 2000);
    }
  };

  const calculateTotal = () => {
    const amount = parseInt(topUpAmount) || 0;
    const fee = amount * 0.01; // 1% processing fee
    return amount + fee;
  };

  const exportTransactions = () => {
    // Simulate export functionality
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Type,Description,Amount,Balance\n"
      + recentTransactions.map(t => 
          `${t.timestamp},${t.type},${t.description},${t.amount},${t.balance}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-gray-900">Account Balance</h1>
          <p className="text-gray-600">Monitor your account balance and transaction history</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={exportTransactions}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setShowTopUpModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Top Up</span>
          </button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900">UGX 1,834,000</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">-5% from last month</span>
              </div>
            </div>
            <CreditCard className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Spend</p>
              <p className="text-2xl font-bold text-gray-900">UGX 485,000</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8% from last month</span>
              </div>
            </div>
            <TrendingDown className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Cost/SMS</p>
              <p className="text-2xl font-bold text-gray-900">UGX 150</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600">Standard rate</span>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estimated Days Left</p>
              <p className="text-2xl font-bold text-gray-900">28 days</p>
              <div className="flex items-center mt-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">Based on usage</span>
              </div>
            </div>
            <Calendar className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Balance Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Balance Trend (Last 7 Days)</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Jan 10 - Jan 16, 2024</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="#666"
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [formatCurrency(value), 'Balance']}
                labelFormatter={(value) => `Date: ${value}`}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Type</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Description</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Balance</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getTransactionIcon(transaction.type)}
                      <span className={`text-sm font-medium capitalize ${getTransactionColor(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{formatCurrency(transaction.balance)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{transaction.timestamp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">{transaction.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Top Up Account</h2>
              <button 
                onClick={() => setShowTopUpModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Top Up Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">UGX</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Amounts</label>
                <div className="grid grid-cols-3 gap-2">
                  {[100000, 500000, 1000000].map((amount) => (
                    <button 
                      key={amount}
                      onClick={() => handleQuickAmount(amount)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mobile-money">Mobile Money (MTN/Airtel)</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="credit-card">Credit Card</option>
                </select>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Top up amount:</span>
                  <span>UGX {parseInt(topUpAmount || '0').toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Processing fee (1%):</span>
                  <span>UGX {Math.round((parseInt(topUpAmount || '0') * 0.01)).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between font-medium text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>UGX {Math.round(calculateTotal()).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button 
                  onClick={() => setShowTopUpModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTopUp}
                  disabled={!topUpAmount || parseInt(topUpAmount) <= 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Top Up Successful!
              </h3>
              <p className="text-gray-600">
                Your account has been topped up with UGX {parseInt(topUpAmount || '0').toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceManager;