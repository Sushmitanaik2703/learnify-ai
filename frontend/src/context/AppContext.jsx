import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Theme State (light, dark, system)
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('learnloop_theme') || 'dark';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('learnloop_theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // 2. Navigation Page State
  const [currentPage, setCurrentPage] = useState('dashboard');

  // 3. Global Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Notes List & Active Note
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('learnloop_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'note-demo-1',
        filename: 'Computer_Networks_Unit1.pdf',
        file_type: 'PDF',
        char_count: 3420,
        content: 'Computer Networks overview covering OSI Model 7 layers, TCP/IP protocol suite, packet switching vs circuit switching, and IP addressing concepts.',
        created_at: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
        topics_count: 4
      }
    ];
  });

  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    localStorage.setItem('learnloop_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (noteObj) => {
    const newNote = {
      id: `note-${Date.now()}`,
      created_at: new Date().toLocaleDateString(),
      topics_count: 0,
      ...noteObj
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNote(newNote);
    return newNote;
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
    }
  };

  // 5. Topics State
  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem('learnloop_topics');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'topic-1',
        title: 'OSI Model & Layered Architecture',
        explanation: 'The 7-layer reference model organizing network communication from physical signals to user applications.',
        keywords: ['Physical', 'DataLink', 'Transport', 'Application'],
        difficulty: 'Medium',
        status: 'Completed',
        note_id: 'note-demo-1'
      },
      {
        id: 'topic-2',
        title: 'TCP/IP Protocol Suite & Handshakes',
        explanation: 'Transmission Control Protocol 3-way handshake mechanism ensuring reliable end-to-end data delivery.',
        keywords: ['SYN', 'ACK', 'TCP', 'Reliable-Stream'],
        difficulty: 'Hard',
        status: 'In Progress',
        note_id: 'note-demo-1'
      },
      {
        id: 'topic-3',
        title: 'Packet Switching vs Circuit Switching',
        explanation: 'Compares dedicated link allocation against statistical multiplexing of data packets across routers.',
        keywords: ['Multiplexing', 'Bandwidth', 'Routing', 'Latency'],
        difficulty: 'Easy',
        status: 'Completed',
        note_id: 'note-demo-1'
      },
      {
        id: 'topic-4',
        title: 'IPv4 Subnetting & CIDR Addressing',
        explanation: 'Network address classification and subnet mask calculations for efficient IP assignment.',
        keywords: ['Subnet-Mask', 'CIDR', 'IP-Address', 'Prefix'],
        difficulty: 'Medium',
        status: 'Not Started',
        note_id: 'note-demo-1'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('learnloop_topics', JSON.stringify(topics));
  }, [topics]);

  const addTopics = (newTopicsList, noteId = null) => {
    const formatted = newTopicsList.map((t, idx) => ({
      id: `topic-${Date.now()}-${idx}`,
      title: t.title,
      explanation: t.explanation,
      keywords: t.keywords || ['concept', 'notes'],
      difficulty: t.difficulty || ['Easy', 'Medium', 'Hard'][idx % 3],
      status: 'Not Started',
      note_id: noteId
    }));
    setTopics((prev) => [...formatted, ...prev]);

    // Update note's topic count
    if (noteId) {
      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.id === noteId ? { ...n, topics_count: n.topics_count + formatted.length } : n
        )
      );
    }
  };

  const updateTopicStatus = (topicId, newStatus) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, status: newStatus } : t))
    );
  };

  // 6. Quiz Attempts History
  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('learnloop_quizzes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'quiz-1',
        topic: 'OSI Model & Layered Architecture',
        score: 4,
        total_questions: 5,
        percentage: 80,
        difficulty: 'medium',
        date: new Date(Date.now() - 86400000).toLocaleDateString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('learnloop_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  const recordQuizAttempt = (attempt) => {
    const newAttempt = {
      id: `quiz-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      ...attempt
    };
    setQuizzes((prev) => [newAttempt, ...prev]);
  };

  // 7. Flashcards State
  const [flashcards, setFlashcards] = useState(() => {
    const saved = localStorage.getItem('learnloop_flashcards');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'card-1',
        front: 'What are the 7 layers of the OSI Model from bottom to top?',
        back: '1. Physical, 2. Data Link, 3. Network, 4. Transport, 5. Session, 6. Presentation, 7. Application.',
        topic: 'OSI Model & Layered Architecture',
        difficulty: 'Medium',
        reviewed: true,
        rating: 'Medium'
      },
      {
        id: 'card-2',
        front: 'Explain the TCP 3-way handshake process.',
        back: 'Step 1: Client sends SYN. Step 2: Server responds with SYN-ACK. Step 3: Client sends ACK.',
        topic: 'TCP/IP Protocol Suite & Handshakes',
        difficulty: 'Hard',
        reviewed: true,
        rating: 'Difficult'
      },
      {
        id: 'card-3',
        front: 'What is the key advantage of Packet Switching over Circuit Switching?',
        back: 'Dynamic resource sharing via statistical multiplexing, leading to higher bandwidth efficiency.',
        topic: 'Packet Switching vs Circuit Switching',
        difficulty: 'Easy',
        reviewed: false,
        rating: null
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('learnloop_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const updateCardRating = (cardId, rating) => {
    setFlashcards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, rating, reviewed: true } : c))
    );
  };

  const addFlashcards = (newCards) => {
    const formatted = newCards.map((c, idx) => ({
      id: `card-${Date.now()}-${idx}`,
      front: c.front,
      back: c.back,
      topic: c.topic || 'General',
      difficulty: c.difficulty || 'Medium',
      reviewed: false,
      rating: null
    }));
    setFlashcards((prev) => [...formatted, ...prev]);
  };

  // 8. Application Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('learnloop_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return {}; }
    }
    return {
      defaultDifficulty: 'medium',
      defaultQuestions: 5,
      enableAnimations: true
    };
  });

  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('learnloop_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetAllProgress = () => {
    localStorage.removeItem('learnloop_notes');
    localStorage.removeItem('learnloop_topics');
    localStorage.removeItem('learnloop_quizzes');
    localStorage.removeItem('learnloop_flashcards');
    setNotes([]);
    setTopics([]);
    setQuizzes([]);
    setFlashcards([]);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        currentPage,
        setCurrentPage,
        searchQuery,
        setSearchQuery,
        notes,
        activeNote,
        setActiveNote,
        addNote,
        deleteNote,
        topics,
        addTopics,
        updateTopicStatus,
        quizzes,
        recordQuizAttempt,
        flashcards,
        updateCardRating,
        addFlashcards,
        settings,
        updateSettings,
        resetAllProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
