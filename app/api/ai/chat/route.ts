import { NextResponse } from 'next/server';

// ✅ RELATIVE IMPORTS: Ensures files are found correctly
import { parsePdf } from '../../../lib/pdf-loader';
import { analyzeResume } from '../../../lib/ai-service';
import { connectDB } from '../../../lib/db';

export async function POST(req: Request) {
    try {
        // 1. Establish cloud database cluster connection
        await connectDB();

        // Read incoming browser data string payloads
        const { prompt, pdfBase64 } = await req.json();
        let resumeText = "";

        if (!pdfBase64) {
            return NextResponse.json({ error: "Missing uploaded file data string." }, { status: 400 });
        }

        try {
            // 2. Convert incoming base64 payload straight into a raw memory data buffer
            const dataBuffer = Buffer.from(pdfBase64, 'base64');

            // 3. Parse text layer cleanly out of pure server RAM memory
            const pdfData = await parsePdf(dataBuffer);
            resumeText = pdfData.text.replace(/\0/g, '').trim();

            // 🔍 DEBUG LOG: SHOW ME THE TEXT!
            console.log("--------------------------------------------------");
            console.log("📄 PURE-JS PDF PARSING SUCCESSFUL");
            console.log("Characters Extracted:", resumeText.length);
            console.log("--------------------------------------------------");
        } catch (parseError: any) {
            console.error("❌ Parsing Bridge Exception:", parseError);
            return NextResponse.json({ error: "Failed to read data structure from PDF string: " + parseError.message }, { status: 422 });
        }

        if (!resumeText || resumeText.length < 50) {
            return NextResponse.json({ error: "Resume text is empty or too short." }, { status: 400 });
        }

        // 4. Send clean string text to your core AI analysis service configurations
        const jobTitle = prompt.replace("Target Role:", "").split('.')[0].trim();
        console.log(`🤖 Analyzing with AI for role: ${jobTitle}...`);

        const analysis = await analyzeResume(resumeText, jobTitle);

        return NextResponse.json({ message: { content: JSON.stringify(analysis) } });

    } catch (error: any) {
        console.error("❌ Route Error:", error);
        return NextResponse.json({ error: "Analysis Failed: " + error.message }, { status: 500 });
    }
}