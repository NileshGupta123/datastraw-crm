import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ticketsApi } from '../api';
import StatsDashboard from '../components/StatsDashboard';
import SearchFilterBar from '../components/SearchFilterBar';
import TicketList from '../components/TicketList';
import Pagination from '../components/Pagination';

const LIMIT = 10;

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ticketsApi.list({ status, search, page, limit: LIMIT });
      setTickets(res.data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [status, search, page]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await ticketsApi.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debounce search-as-you-type
    const timer = setTimeout(() => {
      setPage(1);
      fetchTickets();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <Link
          to="/new"
          className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + New Ticket
        </Link>
      </div>

      <StatsDashboard stats={stats} loading={statsLoading} />
      <SearchFilterBar search={search} setSearch={setSearch} status={status} setStatus={setStatus} />
      <TicketList tickets={tickets} loading={loading} />
      <Pagination page={page} setPage={setPage} hasMore={tickets.length === LIMIT} />
    </div>
  );
}