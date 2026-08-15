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
import { generateRoadmap, extractSearchParams } from '../../../lib/ai-service';
import { connectDB } from '../../../lib/db';
import { parsePdf } from '../../../lib/pdf-loader';

export async function POST(req: Request) {
    try {
        await connectDB();
        const formData = await req.formData();
        const file = formData.get('resume') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
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