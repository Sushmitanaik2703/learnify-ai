import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  Plus, 
  Sparkles, 
  ArrowRight,
  Flame,
  Calendar,
  UploadCloud,
  Trash2,
  Edit,
  CheckCircle2
} from 'lucide-react';
import SubjectList from '../components/SubjectList';
import CreateSubjectModal from '../components/CreateSubjectModal';
import { useApp } from '../context/AppContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function DashboardPage() {
  const { 
    subjects, 
    notes, 
    topics, 
    quizzes, 
    flashcards, 
    setSelectedSubjectId, 
    setCurrentPage,
    deleteSubject,
    streakData
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Deletion Modal state
  const [deletingSubjectTarget, setDeletingSubjectTarget] = useState(null);
  const [successBanner, setSuccessBanner] = useState(null);

  const handleConfirmDeleteSubject = async () => {
    if (deletingSubjectTarget) {
      const name = deletingSubjectTarget.name;
      await deleteSubject(deletingSubjectTarget.id);
      setSuccessBanner(`Subject "${name}" and associated records deleted successfully.`);
      setTimeout(() => setSuccessBanner(null), 4000);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <section className="welcome-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="pill-badge" style={{ marginBottom: '0.75rem' }}>✨ Subject-Organized Learning Engine</span>
            <h2 className="hero-title">Welcome to LearnLoop AI 🚀</h2>
            <p className="hero-subtitle">
              Organize your study notes around subjects, extract core concepts, practice quizzes, and maintain your daily study streak.
            </p>
          </div>

          {/* Daily Streak Counter Badge */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '1rem 1.25rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              background: 'rgba(245, 158, 11, 0.12)', 
              borderColor: 'rgba(245, 158, 11, 0.3)',
              cursor: 'pointer'
            }}
            onClick={() => setCurrentPage('streak')}
          >
            <Flame size={32} color="#F59E0B" />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>
                {streakData.currentStreak || 1} Day Streak 🔥
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Goal: {streakData.dailyGoalMinutes || 30} mins daily
              </div>
            </div>
          </div>
        </div>
      </section>

      {successBanner && (
        <div className="alert-box success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={18} />
          <div>{successBanner}</div>
        </div>
      )}

      {/* SUBJECT-FIRST SECTION */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 className="section-title">
              <BookOpen size={22} color="var(--primary)" />
              My Academic Subjects ({subjects.length})
            </h3>
            <p className="section-desc">Select a subject to view its study materials, extracted concepts, and quizzes.</p>
          </div>

          <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={18} />
            <span>Create Subject</span>
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={40} className="empty-icon" />
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No subjects created yet</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Create your first subject (e.g. Computer Networks, DBMS, Physics) to organize your study notes.
            </p>
            <button className="btn-primary" style={{ width: 'auto', margin: '0 auto' }} onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={16} /> Create Subject
            </button>
          </div>
        ) : (
            <SubjectList
              subjects={subjects}
              notes={notes}
              topics={topics}
              quizzes={quizzes}
              setSelectedSubjectId={setSelectedSubjectId}
              setCurrentPage={setCurrentPage}
              setEditingSubject={setEditingSubject}
              setDeletingSubjectTarget={setDeletingSubjectTarget}
            />
        )}
      </section>

      {/* QUICK ACTIONS & RECENT MATERIALS */}
      <div className="content-split-grid">
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            Quick Learning Shortcuts
          </h3>
          <div className="quick-actions-grid">
            <div className="quick-action-item" onClick={() => setIsCreateModalOpen(true)}>
              <div className="quick-icon"><Plus size={20} /></div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>New Subject</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add study subject</p>
              </div>
            </div>

            <div className="quick-action-item" onClick={() => setCurrentPage('notes')}>
              <div className="quick-icon"><UploadCloud size={20} /></div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Upload Notes</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Parse PDF / TXT file</p>
              </div>
            </div>

            <div className="quick-action-item" onClick={() => setCurrentPage('planner')}>
              <div className="quick-icon"><Calendar size={20} /></div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Study Planner</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily study schedule</p>
              </div>
            </div>

            <div className="quick-action-item" onClick={() => setCurrentPage('streak')}>
              <div className="quick-icon"><Flame size={20} /></div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Streak Tracker</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calendar & goals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notes */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--accent-cyan)" />
              Recent Uploads
            </h3>
            <button 
              onClick={() => setCurrentPage('notes')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              All Notes →
            </button>
          </div>

          {notes.length === 0 ? (
            <div className="empty-state">
              <FileText size={32} className="empty-icon" />
              <p>No study notes uploaded yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notes.slice(0, 3).map((note) => {
                const noteSubject = subjects.find(s => s.id === note.subject_id);
                return (
                  <div key={note.id} className="recent-material-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="file-type-badge">{note.file_type}</div>
                      <div>
                        <h4 className="material-filename">{note.filename}</h4>
                        <span className="material-meta">
                          Subject: {noteSubject ? noteSubject.name : 'General'} • {note.char_count} chars
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Subject Modal */}
      {(isCreateModalOpen || editingSubject) && (
        <CreateSubjectModal
          isOpen={isCreateModalOpen || !!editingSubject}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingSubject(null);
          }}
          editingSubject={editingSubject}
        />
      )}

      {/* Delete Subject Confirmation Modal */}
      {deletingSubjectTarget && (
        <DeleteConfirmModal
          isOpen={!!deletingSubjectTarget}
          onClose={() => setDeletingSubjectTarget(null)}
          onConfirm={handleConfirmDeleteSubject}
          itemType="Subject"
          itemName={deletingSubjectTarget.name}
          detailsCount={{
            materials: notes.filter(n => n.subject_id === deletingSubjectTarget.id).length,
            concepts: topics.filter(t => t.subject_id === deletingSubjectTarget.id).length
          }}
        />
      )}
    </div>
  );
}
