import React, { useState } from 'react';
import { 
  Flame, 
  Calendar as CalendarIcon, 
  Target, 
  Award, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StreakPage() {
  const { streakData, updateStreakGoal, setCurrentPage } = useApp();
  const [goalInput, setGoalInput] = useState(streakData.dailyGoalMinutes || 30);
  const [savedMsg, setSavedMsg] = useState(null);

  const handleSaveGoal = (e) => {
    e.preventDefault();
    updateStreakGoal(goalInput);
    setSavedMsg('Daily streak goal updated!');
    setTimeout(() => setSavedMsg(null), 3000);
  };

  // Generate calendar grid for current month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const activeDates = streakData.activeDates || {};

  return (
    <div className="streak-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Daily Study Streak & Activity Calendar</h2>
          <p className="page-subtitle">Build consistent study habits by completing daily quizzes, flashcards, or planner tasks.</p>
        </div>
      </div>

      {/* Streak Hero Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), var(--bg-card))', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#F59E0B' }}>
            <Flame size={42} style={{ margin: 'auto' }} />
          </div>

          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F59E0B', lineHeight: 1.1 }}>
              {streakData.currentStreak || 1} Day Active Streak 🔥
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Longest Streak: <strong>{streakData.longestStreak || 1} days</strong> • Total Active Days: <strong>{streakData.totalActiveDays || 1} days</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Grid & Goal Settings */}
      <div className="content-split-grid">
        {/* Left Column: Calendar Visualization */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={18} color="var(--primary)" />
              {monthNames[month]} {year} Activity
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🔥 = Active Study Day
            </span>
          </div>

          {/* Days of week header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', textTransform: 'center', textAlign: 'center', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: 42, background: 'transparent' }} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(year, month, dayNum);
              const dateStr = dateObj.toISOString().split('T')[0];
              const isActive = !!activeDates[dateStr];
              const isToday = dayNum === today.getDate();

              return (
                <div
                  key={dayNum}
                  style={{
                    height: 42,
                    borderRadius: 10,
                    background: isActive ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-input)',
                    border: isToday ? '2px solid var(--primary)' : isActive ? '1px solid #F59E0B' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: isToday ? 800 : 500,
                    fontSize: '0.85rem',
                    color: isActive ? '#F59E0B' : 'var(--text-main)',
                    position: 'relative'
                  }}
                >
                  <span>{dayNum}</span>
                  {isActive && <span style={{ fontSize: '0.65rem' }}>🔥</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Goal Settings & Activity Triggers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Daily Goal Settings */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--accent-emerald)" />
              Daily Study Goal Settings
            </h3>

            {savedMsg && (
              <div className="alert-box success" style={{ marginBottom: '1rem' }}>
                <CheckCircle2 size={16} />
                <div>{savedMsg}</div>
              </div>
            )}

            <form onSubmit={handleSaveGoal}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Target Daily Study Time (Minutes)
                </label>
                <select
                  className="select-input"
                  value={goalInput}
                  onChange={(e) => setGoalInput(parseInt(e.target.value, 10))}
                >
                  <option value="15">15 Minutes / day (Casual)</option>
                  <option value="30">30 Minutes / day (Regular)</option>
                  <option value="45">45 Minutes / day (Focused)</option>
                  <option value="60">60 Minutes / day (Intensive)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary">
                <CheckCircle2 size={16} /> Save Daily Goal
              </button>
            </form>
          </div>

          {/* Activity Actions to maintain streak */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" />
              Qualifying Streak Activities
            </h3>
            <p className="card-description" style={{ marginBottom: '1rem' }}>
              Perform any of these actual learning tasks to automatically increment your streak counter:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div className="quick-action-item" onClick={() => setCurrentPage('quizzes')}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Complete an AI Quiz</span>
              </div>

              <div className="quick-action-item" onClick={() => setCurrentPage('flashcards')}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Review Flashcard Deck</span>
              </div>

              <div className="quick-action-item" onClick={() => setCurrentPage('topics')}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mark Concept as Studied</span>
              </div>

              <div className="quick-action-item" onClick={() => setCurrentPage('planner')}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Check off Study Planner Task</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
