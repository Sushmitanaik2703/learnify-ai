import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { uploadNotes, extractTopics } from '../api';

export default function NotesPage() {
  const { notes, addNote, deleteNote, addTopics, setCurrentPage } = useApp();

  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'paste'
  const [selectedFile, setSelectedFile] = useState(null);
  const [pasteText, setPasteText] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState('ALL'); // ALL, PDF, TXT

  // Note Viewer Modal state
  const [viewingNote, setViewingNote] = useState(null);
  const [isExtractingTopics, setIsExtractingTopics] = useState(false);
  const [extractMsg, setExtractMsg] = useState(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (activeTab === 'paste') {
      if (!pasteText.trim()) {
        setUploadError('Please enter note text first.');
        return;
      }
      setUploadError(null);
      const created = addNote({
        filename: `Pasted_Notes_${new Date().toLocaleTimeString().replace(/:/g, '-')}.txt`,
        file_type: 'TXT',
        content: pasteText.trim(),
        char_count: pasteText.trim().length
      });
      setUploadSuccess(`Note text saved! (${created.char_count} characters)`);
      setPasteText('');
      return;
    }

    if (!selectedFile) {
      setUploadError('Please select a PDF or TXT file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const data = await uploadNotes(selectedFile);
      const created = addNote({
        filename: data.filename,
        file_type: data.file_type,
        content: data.content,
        char_count: data.char_count
      });

      // Automatically extract topics for newly uploaded note!
      try {
        const topicsList = await extractTopics(data.content);
        addTopics(topicsList, created.id);
        setUploadSuccess(`Uploaded "${data.filename}" and extracted ${topicsList.length} topics!`);
      } catch (tErr) {
        setUploadSuccess(`Uploaded "${data.filename}" successfully!`);
      }

      setSelectedFile(null);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExtractForExistingNote = async (note) => {
    setIsExtractingTopics(true);
    setExtractMsg(null);
    try {
      const list = await extractTopics(note.content);
      addTopics(list, note.id);
      setExtractMsg(`Extracted ${list.length} new topics!`);
    } catch (err) {
      setExtractMsg(`Extraction error: ${err.message}`);
    } finally {
      setIsExtractingTopics(false);
    }
  };

  // Filtered notes list
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = formatFilter === 'ALL' || n.file_type === formatFilter;
    return matchesSearch && matchesFormat;
  });

  return (
    <div className="notes-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Study Notes & Material Management</h2>
          <p className="page-subtitle">Upload lecture PDFs, text documents, or paste notes for AI concept extraction.</p>
        </div>
      </div>

      {/* Upload Box Card */}
      <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div className="card-icon">
            <UploadCloud size={20} />
          </div>
          <h3 className="card-title">Upload New Material</h3>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveTab('file')}
            className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
          >
            📄 PDF / TXT File Upload
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`tab-btn ${activeTab === 'paste' ? 'active' : ''}`}
          >
            ✍️ Paste Text Directly
          </button>
        </div>

        {activeTab === 'file' ? (
          <div>
            <div 
              className="dropzone"
              onClick={() => document.getElementById('notes-file-input').click()}
            >
              <UploadCloud size={36} className="dropzone-icon" />
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                {selectedFile ? selectedFile.name : 'Choose a file or drag it here'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Supported formats: PDF (.pdf) or Plain Text (.txt)
              </p>
              <input 
                id="notes-file-input"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        ) : (
          <textarea
            className="text-area-input"
            placeholder="Paste your study notes here..."
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />
        )}

        <button 
          className="btn-primary"
          onClick={handleUploadSubmit}
          disabled={isUploading || (activeTab === 'file' && !selectedFile)}
        >
          {isUploading ? (
            <>
              <span className="spinner"></span>
              <span>Processing Document & Extracting Text...</span>
            </>
          ) : (
            <>
              <Zap size={18} />
              <span>{activeTab === 'file' ? 'Upload & Extract Topics' : 'Save Notes & Extract'}</span>
            </>
          )}
        </button>

        {uploadSuccess && (
          <div className="alert-box success">
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <div>{uploadSuccess}</div>
          </div>
        )}

        {uploadError && (
          <div className="alert-box error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{uploadError}</div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="notes-filter-bar">
        <div className="search-box-wrapper">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Filter files by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Filter size={16} color="var(--text-muted)" />
          <button
            className={`filter-pill ${formatFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFormatFilter('ALL')}
          >
            All ({notes.length})
          </button>
          <button
            className={`filter-pill ${formatFilter === 'PDF' ? 'active' : ''}`}
            onClick={() => setFormatFilter('PDF')}
          >
            PDF ({notes.filter((n) => n.file_type === 'PDF').length})
          </button>
          <button
            className={`filter-pill ${formatFilter === 'TXT' ? 'active' : ''}`}
            onClick={() => setFormatFilter('TXT')}
          >
            TXT ({notes.filter((n) => n.file_type === 'TXT').length})
          </button>
        </div>
      </div>

      {/* Uploaded Notes Table / List */}
      {filteredNotes.length === 0 ? (
        <div className="empty-state">
          <FileText size={40} className="empty-icon" />
          <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>No study materials found</h4>
          <p style={{ fontSize: '0.85rem' }}>Upload a file above or clear search filters to view files.</p>
        </div>
      ) : (
        <div className="notes-list-container">
          {filteredNotes.map((note) => (
            <div key={note.id} className="note-item-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className={`file-type-icon ${note.file_type.toLowerCase()}`}>
                  {note.file_type}
                </div>
                <div>
                  <h4 className="note-title">{note.filename}</h4>
                  <p className="note-meta-text">
                    Uploaded: {note.created_at} • {note.char_count} characters • {note.topics_count} topics extracted
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-icon-secondary"
                  onClick={() => setViewingNote(note)}
                  title="View Content & Topics"
                >
                  <Eye size={16} />
                  <span>View</span>
                </button>
                <button
                  className="btn-icon-danger"
                  onClick={() => {
                    if (window.confirm(`Delete "${note.filename}"?`)) {
                      deleteNote(note.id);
                    }
                  }}
                  title="Delete File"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Content Viewer Modal */}
      {viewingNote && (
        <div className="modal-backdrop" onClick={() => setViewingNote(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={22} color="var(--primary)" />
                <div>
                  <h3 className="modal-title">{viewingNote.filename}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {viewingNote.file_type} • {viewingNote.char_count} characters
                  </span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setViewingNote(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Extracted Text Content:
              </h4>
              <div className="note-text-preview-box">
                {viewingNote.content}
              </div>

              {extractMsg && (
                <div className="alert-box success" style={{ marginTop: '1rem' }}>
                  <CheckCircle2 size={16} />
                  <div>{extractMsg}</div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => handleExtractForExistingNote(viewingNote)}
                disabled={isExtractingTopics}
                style={{ width: 'auto' }}
              >
                {isExtractingTopics ? (
                  <>
                    <span className="spinner"></span>
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Extract AI Topics</span>
                  </>
                )}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setViewingNote(null);
                  setCurrentPage('topics');
                }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View All Topics →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
