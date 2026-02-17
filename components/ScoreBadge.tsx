import React from 'react';
import { cn } from "@/app/lib/utils"; // Adjusted alias

interface ScoreBadgeProps {
    score: number;
    className?: string;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, className }) => {
    // Determine status
    const isHigh = score > 69;
    const isMid = score > 49;

    return (
        <div
            className={cn(
                "flex flex-row gap-1 items-center px-2 py-0.5 rounded-full w-fit",
                isHigh
                    ? "bg-green-100 text-green-700"
                    : isMid
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700",
                className
            )}
        >
            {/* Ensure these icons exist in public/icons/ */}
            <img
                src={isHigh ? "/icons/check.svg" : "/icons/warning.svg"}
                alt="status"
                className="w-4 h-4"
            />
            <p className="text-sm font-medium">
                {isHigh ? "Strong" : isMid ? "Good Start" : "Needs Work"}
            </p>
        </div>
    );
};

export default ScoreBadge;