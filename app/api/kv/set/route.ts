import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import KeyValue from '@/models/KeyValue';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { key, value } = body;

        await KeyValue.findOneAndUpdate(
            { key },
            {
                key,
                value,
                createdAt: new Date() // Updates time for the graph
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("KV Set Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}