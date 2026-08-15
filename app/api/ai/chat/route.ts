// Polyfill browser globals for Vercel Serverless Node Runtime
if (typeof (globalThis as any).DOMMatrix === 'undefined') {
    (globalThis as any).DOMMatrix = class DOMMatrix {};
}
if (typeof (globalThis as any).ImageData === 'undefined') {
    (globalThis as any).ImageData = class ImageData {};
}
if (typeof (globalThis as any).Path2D === 'undefined') {
    (globalThis as any).Path2D = class Path2D {};
}

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { parsePdf } from '../../../lib/pdf-loader';
import { analyzeResume } from '../../../lib/ai-service';
import { connectDB } from '../../../lib/db';
export async function POST(req: Request) {
    try {
        await connectDB();

        const { prompt, pdfBase64 } = await req.json();
        let resumeText = "";

        if (!pdfBase64) {
            return NextResponse.json({ error: "Missing uploaded file data string." }, { status: 400 });
        }

        try {
            const dataBuffer = Buffer.from(pdfBase64, 'base64');
            const pdfData = await parsePdf(dataBuffer);
            resumeText = pdfData.text.replace(/\0/g, '').trim();

            console.log("--------------------------------------------------");
            console.log("CLOUD PARSING PIPELINE COMPLETE");
            console.log("Characters Extracted:", resumeText.length);
            console.log("--------------------------------------------------");
        } catch (parseError: any) {
            console.error("PDF Parsing Bridge Failed:", parseError);
            return NextResponse.json({ error: "Failed to read data layer from PDF: " + parseError.message }, { status: 422 });
        }

        if (!resumeText || resumeText.length < 50) {
            return NextResponse.json({ error: "Resume text is empty or too short." }, { status: 400 });
        }

        const jobTitle = prompt.replace("Target Role:", "").split('.')[0].trim();
        console.log(`Analyzing with AI for role: ${jobTitle}...`);

        const analysis = await analyzeResume(resumeText, jobTitle);

        return NextResponse.json({ message: { content: JSON.stringify(analysis) } });

    } catch (error: any) {
        console.error("Route Execution Error:", error);
        return NextResponse.json({ error: "Analysis Failed: " + error.message }, { status: 500 });
    }
}