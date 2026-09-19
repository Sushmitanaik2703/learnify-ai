import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  BarChart3, 
  Settings,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { currentPage, setCurrentPage, notes, topics, quizzes, flashcards } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'Notes & Files', icon: FileText, badge: notes.length },
    { id: 'topics', label: 'Topics & Concepts', icon: BookOpen, badge: topics.length },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle, badge: quizzes.length },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, badge: flashcards.length },
    { id: 'progress', label: 'Study Progress', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-menu">
        <p className="sidebar-section-title">MAIN NAVIGATION</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon size={18} className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="sidebar-footer-card">
        <div className="footer-card-header">
          <Sparkles size={16} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>AI Powered</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.4rem 0 0.75rem 0' }}>
          Upload study notes to extract key concepts and generate revision quizzes instantly.
        </p>
        <button 
          className="sidebar-upload-btn"
          onClick={() => setCurrentPage('notes')}
        >
          + Upload Material
        </button>
      </div>
    </aside>
  );
}
