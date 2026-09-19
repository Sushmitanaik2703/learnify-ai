import React, { createContext, useContext, useState, useEffect } from 'react';
import { deleteNoteApi, deleteSubjectApi } from '../api';

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
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  // 3. Global Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Subjects State
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('learnloop_subjects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'subj-1',
        name: 'Computer Networks',
        description: 'OSI 7-layer architecture, TCP/IP protocol suite, IP addressing, and packet routing.',
        color: '#6366F1',
        created_at: new Date(Date.now() - 86400000 * 5).toLocaleDateString()
      },
      {
        id: 'subj-2',
        name: 'Database Management Systems',
        description: 'Relational model, SQL query optimization, ER diagrams, normalization, and ACID transactions.',
        color: '#8B5CF6',
        created_at: new Date(Date.now() - 86400000 * 3).toLocaleDateString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('learnloop_subjects', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (subjectObj) => {
    const newSubject = {
      id: `subj-${Date.now()}`,
      color: subjectObj.color || ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'][subjects.length % 5],
      created_at: new Date().toLocaleDateString(),
      ...subjectObj
    };
    setSubjects((prev) => [newSubject, ...prev]);
    return newSubject;
  };

  const updateSubject = (id, updatedFields) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteSubject = async (id) => {
    // 1. Backend API call
    await deleteSubjectApi(id);

    // 2. Local state & referential integrity update
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setNotes((prev) => prev.filter((n) => n.subject_id !== id));
    setTopics((prev) => prev.filter((t) => t.subject_id !== id));
    setQuizzes((prev) => prev.filter((q) => q.subject_id !== id));
    setFlashcards((prev) => prev.filter((c) => c.subject_id !== id));

    if (selectedSubjectId === id) {
      setSelectedSubjectId(null);
      setCurrentPage('dashboard');
    }
  };

  // 5. Notes List & Active Note
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('learnloop_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'note-demo-1',
        subject_id: 'subj-1',
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
    // Check for duplicate upload in same subject
    const isDuplicate = notes.some(
      (n) => n.subject_id === noteObj.subject_id && n.filename.toLowerCase() === noteObj.filename.toLowerCase()
    );
    if (isDuplicate) {
      throw new Error(`File "${noteObj.filename}" has already been uploaded to this subject.`);
    }

    const newNote = {
      id: `note-${Date.now()}`,
      subject_id: noteObj.subject_id || (subjects[0] ? subjects[0].id : 'subj-1'),
      created_at: new Date().toLocaleDateString(),
      topics_count: 0,
      ...noteObj
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNote(newNote);
    return newNote;
  };

  const deleteNote = async (id) => {
    // 1. Backend API call
    await deleteNoteApi(id);

    // 2. Local state & referential integrity update (Parent subject remains intact!)
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setTopics((prev) => prev.filter((t) => t.note_id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
    }
  };


  // 6. Topics State (Concepts)
  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem('learnloop_topics');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'topic-1',
        subject_id: 'subj-1',
        note_id: 'note-demo-1',
        title: 'OSI Model & Layered Architecture',
        explanation: 'The 7-layer reference model organizing network communication from physical signals to user applications.',
        keywords: ['Physical', 'DataLink', 'Transport', 'Application'],
        difficulty: 'Medium',
        status: 'Completed',
        source_ref: 'Unit 1 - Page 4'
      },
      {
        id: 'topic-2',
        subject_id: 'subj-1',
        note_id: 'note-demo-1',
        title: 'TCP/IP Protocol Suite & Handshakes',
        explanation: 'Transmission Control Protocol 3-way handshake mechanism ensuring reliable end-to-end data delivery.',
        keywords: ['SYN', 'ACK', 'TCP', 'Reliable-Stream'],
        difficulty: 'Hard',
        status: 'In Progress',
        source_ref: 'Unit 1 - Page 12'
      },
      {
        id: 'topic-3',
        subject_id: 'subj-1',
        note_id: 'note-demo-1',
        title: 'Packet Switching vs Circuit Switching',
        explanation: 'Compares dedicated link allocation against statistical multiplexing of data packets across routers.',
        keywords: ['Multiplexing', 'Bandwidth', 'Routing', 'Latency'],
        difficulty: 'Easy',
        status: 'Completed',
        source_ref: 'Unit 1 - Page 18'
      },
      {
        id: 'topic-4',
        subject_id: 'subj-1',
        note_id: 'note-demo-1',
        title: 'IPv4 Subnetting & CIDR Addressing',
        explanation: 'Network address classification and subnet mask calculations for efficient IP assignment.',
        keywords: ['Subnet-Mask', 'CIDR', 'IP-Address', 'Prefix'],
        difficulty: 'Medium',
        status: 'Not Started',
        source_ref: 'Unit 1 - Page 25'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('learnloop_topics', JSON.stringify(topics));
  }, [topics]);

  const addTopics = (newTopicsList, noteId = null, subjectId = null) => {
    const formatted = newTopicsList.map((t, idx) => ({
      id: `topic-${Date.now()}-${idx}`,
      subject_id: subjectId || (noteId ? notes.find(n => n.id === noteId)?.subject_id : subjects[0]?.id),
      note_id: noteId,
      title: t.title,
      explanation: t.explanation,
      keywords: t.keywords || ['concept', 'notes'],
      difficulty: t.difficulty || ['Easy', 'Medium', 'Hard'][idx % 3],
      status: 'Not Started',
      source_ref: t.source_ref || 'Extracted Section'
    }));
    setTopics((prev) => [...formatted, ...prev]);

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

    // Recording an activity updates the streak!
    recordStudyActivity();
  };

  // 7. Quiz Attempts History
  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('learnloop_quizzes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'quiz-1',
        subject_id: 'subj-1',
        topic: 'OSI Model & Layered Architecture',
        concept_id: 'topic-1',
        note_id: 'note-demo-1',
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
    recordStudyActivity();
  };

  // 8. Flashcards State
  const [flashcards, setFlashcards] = useState(() => {
    const saved = localStorage.getItem('learnloop_flashcards');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'card-1',
        subject_id: 'subj-1',
        concept_id: 'topic-1',
        front: 'What are the 7 layers of the OSI Model from bottom to top?',
        back: '1. Physical, 2. Data Link, 3. Network, 4. Transport, 5. Session, 6. Presentation, 7. Application.',
        topic: 'OSI Model & Layered Architecture',
        difficulty: 'Medium',
        reviewed: true,
        rating: 'Medium'
      },
      {
        id: 'card-2',
        subject_id: 'subj-1',
        concept_id: 'topic-2',
        front: 'Explain the TCP 3-way handshake process.',
        back: 'Step 1: Client sends SYN. Step 2: Server responds with SYN-ACK. Step 3: Client sends ACK.',
        topic: 'TCP/IP Protocol Suite & Handshakes',
        difficulty: 'Hard',
        reviewed: true,
        rating: 'Difficult'
      },
      {
        id: 'card-3',
        subject_id: 'subj-1',
        concept_id: 'topic-3',
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
    recordStudyActivity();
  };

  const addFlashcards = (newCards, subjectId = null, conceptId = null) => {
    const formatted = newCards.map((c, idx) => ({
      id: `card-${Date.now()}-${idx}`,
      subject_id: subjectId || subjects[0]?.id,
      concept_id: conceptId,
      front: c.front,
      back: c.back,
      topic: c.topic || 'General',
      difficulty: c.difficulty || 'Medium',
      reviewed: false,
      rating: null
    }));
    setFlashcards((prev) => [...formatted, ...prev]);
  };

  // 9. Streak Tracking State
  const [streakData, setStreakData] = useState(() => {
    const saved = localStorage.getItem('learnloop_streak');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return {}; }
    }
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      currentStreak: 1,
      longestStreak: 3,
      totalActiveDays: 4,
      lastStudyDate: todayStr,
      dailyGoalMinutes: 30,
      activeDates: {
        [todayStr]: true,
        [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
        [new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]]: true,
        [new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0]]: true
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('learnloop_streak', JSON.stringify(streakData));
  }, [streakData]);

  const recordStudyActivity = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setStreakData((prev) => {
      const activeDates = { ...(prev.activeDates || {}), [todayStr]: true };
      
      // Calculate consecutive streak
      if (prev.lastStudyDate === todayStr) {
        return { ...prev, activeDates };
      }

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const isConsecutive = prev.lastStudyDate === yesterday;
      const newStreak = isConsecutive ? (prev.currentStreak || 0) + 1 : 1;
      const newLongest = Math.max(newStreak, prev.longestStreak || 1);

      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalActiveDays: Object.keys(activeDates).length,
        lastStudyDate: todayStr,
        activeDates
      };
    });
  };

  const updateStreakGoal = (minutes) => {
    setStreakData((prev) => ({ ...prev, dailyGoalMinutes: parseInt(minutes, 10) }));
  };

  // 10. Study Planner State
  const [studyPlan, setStudyPlan] = useState(() => {
    const saved = localStorage.getItem('learnloop_planner');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return {
      generatedAt: new Date().toLocaleDateString(),
      availableMinutes: 90,
      sessions: [
        {
          id: 'plan-1',
          subject: 'Computer Networks',
          concept: 'OSI Model & Layered Architecture',
          durationMinutes: 30,
          type: 'Concept Study',
          reason: 'Targeting foundational concept in Computer Networks',
          completed: true
        },
        {
          id: 'plan-2',
          subject: 'Computer Networks',
          concept: 'TCP/IP Protocol Suite & Handshakes',
          durationMinutes: 25,
          type: 'Practice Quiz',
          reason: 'Hard concept marked as In Progress requiring quiz practice',
          completed: false
        },
        {
          id: 'plan-3',
          subject: 'Database Management Systems',
          concept: 'Relational Model & Normalization',
          durationMinutes: 20,
          type: 'Flashcards Review',
          reason: 'Review key terms before upcoming DBMS assessment',
          completed: false
        },
        {
          id: 'plan-4',
          subject: 'Break & Summary',
          concept: 'Rest & Mental Consolidation',
          durationMinutes: 15,
          type: 'Break',
          reason: 'Consolidate memory and prevent cognitive fatigue',
          completed: true
        }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('learnloop_planner', JSON.stringify(studyPlan));
  }, [studyPlan]);

  const togglePlannerItem = (sessionId) => {
    setStudyPlan((prev) => {
      if (!prev) return prev;
      const updatedSessions = prev.sessions.map((s) =>
        s.id === sessionId ? { ...s, completed: !s.completed } : s
      );
      recordStudyActivity();
      return { ...prev, sessions: updatedSessions };
    });
  };

  const saveGeneratedPlan = (planObj) => {
    setStudyPlan(planObj);
  };

  // 11. Application Settings
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
    localStorage.removeItem('learnloop_subjects');
    localStorage.removeItem('learnloop_notes');
    localStorage.removeItem('learnloop_topics');
    localStorage.removeItem('learnloop_quizzes');
    localStorage.removeItem('learnloop_flashcards');
    localStorage.removeItem('learnloop_streak');
    localStorage.removeItem('learnloop_planner');
    setSubjects([]);
    setNotes([]);
    setTopics([]);
    setQuizzes([]);
    setFlashcards([]);
    setStudyPlan(null);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        currentPage,
        setCurrentPage,
        selectedSubjectId,
        setSelectedSubjectId,
        searchQuery,
        setSearchQuery,

        subjects,
        addSubject,
        updateSubject,
        deleteSubject,

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

        streakData,
        recordStudyActivity,
        updateStreakGoal,

        studyPlan,
        togglePlannerItem,
        saveGeneratedPlan,

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
