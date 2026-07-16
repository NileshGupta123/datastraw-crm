const STATUS_STYLES = {
    Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'In Progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Closed: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };
  
  export default function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || STATUS_STYLES.Open;
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
        {status}
      </span>
    );
  }