import React from 'react';

export const BriefcaseIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-3.5a1 1 0 01-1-1V4a1 1 0 00-1-1H7.5a1 1 0 00-1 1v1a1 1 0 01-1 1H4zm2-1v1h8V4H6zM4 7h12v8H4V7z" clipRule="evenodd" />
    </svg>
);