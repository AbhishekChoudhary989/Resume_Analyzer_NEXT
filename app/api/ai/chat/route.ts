import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ✅ RELATIVE IMPORTS: Ensures files are found correctly
import { parsePdf } from '../../../lib/pdf-loader';
import { analyzeResume } from '../../../lib/ai-service';
import { connectDB } from '../../../lib/db';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { prompt, fileUrl } = await req.json();
        let resumeText = "";

        // 1. Resolve File Path from URL
        if (fileUrl && fileUrl.includes('/uploads/')) {
            const filename = fileUrl.split('/uploads/')[1];
            // Uses standard file system path to find the uploaded file
            const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

            if (fs.existsSync(filePath)) {
                // 2. Parse the PDF
                const dataBuffer = fs.readFileSync(filePath);
                const pdfData = await parsePdf(dataBuffer);

                // Clean up the text (remove null bytes)
                resumeText = pdfData.text.replace(/\0/g, '').trim();

                // 🔍 DEBUG LOG: SHOW ME THE TEXT!
                // This prints the first 500 characters to your VS Code terminal.
                console.log("--------------------------------------------------");
                console.log("📄 PDF PARSING SUCCESSFUL");
                console.log("Characters Extracted:", resumeText.length);
                console.log("Preview (First 200 chars):");
                console.log(resumeText.substring(0, 500) + "...");
                console.log("--------------------------------------------------");

            } else {
                console.error("❌ File not found at path:", filePath);
                return NextResponse.json({ error: "File not found on server." }, { status: 404 });
            }
        }

        if (!resumeText || resumeText.length < 50) {
            return NextResponse.json({ error: "Resume text is empty or too short." }, { status: 400 });
        }

        // 3. Send to AI for Analysis
        const jobTitle = prompt.replace("Target Role:", "").split('.')[0].trim();
        console.log(`🤖 Analyzing with AI for role: ${jobTitle}...`);

        const analysis = await analyzeResume(resumeText, jobTitle);

        return NextResponse.json({ message: { content: JSON.stringify(analysis) } });

    } catch (error: any) {
        console.error("❌ Route Error:", error);
        return NextResponse.json({ error: "Analysis Failed: " + error.message }, { status: 500 });
    }
}