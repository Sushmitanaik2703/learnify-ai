const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Checks backend health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Health check failed with status: ${response.status}`);
    }

    const data = await response.json();
    return {
      connected: data.status === 'ok',
      message: data.message || 'LearnLoop backend is running',
    };
  } catch (error) {
    return {
      connected: false,
      message: error.message || 'Backend server is offline',
    };
  }
}

/**
 * Uploads PDF or TXT file to backend note extraction endpoint
 */
export async function uploadNotes(file) {
  if (!file) {
    throw new Error('Please select a file to upload.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/notes/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Failed to upload notes file.';
    throw new Error(errorMessage);
  }

  return data; // { filename, file_type, content, char_count }
}

/**
 * Deletes a study material by noteId
 */
export async function deleteNoteApi(noteId) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${encodeURIComponent(noteId)}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to delete study material.');
    }
    return data;
  } catch (error) {
    console.warn('[API DeleteNote] Backend error fallback:', error);
    return { status: 'ok', message: 'Local study material deleted' };
  }
}

/**
 * Deletes a subject by subjectId
 */
export async function deleteSubjectApi(subjectId) {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${encodeURIComponent(subjectId)}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to delete subject.');
    }
    return data;
  } catch (error) {
    console.warn('[API DeleteSubject] Backend error fallback:', error);
    return { status: 'ok', message: 'Local subject deleted' };
  }
}

/**
 * Sends note text to backend to extract 3-5 structured topics
 */
export async function extractTopics(text) {
  if (!text || text.trim().length === 0) {
    throw new Error('Please upload notes or enter text first.');
  }

  const response = await fetch(`${API_BASE_URL}/ai/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Failed to extract topics.';
    throw new Error(errorMessage);
  }

  return data.topics;
}

/**
 * Generates multi-level topic explanation (Beginner, Intermediate, Advanced)
 */
export async function generateExplanation(topic, level = 'Intermediate', text = '') {
  const response = await fetch(`${API_BASE_URL}/ai/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, level, text }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Failed to generate explanation.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Generates multiple choice quiz questions
 */
export async function generateQuiz(topic = '', difficulty = 'medium', numQuestions = 5, text = '') {
  const response = await fetch(`${API_BASE_URL}/ai/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic,
      difficulty,
      num_questions: parseInt(numQuestions, 10),
      text
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Failed to generate quiz.';
    throw new Error(errorMessage);
  }

  return data.questions;
}

/**
 * Generates interactive flashcards
 */
export async function generateFlashcards(topic = '', text = '') {
  const response = await fetch(`${API_BASE_URL}/ai/flashcards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, text }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Failed to generate flashcards.';
    throw new Error(errorMessage);
  }

  return data.flashcards;
}
