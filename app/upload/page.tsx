"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/components/FileUploader";
import Navbar from "@/components/Navbar";
import { convertPdfToImage } from "../lib/pdf2img";
import ModuleLanding from "@/components/ModuleLanding";
import { Search, FileText, BarChart3, ShieldCheck, Target, Bot, SearchCode } from "lucide-react";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    // Helper to turn the browser file object into a base64 string
    const fileToBase64 = (targetFile: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(targetFile);
            reader.onload = () => {
                const base64String = (reader.result as string).split(",")[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleAnalyze = async () => {
        setErrorMsg("");
        if (!file || jobTitle.length < 2) return setErrorMsg("Upload a resume and enter a valid Job Title.");

        setLoading(true);
        setStatus("Generating preview image...");

        try {
            let base64Preview = "";
            try {
                const imageResult = await convertPdfToImage(file);
                // ✅ Targets your fresh base64 string property directly with fallback
                base64Preview = imageResult.base64 || imageResult.imageUrl || "";
            } catch (imgErr) {
                console.warn("Image generation failed, continuing with PDF only...", imgErr);
            }

            setStatus("Reading resume contents...");
            // Convert the user's uploaded PDF file directly into a base64 string right in the browser
            const pdfBase64String = await fileToBase64(file);

            setStatus("Analyzing resume with AI...");
            const aiRes = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `Target Role: ${jobTitle}. strict JSON return.`,
                    pdfBase64: pdfBase64String // Sent directly via data payload
                })
            });

            if (!aiRes.ok) throw new Error("AI Analysis Failed.");
            const aiData = await aiRes.json();
            const content = aiData.message.content.replace(/```json|```/g, "").trim();
            const feedback = JSON.parse(content);

            const newId = Date.now().toString();
            setStatus("Saving analysis data...");

            await fetch("/api/kv/set", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: `resume:${newId}`,
                    value: {
                        id: newId,
                        jobTitle,
                        overallScore: feedback.overallScore || 0,
                        resumePath: "",
                        previewUrl: base64Preview,
                        feedback,
                        createdAt: new Date()
                    }
                })
            });

            router.push(`/resume/${newId}`);
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || "Analysis Error");
        } finally {
            setLoading(false);
            setStatus("");
        }
    };

    if (isStarted) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-2xl mx-auto pt-24 px-6">
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                        <button onClick={() => setIsStarted(false)} className="text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 flex items-center gap-2">
                            ← Back to Info
                        </button>
                        <h1 className="text-3xl font-black mb-6 text-slate-900">New Analysis</h1>
                        {errorMsg && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg text-sm font-bold">{errorMsg}</div>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Target Job Title</label>
                                <input type="text" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Frontend Developer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Upload Resume (PDF)</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4">
                                    <FileUploader onFileSelect={setFile} />
                                </div>
                            </div>
                            <button onClick={handleAnalyze} disabled={loading} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all">
                                {loading ? status : "Start Analysis"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ModuleLanding
            title="ATS Resume Checker: Scan & Score Your Resume"
            subtitle="Beat the bots. Our AI-powered checker simulates modern Applicant Tracking Systems to ensure your resume reaches a human hiring manager."
            heroGraphic={
                <div className="relative w-full max-w-xl mx-auto rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)] border-4 border-white/20">
                    <img src="/images/resume-mockup.png" alt="ATS Resume Scanner Mockup" className="w-full h-auto object-contain" />
                </div>
            }
            actionComponent={
                <button onClick={() => setIsStarted(true)} className="bg-slate-900 text-white px-8 py-4 rounded-full font-black text-lg hover:-translate-y-1 transition-all shadow-xl shadow-slate-200 flex items-center gap-3">
                    <Search /> Scan My Resume
                </button>
            }
            features={[
                { icon: <Bot size={32}/>, title: "Industry AI Models", desc: "Analyzed by state-of-the-art LLMs trained on millions of successful hiring patterns." },
                { icon: <BarChart3 size={32}/>, title: "Real-time Scoring", desc: "Instantly see your compatibility percentage matched against your target job title." },
                { icon: <FileText size={32}/>, title: "Format Analysis", desc: "We check for parsing errors that cause standard ATS to fail." }
            ]}
            steps={[
                { title: "Upload PDF", desc: "Drop your existing resume into our secure sandbox." },
                { title: "Define Target", desc: "Specify the job title you are aiming for." },
                { title: "AI Analysis", desc: "Our neural core processes keywords, tone, and structure." },
                { title: "Fix & Download", desc: "Apply suggestions and re-check until you hit 85%." }
            ]}
            whyUse={[
                { icon: <Target size={28}/>, title: "Keyword Precision", desc: "Identify exactly which technical and soft skills you are missing compared to industry standards." },
                { icon: <ShieldCheck size={28}/>, title: "Parsing Safety", desc: "Ensure your document structure doesn't confuse parsing software, preventing lost data." },
                { icon: <Search size={28}/>, title: "Recruiter's View", desc: "See your resume through the lens of modern hiring tech." }
            ]}
        />
    );
}