import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export function RoadmapViewer({
  title,
  subtitle,
  steps = [],
  completedIds = [],
  onToggleStep,
  loading = false,
}) {
  const [expandedId, setExpandedId] = useState(steps[0]?.id || null);

  const totalSteps = steps.length;
  const completedCount = completedIds.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Overall Progress Banner */}
      <div className="kc-card p-6 bg-gradient-to-r from-kc-surface via-kc-surface to-kc-surface-2/80 border-kc-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-kc-accent" />
              <h2 className="text-xl font-bold text-kc-text m-0">{title}</h2>
            </div>
            {subtitle && <p className="text-xs text-kc-muted mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-kc-muted">Progress:</span>
            <span className="text-base font-extrabold text-kc-accent">{progressPercent}%</span>
            <span className="text-xs text-kc-muted">({completedCount}/{totalSteps} completed)</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-kc-surface-2 border border-kc-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-kc-accent to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = completedIds.includes(step.id);
          const isExpanded = expandedId === step.id;

          return (
            <div
              key={step.id}
              className={`kc-card overflow-hidden transition-all duration-200 ${
                isCompleted
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : isExpanded
                  ? 'border-kc-accent/40 bg-kc-surface shadow-kc-sm'
                  : 'bg-kc-surface hover:border-kc-border-hover'
              }`}
            >
              {/* Step Header / Toggle Row */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Complete Checkbox Button */}
                  <button
                    type="button"
                    onClick={() => onToggleStep(step.id)}
                    disabled={loading}
                    className="shrink-0 text-kc-muted hover:text-emerald-400 transition-colors p-1 cursor-pointer"
                    aria-label={isCompleted ? `Mark ${step.title} incomplete` : `Mark ${step.title} complete`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-6 h-6 text-kc-border hover:text-kc-accent" />
                    )}
                  </button>

                  <div
                    onClick={() => setExpandedId(isExpanded ? null : step.id)}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-kc-muted">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <h3
                        className={`text-sm sm:text-base font-bold m-0 truncate ${
                          isCompleted ? 'text-kc-muted line-through' : 'text-kc-text'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-kc-muted m-0 mt-0.5 line-clamp-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Expand / Collapse Button */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : step.id)}
                  className="text-kc-muted hover:text-kc-text p-1.5 rounded-lg hover:bg-kc-surface-2 transition-colors cursor-pointer shrink-0"
                  aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Step Expanded Details */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-5 pt-2 border-t border-kc-border/60 bg-kc-surface-2/30 animate-slide-up">
                  <p className="text-xs sm:text-sm text-kc-text leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Topics / Key Concepts Pills */}
                  {((step.topics || step.concepts) && (
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-kc-muted mb-2">
                        Core Concepts & Checkpoints:
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-kc-text list-none p-0 m-0">
                        {(step.topics || step.concepts || []).map((topic, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 p-2 rounded-lg bg-kc-surface border border-kc-border/70"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-kc-accent mt-1.5 shrink-0" />
                            <span className="leading-tight">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
