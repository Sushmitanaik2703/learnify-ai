import { useState, useEffect } from 'react';
import './App.css';
import { fetchHealth } from './api.js';

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchHealth();
      const data = await resp.json();
      setHealth(data.status);
    } catch (e) {
      setError('Failed to reach backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1>LearnLoop AI Dashboard</h1>
      </header>
      <main className="main">
        <section className="health-section">
          <h2>Backend Health Check</h2>
          {loading && <p>Checking...</p>}
          {error && <p className="error">{error}</p>}
          {health && <p className="success">Backend status: {health}</p>}
          <button onClick={checkHealth} className="health-btn">Refresh</button>
        </section>
        {/* Future components will go here */}
      </main>
      <footer className="footer">
        <p>© 2026 LearnLoop AI</p>
      </footer>
    </div>
  );
}

export default App;
