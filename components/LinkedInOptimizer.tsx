"use client";

import { useState } from "react";
import {
    Linkedin, Copy, Loader2, Sparkles, Check, AlertTriangle,
    Pin, Award, ListChecks, Quote, Briefcase, ChevronRight, CheckCircle2, Zap
} from "lucide-react";

interface LinkedInData {
    headlines: string[];
    storyAbout: string;
    topSkills: string[];
    credentialsAndProjects: { title: string; description: string }[];
    manualChecklist: string[];
}

export default function LinkedInOptimizer({ resumeText }: { resumeText: string }) {
    const [data, setData] = useState<LinkedInData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

    const generate = async () => {
        setError("");
        setLoading(true);

        if (!resumeText || resumeText === "{}" || resumeText.length < 5) {
            setError("No resume data found. Please analyze a new resume first.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/ai/linkedin-optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeText })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Server failed to generate profile");
            }

            const json = await res.json();
            setData(json.result || json);
        } catch (e: any) {
            console.error("LinkedIn Error:", e);
            setError(e.message || "Failed to connect to AI server.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(id);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-200/80 p-6 sm:p-10 shadow-2xl shadow-slate-200/40 relative overflow-hidden mb-8">
            {/* Subtle Top Gradient Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

            <div className="flex items-center gap-5 mb-10 pb-6 border-b border-slate-100">
                <div className="bg-[#0A66C2] p-3.5 rounded-2xl shadow-lg shadow-blue-200/50 flex items-center justify-center">
                    <Linkedin className="text-white" size={28} />
                </div>
                <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">LinkedIn Optimizer</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1.5 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-indigo-500" /> AI-Crafted Professional Profile
                    </p>
                </div>
            </div>

            {!data ? (
                <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap size={32} className="text-blue-500" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Ready to upgrade your network?</h4>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">We'll analyze your resume and generate viral headlines, a story-driven bio, and optimized skills.</p>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="max-w-md mx-auto bg-slate-900 hover:bg-slate-800 text-white py-4 px-8 rounded-2xl font-bold transition-all transform hover:-translate-y-1 flex justify-center items-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-50 disabled:hover:translate-y-0 w-full"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="text-blue-400" />}
                        {loading ? "Crafting Your Profile..." : "Generate Premium Profile"}
                    </button>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center justify-center gap-2 font-medium border border-red-100 max-w-md mx-auto">
                            <AlertTriangle size={18} /> {error}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-12 animate-in fade-in duration-700">

                    {/* 1. VIRAL HEADLINES */}
                    <section>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                            <Sparkles size={16} className="text-[#0A66C2]" /> High-Impact Headlines
                        </h4>
                        <div className="grid gap-4">
                            {data.headlines?.map((headline, i) => (
                                <div key={i} onClick={() => copyToClipboard(headline, `headline-${i}`)} className="group bg-white border border-slate-200 p-5 rounded-2xl cursor-pointer flex justify-between items-center transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50">
                                    <p className="text-slate-700 font-medium leading-relaxed pr-6">{headline}</p>
                                    <div className="bg-slate-50 group-hover:bg-blue-50 p-2.5 rounded-xl text-slate-400 group-hover:text-[#0A66C2] transition-colors">
                                        {copiedIndex === `headline-${i}` ? <Check size={18} /> : <Copy size={18} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 2. STORY-DRIVEN ABOUT SECTION */}
                    <section>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                            <Quote size={16} className="text-[#0A66C2]" /> Story-Driven Summary
                        </h4>
                        <div className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-8 rounded-3xl group transition-all hover:shadow-md">
                            <p className="text-slate-700 leading-loose whitespace-pre-wrap">{data.storyAbout}</p>
                            <button onClick={() => copyToClipboard(data.storyAbout, 'about')} className="absolute top-5 right-5 bg-white border border-slate-200 hover:border-[#0A66C2] hover:text-[#0A66C2] text-slate-400 p-2.5 rounded-xl transition-all shadow-sm">
                                {copiedIndex === 'about' ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </section>

                    {/* 3. TOP PINNED SKILLS */}
                    {data.topSkills && data.topSkills.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-5">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Pin size={16} className="text-[#0A66C2]" /> Top Skills to Pin
                                </h4>
                                <span className="text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700 px-2.5 py-1 rounded-full hidden sm:block">
                                    Boosts connections 3x
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {data.topSkills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 4. CREDENTIALS & PROJECTS */}
                    {data.credentialsAndProjects && data.credentialsAndProjects.length > 0 && (
                        <section>
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                                <Briefcase size={16} className="text-[#0A66C2]" /> Featured Projects
                            </h4>
                            <div className="grid gap-5 sm:grid-cols-2">
                                {data.credentialsAndProjects.map((item, i) => (
                                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-3xl relative group transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-200">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-4">
                                            <Award size={20} />
                                        </div>
                                        <h5 className="font-bold text-slate-900 mb-3 text-lg pr-8">{item.title}</h5>
                                        <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                                        <button onClick={() => copyToClipboard(item.description, `cred-${i}`)} className="absolute top-6 right-6 bg-slate-50 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white text-slate-400 p-2.5 rounded-xl transition-all shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                            {copiedIndex === `cred-${i}` ? <Check size={18} /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 5. MANUAL CHECKLIST */}
                    {data.manualChecklist && data.manualChecklist.length > 0 && (
                        <section>
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                                <ListChecks size={18} className="text-emerald-500" /> Final Actions
                            </h4>
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                                <ul className="space-y-3">
                                    {data.manualChecklist.map((task, i) => (
                                        <li key={i} className="flex items-start gap-4 text-slate-700 font-medium p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                            <div className="bg-emerald-100 p-1 rounded-full flex-shrink-0 mt-0.5">
                                                <CheckCircle2 size={16} className="text-emerald-600" />
                                            </div>
                                            <span className="leading-relaxed text-sm">{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}

                    {/* RESET BUTTON */}
                    <div className="pt-8 text-center">
                        <button onClick={() => setData(null)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0A66C2] hover:bg-blue-50 transition-all py-3 px-6 rounded-xl">
                            Optimize Another Resume <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}