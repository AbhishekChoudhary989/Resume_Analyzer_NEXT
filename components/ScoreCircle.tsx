import { cn } from "@/app/lib/utils";

interface ScoreCircleProps {
    score?: number;
    size?: number;
    stroke?: number;
    className?: string;
}

const ScoreCircle = ({ score = 0, size = 60, stroke = 6, className }: ScoreCircleProps) => {
    const radius = size / 2;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = Math.min(Math.max(score, 0), 100) / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div
            className={cn("relative flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            <svg
                height={size}
                width={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={radius}
                    cy={radius}
                    r={normalizedRadius}
                    stroke="#e5e7eb"
                    strokeWidth={stroke}
                    fill="transparent"
                />

                <defs>
                    <linearGradient id="circleGradient" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF97AD" />
                        <stop offset="100%" stopColor="#5171FF" />
                    </linearGradient>
                </defs>

                {/* Progress circle */}
                <circle
                    cx={radius}
                    cy={radius}
                    r={normalizedRadius}
                    stroke="url(#circleGradient)"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>

            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-xs text-gray-700">{score}/100</span>
            </div>
        </div>
    );
};

export default ScoreCircle;