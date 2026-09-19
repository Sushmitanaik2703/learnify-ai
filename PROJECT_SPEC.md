
# LearnLoop AI — Project Specification

## 1. Project Overview

LearnLoop AI is an interactive AI-powered learning application that transforms student notes and study materials into active learning activities.

Instead of simply reading notes, students can:
- Extract topics from study material
- Generate flashcards
- Practice quizzes
- Understand incorrect answers
- Track weak topics
- Receive personalized revision recommendations

## 2. Problem Statement

Students often study passively and do not know:
- Which topics they understand
- Which concepts they have forgotten
- What they should revise next
- Whether they are ready for an examination

LearnLoop AI solves this problem by converting notes into a personalized active learning experience.

## 3. Target Users

- College students
- School students
- Competitive examination learners
- Students preparing for internal and semester examinations

## 4. Main Features

### A. Document Upload
- Upload PDF and TXT files
- Paste notes directly into a text area
- Extract readable text
- Show processing status
- Display helpful error messages

### B. AI Topic Extraction
Extract:
- Main topics
- Subtopics
- Key concepts
- Definitions
- Important points
- Exam-relevant keywords

Display extracted topics as attractive cards.

### C. Flashcard Generation
Generate flashcards from uploaded notes.

Each flashcard should contain:
- Question or term
- Answer or explanation
- Related topic
- Difficulty level

Allow students to mark:
- Know
- Need Practice
- Difficult

### D. Quiz Generation
Generate multiple-choice questions from the uploaded material.

Each question should contain:
- Question
- Four options
- Correct answer
- Explanation
- Topic
- Difficulty
- Source reference where available

Allow students to:
- Select a topic
- Select difficulty
- Select number of questions
- Answer questions
- View results
- Review incorrect answers

### E. Quiz Scoring
Track:
- Total questions
- Correct answers
- Incorrect answers
- Percentage score
- Topic-wise accuracy
- Difficulty-wise performance

### F. Weak Topic Detection
Identify weak topics using transparent rules.

Suggested rules:
- Accuracy below 60%: Revise Now
- Accuracy from 60% to 79%: Practice Next
- Accuracy 80% or above: Performing Well

Repeated incorrect answers should increase revision priority.

### G. Personalized Revision
Create three categories:
1. Revise Now
2. Practice Next
3. Performing Well

Provide a targeted retest for weak topics.

## 5. Advanced Features

### Adaptive Difficulty
- Increase difficulty after consistent correct answers.
- Reduce difficulty after repeated incorrect answers.
- Keep difficulty changes understandable.

### Confidence Feedback
After answering, students select:
- I knew it
- I guessed
- I did not know

Compare confidence with actual accuracy and provide supportive feedback.

### Targeted Retest
Generate a short quiz containing questions from weak topics.

Prefer different questions from previous attempts.

### Note-Grounded Questions
Generate questions based on uploaded notes.

If information is missing, do not invent unsupported facts.

### Exam Mode
Optional feature:
- Timed quiz
- Results after submission
- Review of answers

## 6. Technology Stack

Frontend:
- React + Vite
- Tailwind CSS or clean CSS

Backend:
- Python FastAPI

AI:
- Gemini API or another approved AI provider

Database:
- SQLite

Document Processing:
- PyMuPDF for PDF extraction

Charts:
- Recharts or another suitable chart library

## 7. Suggested Pages

1. Dashboard
2. Upload Notes
3. Topics
4. Flashcards
5. Quiz
6. Results
7. Revision Insights

## 8. UI Design

Create a modern, professional educational SaaS interface.

Design requirements:
- Dark navy and indigo theme
- Clean typography
- Rounded cards
- Consistent spacing
- Responsive layout
- Attractive dashboard
- Clear navigation
- Loading states
- Empty states
- Error states
- Accessible buttons

The website should look polished enough for a hackathon demonstration.

## 9. Backend API

Suggested endpoints:

POST /api/upload
POST /api/analyze
POST /api/generate/flashcards
POST /api/generate/quiz
POST /api/quiz/submit
GET /api/progress
GET /api/revision
POST /api/revision/retest

## 10. Data Models

Document:
- id
- title
- filename
- extracted_text
- created_at

Topic:
- id
- document_id
- name
- summary
- key_points

Question:
- id
- topic_id
- question
- options
- correct_answer
- explanation
- difficulty

QuizAttempt:
- id
- score
- total_questions
- created_at

AnswerAttempt:
- id
- question_id
- selected_answer
- is_correct
- confidence

TopicProgress:
- topic_id
- attempts
- correct_answers
- accuracy
- mastery_status
- last_practiced

## 11. Development Priorities

Priority 1:
- Text input
- TXT upload
- Topic extraction
- Quiz generation
- Quiz scoring
- Flashcards

Priority 2:
- Weak topic detection
- Revision queue
- Confidence feedback
- PDF upload

Priority 3:
- Adaptive difficulty
- Targeted retest
- Exam mode
- Analytics charts

## 12. Reliability Requirements

- Validate AI responses.
- Handle invalid AI output.
- Handle missing API keys.
- Handle empty documents.
- Display useful error messages.
- Keep API keys in environment variables.
- Provide demo fallback data.
- Do not claim success if processing fails.

## 13. Acceptance Criteria

The application is ready for demonstration when:

1. A student can upload or paste notes.
2. Topics are extracted.
3. A quiz can be generated.
4. The quiz can be completed.
5. Score and explanations are displayed.
6. Weak topics are identified.
7. Revision recommendations are shown.
8. A targeted retest can be started.
9. The complete flow works through the UI.