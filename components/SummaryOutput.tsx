import React from 'react';
import { Summary } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface SummaryOutputProps {
  summary: Summary | null;
  isLoading: boolean;
  error: string | null;
}

const SkeletonLoader: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
    </div>
    <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
    </div>
    <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
    </div>
    <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
    </div>
  </div>
);


const SummarySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-md font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
        <p className="mt-1 text-slate-700 whitespace-pre-wrap">{children}</p>
    </div>
);


const SummaryOutput: React.FC<SummaryOutputProps> = ({ summary, isLoading, error }) => {

    const renderContent = () => {
        if (isLoading) {
            return <SkeletonLoader />;
        }

        if (error) {
            return (
                <div className="text-center py-10">
                    <div className="mx-auto h-12 w-12 text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-slate-900">An Error Occurred</h3>
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
            );
        }

        if (summary) {
            return (
                <div className="space-y-6">
                    <SummarySection title="Chief Complaint">
                        {summary.chiefComplaint}
                    </SummarySection>
                    <hr className="border-slate-200" />
                    <SummarySection title="History of Present Illness">
                        {summary.historyOfPresentIllness}
                    </SummarySection>
                    <hr className="border-slate-200" />
                    <SummarySection title="Current Medications">
                        {summary.currentMedications}
                    </SummarySection>
                    <hr className="border-slate-200" />
                    <SummarySection title="Impact on Daily Life">
                        {summary.impactOnDailyLife}
                    </SummarySection>
                </div>
            );
        }

        return (
            <div className="text-center py-10">
                 <div className="mx-auto h-12 w-12 text-slate-400">
                    <SparklesIcon />
                 </div>
                 <h3 className="mt-2 text-lg font-medium text-slate-900">AI-Generated Summary</h3>
                 <p className="mt-1 text-sm text-slate-500">Your clinical summary will appear here after providing a transcript, recording, or audio file.</p>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Clinical Summary</h2>
            <div className="p-4 bg-slate-50/80 rounded-lg min-h-[320px] flex items-center justify-center">
                <div className="w-full">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SummaryOutput;