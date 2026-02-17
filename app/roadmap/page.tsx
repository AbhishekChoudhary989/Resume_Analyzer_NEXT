"use client";

import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, ArrowRight, Upload, FileText, CheckCircle2,
    Loader2, Globe, Cpu, ScanFace, Binary
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export default function RoadmapPage() {
    const [file, setFile] = useState<File | null>(null);
    const [mainLoading, setMainLoading] = useState(false);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [logMessages, setLogMessages] = useState<string[]>([]);

    // 1. TERMINAL EFFECT
    useEffect(() => {
        if (mainLoading) {
            const msgs = [
                "> Handshake protocol initiated...",
                "> Encrypting upload stream...",
                "> Neural Core: ONLINE",
                "> Analyzing career vectors...",
                "> Decrypting future path..."
            ];
            let i = 0;
            const interval = setInterval(() => {
                if (i < msgs.length) {
                    setLogMessages(prev => [...prev, msgs[i]]);
                    i++;
                }
            }, 800);
            return () => clearInterval(interval);
        } else {
            setLogMessages([]);
        }
    }, [mainLoading]);

    // 2. UPLOAD LOGIC
    const handleUpload = async () => {
        if (!file) return;
        setMainLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const res = await fetch("/api/roadmap", { method: 'POST', body: formData });
            if (!res.ok) throw new Error("Analysis failed");
            const data = await res.json();

            setResult({ analysis: data.analysis || data });
            setMainLoading(false);

            if (data.searchParams) fetchJobsBackground(data.searchParams);
        } catch (err) {
            console.error(err);
            alert("Scan failed. Please try a different PDF.");
            setMainLoading(false);
        }
    };

    const fetchJobsBackground = async (params: any) => {
        setJobsLoading(true);
        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job_title: params.job_title, location: params.location })
            });
            const data = await res.json();
            setResult((prev: any) => ({ ...prev, live_jobs: data.live_jobs }));
        } catch (error) {
            console.error("Job fetch failed", error);
        } finally {
            setJobsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative">

            {/* --- CSS-ONLY CYBERPUNK BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* --- NAVBAR --- */}
            <header className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href="/" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
                        BACK
                    </Link>
                    <div className="h-6 w-[1px] bg-white/10"></div>
                    <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
                        PATHGENIE AI
                    </span>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32">

                {/* --- VIEW 1: SCANNER UI (Old Look Restored) --- */}
                {!result && !mainLoading && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[60vh]">

                        {/* Glowing Scanner Icon */}
                        <div className="relative mb-8 group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-[#0B0F19] border border-white/10 p-8 rounded-3xl shadow-2xl flex items-center justify-center">
                                <ScanFace size={64} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-center mb-6 tracking-tight text-white">
                            Decrypt Your <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                                Career Future
                            </span>
                        </h1>

                        {/* Upload Box */}
                        <div className="relative group w-full max-w-lg cursor-pointer mt-8">
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />

                            <div className="relative z-10 bg-[#0B0F19] border border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-12 flex flex-col items-center transition-all duration-300 group-hover:bg-[#111827] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                                {file ? (
                                    <FileText className="text-cyan-400 mb-4 animate-bounce" size={40} />
                                ) : (
                                    <Binary className="text-slate-500 mb-4 group-hover:text-cyan-400 transition-colors" size={40} />
                                )}
                                <p className="text-xl font-bold text-white mb-2">
                                    {file ? file.name : "Drop Resume PDF"}
                                </p>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">
                                    {file ? "Ready to Scan" : "Click or Drag & Drop"}
                                </p>
                            </div>
                        </div>

                        <button onClick={handleUpload} disabled={!file} className={`mt-8 px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all flex items-center gap-3 ${file ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25 hover:scale-105" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}>
                            Initialize Scan <ArrowRight size={16} />
                        </button>
                    </motion.div>
                )}

                {/* --- VIEW 2: LOADING TERMINAL --- */}
                {mainLoading && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <div className="w-full max-w-2xl bg-[#0B0F19] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                            <div className="bg-slate-900/50 px-4 py-2 border-b border-white/5 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="p-6 font-mono text-sm h-64 flex flex-col justify-end space-y-2">
                                {logMessages.map((msg, idx) => (
                                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-cyan-400/80 flex gap-2">
                                        <span className="text-cyan-600">➜</span> {msg}
                                    </motion.div>
                                ))}
                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-4 bg-cyan-500 inline-block" />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW 3: RESULTS DASHBOARD --- */}
                {result && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">

                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 to-cyan-900/40 border border-white/10 p-8 md:p-12">
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Strategic Career Roadmap</h2>
                                <p className="text-lg text-slate-300 max-w-2xl">Your personalized execution plan.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-10 shadow-xl">
                                    {result.analysis?.roadmap ? (
                                        <div className="space-y-12 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                                            {result.analysis.roadmap.map((step: any, i: number) => (
                                                <div key={i} className="relative pl-12">
                                                    <div className="absolute left-0 top-0 bg-cyan-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-cyan-500/20 z-10">{i + 1}</div>
                                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-colors group">
                                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{step.step}</h3>
                                                        <p className="text-slate-400 leading-relaxed mb-4">{step.description}</p>
                                                        {step.resources && (
                                                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                                                                {step.resources.map((res: string, j: number) => (
                                                                    <span key={j} className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/20">
                                                                        <CheckCircle2 size={12} className="mr-1" />
                                                                        {res}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="prose prose-lg prose-invert max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {typeof result.analysis === 'string' ? result.analysis : JSON.stringify(result.analysis)}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-[#0B0F19] border border-white/10 rounded-3xl p-6 sticky top-24">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Globe size={12} /> Live Market Nodes
                                        {jobsLoading && <Loader2 size={12} className="animate-spin text-cyan-400"/>}
                                    </h3>
                                    {!jobsLoading && (!result.live_jobs || result.live_jobs.length === 0) && (
                                        <div className="text-center py-8 text-slate-600 text-xs italic">
                                            No active nodes found in this sector.
                                        </div>
                                    )}
                                    {!jobsLoading && result.live_jobs?.map((job: any, i: number) => (
                                        <a key={i} href={job.url} target="_blank" rel="noopener noreferrer" className="block group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 p-4 rounded-xl transition-all mb-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-sm text-slate-200 group-hover:text-cyan-400 transition-colors line-clamp-1">{job.title}</h4>
                                                <ArrowRight size={14} className="text-slate-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                            </div>
                                            <p className="text-xs text-slate-500">{job.company}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}