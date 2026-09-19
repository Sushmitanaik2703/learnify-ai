import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Coffee, 
  HelpCircle, 
  Layers,
  RotateCcw,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PlannerPage() {
  const {
    subjects,
    topics,
    studyPlan,
    saveGeneratedPlan,
    togglePlannerItem,
    setCurrentPage,
    generateDataDrivenPlan,
  } = useApp();

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(!studyPlan);

  // Planner Form Inputs
  const [availableTime, setAvailableTime] = useState(90);
  const [sessionLength, setSessionLength] = useState(25);
  const [academicCommitments, setAcademicCommitments] = useState('2 classes, 1 assignment deadline tomorrow');
  const [selectedSubjects, setSelectedSubjects] = useState(subjects.map(s => s.id));
  const [weakConcepts, setWeakConcepts] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleToggleSubject = (subId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  };

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    // Use the new data-driven planner engine from AppContext
    const plan = generateDataDrivenPlan(availableTime, selectedSubjects);
    // The function already updates state and stores the plan.
    setIsGenerating(false);
    setIsGeneratorOpen(false);
  };

  const completedCount = studyPlan ? studyPlan.sessions.filter(s => s.completed).length : 0;
  const totalCount = studyPlan ? studyPlan.sessions.length : 0;
  const planProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="planner-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">AI Daily Study Planner</h2>
          <p className="page-subtitle">Generate realistic time-blocked study schedules tailored to your available time and deadlines.</p>
        </div>
      </div>

      {/* PLANNER GENERATOR FORM MODAL / CARD */}
      {isGeneratorOpen ? (
        <div className="glass-card" style={{ maxWidth: 740, margin: '0 auto' }}>
          <div className="card-header">
            <div className="card-icon">
              <Sparkles size={20} />
            </div>
            <h3 className="card-title">Configure Today's Study Planner</h3>
          </div>

          <form onSubmit={handleGeneratePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1.5rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Available Study Time Today
                </label>
                <select
                  className="select-input"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(parseInt(e.target.value, 10))}
                >
                  <option value="45">45 Minutes (Short Session)</option>
                  <option value="60">60 Minutes (1 Hour)</option>
                  <option value="90">90 Minutes (1.5 Hours)</option>
                  <option value="120">120 Minutes (2 Hours)</option>
                  <option value="180">180 Minutes (3 Hours)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Preferred Study Session Duration
                </label>
                <select
                  className="select-input"
                  value={sessionLength}
                  onChange={(e) => setSessionLength(parseInt(e.target.value, 10))}
                >
                  <option value="20">20 Minutes (Quick Focus)</option>
                  <option value="25">25 Minutes (Standard Pomodoro)</option>
                  <option value="35">35 Minutes (Extended Focus)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Select Subjects to Include Today
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {subjects.map((sub) => {
                  const isSel = selectedSubjects.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      className={`filter-pill ${isSel ? 'active' : ''}`}
                      onClick={() => handleToggleSubject(sub.id)}
                    >
                      {isSel ? '✓ ' : ''}{sub.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Academic Commitments & Deadlines (Optional)
              </label>
              <input
                type="text"
                className="select-input"
                placeholder="e.g. 2 lecture classes, Assignment due tomorrow"
                value={academicCommitments}
                onChange={(e) => setAcademicCommitments(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <span className="spinner"></span>
                    <span>Generating Realistic Schedule...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Today's Study Plan</span>
                  </>
                )}
              </button>

              {studyPlan && (
                <button
                  type="button"
                  className="btn-secondary-nav"
                  onClick={() => setIsGeneratorOpen(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        /* TODAY'S PLAN DISPLAY */
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          {/* Header Card */}
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CalendarIcon size={20} color="var(--primary)" />
                  Today's AI Schedule ({studyPlan.availableMinutes} Mins Allocated)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Generated on {studyPlan.generatedAt} • Completed {completedCount} of {totalCount} tasks
                </p>
              </div>

              <button
                className="btn-secondary-nav"
                onClick={() => setIsGeneratorOpen(true)}
              >
                <RotateCcw size={16} /> Edit / Regenerate
              </button>
            </div>

            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Daily Schedule Completion</span>
                <span>{planProgress}%</span>
              </div>
              <div className="progress-bar-bg" style={{ height: 10 }}>
                <div className="progress-bar-fill" style={{ width: `${planProgress}%` }} />
              </div>
            </div>
          </div>

          {/* Time Blocked Tasks List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {studyPlan.sessions.map((item, idx) => {
              const isBreak = item.type === 'Break';
              return (
                <div 
                  key={item.id} 
                  className={`glass-card ${item.completed ? 'completed-task' : ''}`}
                  style={{
                    borderLeft: item.completed 
                      ? '5px solid var(--accent-emerald)' 
                      : isBreak 
                      ? '5px solid var(--accent-amber)' 
                      : '5px solid var(--primary)',
                    opacity: item.completed ? 0.75 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => togglePlannerItem(item.id)}
                        style={{ width: 20, height: 20, cursor: 'pointer', marginTop: 3 }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span className="file-type-badge" style={{ background: isBreak ? 'rgba(245,158,11,0.15)' : 'var(--primary-light)', color: isBreak ? '#F59E0B' : 'var(--primary)' }}>
                            {item.durationMinutes} Mins
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            {item.subject}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, textDecoration: item.completed ? 'line-through' : 'none' }}>
                          {item.concept}
                        </h4>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Rationale: {item.reason}
                        </p>
                      </div>
                    </div>

                    {!isBreak && (
                      <button
                        className="btn-icon-secondary"
                        onClick={() => {
                          if (item.type === 'Practice Quiz') setCurrentPage('quizzes');
                          else if (item.type === 'Flashcards Review') setCurrentPage('flashcards');
                          else setCurrentPage('topics');
                        }}
                      >
                        Start Task →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
