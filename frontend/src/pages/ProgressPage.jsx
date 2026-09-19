import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  HelpCircle, 
  Layers, 
  AlertTriangle,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProgressPage() {
  const { topics, quizzes, flashcards, setCurrentPage } = useApp();

  const completedTopics = topics.filter((t) => t.status === 'Completed');
  const inProgressTopics = topics.filter((t) => t.status === 'In Progress');
  const notStartedTopics = topics.filter((t) => t.status === 'Not Started' || !t.status);

  const totalScore = quizzes.reduce((acc, q) => acc + q.percentage, 0);
  const avgAccuracy = quizzes.length > 0 ? Math.round(totalScore / quizzes.length) : 0;

  const reviewedCards = flashcards.filter((f) => f.reviewed);
  const difficultCards = flashcards.filter((f) => f.rating === 'Difficult');

  // Weak topics detection: topics with accuracy < 60% or marked not completed
  const weakTopicsList = topics.filter((t) => t.status !== 'Completed');

  return (
    <div className="progress-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Study Progress & Learning Analytics</h2>
          <p className="page-subtitle">Track your topic mastery, quiz history, and weak-area revision priority.</p>
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-value">{completedTopics.length} / {topics.length}</div>
            <div className="stat-label">Completed Topics ({topics.length > 0 ? Math.round((completedTopics.length / topics.length) * 100) : 0}%)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Award size={22} />
          </div>
          <div>
            <div className="stat-value">{avgAccuracy}%</div>
            <div className="stat-label">Average Quiz Accuracy ({quizzes.length} Quizzes)</div>
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
            <div className="stat-label">Cards Tagged Difficult</div>
          </div>
        </div>
      </div>

      <div className="content-split-grid">
        {/* Left Column: Quiz History */}
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

        {/* Right Column: Weak Topics Queue */}
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="var(--accent-amber)" />
            Weak Topic Revision Queue
          </h3>

          {weakTopicsList.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={36} className="empty-icon" color="var(--accent-emerald)" />
              <p>Great job! All extracted topics marked as completed.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {weakTopicsList.map((t) => (
                <div key={t.id} className="recommended-topic-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <h4 className="rec-topic-title">{t.title}</h4>
                    <span className="coming-soon-pill" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-rose)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                      Revise Priority
                    </span>
                  </div>
                  <p className="rec-topic-desc">{t.explanation}</p>
                  <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      className="rec-action-btn"
                      onClick={() => setCurrentPage('topics')}
                    >
                      <BookOpen size={12} /> Revise Topic
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
