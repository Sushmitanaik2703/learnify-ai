import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import DashboardPage from './pages/DashboardPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import NotesPage from './pages/NotesPage';
import TopicsPage from './pages/TopicsPage';
import QuizzesPage from './pages/QuizzesPage';
import FlashcardsPage from './pages/FlashcardsPage';
import ProgressPage from './pages/ProgressPage';
import StreakPage from './pages/StreakPage';
import PlannerPage from './pages/PlannerPage';
import SettingsPage from './pages/SettingsPage';

function MainLayout() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'subject_detail':
        return <SubjectDetailPage />;
      case 'notes':
        return <NotesPage />;
      case 'topics':
        return <TopicsPage />;
      case 'quizzes':
        return <QuizzesPage />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'progress':
        return <ProgressPage />;
      case 'streak':
        return <StreakPage />;
      case 'planner':
        return <PlannerPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-content-area">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
