import React from 'react';
import { Trash2, Edit } from 'lucide-react';

export default function SubjectRow({
  subject,
  notesCount,
  topicsCount,
  quizzesCount,
  progress,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="subject-row"
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '0.85rem',
        gap: '0.5rem',
        background: 'var(--bg-card)',
        cursor: 'pointer',
      }}
      onClick={onSelect}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{subject.name}</h4>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button
            type="button"
            className="btn-icon-secondary"
            style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit Subject"
          >
            <Edit size={14} />
          </button>
          <button
            type="button"
            className="btn-icon-danger"
            style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete Subject"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
        {subject.description || 'No description provided.'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-bar-bg" style={{ height: '8px' }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%`, background: subject.color || 'var(--primary)' }}
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.3rem',
          textAlign: 'center',
        }}
      >
        <div className="mini-status-box" style={{ padding: '0.3rem' }}>
          <span className="mini-box-val">{notesCount}</span>
          <span className="mini-box-lbl">Files</span>
        </div>
        <div className="mini-status-box" style={{ padding: '0.3rem' }}>
          <span className="mini-box-val">{topicsCount}</span>
          <span className="mini-box-lbl">Concepts</span>
        </div>
        <div className="mini-status-box" style={{ padding: '0.3rem' }}>
          <span className="mini-box-val">{quizzesCount}</span>
          <span className="mini-box-lbl">Quizzes</span>
        </div>
      </div>
    </div>
  );
}
