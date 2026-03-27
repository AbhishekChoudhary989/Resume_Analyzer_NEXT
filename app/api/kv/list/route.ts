import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import KeyValue from '@/models/KeyValue';

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const pattern = body.pattern || '^resume:';

        const all = await KeyValue.find({ key: { $regex: pattern } });
        const values = all.map(doc => doc.value);

        return NextResponse.json(values);
    } catch (error: any) {
        console.error("KV List Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}