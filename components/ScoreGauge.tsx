import React from 'react';

const ScoreGauge = ({ score = 0 }: { score: number }) => {
    // Gauge Logic (180 degrees)
    const radius = 40;
    const arcLength = Math.PI * radius;
    const normalizedScore = Math.min(Math.max(score, 0), 100);
    const progress = normalizedScore / 100;
    const dashOffset = arcLength * (1 - progress);

    return (
        <div className="relative flex flex-col items-center justify-center w-64 h-32">
            <svg viewBox="0 0 100 60" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                </defs>

                {/* Background Track */}
                <path
                    d="M10,50 A40,40 0 0,1 90,50"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    strokeLinecap="round"
                />

                {/* Progress Bar */}
                <path
                    d="M10,50 A40,40 0 0,1 90,50"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>

            {/* Score Text */}
            <div className="absolute bottom-0 flex flex-col items-center translate-y-2">
                <span className="text-4xl font-black text-slate-900">
                    {normalizedScore}
                </span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Score
                </span>
            </div>
        </div>
    );
};

export default ScoreGauge;