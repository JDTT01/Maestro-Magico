import React from 'react';

export const BookOpenIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
        <path d="M13 3.5A1.5 1.5 0 0114.5 2H15a2 2 0 012 2v11.05a.5.5 0 01-.78.42L11.5 13.236 6.78 15.47a.5.5 0 01-.78-.42V4a2 2 0 012-2h.5A1.5 1.5 0 0110 3.5v10.736l1.5-1.072 1.5 1.072V3.5z" />
    </svg>
);