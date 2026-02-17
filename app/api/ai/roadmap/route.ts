import { NextResponse } from 'next/server';
import { generateRoadmap, extractSearchParams } from '@/app/lib/ai-service';
import { connectDB } from '@/app/lib/db';
import { parsePdf } from '@/app/lib/pdf-loader'; // ✅ Corrected path to root lib

export async function POST(req: Request) {
    try {
        await connectDB();
        const formData = await req.formData();
        const file = formData.get('resume') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Use the fixed helper to extract text
        const pdfData = await parsePdf(buffer);
        const resumeText = pdfData.text.replace(/\0/g, '').trim();

        if (resumeText.length < 50) {
            return NextResponse.json({ error: "Resume text too short." }, { status: 400 });
        }

        const searchParams = await extractSearchParams(resumeText);
        const roadmap = await generateRoadmap(resumeText, searchParams);

        return NextResponse.json({
            analysis: roadmap,
            searchParams: searchParams
        });

    } catch (error: any) {
        console.error("Roadmap Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}