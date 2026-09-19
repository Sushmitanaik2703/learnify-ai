import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Monitor, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { checkHealth } from '../api';

export default function SettingsPage() {
  const { 
    theme, 
    setTheme, 
    settings, 
    updateSettings, 
    resetAllProgress, 
    setCurrentPage 
  } = useApp();

  const [backendStatus, setBackendStatus] = useState({ connected: false, message: 'Checking...' });
  const [isChecking, setIsChecking] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  const runCheck = async () => {
    setIsChecking(true);
    const res = await checkHealth();
    setBackendStatus(res);
    setIsChecking(false);
  };

  useEffect(() => {
    runCheck();
  }, []);

  const handleSavePref = (key, val) => {
    updateSettings({ [key]: val });
    setSaveSuccessMsg('Preference saved successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setShowConfirmReset(false);
    alert('Local learning data and uploaded files have been cleared.');
    setCurrentPage('dashboard');
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Application Settings & Preferences</h2>
          <p className="page-subtitle">Customize theme appearance, default quiz parameters, and backend system connection.</p>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="alert-box success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={16} />
          <div>{saveSuccessMsg}</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 800 }}>
        {/* Appearance Settings */}
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sun size={18} color="var(--primary)" />
            Appearance & Theme
          </h3>
          <p className="card-description">
            Choose your preferred interface theme. Selection will persist across browser sessions.
          </p>

          <div className="theme-setting-grid">
            <button
              className={`theme-card-option ${theme === 'light' ? 'selected' : ''}`}
              onClick={() => setTheme('light')}
            >
              <Sun size={24} color="#F59E0B" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Light Mode</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High contrast light theme</p>
              </div>
            </button>

            <button
              className={`theme-card-option ${theme === 'dark' ? 'selected' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <Moon size={24} color="#8B5CF6" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Dark Mode</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sleek navy & indigo glass</p>
              </div>
            </button>

            <button
              className={`theme-card-option ${theme === 'system' ? 'selected' : ''}`}
              onClick={() => setTheme('system')}
            >
              <Monitor size={24} color="#06B6D4" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>System Default</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Matches OS preferences</p>
              </div>
            </button>
          </div>
        </div>

        {/* Quiz & Learning Preferences */}
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--secondary)" />
            Quiz & Learning Defaults
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Default Quiz Difficulty
              </label>
              <select
                className="select-input"
                value={settings.defaultDifficulty || 'medium'}
                onChange={(e) => handleSavePref('defaultDifficulty', e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Default Questions per Quiz
              </label>
              <select
                className="select-input"
                value={settings.defaultQuestions || 5}
                onChange={(e) => handleSavePref('defaultQuestions', parseInt(e.target.value, 10))}
              >
                <option value="3">3 Questions</option>
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Application & Backend Status */}
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--accent-emerald)" />
            System & Backend Information
          </h3>

          <div className="system-info-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Backend Connection:</span>
              <span className={`status-badge ${backendStatus.connected ? 'connected' : 'disconnected'}`}>
                {backendStatus.connected ? 'Connected (FastAPI)' : 'Disconnected'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Backend API Host:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>http://127.0.0.1:8000/api</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Version:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>LearnLoop AI v1.0.0 (MVP)</span>
            </div>
          </div>

          <button
            className="btn-secondary-nav"
            onClick={runCheck}
            disabled={isChecking}
            style={{ marginTop: '1rem' }}
          >
            <RefreshCw size={14} className={isChecking ? 'spinner' : ''} />
            <span>Re-check Backend Connection</span>
          </button>
        </div>

        {/* Destructive Data Management */}
        <div className="glass-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <h3 className="card-title" style={{ color: 'var(--accent-rose)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trash2 size={18} />
            Reset Local Application Data
          </h3>
          <p className="card-description">
            Clears saved notes, extracted topics, quiz score history, and flashcard progress stored in local browser storage.
          </p>

          <button
            className="btn-icon-danger"
            style={{ width: 'auto', padding: '0.75rem 1.25rem' }}
            onClick={() => setShowConfirmReset(true)}
          >
            <Trash2 size={16} />
            <span>Reset All Learning Progress</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {showConfirmReset && (
        <div className="modal-backdrop" onClick={() => setShowConfirmReset(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle size={24} color="var(--accent-rose)" />
                <h3 className="modal-title">Confirm Reset Data?</h3>
              </div>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Are you sure you want to delete all local study notes, extracted topics, flashcards, and quiz scores? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary-nav" onClick={() => setShowConfirmReset(false)}>
                Cancel
              </button>
              <button className="btn-icon-danger" style={{ width: 'auto', padding: '0.6rem 1.25rem' }} onClick={handleConfirmReset}>
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
