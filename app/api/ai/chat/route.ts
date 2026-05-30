import { NextResponse } from 'next/server';

// ✅ RELATIVE IMPORTS: Ensures files are found correctly
import { parsePdf } from '../../../lib/pdf-loader';
import { analyzeResume } from '../../../lib/ai-service';
import { connectDB } from '../../../lib/db';

export async function POST(req: Request) {
    try {
        // 1. Establish database connection
        await connectDB();

        // Read incoming payload parameters
        const { prompt, pdfBase64 } = await req.json();
        let resumeText = "";

        if (!pdfBase64) {
            return NextResponse.json({ error: "Missing uploaded file data string." }, { status: 400 });
        }

        try {
            // 2. Convert incoming base64 payload straight into a raw memory data buffer
            const dataBuffer = Buffer.from(pdfBase64, 'base64');

            // ✅ FIX FOR VERCEL: Disable native canvas hook check on backend serverless functions
            // This prevents pdfjs from looking for '@napi-rs/canvas'
            const pdfjsLib = require('pdfjs-dist/build/pdf.mjs');
            if (pdfjsLib?.GlobalWorkerOptions) {
                pdfjsLib.GlobalWorkerOptions.disableFontFace = true;
            }

            // 3. Parse the PDF out of pure server RAM memory
            const pdfData = await parsePdf(dataBuffer);

            // Clean up the text (remove null bytes)
            resumeText = pdfData.text.replace(/\0/g, '').trim();

            // 🔍 DEBUG LOG: SHOW ME THE TEXT!
            console.log("--------------------------------------------------");
            console.log("📄 PDF PARSING SUCCESSFUL (FROM MEMORY BUFFER)");
            console.log("Characters Extracted:", resumeText.length);
            console.log("--------------------------------------------------");
        } catch (parseError: any) {
            console.error("❌ PDF Parsing Exception:", parseError);
            return NextResponse.json({ error: "Failed to read data structure from PDF string: " + parseError.message }, { status: 422 });
        }

        if (!resumeText || resumeText.length < 50) {
            return NextResponse.json({ error: "Resume text is empty or too short." }, { status: 400 });
        }

        // 4. Send clean text over to AI service configuration for Analysis
        const jobTitle = prompt.replace("Target Role:", "").split('.')[0].trim();
        console.log(`🤖 Analyzing with AI for role: ${jobTitle}...`);

        const analysis = await analyzeResume(resumeText, jobTitle);

        return NextResponse.json({ message: { content: JSON.stringify(analysis) } });

    } catch (error: any) {
        console.error("❌ Route Error:", error);
        return NextResponse.json({ error: "Analysis Failed: " + error.message }, { status: 500 });
    }
}