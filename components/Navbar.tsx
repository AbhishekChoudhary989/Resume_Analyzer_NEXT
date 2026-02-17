"use client";

import Link from "next/link"; // Changed for Next.js
import { Sparkles, Github } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-[73px]">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight">
                        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">CareerBoost</span>
                    </span>
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-6">
                    <a
                        href="https://github.com/AbhishekChoudhary989/Resume_Analyzer_2.0"
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <Github className="w-5 h-5" />
                    </a>

                    <Link
                        href="/upload"
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
                    >
                        Analyze Resume
                    </Link>
                </div>
            </div>
        </nav>
    );
}