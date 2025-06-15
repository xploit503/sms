import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  RefreshCw,
  Key,
  Globe,
  Shield,
  CheckCircle
} from 'lucide-react';

const APISection: React.FC = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const apiKeys = [
    {
      id: 1,
      name: 'Production API Key',
      key: 'sk_live_4f3c8b2a1e9d7c6b5a8f9e2d3c4b5a6e',
      created: '2024-01-10',
      lastUsed: '2024-01-16',
      status: 'active'
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'sk_test_9e2d3c4b5a6e7f8a9b0c1d2e3f4a5b6c',
      created: '2024-01-05',
      lastUsed: '2024-01-15',
      status: 'active'
    }
  ];

  const webhooks = [
    {
      id: 1,
      url: 'https://api.myapp.com/sms/webhook',
      events: ['message.delivered', 'message.failed'],
      status: 'active',
      lastTriggered: '2024-01-16 14:30:00'
    },
    {
      id: 2,
      url: 'https://dashboard.myapp.com/webhooks/sms',
      events: ['message.received'],
      status: 'active',
      lastTriggered: '2024-01-16 12:15:00'
    }
  ];

  const codeExamples = {
    curl: `curl -X POST https://api.smsplatform.com/v1/messages \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+256701234567",
    "message": "Hello from SMS Platform!",
    "from": "YourApp"
  }'`,
    
    javascript: `const response = await fetch('https://api.smsplatform.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+256701234567',
    message: 'Hello from SMS Platform!',
    from: 'YourApp'
  })
});

const result = await response.json();
console.log(result);`,

    python: `import requests

url = "https://api.smsplatform.com/v1/messages"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "to": "+256701234567",
    "message": "Hello from SMS Platform!",
    "from": "YourApp"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskApiKey = (key: string) => {
    if (showApiKey) return key;
    return key.substring(0, 12) + '...' + key.substring(key.length - 4);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-gray-900">API Access</h1>
          <p className="text-gray-600">Integrate SMS functionality into your applications</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create API Key</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'keys', label: 'API Keys' },
            { id: 'webhooks', label: 'Webhooks' },
            { id: 'docs', label: 'Documentation' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* API Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">API Requests</p>
                  <p className="text-2xl font-bold text-gray-900">12,547</p>
                </div>
                <Globe className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">99.8%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rate Limit</p>
                  <p className="text-2xl font-bold text-gray-900">1000/hr</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Guide</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <h3 className="font-medium text-gray-900">Generate an API Key</h3>
                  <p className="text-sm text-gray-600">Create a new API key from the API Keys section</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <h3 className="font-medium text-gray-900">Make Your First Request</h3>
                  <p className="text-sm text-gray-600">Use the code examples below to send your first SMS</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <h3 className="font-medium text-gray-900">Set Up Webhooks</h3>
                  <p className="text-sm text-gray-600">Configure webhooks to receive delivery status updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
              <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <button 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-sm"
                >
                  {showApiKey ? 'Hide' : 'Show'} Keys
                </button>
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{key.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          key.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {key.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {maskApiKey(key.key)}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(key.key)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created: {key.created}</span>
                        <span>Last used: {key.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Webhooks</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Webhook</span>
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {webhook.url}
                        </code>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          webhook.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {webhook.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">Events:</span>
                        {webhook.events.map((event, index) => (
                          <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded">
                            {event}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        Last triggered: {webhook.lastTriggered}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Code Examples</h2>
            
            <div className="space-y-6">
              {Object.entries(codeExamples).map(([language, code]) => (
                <div key={language} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">{language}</span>
                    <button 
                      onClick={() => copyToClipboard(code)}
                      className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* API Endpoints */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded font-medium">POST</span>
                  <code className="text-sm font-mono">/v1/messages</code>
                </div>
                <p className="text-sm text-gray-600">Send a single SMS message</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded font-medium">POST</span>
                  <code className="text-sm font-mono">/v1/messages/bulk</code>
                </div>
                <p className="text-sm text-gray-600">Send multiple SMS messages</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded font-medium">GET</span>
                  <code className="text-sm font-mono">{`/v1/messages/{id}`}</code>
                </div>
                <p className="text-sm text-gray-600">Get message status and details</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded font-medium">GET</span>
                  <code className="text-sm font-mono">/v1/balance</code>
                </div>
                <p className="text-sm text-gray-600">Check account balance</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APISection;