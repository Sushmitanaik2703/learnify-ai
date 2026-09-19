import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Layers, 
  BarChart3, 
  Settings,
  Flame,
  Calendar,
  Sparkles,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { currentPage, setCurrentPage, subjects, notes, topics, quizzes, flashcards, streakData } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Subjects Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'Study Materials', icon: FileText, badge: notes.length },
    { id: 'topics', label: 'Important Concepts', icon: BookOpen, badge: topics.length },
    { id: 'quizzes', label: 'Quiz Engine', icon: HelpCircle, badge: quizzes.length },
    { id: 'flashcards', label: 'Flashcard Decks', icon: Layers, badge: flashcards.length },
    { id: 'progress', label: 'Learning Progress', icon: BarChart3 },
    { id: 'streak', label: 'Streak Tracker', icon: Flame, badge: `${streakData.currentStreak || 1}d` },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-menu">
        <p className="sidebar-section-title">PLATFORM NAVIGATION</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (currentPage === 'subject_detail' && item.id === 'dashboard');
          return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon size={18} className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
              {item.badge !== undefined && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="sidebar-footer-card">
        <div className="footer-card-header">
          <Sparkles size={16} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Subject Engine</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.4rem 0 0.75rem 0' }}>
          Organize your notes into subjects and extract grounded concepts.
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
