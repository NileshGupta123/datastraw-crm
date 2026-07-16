const PRIORITY_STYLES = {
    Low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  
  export default function PriorityBadge({ priority }) {
    const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
        {priority}
      </span>
    );
  }