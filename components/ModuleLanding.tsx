"use client";

import React, { ReactNode } from "react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface LandingProps {
    title: string;
    subtitle: string;
    actionComponent: ReactNode;
    heroGraphic: ReactNode;
    features: { icon: ReactNode; title: string; desc: string }[];
    steps: { title: string; desc: string }[];
    whyUse: { icon: ReactNode; title: string; desc: string }[];
}

export default function ModuleLanding({ title, subtitle, actionComponent, heroGraphic, features, steps, whyUse }: LandingProps) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans overflow-hidden selection:bg-blue-200">

            {/* =========================================
          1. HERO SECTION (Graphical & Immersive)
          ========================================= */}
            <div className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 px-6">
                {/* Abstract Background Graphics */}
                <div className="absolute inset-0 z-0 flex justify-center pointer-events-none">
                    <div className="w-full max-w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 mix-blend-multiply"></div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-16 items-center">

                    {/* Hero Text */}
                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                            AI-Powered Career Intelligence
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            {title.split(':').map((part, index, array) => (
                                <span key={index}>
                      {index === 0 ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{part}</span> : part}
                                    {index < array.length - 1 && ":"}
                  </span>
                            ))}
                        </h1>

                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            {subtitle}
                        </p>

                        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            {actionComponent}
                        </div>
                    </div>

                    {/* Hero Graphic (Glassmorphism Window) */}
                    <div className="lg:col-span-5 relative group hidden md:block">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative h-[450px] w-full bg-white/60 backdrop-blur-2xl border border-white rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none"></div>
                            <div className="transform group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl relative z-10">
                                {heroGraphic}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================
          2. KEY CAPABILITIES (Premium Cards)
          ========================================= */}
            <div className="bg-white py-24 border-t border-slate-100 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-6">Unfair Advantages.</h2>
                        <p className="text-lg text-slate-500 leading-relaxed">Built with enterprise-grade algorithms to give you the exact insights you need to outperform the competition.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="group relative bg-slate-50 rounded-[2rem] p-10 hover:bg-white transition-all duration-300 border border-slate-200 hover:border-blue-200 hover:shadow-[0_8px_40px_rgba(37,99,235,0.08)]">
                                <div className="w-16 h-16 bg-white border border-slate-200 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* =========================================
          3. HOW IT WORKS (Connected Timeline)
          ========================================= */}
            <div className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">

                        {/* Left: Sticky Image Area */}
                        <div className="order-2 lg:order-1 relative h-full min-h-[500px] hidden lg:flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[3rem] transform -rotate-3 border border-white shadow-xl"></div>
                            <div className="relative z-10 bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 w-4/5 aspect-square flex items-center justify-center">
                                {heroGraphic}
                            </div>
                        </div>

                        {/* Right: Step-by-step Content */}
                        <div className="order-1 lg:order-2 space-y-12">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 mb-6">How the system works</h2>
                                <p className="text-lg text-slate-500">A seamless, automated workflow designed to get you from upload to optimized in minutes.</p>
                            </div>

                            <div className="space-y-10 relative before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                {steps.map((step, i) => (
                                    <div key={i} className="relative flex items-start gap-8 group">
                                        <div className="w-14 h-14 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-lg text-slate-900 font-black text-xl z-10 group-hover:border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="pt-2">
                                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                            <p className="text-lg text-slate-600 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================
          4. WHY CHOOSE US (Dark Mode Tech Vibe)
          ========================================= */}
            <div className="bg-[#0B0F19] py-32 relative text-slate-300 border-t border-slate-800">
                {/* Glow Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Why trust this platform?</h2>
                        <p className="text-xl text-slate-400">Engineered to bypass automated filters and immediately capture human attention.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {whyUse.map((reason, i) => (
                            <div key={i} className="bg-slate-900/50 backdrop-blur-lg border border-slate-800 p-10 rounded-[2rem] hover:bg-slate-800/80 hover:border-blue-500/50 transition-all duration-300 group">
                                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 mb-8 border border-slate-700 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all duration-300">
                                    {reason.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{reason.title}</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">{reason.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}