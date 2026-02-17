import { NextResponse } from 'next/server';
import { generateAIContent } from '@/app/lib/ai-service';

export async function POST(req: Request) {
    try {
        const { resumeText } = await req.json();
        // Passing "LINKEDIN_OPTIMIZATION" as the prompt type
        const result = await generateAIContent("LINKEDIN_OPTIMIZATION", { resumeText });
        return NextResponse.json({ result });
    } catch (e) {
        return NextResponse.json({ error: "Failed to optimize profile" }, { status: 500 });
    }
}