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
  const { 
    subjects, 
    notes, 
    topics, 
    quizzes, 
    flashcards, 
    setCurrentPage, 
    setSelectedSubjectId,
    getConceptScore,
    getSubjectProgress,
    getWeakTopics,
    getOverallProgress
  } = useApp();

  const weakTopics = getWeakTopics();
  const overallMastery = getOverallProgress();

  const totalScore = quizzes.reduce((acc, q) => acc + (q.percentage !== undefined ? q.percentage : (q.score / q.total_questions) * 100), 0);
  const avgAccuracy = quizzes.length > 0 ? Math.round(totalScore / quizzes.length) : 0;

  const reviewedCards = flashcards.filter((f) => f.reviewed);
  const difficultCards = flashcards.filter((f) => f.rating === 'Difficult' || f.rating === 'Hard');

  return (
    <div className="progress-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Subject & Concept Learning Analytics</h2>
          <p className="page-subtitle">Track topic performance scores, quiz accuracy trends, and areas needing active revision.</p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-value">{overallMastery}%</div>
            <div className="stat-label">Overall Concept Mastery ({topics.length} Concepts)</div>
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
            <div className="stat-value">{weakTopics.length}</div>
            <div className="stat-label">Topics Needing Revision</div>
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
              const subjTopics = topics.filter(t => t.subject_id === subj.id);
              const subjProgress = getSubjectProgress(subj.id);

              return (
                <div key={subj.id} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: subj.color || 'var(--primary)' }} />
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{subj.name}</h4>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{subjProgress}% Overall Mastery</span>
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
                        const score = getConceptScore(top);

                        return (
                          <div key={top.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.85rem', background: 'var(--bg-input)', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span className={`status-tag ${top.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                {top.status}
                              </span>
                              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{top.title}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score:</span>
                              <span style={{ 
                                fontSize: '0.85rem', 
                                fontWeight: 800, 
                                fontFamily: 'var(--font-mono)',
                                color: score >= 80 ? 'var(--accent-emerald)' : score >= 60 ? 'var(--accent-amber)' : '#EF4444' 
                              }}>
                                {score}%
                              </span>
                            </div>
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

      {/* QUIZ HISTORY & WEAK TOPICS */}
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
              {quizzes.map((quiz) => {
                const pct = quiz.percentage !== undefined ? quiz.percentage : Math.round((quiz.score / quiz.total_questions) * 100);
                return (
                  <div key={quiz.id} className="quiz-history-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{quiz.topic}</h4>
                      <span className={`review-badge ${pct >= 70 ? 'pass' : 'fail'}`}>
                        {quiz.score}/{quiz.total_questions} ({pct}%)
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Difficulty: {(quiz.difficulty || 'medium').toUpperCase()}</span>
                      <span>Date: {quiz.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* WEAK CONCEPTS REVISION QUEUE */}
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="var(--accent-amber)" />
            Focus Revision Queue ({weakTopics.length})
          </h3>

          {weakTopics.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={36} className="empty-icon" color="var(--accent-emerald)" />
              <p>Great job! All extracted concepts have high performance scores.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {weakTopics.map((t) => (
                <div key={t.id} className="recommended-topic-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className="rec-topic-title" style={{ margin: 0 }}>{t.title}</h4>
                    <span className="coming-soon-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      {t.conceptScore}% Score
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{t.subjectName} • {t.reason}</span>
                    <button
                      className="secondary-button"
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => setCurrentPage('quizzes')}
                    >
                      Practice Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
