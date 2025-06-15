import React, { useState } from 'react';
import { Send, Users, MessageSquare, Upload, Plus, X, Check } from 'lucide-react';

interface SendSMSProps {
  setActiveSection?: (section: string) => void;
}

const SendSMS: React.FC<SendSMSProps> = ({ setActiveSection }) => {
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [sendMethod, setSendMethod] = useState<'individual' | 'group' | 'upload'>('individual');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const groups = [
    { id: 'customers', name: 'Customers', count: 1245 },
    { id: 'prospects', name: 'Prospects', count: 567 },
    { id: 'vip', name: 'VIP Clients', count: 89 },
    { id: 'staff', name: 'Staff Members', count: 45 }
  ];

  const templates = [
    { id: 'welcome', name: 'Welcome Message', content: 'Welcome to our service! Thank you for joining us.' },
    { id: 'reminder', name: 'Appointment Reminder', content: 'Your appointment is scheduled for {date} at {time}.' },
    { id: 'promotion', name: 'Promotional Offer', content: 'Special offer! Get 20% off your next purchase. Use code SAVE20.' },
    { id: 'payment', name: 'Payment Reminder', content: 'Your payment is due in 3 days. Please settle your account.' }
  ];

  const addRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const removeRecipient = (phone: string) => {
    setRecipients(recipients.filter(r => r !== phone));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const calculateCost = () => {
    let recipientCount = 0;
    if (sendMethod === 'individual') {
      recipientCount = recipients.length;
    } else if (sendMethod === 'group' && selectedGroup) {
      const group = groups.find(g => g.id === selectedGroup);
      recipientCount = group ? group.count : 0;
    }
    
    const smsCount = Math.ceil(message.length / 160);
    return recipientCount * smsCount * 150; // UGX 150 per SMS
  };

  const handleSend = () => {
    // Simulate sending SMS
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      // Reset form
      setMessage('');
      setRecipients([]);
      setSelectedGroup('');
      setSelectedTemplate('');
      setIsScheduled(false);
      setScheduleDate('');
      setScheduleTime('');
    }, 2000);
  };

  const canSend = message && (
    (sendMethod === 'individual' && recipients.length > 0) ||
    (sendMethod === 'group' && selectedGroup) ||
    (sendMethod === 'upload')
  );

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Send SMS</h1>
          <p className="text-gray-600 mt-1">Send SMS messages to your contacts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Send Method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setSendMethod('individual')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  sendMethod === 'individual'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Individual</div>
                <div className="text-xs text-gray-500">Add phone numbers</div>
              </button>
              <button
                onClick={() => setSendMethod('group')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  sendMethod === 'group'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Group</div>
                <div className="text-xs text-gray-500">Select contact group</div>
              </button>
              <button
                onClick={() => setSendMethod('upload')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  sendMethod === 'upload'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Upload className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Upload</div>
                <div className="text-xs text-gray-500">CSV file upload</div>
              </button>
            </div>
          </div>

          {/* Recipients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recipients</h2>
            
            {sendMethod === 'individual' && (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    placeholder="+256701234567"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                  />
                  <button
                    onClick={addRecipient}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {recipients.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Recipients ({recipients.length})
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {recipients.map((phone, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">{phone}</span>
                          <button
                            onClick={() => removeRecipient(phone)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {sendMethod === 'group' && (
              <div>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a group</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.count} contacts)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {sendMethod === 'upload' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload CSV file with phone numbers</p>
                <input type="file" accept=".csv" className="hidden" id="csv-upload" />
                <label htmlFor="csv-upload" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                  Choose File
                </label>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Message</h2>
            
            {/* Templates */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use Template (Optional)
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Type your message here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {message.length}/160 characters
                </span>
                <span className="text-sm text-gray-500">
                  {Math.ceil(message.length / 160) || 1} SMS
                </span>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Schedule</h2>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Schedule for later</span>
              </label>
            </div>

            {isScheduled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Cost Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Recipients:</span>
                <span className="font-medium">
                  {sendMethod === 'individual' 
                    ? recipients.length 
                    : sendMethod === 'group' && selectedGroup
                    ? groups.find(g => g.id === selectedGroup)?.count || 0
                    : 0
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SMS per recipient:</span>
                <span className="font-medium">{Math.ceil(message.length / 160) || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate per SMS:</span>
                <span className="font-medium">UGX 150</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total Cost:</span>
                  <span className="font-bold text-blue-600">UGX {calculateCost().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>{isScheduled ? 'Schedule SMS' : 'Send SMS'}</span>
          </button>

          {/* Recent Templates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h2>
            <div className="space-y-2">
              {templates.slice(0, 3).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{template.content}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isScheduled ? 'SMS Scheduled Successfully!' : 'SMS Sent Successfully!'}
              </h3>
              <p className="text-gray-600">
                {isScheduled 
                  ? `Your message has been scheduled for ${scheduleDate} at ${scheduleTime}`
                  : 'Your message has been sent to all recipients'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendSMS;