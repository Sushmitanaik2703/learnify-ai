import React from 'react';
import { 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  UploadCloud, 
  Sparkles, 
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const { 
    setCurrentPage, 
    notes, 
    topics, 
    quizzes, 
    flashcards, 
    setActiveNote 
  } = useApp();

  const completedTopicsCount = topics.filter((t) => t.status === 'Completed').length;
  const progressPercent = topics.length > 0 ? Math.round((completedTopicsCount / topics.length) * 100) : 0;
  
  const totalQuizScore = quizzes.reduce((acc, q) => acc + q.percentage, 0);
  const avgQuizAccuracy = quizzes.length > 0 ? Math.round(totalQuizScore / quizzes.length) : 0;

  const reviewedFlashcardsCount = flashcards.filter((f) => f.reviewed).length;

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <section className="welcome-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="pill-badge" style={{ marginBottom: '0.75rem' }}>✨ LearnLoop AI Learning Engine</span>
          <h2 className="hero-title">Welcome back to your Study Hub 🚀</h2>
          <p className="hero-subtitle">
            Track your study progress, generate AI-powered quiz assessments from your uploaded lecture notes, and master key exam topics.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="hero-cta-btn" onClick={() => setCurrentPage('notes')}>
              <UploadCloud size={18} />
              <span>Upload Study Material</span>
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => setCurrentPage('quizzes')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.08)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                padding: '0.75rem 1.5rem',
                borderRadius: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <HelpCircle size={18} />
              <span>Take a Quick Quiz</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FileText size={22} />
          </div>
          <div>
            <div className="stat-value">{notes.length}</div>
            <div className="stat-label">Uploaded Notes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="stat-value">{topics.length}</div>
            <div className="stat-label">Extracted Topics</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">
            <HelpCircle size={22} />
          </div>
          <div>
            <div className="stat-value">{quizzes.length}</div>
            <div className="stat-label">Quizzes Completed ({avgQuizAccuracy}% Avg)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Layers size={22} />
          </div>
          <div>
            <div className="stat-value">{reviewedFlashcardsCount} / {flashcards.length}</div>
            <div className="stat-label">Flashcards Mastered</div>
          </div>
        </div>
      </div>

      {/* Main Content Split Grid */}
      <div className="content-split-grid">
        {/* Left Column: Quick Actions & Recent Materials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Quick Action Cards */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" />
              Quick Actions
            </h3>
            <div className="quick-actions-grid">
              <div className="quick-action-item" onClick={() => setCurrentPage('notes')}>
                <div className="quick-icon"><UploadCloud size={20} /></div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Upload Notes</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Parse PDF/TXT notes</p>
                </div>
              </div>

              <div className="quick-action-item" onClick={() => setCurrentPage('topics')}>
                <div className="quick-icon"><BookOpen size={20} /></div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Explore Topics</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>View AI summaries</p>
                </div>
              </div>

              <div className="quick-action-item" onClick={() => setCurrentPage('quizzes')}>
                <div className="quick-icon"><HelpCircle size={20} /></div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Start Quiz</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Test your accuracy</p>
                </div>
              </div>

              <div className="quick-action-item" onClick={() => setCurrentPage('flashcards')}>
                <div className="quick-icon"><Layers size={20} /></div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Flashcards</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Review card deck</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Study Materials */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--accent-cyan)" />
                Recent Study Materials
              </h3>
              <button 
                onClick={() => setCurrentPage('notes')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                View All →
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="empty-state">
                <FileText size={32} className="empty-icon" />
                <p>No uploaded notes yet. Upload your first PDF or TXT document!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notes.slice(0, 4).map((note) => (
                  <div key={note.id} className="recent-material-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="file-type-badge">{note.file_type}</div>
                      <div>
                        <h4 className="material-filename">{note.filename}</h4>
                        <span className="material-meta">
                          {note.created_at} • {note.char_count} chars • {note.topics_count} topics
                        </span>
                      </div>
                    </div>
                    <button
                      className="open-note-btn"
                      onClick={() => {
                        setActiveNote(note);
                        setCurrentPage('notes');
                      }}
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Learning Progress & Recommended Topics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Learning Progress Card */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--accent-emerald)" />
              Overall Topic Mastery
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                <span>Completion Status</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
              <div className="mini-status-box">
                <span className="mini-box-val">{completedTopicsCount}</span>
                <span className="mini-box-lbl">Completed Topics</span>
              </div>
              <div className="mini-status-box">
                <span className="mini-box-val">{topics.length - completedTopicsCount}</span>
                <span className="mini-box-lbl">In Progress / Pending</span>
              </div>
            </div>
          </div>

          {/* Recommended Topics */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="var(--secondary)" />
                Recommended Focus Topics
              </h3>
              <button 
                onClick={() => setCurrentPage('topics')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                All Topics →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topics.slice(0, 3).map((topic) => (
                <div key={topic.id} className="recommended-topic-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 className="rec-topic-title">{topic.title}</h4>
                    <span className={`difficulty-pill ${topic.difficulty?.toLowerCase()}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <p className="rec-topic-desc">{topic.explanation}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                    <div className="keywords-group">
                      {(topic.keywords || []).slice(0, 2).map((k, i) => (
                        <span key={i} className="keyword-tag">#{k}</span>
                      ))}
                    </div>
                    <button
                      className="rec-action-btn"
                      onClick={() => setCurrentPage('topics')}
                    >
                      Study Now <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
