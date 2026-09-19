import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Search, 
  Sun, 
  Moon, 
  Monitor, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { checkHealth } from '../api';

export default function Navbar() {
  const { theme, setTheme, searchQuery, setSearchQuery, setCurrentPage } = useApp();
  const [backendStatus, setBackendStatus] = useState({ connected: false, message: 'Checking...' });
  const [isChecking, setIsChecking] = useState(false);

  const runCheck = async () => {
    setIsChecking(true);
    const res = await checkHealth();
    setBackendStatus(res);
    setIsChecking(false);
  };

  useEffect(() => {
    runCheck();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('topics'); // Navigate to search-relevant view
    }
  };

  return (
    <nav className="app-navbar">
      <div className="navbar-brand" onClick={() => setCurrentPage('dashboard')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <BrainCircuit size={22} />
        </div>
        <div>
          <span className="brand-title">LearnLoop AI</span>
          <span className="brand-badge">PRO</span>
        </div>
      </div>

      {/* Global Search */}
      <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search notes, topics, concepts, or flashcards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            type="button" 
            className="search-clear-btn" 
            onClick={() => setSearchQuery('')}
          >
            ×
          </button>
        )}
      </form>

      {/* Right Navbar Tools */}
      <div className="navbar-tools">
        {/* Theme Selector Pill */}
        <div className="theme-toggle-pill">
          <button
            type="button"
            className={`theme-pill-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            title="Light Mode"
          >
            <Sun size={15} />
          </button>
          <button
            type="button"
            className={`theme-pill-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            title="Dark Mode"
          >
            <Moon size={15} />
          </button>
          <button
            type="button"
            className={`theme-pill-btn ${theme === 'system' ? 'active' : ''}`}
            onClick={() => setTheme('system')}
            title="System Preference"
          >
            <Monitor size={15} />
          </button>
        </div>

        {/* Health Status Indicator */}
        <div
          className={`status-badge ${backendStatus.connected ? 'connected' : 'disconnected'}`}
          title={backendStatus.message}
          onClick={runCheck}
          style={{ cursor: 'pointer' }}
        >
          <span className="status-dot"></span>
          <span className="status-text">{backendStatus.connected ? 'Connected' : 'Offline'}</span>
          <RefreshCw size={12} className={isChecking ? 'spinner' : ''} />
        </div>
      </div>
    </nav>
  );
}
