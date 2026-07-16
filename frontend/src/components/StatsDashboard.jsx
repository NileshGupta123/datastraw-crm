export default function StatsDashboard({ stats, loading }) {
    if (loading || !stats) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      );
    }
  
    const cards = [
      { label: 'Total', value: stats.total, color: 'text-gray-800 dark:text-gray-100' },
      { label: 'Open', value: stats.open, color: 'text-blue-600 dark:text-blue-400' },
      { label: 'In Progress', value: stats.in_progress, color: 'text-purple-600 dark:text-purple-400' },
      { label: 'Closed', value: stats.closed, color: 'text-gray-500 dark:text-gray-400' },
    ];
  
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    );
  }