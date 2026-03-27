"use client";

import Navbar from "@/components/Navbar";
import RoadmapVisualizer from "@/components/RoadmapVisualizer";
import { ArrowLeft, Network } from "lucide-react";
import Link from "next/link";

export default function VisualizePage() {
    // Dummy Data for the React Flow Canvas
    const initialNodes = [
        { id: '1', type: 'turbo', position: { x: 250, y: 0 }, data: { title: 'Learn React Fundamentals', description: 'Master components, state, and props.', link: 'https://react.dev' } },
        { id: '2', type: 'turbo', position: { x: 250, y: 200 }, data: { title: 'Master Node.js', description: 'Understand the event loop and build basic APIs.', link: 'https://nodejs.org' } },
        { id: '3', type: 'turbo', position: { x: 250, y: 400 }, data: { title: 'Database Integration', description: 'Connect MongoDB using Mongoose.', link: 'https://mongoosejs.com/' } },
    ];

    const initialEdges = [
        { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#4f46e5', strokeWidth: 2 } },
        { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#4f46e5', strokeWidth: 2 } },
    ];

    return (
        <main className="min-h-screen flex flex-col w-full bg-slate-50 text-slate-900 font-sans">
            <Navbar />

            <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto pt-24 px-6 pb-6">

                {/* --- TOP BAR: Back Button & Title --- */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/roadmap"
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Summary
                    </Link>

                    <div className="flex items-center gap-2 text-slate-900">
                        <Network className="text-indigo-600" />
                        <h1 className="text-xl font-bold">Interactive Execution Plan</h1>
                    </div>
                </div>

                {/* --- FULLSCREEN CANVAS CONTAINER --- */}
                <div className="flex-1 bg-white p-2 sm:p-4 rounded-[2rem] shadow-xl border border-slate-200/60 ring-4 ring-slate-50 min-h-[600px] flex flex-col">
                    <div className="flex-1 w-full rounded-3xl overflow-hidden relative bg-slate-50/50">
                        <RoadmapVisualizer nodes={initialNodes} edges={initialEdges} />
                    </div>
                </div>

            </div>
        </main>
    );
}