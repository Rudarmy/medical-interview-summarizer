
import React from 'react';
import { StethoscopeIcon } from './icons/StethoscopeIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start h-20">
            <StethoscopeIcon className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-slate-800 tracking-tight">
              Medical Interview Summarizer
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
