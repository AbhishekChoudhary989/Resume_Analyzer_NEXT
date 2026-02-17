import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import KeyValue from '@/models/KeyValue';

export async function GET() {
    try {
        await connectDB();

        // Find all resumes, sort by oldest to newest
        const history = await KeyValue.find({ key: { $regex: '^resume:' } })
            .sort({ createdAt: 1 })
            .limit(30);

        // Format for the Chart
        const chartData = history.map(doc => ({
            date: doc.createdAt
                ? new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'N/A',
            score: doc.value.overallScore || 0,
        }));

        return NextResponse.json(chartData);
    } catch (error: any) {
        console.error("History Error:", error);
        return NextResponse.json([]);
    }
}