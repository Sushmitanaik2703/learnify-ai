import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Award,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateQuiz } from '../api';

export default function QuizzesPage() {
  const { topics, notes, recordQuizAttempt, settings, setCurrentPage } = useApp();

  // Setup options
  const [selectedTopic, setSelectedTopic] = useState(topics.length > 0 ? topics[0].title : '');
  const [difficulty, setDifficulty] = useState(settings.defaultDifficulty || 'medium');
  const [numQuestions, setNumQuestions] = useState(settings.defaultQuestions || 5);

  // Quiz Engine State
  const [quizState, setQuizState] = useState('SETUP'); // 'SETUP', 'LOADING', 'ACTIVE', 'SUBMITTED'
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { 0: option_index, 1: option_index }
  const [quizError, setQuizError] = useState(null);

  // Handle generating quiz
  const handleStartQuiz = async () => {
    setQuizState('LOADING');
    setQuizError(null);
    setUserAnswers({});
    setCurrentQIndex(0);

    // Get note context if applicable
    const activeNoteContent = notes.length > 0 ? notes[0].content : '';

    try {
      const qList = await generateQuiz(selectedTopic, difficulty, numQuestions, activeNoteContent);
      if (!qList || qList.length === 0) {
        throw new Error('No quiz questions returned from backend generator.');
      }
      setQuestions(qList);
      setQuizState('ACTIVE');
    } catch (err) {
      setQuizError(err.message || 'Failed to generate quiz.');
      setQuizState('SETUP');
    }
  };

  const handleSelectAnswer = (optionIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optionIdx
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_answer_index) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);

    // Record in global app context
    recordQuizAttempt({
      topic: selectedTopic || 'General Quiz',
      score: correctCount,
      total_questions: questions.length,
      percentage,
      difficulty
    });

    setQuizState('SUBMITTED');
  };

  const calculateScore = () => {
    let count = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_answer_index) count += 1;
    });
    const percentage = Math.round((count / questions.length) * 100);
    return { score: count, total: questions.length, percentage };
  };

  return (
    <div className="quizzes-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">AI Quiz & Knowledge Assessment</h2>
          <p className="page-subtitle">Test your understanding with note-grounded multiple-choice questions.</p>
        </div>
      </div>

      {/* QUIZ SETUP VIEW */}
      {quizState === 'SETUP' && (
        <div className="glass-card" style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="card-header">
            <div className="card-icon">
              <Sparkles size={20} />
            </div>
            <h3 className="card-title">Configure Quiz Assessment</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1.5rem 0' }}>
            {/* Topic Select */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Select Study Topic
              </label>
              <select
                className="select-input"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="">All Topics (General Revision)</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.title}>{t.title}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Select */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Select Difficulty Level
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {['easy', 'medium', 'hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    className={`level-choice-btn ${difficulty === diff ? 'active' : ''}`}
                    onClick={() => setDifficulty(diff)}
                  >
                    {diff.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Number of Questions
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`level-choice-btn ${numQuestions === num ? 'active' : ''}`}
                    onClick={() => setNumQuestions(num)}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={handleStartQuiz}>
            <Sparkles size={18} />
            <span>Generate & Start Quiz</span>
          </button>

          {quizError && (
            <div className="alert-box error" style={{ marginTop: '1rem' }}>
              <AlertCircle size={18} />
              <div>{quizError}</div>
            </div>
          )}
        </div>
      )}

      {/* LOADING STATE */}
      {quizState === 'LOADING' && (
        <div className="glass-card" style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ width: 36, height: 36, margin: '0 auto 1.25rem auto' }}></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Generating Questions for {selectedTopic || 'Selected Material'}...
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Analyzing note text and building multi-choice assessment options...
          </p>
        </div>
      )}

      {/* ACTIVE QUIZ ENGINE VIEW */}
      {quizState === 'ACTIVE' && questions.length > 0 && (
        <div className="quiz-container">
          {/* Progress Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Question {currentQIndex + 1} of {questions.length}
            </span>
            <span className={`difficulty-pill ${questions[currentQIndex]?.difficulty?.toLowerCase()}`}>
              {questions[currentQIndex]?.difficulty || difficulty}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar-bg" style={{ marginBottom: '2rem' }}>
            <div 
              className="progress-bar-fill" 
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Card */}
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="quiz-question-title">
              {questions[currentQIndex].question}
            </h3>

            <div className="quiz-options-group">
              {questions[currentQIndex].options.map((option, oIdx) => {
                const isSelected = userAnswers[currentQIndex] === oIdx;
                const optionLetters = ['A', 'B', 'C', 'D'];
                return (
                  <button
                    key={oIdx}
                    className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectAnswer(oIdx)}
                  >
                    <span className="option-letter">{optionLetters[oIdx]}</span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn-secondary-nav"
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
            >
              <ArrowLeft size={16} /> Previous
            </button>

            {currentQIndex < questions.length - 1 ? (
              <button
                className="btn-primary"
                style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
                onClick={() => setCurrentQIndex((prev) => prev + 1)}
              >
                <span>Next Question</span> <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn-primary"
                style={{ width: 'auto', padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, var(--accent-emerald), var(--primary))' }}
                disabled={Object.keys(userAnswers).length < questions.length}
                onClick={handleSubmitQuiz}
              >
                <CheckCircle2 size={18} />
                <span>Submit Answers</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ RESULTS VIEW */}
      {quizState === 'SUBMITTED' && (
        <div className="quiz-results-wrapper">
          {(() => {
            const { score, total, percentage } = calculateScore();
            return (
              <div>
                <div className="glass-card" style={{ textAlign: 'center', marginBottom: '2rem', padding: '2.5rem' }}>
                  <Award size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Quiz Results Summary
                  </h3>
                  <div className="score-badge-circle">
                    {percentage}%
                  </div>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: '1rem 0 0.5rem 0' }}>
                    You scored {score} out of {total} correct!
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {percentage >= 80 ? '🎉 Excellent performance! Topic mastered.' : percentage >= 60 ? '👍 Good job! Review incorrect answers below to improve.' : '📖 Consider revisiting topic explanations before retrying.'}
                  </p>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setQuizState('SETUP')}>
                      <RotateCcw size={16} /> Retry / New Quiz
                    </button>
                    <button 
                      className="btn-secondary-nav"
                      onClick={() => setCurrentPage('progress')}
                    >
                      View Progress →
                    </button>
                  </div>
                </div>

                {/* Detailed Answers Review */}
                <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>
                  Detailed Question Breakdown
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {questions.map((q, idx) => {
                    const userSel = userAnswers[idx];
                    const isCorrect = userSel === q.correct_answer_index;
                    return (
                      <div key={idx} className={`glass-card answer-review-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                            Q{idx + 1}. {q.question}
                          </span>
                          <span className={`review-badge ${isCorrect ? 'pass' : 'fail'}`}>
                            {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                          </span>
                        </div>

                        <div className="quiz-options-group" style={{ pointerEvents: 'none' }}>
                          {q.options.map((opt, oIdx) => {
                            let statusClass = '';
                            if (oIdx === q.correct_answer_index) statusClass = 'correct-choice';
                            else if (oIdx === userSel && !isCorrect) statusClass = 'wrong-choice';

                            return (
                              <div key={oIdx} className={`review-option-item ${statusClass}`}>
                                <span>{['A', 'B', 'C', 'D'][oIdx]}. {opt}</span>
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="explanation-box" style={{ marginTop: '0.85rem' }}>
                            <strong>AI Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

