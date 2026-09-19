import React from 'react';
import SubjectRow from './SubjectRow';

export default function SubjectList({
  subjects,
  notes,
  topics,
  quizzes,
  setSelectedSubjectId,
  setCurrentPage,
  setEditingSubject,
  setDeletingSubjectTarget,
}) {
  return (
    <div className="subject-list">
      {subjects.map((subj) => {
        const subjNotes = notes.filter((n) => n.subject_id === subj.id);
        const subjTopics = topics.filter((t) => t.subject_id === subj.id);
        const completedTopics = subjTopics.filter((t) => t.status === 'Completed');
        const subjQuizzes = quizzes.filter(
          (q) => q.subject_id === subj.id || subjTopics.some((t) => t.title === q.topic)
        );
        const overallProgress = subjTopics.length > 0 ? Math.round((completedTopics.length / subjTopics.length) * 100) : 0;

        return (
          <SubjectRow
            key={subj.id}
            subject={subj}
            notesCount={subjNotes.length}
            topicsCount={subjTopics.length}
            quizzesCount={subjQuizzes.length}
            progress={overallProgress}
            onSelect={() => {
              setSelectedSubjectId(subj.id);
              setCurrentPage('subject_detail');
            }}
            onEdit={() => setEditingSubject(subj)}
            onDelete={() => setDeletingSubjectTarget(subj)}
          />
        );
      })}
    </div>
  );
}
