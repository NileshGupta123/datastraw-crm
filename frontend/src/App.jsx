import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NewTicket from './pages/NewTicket';
import TicketDetailPage from './pages/TicketDetailPage';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-brand">
          Datastraw Support CRM
        </a>
        <DarkModeToggle />
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewTicket />} />
          <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;