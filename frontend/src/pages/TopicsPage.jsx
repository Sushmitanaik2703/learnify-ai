import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  HelpCircle,
  Layers,
  X,
  Zap,
  Lightbulb,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateExplanation } from '../api';

export default function TopicsPage() {
  const { topics, subjects, updateTopicStatus, searchQuery, setCurrentPage } = useApp();

  // Filters
  const [localSearch, setLocalSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Explain with AI Modal State
  const [activeExplainTopic, setActiveExplainTopic] = useState(null);
  const [explainLevel, setExplainLevel] = useState('Intermediate');
  const [isGeneratingExplain, setIsGeneratingExplain] = useState(false);
  const [explanationResult, setExplanationResult] = useState(null);
  const [explainError, setExplainError] = useState(null);

  const query = (localSearch || searchQuery).toLowerCase();

  const filteredTopics = topics.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(query) || 
                          t.explanation.toLowerCase().includes(query) ||
                          (t.keywords || []).some(k => k.toLowerCase().includes(query));
    
    const matchesSubject = subjectFilter === 'ALL' || t.subject_id === subjectFilter;
    const matchesDiff = difficultyFilter === 'ALL' || t.difficulty?.toUpperCase() === difficultyFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesSubject && matchesDiff && matchesStatus;
  });

  const handleOpenExplainModal = async (topic) => {
    setActiveExplainTopic(topic);
    setExplainLevel('Intermediate');
    setExplainError(null);
    setIsGeneratingExplain(true);

    try {
      const res = await generateExplanation(topic.title, 'Intermediate');
      setExplanationResult(res);
    } catch (err) {
      setExplainError(err.message || 'Failed to generate explanation.');
    } finally {
      setIsGeneratingExplain(false);
    }
  };

  const handleChangeExplainLevel = async (newLevel) => {
    setExplainLevel(newLevel);
    if (!activeExplainTopic) return;
    
    setIsGeneratingExplain(true);
    setExplainError(null);

    try {
      const res = await generateExplanation(activeExplainTopic.title, newLevel);
      setExplanationResult(res);
    } catch (err) {
      setExplainError(err.message || 'Failed to update explanation level.');
    } finally {
      setIsGeneratingExplain(false);
    }
  };

  return (
    <div className="topics-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Important Concepts & Study Summaries</h2>
          <p className="page-subtitle">Review filtered core concepts extracted directly from your subject study material.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="notes-filter-bar" style={{ marginBottom: '2rem' }}>
        <div className="search-box-wrapper">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search concepts by title, summary, or keywords..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="select-input"
            style={{ width: 'auto', fontSize: '0.8rem' }}
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="ALL">All Subjects ({topics.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Filter size={14} /> Diff:
          </span>
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((d) => (
            <button
              key={d}
              className={`filter-pill ${difficultyFilter === d ? 'active' : ''}`}
              onClick={() => setDifficultyFilter(d)}
            >
              {d}
            </button>
          ))}

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Status:</span>
          {['ALL', 'Not Started', 'In Progress', 'Completed'].map((s) => (
            <button
              key={s}
              className={`filter-pill ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Concepts Grid */}
      {filteredTopics.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={40} className="empty-icon" />
          <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>No concepts match your criteria</h4>
          <p style={{ fontSize: '0.85rem' }}>Upload study notes to extract concepts or adjust search filters.</p>
        </div>
      ) : (
        <div className="topics-list-grid">
          {filteredTopics.map((topic) => {
            const conceptSubject = subjects.find(s => s.id === topic.subject_id);
            return (
              <div key={topic.id} className="topic-main-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`difficulty-pill ${topic.difficulty?.toLowerCase()}`}>
                        {topic.difficulty}
                      </span>
                      <span className={`status-tag ${topic.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {topic.status}
                      </span>
                    </div>
                    {topic.source_ref && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {topic.source_ref}
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem', display: 'block' }}>
                    Subject: {conceptSubject ? conceptSubject.name : 'General'}
                  </span>

                  <h3 className="topic-card-title">{topic.title}</h3>
                  <p className="topic-card-explanation">{topic.explanation}</p>

                  {topic.keywords && topic.keywords.length > 0 && (
                    <div className="keywords-group" style={{ marginBottom: '1.25rem' }}>
                      {topic.keywords.map((kw, idx) => (
                        <span key={idx} className="keyword-tag">#{kw}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Concept-Level Actions */}
                <div className="topic-card-footer" style={{ flexDirection: 'column', gap: '0.6rem', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className="btn-explain-ai"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => handleOpenExplainModal(topic)}
                    >
                      <Sparkles size={14} /> Explain
                    </button>
                    <button
                      className="btn-secondary-nav"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                      onClick={() => setCurrentPage('quizzes')}
                    >
                      <HelpCircle size={14} color="var(--primary)" /> Concept Quiz
                    </button>
                    <button
                      className="btn-secondary-nav"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                      onClick={() => setCurrentPage('flashcards')}
                    >
                      <Layers size={14} color="var(--secondary)" /> Flashcards
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
                    <span>{topic.status === 'Completed' ? 'Studied & Completed' : 'Mark as Studied'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EXPLAIN WITH AI MODAL */}
      {activeExplainTopic && (
        <div className="modal-backdrop" onClick={() => setActiveExplainTopic(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="card-icon" style={{ background: 'rgba(99,102,241,0.2)' }}>
                  <Sparkles size={20} color="var(--primary)" />
                </div>
                <div>
                  <h3 className="modal-title">AI Concept Breakdown</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Concept: <strong>{activeExplainTopic.title}</strong>
                  </p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveExplainTopic(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Level Selector Tabs */}
            <div className="explain-level-tabs">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  className={`level-tab-btn ${explainLevel === lvl ? 'active' : ''}`}
                  onClick={() => handleChangeExplainLevel(lvl)}
                >
                  {lvl} Level
                </button>
              ))}
            </div>

            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {isGeneratingExplain ? (
                <div className="empty-state" style={{ padding: '3rem 1rem' }}>
                  <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 1rem auto' }}></div>
                  <p>Generating {explainLevel}-level AI explanation for <strong>{activeExplainTopic.title}</strong>...</p>
                </div>
              ) : explainError ? (
                <div className="alert-box error">
                  <AlertTriangle size={18} />
                  <div>{explainError}</div>
                </div>
              ) : explanationResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="explain-section-box">
                    <h4 className="explain-box-title" style={{ color: 'var(--accent-cyan)' }}>
                      <Zap size={16} /> Overview ({explanationResult.level} Level)
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                      {explanationResult.simple_explanation}
                    </p>
                  </div>

                  <div className="explain-section-box">
                    <h4 className="explain-box-title" style={{ color: 'var(--primary)' }}>
                      <BookOpen size={16} /> Detailed Concept Breakdown
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {explanationResult.detailed_explanation}
                    </p>
                  </div>

                  <div className="explain-section-box">
                    <h4 className="explain-box-title" style={{ color: 'var(--accent-emerald)' }}>
                      <Lightbulb size={16} /> Real-World Example & Analogy
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                      {explanationResult.real_world_example}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="explain-section-box">
                      <h4 className="explain-box-title" style={{ color: 'var(--accent-amber)' }}>
                        <CheckCircle2 size={16} /> Key Takeaways
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {(explanationResult.key_points || []).map((pt, i) => (
                          <li key={i} style={{ marginBottom: '0.4rem' }}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="explain-section-box">
                      <h4 className="explain-box-title" style={{ color: 'var(--accent-rose)' }}>
                        <AlertTriangle size={16} /> Common Misconceptions
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {(explanationResult.common_mistakes || []).map((m, i) => (
                          <li key={i} style={{ marginBottom: '0.4rem' }}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="explain-section-box" style={{ background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.3)' }}>
                    <h4 className="explain-box-title" style={{ color: '#A5B4FC' }}>
                      ⚡ Quick Revision Summary
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>
                      {explanationResult.revision_summary}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => {
                  setActiveExplainTopic(null);
                  setCurrentPage('quizzes');
                }}
                style={{ width: 'auto' }}
              >
                Start Concept Quiz →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
