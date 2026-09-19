import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  HelpCircle, 
  Layers, 
  AlertTriangle,
  BookOpen,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProgressPage() {
  const { subjects, notes, topics, quizzes, flashcards, setCurrentPage, setSelectedSubjectId } = useApp();

  const completedTopics = topics.filter((t) => t.status === 'Completed');
  const inProgressTopics = topics.filter((t) => t.status === 'In Progress');
  const notStartedTopics = topics.filter((t) => t.status === 'Not Started' || !t.status);

  const totalScore = quizzes.reduce((acc, q) => acc + q.percentage, 0);
  const avgAccuracy = quizzes.length > 0 ? Math.round(totalScore / quizzes.length) : 0;

  const reviewedCards = flashcards.filter((f) => f.reviewed);
  const difficultCards = flashcards.filter((f) => f.rating === 'Difficult');

  return (
    <div className="progress-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Subject & Concept Learning Analytics</h2>
          <p className="page-subtitle">Track topic completion percentages, quiz accuracy, and areas needing revision.</p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-value">{completedTopics.length} / {topics.length}</div>
            <div className="stat-label">Mastered Concepts ({topics.length > 0 ? Math.round((completedTopics.length / topics.length) * 100) : 0}%)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Award size={22} />
          </div>
          <div>
            <div className="stat-value">{avgAccuracy}%</div>
            <div className="stat-label">Average Quiz Score ({quizzes.length} Quizzes)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Layers size={22} />
          </div>
          <div>
            <div className="stat-value">{reviewedCards.length} / {flashcards.length}</div>
            <div className="stat-label">Flashcards Reviewed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-value">{difficultCards.length}</div>
            <div className="stat-label">Difficult Flashcards</div>
          </div>
        </div>
      </div>

      {/* SUBJECT & CONCEPT PROGRESS BREAKDOWN */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>
          <BookOpen size={20} color="var(--primary)" />
          Progress Breakdown by Subject & Concept
        </h3>

        {subjects.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={36} className="empty-icon" />
            <p>No subjects created yet. Create a subject to start tracking progress!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {subjects.map((subj) => {
              const subjNotes = notes.filter(n => n.subject_id === subj.id);
              const subjTopics = topics.filter(t => t.subject_id === subj.id);
              const subjCompleted = subjTopics.filter(t => t.status === 'Completed');
              const subjProgress = subjTopics.length > 0 
                ? Math.round((subjCompleted.length / subjTopics.length) * 100)
                : 0;

              return (
                <div key={subj.id} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: subj.color || 'var(--primary)' }} />
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{subj.name}</h4>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{subjProgress}% Overall</span>
                  </div>

                  <div className="progress-bar-bg" style={{ height: 10, marginBottom: '1.25rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${subjProgress}%`, background: subj.color || 'var(--primary)' }} />
                  </div>

                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 700 }}>
                    Concept Breakdown ({subjTopics.length} concepts):
                  </h5>

                  {subjTopics.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No concepts extracted yet for this subject.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {subjTopics.map((top) => {
                        let topProgress = 0;
                        if (top.status === 'Completed') topProgress = 100;
                        else if (top.status === 'In Progress') topProgress = 50;

                        return (
                          <div key={top.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-input)', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span className={`status-tag ${top.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                {top.status}
                              </span>
                              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{top.title}</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                              {topProgress}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* QUIZ HISTORY */}
      <div className="content-split-grid">
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} color="var(--primary)" />
            Recent Quiz Attempts
          </h3>

          {quizzes.length === 0 ? (
            <div className="empty-state">
              <HelpCircle size={36} className="empty-icon" />
              <p>No quizzes completed yet. Take a quiz to view your score breakdown!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-history-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{quiz.topic}</h4>
                    <span className={`review-badge ${quiz.percentage >= 70 ? 'pass' : 'fail'}`}>
                      {quiz.score}/{quiz.total_questions} ({quiz.percentage}%)
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Difficulty: {quiz.difficulty?.toUpperCase()}</span>
                    <span>Date: {quiz.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WEAK CONCEPTS REVISION QUEUE */}
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="var(--accent-amber)" />
            Focus Revision Queue
          </h3>

          {notStartedTopics.length === 0 && inProgressTopics.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={36} className="empty-icon" color="var(--accent-emerald)" />
              <p>Great job! All extracted concepts marked as completed.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[...inProgressTopics, ...notStartedTopics].map((t) => (
                <div key={t.id} className="recommended-topic-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <h4 className="rec-topic-title">{t.title}</h4>
                    <span className="coming-soon-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      {t.status}
                    </span>
                  </div>
                  <p className="rec-topic-desc">{t.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
