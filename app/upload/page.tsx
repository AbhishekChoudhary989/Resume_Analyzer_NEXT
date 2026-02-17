"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/components/FileUploader";
import Navbar from "@/components/Navbar";
// ✅ FIX: Use relative path (Go up one folder, then into lib)
import { convertPdfToImage } from "../lib/pdf2img";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(""); // To show progress updates
    const [errorMsg, setErrorMsg] = useState("");

    const handleAnalyze = async () => {
        setErrorMsg("");
        if (!file || jobTitle.length < 2) return setErrorMsg("Upload a resume and enter a valid Job Title.");

        setLoading(true);
        setStatus("Generating preview image...");

        try {
            // ---------------------------------------------------------
            // 1. GENERATE IMAGE (This was missing!)
            // ---------------------------------------------------------
            // We use your fixed pdf2img.ts to create a .png file
            const imageResult = await convertPdfToImage(file);
            const imageFile = imageResult.file;

            if (!imageFile) {
                console.warn("Image generation failed, continuing with PDF only...");
            }

            // ---------------------------------------------------------
            // 2. UPLOAD BOTH FILES (PDF + IMAGE)
            // ---------------------------------------------------------
            setStatus("Uploading files...");
            const formData = new FormData();
            formData.append("files", file);         // The PDF
            if (imageFile) {
                formData.append("files", imageFile); // The Preview Image
            }

            const uploadRes = await fetch("/api/files/upload", { method: "POST", body: formData });
            if (!uploadRes.ok) throw new Error("Upload failed.");

            const filesData = await uploadRes.json();

            // Find which URL is which
            const pdfUrl = filesData.find((f: any) => f.url.endsWith(".pdf"))?.url || filesData[0]?.url;
            const imageUrl = filesData.find((f: any) => f.url.endsWith(".png"))?.url || "";

            // ---------------------------------------------------------
            // 3. AI ANALYSIS
            // ---------------------------------------------------------
            setStatus("Analyzing resume with AI...");
            const aiRes = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `Target Role: ${jobTitle}. strict JSON return.`,
                    fileUrl: pdfUrl
                })
            });

            if (!aiRes.ok) throw new Error("AI Analysis Failed.");
            const aiData = await aiRes.json();

            // Clean up the response
            const content = aiData.message.content.replace(/```json|```/g, "").trim();
            const feedback = JSON.parse(content);

            // ---------------------------------------------------------
            // 4. SAVE (Include the Image URL!)
            // ---------------------------------------------------------
            const newId = Date.now().toString();
            await fetch("/api/kv/set", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: `resume:${newId}`,
                    value: {
                        id: newId,
                        jobTitle,
                        overallScore: feedback.overallScore || 0,
                        resumePath: pdfUrl,
                        previewUrl: imageUrl, // ✅ SAVING THE IMAGE URL HERE
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

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-2xl mx-auto pt-24 px-6">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                    <h1 className="text-3xl font-black mb-6 text-slate-900">New Analysis</h1>

                    {errorMsg && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg text-sm font-bold">{errorMsg}</div>}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Target Job Title</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Frontend Developer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Upload Resume (PDF)</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4">
                                <FileUploader onFileSelect={setFile} />
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all"
                        >
                            {loading ? status : "Start Analysis"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}