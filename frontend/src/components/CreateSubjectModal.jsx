import React, { useState } from 'react';
import { BookOpen, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CreateSubjectModal({ isOpen, onClose, editingSubject = null }) {
  const { addSubject, updateSubject } = useApp();
  
  const [name, setName] = useState(editingSubject ? editingSubject.name : '');
  const [description, setDescription] = useState(editingSubject ? editingSubject.description : '');
  const [color, setColor] = useState(editingSubject ? editingSubject.color : '#6366F1');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a subject name.');
      return;
    }

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name: name.trim(),
        description: description.trim(),
        color
      });
    } else {
      addSubject({
        name: name.trim(),
        description: description.trim(),
        color
      });
    }

    setName('');
    setDescription('');
    setError(null);
    onClose();
  };

  const presetColors = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="card-icon" style={{ background: color + '22', color }}>
              <BookOpen size={20} />
            </div>
            <h3 className="modal-title">{editingSubject ? 'Edit Subject' : 'Create New Subject'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div className="alert-box error" style={{ margin: 0 }}>
                <div>{error}</div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Subject Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <input
                type="text"
                className="select-input"
                placeholder="e.g. Computer Networks, DBMS, Operating Systems"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Subject Description (Optional)
              </label>
              <textarea
                className="text-area-input"
                placeholder="Short description of topics covered, syllabus scope, or exam notes..."
                style={{ minHeight: 80 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Subject Color Tag
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: c,
                      border: color === c ? '3px solid var(--text-main)' : 'none',
                      cursor: 'pointer',
                      boxShadow: color === c ? '0 0 10px ' + c : 'none'
                    }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary-nav" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
              <Sparkles size={16} />
              <span>{editingSubject ? 'Save Changes' : 'Create Subject'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
