"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Summary from "@/components/Summary";
import ATS from "@/components/ATS";
import Details from "@/components/Details";
import LinkedInOptimizer from "@/components/LinkedInOptimizer";

export default function ResumePage() {
    const params = useParams();
    const id = params?.id as string;

    const [feedback, setFeedback] = useState<any | null>(null);
    const [rawText, setRawText] = useState("");
    const [loading, setLoading] = useState(true);
    const [resumeUrl, setResumeUrl] = useState("");

    useEffect(() => {
        if (!id) return;

        // Fetch data from your KV store
        fetch(`/api/kv/get/resume:${id}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    if (data.previewUrl) setResumeUrl(data.previewUrl);
                    else if (data.imagePath) setResumeUrl(data.imagePath);
                    else if (data.resumePath) setResumeUrl(data.resumePath);

                    const parsedFeedback = typeof data.feedback === 'string'
                        ? JSON.parse(data.feedback)
                        : data.feedback;

                    setFeedback(parsedFeedback);
                    setRawText(JSON.stringify(parsedFeedback));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
            <div className="w-full md:w-1/2 bg-slate-200 h-[50vh] md:h-screen sticky top-0 border-r border-slate-300">
                <div className="absolute top-4 left-4 z-10">
                    <Link href="/" className="bg-white/90 px-3 py-1 rounded-md text-sm font-bold text-slate-700 shadow-sm hover:bg-white">
                        ← Back
                    </Link>
                </div>
                {resumeUrl ? (
                    // ✅ FIXED: Safely identify Base64 Data image strings or standard file extensions
                    resumeUrl.startsWith("data:image") || resumeUrl.endsWith(".png") || resumeUrl.endsWith(".jpg") ? (
                        <img src={resumeUrl} alt="Resume Preview" className="w-full h-full object-contain bg-slate-800" />
                    ) : (
                        <iframe src={resumeUrl} className="w-full h-full" title="Resume PDF" />
                    )
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">Loading Preview...</div>
                )}
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-6">Neural Review</h1>
                {loading ? (
                    <div className="text-center py-10 text-slate-500">Analyzing data...</div>
                ) : feedback ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <Summary feedback={feedback} />
                        <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
                        <Details feedback={feedback} />
                        <LinkedInOptimizer resumeText={rawText} />
                    </div>
                ) : (
                    <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center font-medium">
                        Analysis unavailable. Please retry.
                    </div>
                )}
            </div>
        </div>
    );
}