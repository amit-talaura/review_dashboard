// Custom Icon component for visual clarity
const Icon = ({ name, className = "w-5 h-5" }) => {
    const icons = {
      CheckCircle: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 10 12.01" />
        </svg>
      ),
      Trash2: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M15 6V4c0-1-1-2-2-2h-2c-1 0-2 1-2 2v2" />
        </svg>
      ),
      MessageSquare: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      MessageSquarePlus: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v6"/><path d="M15 10h-6"/>
          </svg>
      ),
    };
    return icons[name] || null;
  };
  
  // Utility function for Option Tag styling
  const getTagClasses = (option) => {
    switch (option) {
      case 'phone':
        return 'bg-blue-600 text-white shadow-md shadow-blue-300/50';
      case 'mismatch':
        return 'bg-red-600 text-white shadow-md shadow-red-300/50';
      case 'repeat':
        return 'bg-yellow-500 text-gray-900 shadow-md shadow-yellow-300/50';
      case 'other':
      default:
        return 'bg-gray-400 text-white shadow-md shadow-gray-300/50';
    }
  };
  