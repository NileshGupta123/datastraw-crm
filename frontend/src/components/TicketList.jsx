import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function TicketList({ tickets, loading }) {
  if (loading) {
    return <p className="text-center text-gray-500 py-8">Loading tickets...</p>;
  }

  if (!tickets || tickets.length === 0) {
    return <p className="text-center text-gray-500 py-8">No tickets found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3">Ticket ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.ticket_id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="px-4 py-3">
                <Link
                  to={`/tickets/${ticket.ticket_id}`}
                  className="text-brand font-medium hover:underline"
                >
                  {ticket.ticket_id}
                </Link>
              </td>
              <td className="px-4 py-3">{ticket.customer_name}</td>
              <td className="px-4 py-3">{ticket.subject}</td>
              <td className="px-4 py-3"><PriorityBadge priority={ticket.priority} /></td>
              <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(ticket.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}