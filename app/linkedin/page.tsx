"use client";

import { useEffect, useState } from "react";
import { Linkedin, Loader2, ArrowLeft, PenTool, Sparkles, TrendingUp, Users, Target, Zap } from "lucide-react";
import Link from "next/link";
import LinkedInOptimizer from "@/components/LinkedInOptimizer";
import ModuleLanding from "@/components/ModuleLanding"; // Import the new layout!

export default function LinkedInPage() {
    const [resumeText, setResumeText] = useState<string | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isStarted, setIsStarted] = useState(false); // Controls showing the tool

    useEffect(() => {
        const fetchLatestResume = async () => {
            try {
                const res = await fetch('/api/kv/list', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pattern: 'resume:*' })
                });

                if (res.ok) {
                    const data = await res.json();
                    const sortedData = data.reverse();
                    if (sortedData.length > 0) {
                        const latest = sortedData[0];
                        const contentToOptimize = latest.feedback || latest.summary || latest;
                        setResumeText(JSON.stringify(contentToOptimize));
                    }
                }
            } catch (error) {
                console.error("Failed to load latest resume:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchLatestResume();
    }, []);

    // IF THE USER CLICKS START, SHOW THE ACTUAL TOOL
    if (isStarted && resumeText) {
        return (
            <div className="min-h-screen bg-slate-50 p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <button onClick={() => setIsStarted(false)} className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0A66C2] font-bold">
                        <ArrowLeft size={16} /> Back to Info
                    </button>
                    <LinkedInOptimizer resumeText={resumeText} />
                </div>
            </div>
        );
    }

    // OTHERWISE, SHOW THE BEAUTIFUL LANDING PAGE
    return (
        <ModuleLanding
            title="LinkedIn Optimizer: Build a Viral Professional Brand"
            subtitle="Transform your raw resume data into an engaging, story-driven LinkedIn profile. Our AI analyzes your skills and experience to generate headlines and bios that recruiters actively search for."

            heroGraphic={<Linkedin size={120} className="text-[#0A66C2]" />}

            actionComponent={
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setIsStarted(true)}
                        disabled={isLoadingData || !resumeText}
                        className="bg-[#0A66C2] text-white px-8 py-4 rounded-full font-black text-lg hover:bg-[#004182] transition-transform hover:-translate-y-1 shadow-xl shadow-blue-200 disabled:opacity-50 disabled:hover:translate-y-0 w-max flex items-center gap-3"
                    >
                        {isLoadingData ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        {isLoadingData ? "Syncing Data..." : !resumeText ? "Upload a Resume First" : "Start Optimizing Profile"}
                    </button>
                    {!resumeText && !isLoadingData && (
                        <p className="text-sm text-red-500 font-bold">*You must analyze a resume on the dashboard first.</p>
                    )}
                </div>
            }

            features={[
                { icon: <PenTool size={32}/>, title: "Viral Headlines", desc: "Move beyond just job titles. Generate dynamic headlines that showcase your true value." },
                { icon: <TrendingUp size={32}/>, title: "Story-Driven Bios", desc: "Turn bullet points into a compelling narrative that highlights your professional journey." },
                { icon: <Target size={32}/>, title: "Strategic Skilling", desc: "Identify exactly which skills to pin to the top of your profile to increase search visibility." }
            ]}

            steps={[
                { title: "Sync Your Data", desc: "We securely fetch your latest ATS-scored resume data from our database." },
                { title: "AI Generation", desc: "Our advanced models rewrite your experience into a premium, engaging format." },
                { title: "Review & Copy", desc: "Review the suggested sections and copy them directly into your LinkedIn." },
                { title: "Manual Checklist", desc: "Follow our final manual steps (like recording name pronunciation) to complete your profile." }
            ]}

            whyUse={[
                { icon: <Users size={24}/>, title: "3x More Connections", desc: "Profiles with optimized skills and complete summaries receive significantly more inbound connection requests." },
                { icon: <Zap size={24}/>, title: "Recruiter Visibility", desc: "By using the exact keywords recruiters search for, you rank higher in LinkedIn Recruiter search results." },
                { icon: <Sparkles size={24}/>, title: "Personal Branding", desc: "Establish yourself as a passionate professional rather than just another job applicant." }
            ]}
        />
    );
}