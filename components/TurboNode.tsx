import { Handle, Position } from 'reactflow';
import { ExternalLink, BookOpen } from 'lucide-react';

// This function checks the text and returns a guaranteed working URL
const getSmartLink = (title: string, description: string, aiFallback: string) => {
    const textToAnalyze = (title + " " + description).toLowerCase();

    // Core Web
    if (textToAnalyze.includes('css') || textToAnalyze.includes('tailwind')) return 'https://www.w3schools.com/css/';
    if (textToAnalyze.includes('html')) return 'https://www.w3schools.com/html/';
    if (textToAnalyze.includes('javascript') || textToAnalyze.includes('js')) return 'https://javascript.info/';

    // Frameworks & Backend
    if (textToAnalyze.includes('react') || textToAnalyze.includes('next.js')) return 'https://react.dev/';
    if (textToAnalyze.includes('node') || textToAnalyze.includes('express')) return 'https://nodejs.org/';
    if (textToAnalyze.includes('python') || textToAnalyze.includes('django')) return 'https://www.python.org/';

    // Databases & Tools
    if (textToAnalyze.includes('database') || textToAnalyze.includes('sql')) return 'https://www.w3schools.com/sql/';
    if (textToAnalyze.includes('mongo')) return 'https://www.mongodb.com/';
    if (textToAnalyze.includes('git') || textToAnalyze.includes('github')) return 'https://docs.github.com/';

    // If the AI actually provided a real HTTP link, use it
    if (aiFallback && aiFallback.startsWith('http')) return aiFallback;

    // If we don't know what it is, send them to MDN Web Docs as a safe fallback
    return 'https://developer.mozilla.org/';
};

export function TurboNode({ data }: { data: any }) {
    // Generate a safe, working URL for this specific box
    const safeUrl = getSmartLink(data.title, data.description, data.link);

    return (
        <div className="w-[350px] px-6 py-5 shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-2xl bg-[#0B0F19] border-2 border-cyan-500/30 hover:border-cyan-400 transition-colors">
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-cyan-400 border-none" />

            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg mt-1 shrink-0">
                        <BookOpen className="h-5 w-5 text-cyan-400" />
                    </div>
                    <h4 className="font-bold text-white text-base leading-tight">{data.title}</h4>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {data.description}
                </p>

                <a
                    href={safeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 py-2.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                    Study Resource <ExternalLink className="h-4 w-4" />
                </a>
            </div>

            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-cyan-400 border-none" />
        </div>
    );
}