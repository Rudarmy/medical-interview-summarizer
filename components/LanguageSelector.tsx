import React from 'react';
import { GlobeIcon } from './icons/GlobeIcon';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (language: string) => void;
  disabled: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange, disabled }) => {
  return (
    <div className="relative">
      <label htmlFor="language-select" className="sr-only">Output Language</label>
      <GlobeIcon className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <select
        id="language-select"
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={disabled}
        className="appearance-none block w-full bg-white border border-slate-300 rounded-full py-3 pl-11 pr-8 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors"
      >
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;