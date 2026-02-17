import { NextResponse } from 'next/server';
import { generateCodeQuestReview } from '@/app/lib/ai-service';

export async function POST(req: Request) {
    try {
        const { code } = await req.json();
        const result = await generateCodeQuestReview(code);
        return NextResponse.json({ result });
    } catch (error) {
        return NextResponse.json({ error: "Failed to process code review" }, { status: 500 });
    }
}