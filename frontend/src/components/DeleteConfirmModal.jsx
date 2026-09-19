import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, RefreshCw } from 'lucide-react';

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemType = 'Item', // 'Subject' or 'Study Material'
  itemName = '', 
  detailsCount = {} 
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onConfirm();
      setIsDeleting(false);
      onClose();
    } catch (err) {
      setDeleteError(err.message || `Failed to delete ${itemType.toLowerCase()}.`);
      setIsDeleting(false);
    }
  };

  const isSubject = itemType === 'Subject';

  return (
    <div className="modal-backdrop" onClick={() => !isDeleting && onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="modal-header" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="card-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-rose)' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="modal-title" style={{ color: 'var(--accent-rose)' }}>
                Delete {itemType}?
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                This action cannot be undone.
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={isDeleting}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1rem 0' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
            Are you sure you want to delete <strong>"{itemName}"</strong>?
          </p>

          {isSubject ? (
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.85rem', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--accent-rose)' }}>Warning: Deleting this subject will also delete:</strong>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
                <li>{detailsCount.materials || 0} associated study material files</li>
                <li>{detailsCount.concepts || 0} extracted concepts</li>
                <li>Associated quiz attempts and flashcard decks</li>
                <li>Subject-level progress statistics</li>
              </ul>
            </div>
          ) : (
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.85rem', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--accent-rose)' }}>Warning:</strong> Deleting this study material will remove its extracted concepts and content belonging exclusively to this file. The parent subject will remain intact.
            </div>
          )}

          {deleteError && (
            <div className="alert-box error" style={{ marginTop: '1rem' }}>
              <AlertTriangle size={16} />
              <div>{deleteError}</div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn-secondary-nav" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn-icon-danger" 
            onClick={handleConfirmClick}
            disabled={isDeleting}
            style={{ width: 'auto', padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          >
            {isDeleting ? (
              <>
                <span className="spinner"></span>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
