import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Filter,
  BookOpen,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateFlashcards } from '../api';

export default function FlashcardsPage() {
  const { flashcards, subjects, notes, topics, updateCardRating, addFlashcards } = useApp();

  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' or 'REVISION'
  const [selectedSubjectId, setSelectedSubjectId] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState(null);

  // Filter flashcards by subject and mode
  const activeDeck = flashcards.filter((card) => {
    const matchesSubject = selectedSubjectId === 'ALL' || card.subject_id === selectedSubjectId;
    if (filterMode === 'REVISION') {
      return matchesSubject && (card.rating === 'Difficult' || card.rating === 'Medium');
    }
    return matchesSubject;
  });

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % (activeDeck.length || 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % (activeDeck.length || 1));
  };

  const handleRating = (rating) => {
    if (activeDeck[currentIndex]) {
      updateCardRating(activeDeck[currentIndex].id, rating);
      handleNext();
    }
  };

  const handleGenerateDeck = async () => {
    setIsGenerating(true);
    setGenMsg(null);
    const targetSubject = subjects.find(s => s.id === selectedSubjectId);
    const subjName = targetSubject ? targetSubject.name : 'General';
    const subjNotes = notes.filter(n => selectedSubjectId === 'ALL' || n.subject_id === selectedSubjectId);
    const textContent = subjNotes.map(n => n.content).join('\n\n');

    try {
      const newCards = await generateFlashcards(subjName, textContent);
      addFlashcards(newCards, selectedSubjectId !== 'ALL' ? selectedSubjectId : subjects[0]?.id);
      setGenMsg(`Generated ${newCards.length} new flashcards!`);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setGenMsg(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentCard = activeDeck[currentIndex];

  return (
    <div className="flashcards-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Interactive AI Flashcard Decks</h2>
          <p className="page-subtitle">Master key subject terms and definitions using active recall flip-cards.</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="notes-filter-bar" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Mode:
          </span>
          <button
            className={`filter-pill ${filterMode === 'ALL' ? 'active' : ''}`}
            onClick={() => {
              setFilterMode('ALL');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
          >
            All Cards ({flashcards.length})
          </button>
          <button
            className={`filter-pill ${filterMode === 'REVISION' ? 'active' : ''}`}
            onClick={() => {
              setFilterMode('REVISION');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
          >
            🔥 Revision Mode (Difficult)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            className="select-input"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            onClick={handleGenerateDeck}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>+ AI Deck</span>
              </>
            )}
          </button>
        </div>
      </div>

      {genMsg && (
        <div className="alert-box success" style={{ marginBottom: '1.5rem', maxWidth: 600, margin: '0 auto 1.5rem auto' }}>
          <CheckCircle2 size={16} />
          <div>{genMsg}</div>
        </div>
      )}

      {/* FLASHCARD DECK DISPLAY */}
      {!currentCard || activeDeck.length === 0 ? (
        <div className="empty-state" style={{ maxWidth: 600, margin: '2rem auto' }}>
          <Layers size={40} className="empty-icon" />
          <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Flashcards in Deck</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {filterMode === 'REVISION'
              ? 'No cards marked as Difficult or Medium yet. Switch to All Cards mode!'
              : 'Click "+ AI Deck" above to generate flashcards from your uploaded study notes.'}
          </p>
          <button className="btn-primary" style={{ width: 'auto', margin: '0 auto' }} onClick={handleGenerateDeck}>
            <Sparkles size={16} /> Generate Flashcards Now
          </button>
        </div>
      ) : (
        <div className="flashcard-deck-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 540, margin: '0 auto 1rem auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Card {currentIndex + 1} of {activeDeck.length}
            </span>
            <span className={`difficulty-pill ${currentCard.difficulty?.toLowerCase()}`}>
              {currentCard.difficulty}
            </span>
          </div>

          {/* 3D Flip Card Container */}
          <div className="flip-card-container" onClick={handleFlip}>
            <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
              {/* Front of Card */}
              <div className="flip-card-front">
                <span className="card-side-tag">QUESTION / TERM</span>
                <h3 className="card-question-text">{currentCard.front}</h3>
                <div className="flip-prompt">
                  <RotateCw size={14} /> Click to reveal answer
                </div>
              </div>

              {/* Back of Card */}
              <div className="flip-card-back">
                <span className="card-side-tag">ANSWER / EXPLANATION</span>
                <p className="card-answer-text">{currentCard.back}</p>
                <div className="flip-prompt">
                  <RotateCw size={14} /> Click to flip back
                </div>
              </div>
            </div>
          </div>

          {/* Controls & Rating Bar */}
          <div className="flashcard-controls-bar">
            <button className="btn-secondary-nav" onClick={handlePrev}>
              <ArrowLeft size={16} /> Prev
            </button>

            {/* Self-Rating Buttons */}
            <div className="rating-btn-group">
              <button
                className="rating-btn easy"
                onClick={() => handleRating('Easy')}
                title="Mark Easy"
              >
                😊 Easy
              </button>
              <button
                className="rating-btn medium"
                onClick={() => handleRating('Medium')}
                title="Mark Medium"
              >
                🤔 Medium
              </button>
              <button
                className="rating-btn difficult"
                onClick={() => handleRating('Difficult')}
                title="Mark Difficult"
              >
                😓 Difficult
              </button>
            </div>

            <button className="btn-secondary-nav" onClick={handleNext}>
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
