import { useEffect } from 'react';

const TYPE_STYLES = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
};

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 ${TYPE_STYLES[type]} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in`}
      role="alert"
    >
      {message}
    </div>
  );
}