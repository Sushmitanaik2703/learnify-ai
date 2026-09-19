import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  ArrowLeft,
  Trash2,
  Edit,
  UploadCloud,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CreateSubjectModal from '../components/CreateSubjectModal';

export default function SubjectDetailPage() {
  const { 
    subjects, 
    selectedSubjectId, 
    setSelectedSubjectId, 
    setCurrentPage, 
    notes, 
    topics, 
    quizzes, 
    flashcards, 
    updateTopicStatus,
    deleteSubject
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const subject = subjects.find((s) => s.id === selectedSubjectId);

  if (!subject) {
    return (
      <div className="empty-state" style={{ margin: '3rem auto', maxWidth: 500 }}>
        <BookOpen size={40} className="empty-icon" />
        <h4>Subject Not Found</h4>
        <p style={{ marginBottom: '1.25rem' }}>The requested subject may have been deleted.</p>
        <button className="btn-primary" onClick={() => setCurrentPage('dashboard')}>
          ← Return to Dashboard
        </button>
      </div>
    );
  }

  // Filter materials, concepts, quizzes, flashcards for this subject
  const subjectNotes = notes.filter((n) => n.subject_id === subject.id);
  const subjectTopics = topics.filter((t) => t.subject_id === subject.id);
  const completedTopics = subjectTopics.filter((t) => t.status === 'Completed');
  const subjectQuizzes = quizzes.filter((q) => q.subject_id === subject.id || subjectTopics.some(t => t.title === q.topic));
  const subjectCards = flashcards.filter((c) => c.subject_id === subject.id || subjectTopics.some(t => t.title === c.topic));

  const progressPercent = subjectTopics.length > 0 
    ? Math.round((completedTopics.length / subjectTopics.length) * 100) 
    : 0;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete subject "${subject.name}" and its assigned materials?`)) {
      deleteSubject(subject.id);
    }
  };

  return (
    <div className="subject-detail-page">
      {/* Back Button & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <button 
            className="btn-secondary-nav"
            onClick={() => {
              setSelectedSubjectId(null);
              setCurrentPage('dashboard');
            }}
            style={{ marginBottom: '0.85rem' }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: subject.color || 'var(--primary)',
                boxShadow: '0 0 10px ' + (subject.color || 'var(--primary)')
              }}
            />
            <h2 className="page-title">{subject.name}</h2>
          </div>
          <p className="page-subtitle">{subject.description || 'Dedicated Subject Workspace'}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-icon-secondary" onClick={() => setIsEditModalOpen(true)}>
            <Edit size={16} /> Edit
          </button>
          <button className="btn-icon-danger" onClick={handleDelete}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4), var(--bg-card))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Subject Mastery Progress</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{progressPercent}%</span>
        </div>
        <div className="progress-bar-bg" style={{ height: 12, marginBottom: '1.25rem' }}>
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, background: subject.color }} />
        </div>

        <div className="stats-grid" style={{ margin: 0 }}>
          <div className="stat-card" style={{ padding: '0.85rem' }}>
            <div className="stat-value">{subjectNotes.length}</div>
            <div className="stat-label">Study Materials</div>
          </div>
          <div className="stat-card" style={{ padding: '0.85rem' }}>
            <div className="stat-value">{subjectTopics.length}</div>
            <div className="stat-label">Concepts</div>
          </div>
          <div className="stat-card" style={{ padding: '0.85rem' }}>
            <div className="stat-value">{completedTopics.length}</div>
            <div className="stat-label">Mastered Concepts</div>
          </div>
          <div className="stat-card" style={{ padding: '0.85rem' }}>
            <div className="stat-value">{subjectCards.length}</div>
            <div className="stat-label">Flashcards</div>
          </div>
        </div>
      </div>

      {/* Subject Quick Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          className="btn-primary"
          style={{ width: 'auto', flex: 1, minWidth: 200 }}
          onClick={() => setCurrentPage('notes')}
        >
          <UploadCloud size={18} />
          <span>+ Add Material to Subject</span>
        </button>

        <button
          className="btn-secondary-nav"
          style={{ flex: 1, minWidth: 200, justifyContent: 'center' }}
          onClick={() => setCurrentPage('quizzes')}
        >
          <HelpCircle size={18} color="var(--primary)" />
          <span>Start Subject Quiz</span>
        </button>

        <button
          className="btn-secondary-nav"
          style={{ flex: 1, minWidth: 200, justifyContent: 'center' }}
          onClick={() => setCurrentPage('flashcards')}
        >
          <Layers size={18} color="var(--secondary)" />
          <span>Subject Flashcards</span>
        </button>
      </div>

      {/* SECTION 1: STUDY MATERIALS */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 className="section-title" style={{ marginBottom: '1rem' }}>
          <FileText size={20} color="var(--primary)" />
          Study Materials ({subjectNotes.length})
        </h3>

        {subjectNotes.length === 0 ? (
          <div className="empty-state">
            <FileText size={32} className="empty-icon" />
            <p>No study materials uploaded for this subject yet.</p>
            <button 
              className="btn-primary" 
              style={{ width: 'auto', margin: '1rem auto 0 auto' }}
              onClick={() => setCurrentPage('notes')}
            >
              Upload PDF or TXT File
            </button>
          </div>
        ) : (
          <div className="notes-list-container">
            {subjectNotes.map((note) => (
              <div key={note.id} className="note-item-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className={`file-type-icon ${note.file_type.toLowerCase()}`}>
                    {note.file_type}
                  </div>
                  <div>
                    <h4 className="note-title">{note.filename}</h4>
                    <p className="note-meta-text">
                      {note.created_at} • {note.char_count} characters • {note.topics_count} concepts extracted
                    </p>
                  </div>
                </div>

                <button
                  className="btn-icon-secondary"
                  onClick={() => setCurrentPage('notes')}
                >
                  <Eye size={15} /> View Material
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: CONCEPTS & CONCEPT-LEVEL ACTIONS */}
      <section>
        <h3 className="section-title" style={{ marginBottom: '1rem' }}>
          <BookOpen size={20} color="var(--secondary)" />
          Core Concepts & Learning Actions ({subjectTopics.length})
        </h3>

        {subjectTopics.length === 0 ? (
          <div className="empty-state">
            <Sparkles size={32} className="empty-icon" />
            <p>Upload a PDF or TXT material above to automatically extract core concepts!</p>
          </div>
        ) : (
          <div className="topics-list-grid">
            {subjectTopics.map((topic) => (
              <div key={topic.id} className="topic-main-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className={`difficulty-pill ${topic.difficulty?.toLowerCase()}`}>
                      {topic.difficulty}
                    </span>
                    <span className={`status-tag ${topic.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {topic.status}
                    </span>
                  </div>

                  <h4 className="topic-card-title">{topic.title}</h4>
                  <p className="topic-card-explanation">{topic.explanation}</p>
                </div>

                <div className="topic-card-footer" style={{ flexDirection: 'column', gap: '0.6rem', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className="btn-explain-ai"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => setCurrentPage('topics')}
                    >
                      <Sparkles size={14} /> Explain
                    </button>
                    <button
                      className="btn-secondary-nav"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                      onClick={() => setCurrentPage('quizzes')}
                    >
                      <HelpCircle size={14} /> Quiz
                    </button>
                  </div>

                  <button
                    className={`status-toggle-btn ${topic.status === 'Completed' ? 'completed' : ''}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      const nextStatus = topic.status === 'Completed' ? 'In Progress' : 'Completed';
                      updateTopicStatus(topic.id, nextStatus);
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>{topic.status === 'Completed' ? 'Completed' : 'Mark as Studied'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Subject Modal */}
      {isEditModalOpen && (
        <CreateSubjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          editingSubject={subject}
        />
      )}
    </div>
  );
}
