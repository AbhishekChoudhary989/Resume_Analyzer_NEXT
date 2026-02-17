import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import KeyValue from '@/models/KeyValue';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ key: string }> } // Params are async in Next.js 15+
) {
    try {
        await connectDB();
        const { key } = await params;

        const item = await KeyValue.findOne({ key });

        if (!item) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(item.value);
    } catch (error: any) {
        console.error("KV Get Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}