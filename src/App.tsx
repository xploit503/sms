import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadManagement from './components/LeadManagement';
import CampaignScheduler from './components/CampaignScheduler';
import MessageHistory from './components/MessageHistory';
import APISection from './components/APISection';
import BalanceManager from './components/BalanceManager';
import DeliveryReports from './components/DeliveryReports';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Pricing from './components/Pricing';
import Templates from './components/Templates';
import Contacts from './components/Contacts';
import SendSMS from './components/SendSMS';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    setActiveSection('dashboard');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard user={user} setActiveSection={setActiveSection} />;
      case 'send-sms':
        return <SendSMS />;
      case 'leads':
        return <LeadManagement />;
      case 'contacts':
        return <Contacts />;
      case 'campaigns':
        return <CampaignScheduler />;
      case 'templates':
        return <Templates />;
      case 'messages':
        return <MessageHistory />;
      case 'reports':
        return <DeliveryReports />;
      case 'api':
        return <APISection />;
      case 'balance':
        return <BalanceManager />;
      case 'pricing':
        return <Pricing user={user} />;
      default:
        return <Dashboard user={user} setActiveSection={setActiveSection} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <main className="flex-1 overflow-auto">
        {/* Mobile header spacer when sidebar is open */}
        {sidebarOpen && (
          <div className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-center">
            <h1 className="text-lg font-semibold text-gray-900">SMS Platform</h1>
          </div>
        )}
        {renderActiveSection()}
      </main>
    </div>
  );
}

export default App;