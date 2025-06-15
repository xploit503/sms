import React, { useState } from 'react';
import { 
  Search, 
  Upload, 
  Filter, 
  Download, 
  MoreVertical, 
  Plus,
  Edit,
  Trash2,
  Send,
  UserPlus,
  X,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Users
} from 'lucide-react';

const Contacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [filterGroup, setFilterGroup] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const contacts = [
    {
      id: 1,
      name: 'John Doe',
      phone: '+256701234567',
      email: 'john.doe@example.com',
      location: 'Kampala',
      group: 'Customers',
      status: 'Active',
      lastContact: '2024-01-15',
      joinDate: '2023-12-01',
      totalMessages: 45,
      avatar: 'JD',
      tags: ['VIP', 'Premium']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      phone: '+256708765432',
      email: 'sarah.j@example.com',
      location: 'Entebbe',
      group: 'Prospects',
      status: 'Active',
      lastContact: '2024-01-14',
      joinDate: '2024-01-10',
      totalMessages: 12,
      avatar: 'SJ',
      tags: ['New']
    },
    {
      id: 3,
      name: 'Michael Brown',
      phone: '+256702345678',
      email: 'michael.b@example.com',
      location: 'Jinja',
      group: 'Customers',
      status: 'Inactive',
      lastContact: '2024-01-10',
      joinDate: '2023-11-15',
      totalMessages: 78,
      avatar: 'MB',
      tags: ['Loyal']
    },
    {
      id: 4,
      name: 'Emily Davis',
      phone: '+256709876543',
      email: 'emily.d@example.com',
      location: 'Mbarara',
      group: 'VIP',
      status: 'Active',
      lastContact: '2024-01-16',
      joinDate: '2023-10-20',
      totalMessages: 156,
      avatar: 'ED',
      tags: ['VIP', 'Enterprise']
    },
    {
      id: 5,
      name: 'David Wilson',
      phone: '+256703456789',
      email: 'david.w@example.com',
      location: 'Gulu',
      group: 'Prospects',
      status: 'Active',
      lastContact: '2024-01-13',
      joinDate: '2024-01-08',
      totalMessages: 8,
      avatar: 'DW',
      tags: ['New', 'Interested']
    }
  ];

  const groups = ['All', 'Customers', 'Prospects', 'VIP', 'Inactive'];
  const statuses = ['All', 'Active', 'Inactive'];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === 'All' || contact.group === filterGroup;
    const matchesStatus = filterStatus === 'All' || contact.status === filterStatus;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  const handleSelectContact = (contactId: number) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === filteredContacts.length
        ? []
        : filteredContacts.map(contact => contact.id)
    );
  };

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'text-green-600 bg-green-100 border-green-200' : 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getGroupColor = (group: string) => {
    const colors = {
      'Customers': 'text-blue-600 bg-blue-100 border-blue-200',
      'Prospects': 'text-yellow-600 bg-yellow-100 border-yellow-200',
      'VIP': 'text-purple-600 bg-purple-100 border-purple-200',
      'Inactive': 'text-gray-600 bg-gray-100 border-gray-200'
    };
    return colors[group as keyof typeof colors] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getTagColor = (tag: string) => {
    const colors = {
      'VIP': 'bg-purple-100 text-purple-600',
      'Premium': 'bg-gold-100 text-gold-600',
      'New': 'bg-green-100 text-green-600',
      'Loyal': 'bg-blue-100 text-blue-600',
      'Enterprise': 'bg-indigo-100 text-indigo-600',
      'Interested': 'bg-orange-100 text-orange-600'
    };
    return colors[tag as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your contact database</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setShowGroupModal(true)}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Group</span>
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <Upload className="w-4 h-4" />
            <span>Import Contacts</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{contacts.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{contacts.filter(c => c.status === 'Active').length}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Groups</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{groups.length - 1}</p>
            </div>
            <UserPlus className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{selectedContacts.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
        <div className="flex flex-col space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select 
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {groups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedContacts.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2 sm:space-y-0">
            <span className="text-sm text-blue-800">
              {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                <Send className="w-3 h-3" />
                <span>Send SMS</span>
              </button>
              <button className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center space-x-1">
                <UserPlus className="w-3 h-3" />
                <span>Add to Group</span>
              </button>
              <button className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1">
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contacts Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Contact</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Phone</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Location</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Group</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Tags</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Last Contact</th>
                <th className="w-12 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {contact.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{contact.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{contact.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getGroupColor(contact.group)}`}>
                      {contact.group}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <span key={index} className={`px-2 py-1 text-xs rounded ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{contact.lastContact}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewContact(contact)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contacts Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => handleSelectContact(contact.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {contact.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
              </div>
              <button 
                onClick={() => handleViewContact(contact)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{contact.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Last contact: {contact.lastContact}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs rounded-full border ${getGroupColor(contact.group)}`}>
                  {contact.group}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
                {contact.tags.map((tag, index) => (
                  <span key={index} className={`px-2 py-1 text-xs rounded ${getTagColor(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-700">
                  <Send className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Detail Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Contact Details</h2>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                  {selectedContact.avatar}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedContact.name}</h3>
                <div className="flex justify-center space-x-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getGroupColor(selectedContact.group)}`}>
                    {selectedContact.group}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                </div>
                <div className="flex justify-center flex-wrap gap-1 mt-2">
                  {selectedContact.tags.map((tag: string, index: number) => (
                    <span key={index} className={`px-2 py-1 text-xs rounded ${getTagColor(tag)}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{selectedContact.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedContact.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{selectedContact.location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="font-medium text-gray-900">{selectedContact.joinDate}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Messages</p>
                    <p className="font-medium text-gray-900">{selectedContact.totalMessages}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send SMS</span>
                </button>
                <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Import Contacts</h2>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drop your CSV file here, or click to browse</p>
                  <input type="file" accept=".csv" className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                    Choose File
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  <p className="font-medium mb-1">CSV Format Requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Name, Phone, Email, Location columns</li>
                    <li>Phone numbers with country code</li>
                    <li>Maximum 10,000 contacts per upload</li>
                  </ul>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Create New Group</h2>
                <button 
                  onClick={() => setShowGroupModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                  <input
                    type="text"
                    placeholder="Enter group name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Optional description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Color</label>
                  <div className="flex space-x-2">
                    {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-gray-500'].map((color) => (
                      <button key={color} className={`w-8 h-8 rounded-full ${color} border-2 border-gray-300 hover:border-gray-400 transition-colors`}></button>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowGroupModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Create Group
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

export default Contacts;