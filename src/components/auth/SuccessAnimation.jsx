import React from 'react';

export function SuccessAnimation({
  title = 'Account created successfully',
  subtitle = 'Your KeshavCoder workspace is ready.',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in">
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        {/* Outer subtle glow ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/15 animate-ping opacity-75" />
        
        {/* Main circular surface */}
        <div className="relative w-18 h-18 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center animate-check-circle shadow-lg shadow-emerald-500/10">
          <svg
            className="w-10 h-10 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" className="animate-check-stroke" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-kc-text mb-2 animate-slide-up">
        {title}
      </h2>
      <p className="text-sm text-kc-muted animate-slide-up" style={{ animationDelay: '100ms' }}>
        {subtitle}
      </p>
    </div>
  );
}
