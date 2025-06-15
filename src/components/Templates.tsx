import React, { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Search, MessageSquare, X } from 'lucide-react';

const Templates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Message',
      content: 'Welcome to our service! Thank you for joining us. We\'re excited to have you on board.',
      category: 'welcome',
      usage: 245,
      lastUsed: '2024-01-15',
      variables: ['name', 'company']
    },
    {
      id: 2,
      name: 'Appointment Reminder',
      content: 'Hi {name}, your appointment is scheduled for {date} at {time}. Please arrive 15 minutes early.',
      category: 'reminder',
      usage: 189,
      lastUsed: '2024-01-16',
      variables: ['name', 'date', 'time']
    },
    {
      id: 3,
      name: 'Promotional Offer',
      content: 'Special offer! Get {discount}% off your next purchase. Use code {code}. Valid until {expiry}.',
      category: 'promotion',
      usage: 156,
      lastUsed: '2024-01-14',
      variables: ['discount', 'code', 'expiry']
    },
    {
      id: 4,
      name: 'Payment Reminder',
      content: 'Your payment of {amount} is due in {days} days. Please settle your account to avoid service interruption.',
      category: 'reminder',
      usage: 98,
      lastUsed: '2024-01-13',
      variables: ['amount', 'days']
    },
    {
      id: 5,
      name: 'Event Invitation',
      content: 'You\'re invited to {event} on {date} at {venue}. RSVP by {rsvp_date}.',
      category: 'event',
      usage: 67,
      lastUsed: '2024-01-12',
      variables: ['event', 'date', 'venue', 'rsvp_date']
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'welcome', name: 'Welcome', count: templates.filter(t => t.category === 'welcome').length },
    { id: 'reminder', name: 'Reminders', count: templates.filter(t => t.category === 'reminder').length },
    { id: 'promotion', name: 'Promotions', count: templates.filter(t => t.category === 'promotion').length },
    { id: 'event', name: 'Events', count: templates.filter(t => t.category === 'event').length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'welcome': 'bg-green-100 text-green-600',
      'reminder': 'bg-blue-100 text-blue-600',
      'promotion': 'bg-orange-100 text-orange-600',
      'event': 'bg-purple-100 text-purple-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const copyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const deleteTemplate = (id: number) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Message Templates</h1>
          <p className="text-gray-600 mt-1">Create and manage reusable SMS templates</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Templates</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Used</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{Math.max(...templates.map(t => t.usage))}</p>
            </div>
            <Copy className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <Edit className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usage</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{templates.reduce((sum, t) => sum + t.usage, 0)}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyTemplate(template.content)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600" title="Edit template">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {template.content}
                  </p>
                </div>

                {template.variables.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable, index) => (
                        <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded">
                          {`{${variable}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Used {template.usage} times</span>
                  <span>Last used: {template.lastUsed}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first template to get started'}
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Template</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                    <input
                      type="text"
                      placeholder="Enter template name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="welcome">Welcome</option>
                      <option value="reminder">Reminder</option>
                      <option value="promotion">Promotion</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                  <textarea
                    rows={6}
                    placeholder="Type your template message here... Use {variable} for dynamic content."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">160 characters remaining</span>
                    <span className="text-sm text-gray-500">1 SMS</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variables</label>
                  <input
                    type="text"
                    placeholder="Enter variables separated by commas (e.g., name, date, amount)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Variables will be replaced with actual values when sending messages
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Create Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;