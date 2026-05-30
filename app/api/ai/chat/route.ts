import { NextResponse } from 'next/server';

// ✅ RELATIVE IMPORTS: Clean and verified mapping
import { parsePdf } from '../../../lib/pdf-loader';
import { analyzeResume } from '../../../lib/ai-service';
import { connectDB } from '../../../lib/db';

export async function POST(req: Request) {
    try {
        // 1. Connect to MongoDB Atlas
        await connectDB();

        const { prompt, pdfBase64 } = await req.json();
        let resumeText = "";

        if (!pdfBase64) {
            return NextResponse.json({ error: "Missing uploaded file data string." }, { status: 400 });
        }

        try {
            // 2. Convert incoming base64 payload straight into a raw memory data buffer
            const dataBuffer = Buffer.from(pdfBase64, 'base64');

            // 3. Parse the PDF text cleanly using our updated, serverless-safe helper
            const pdfData = await parsePdf(dataBuffer);
            resumeText = pdfData.text.replace(/\0/g, '').trim();

            console.log("--------------------------------------------------");
            console.log("📄 CLOUD PARSING PIPELINE COMPLETE");
            console.log("Characters Extracted:", resumeText.length);
            console.log("--------------------------------------------------");
        } catch (parseError: any) {
            console.error("❌ PDF Parsing Bridge Failed:", parseError);
            return NextResponse.json({ error: "Failed to read data layer from PDF: " + parseError.message }, { status: 422 });
        }

        if (!resumeText || resumeText.length < 50) {
            return NextResponse.json({ error: "Resume text is empty or too short." }, { status: 400 });
        }

        // 4. Send plain text string over to your Gemini core AI models for analysis
        const jobTitle = prompt.replace("Target Role:", "").split('.')[0].trim();
        console.log(`🤖 Analyzing with AI for role: ${jobTitle}...`);

        const analysis = await analyzeResume(resumeText, jobTitle);

        return NextResponse.json({ message: { content: JSON.stringify(analysis) } });

    } catch (error: any) {
        console.error("❌ Route Execution Error:", error);
        return NextResponse.json({ error: "Analysis Failed: " + error.message }, { status: 500 });
    }
}