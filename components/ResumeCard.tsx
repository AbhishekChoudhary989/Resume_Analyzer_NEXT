"use client";

import Link from "next/link"; // Changed for Next.js
import ScoreCircle from "@/components/ScoreCircle"; // Fixed alias to match Next.js setup
import { User } from "lucide-react";

// In Next.js, images in public are served from root.
// We simplify image handling to work with relative paths.
const ResumeCard = ({ resume }: { resume: any }) => {
    const { id, companyName, jobTitle, feedback, imagePath } = resume || {};

    const getImageUrl = (path: string) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;

        // If it's a local file name (e.g. "resume_01.png"),
        // assume it's in the /uploads or /images folder in public
        const cleanPath = path.replace(/\\/g, "/").split('/').pop();
        return `/images/${cleanPath}`; // Adjust this based on where you actually save images
    };

    const score = feedback?.overallScore || 0;
    const statusColor = score > 70 ? "bg-green-500" : score > 50 ? "bg-yellow-500" : "bg-red-500";
    const glowColor = score > 70 ? "group-hover:shadow-green-500/20" : score > 50 ? "group-hover:shadow-yellow-500/20" : "group-hover:shadow-red-500/20";
    const imageUrl = getImageUrl(imagePath);

    return (
        <Link
            href={`/resume/${id}`}
            className={`group relative flex flex-col rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glowColor} ring-1 ring-slate-200 overflow-hidden h-[380px]`}
        >
            <div className="relative h-full w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Resume"
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 group-hover:bg-white transition-colors duration-500">
                        <div className="relative w-24 h-32 bg-white border border-slate-200 shadow-sm rounded-md flex flex-col p-3 gap-2 group-hover:shadow-md transition-all duration-500 group-hover:-translate-y-2">
                            <div className="w-1/2 h-2 bg-slate-800 rounded-sm mb-2 opacity-80" />
                            <div className="w-full h-1 bg-slate-300 rounded-sm" />
                            <div className="w-full h-1 bg-slate-300 rounded-sm" />
                            <div className="w-3/4 h-1 bg-slate-300 rounded-sm" />
                            <div className="w-full h-1 bg-slate-300 rounded-sm mt-2" />
                            <div className="w-5/6 h-1 bg-slate-300 rounded-sm" />
                            <div className="absolute top-0 right-0 w-6 h-6 bg-slate-100 rounded-bl-md" />
                        </div>
                        <span className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            PDF Document
                        </span>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border border-slate-100">
                    <div className={`h-2 w-2 rounded-full ${statusColor}`} />
                    <span className="text-[10px] font-bold text-slate-700 tracking-widest">
                        {score > 70 ? 'STRONG' : score > 50 ? 'OKAY' : 'WEAK'}
                    </span>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col overflow-hidden">
                        <h3 className="truncate text-lg font-bold text-slate-900 leading-tight">
                            {jobTitle || "Resume Analysis"}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                            <User size={12} strokeWidth={3} />
                            <p className="truncate text-xs font-bold uppercase tracking-wide">
                                {companyName || "Candidate"}
                            </p>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        {/* Ensure ScoreCircle component exists */}
                        <ScoreCircle score={score} size={42} stroke={5} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;