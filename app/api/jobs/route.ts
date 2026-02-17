import { NextResponse } from 'next/server';
import { fetchIndeedJobs } from '@/app/lib/scraper';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { job_title, location } = body;

        // Fallback defaults matching your index.js
        const title = job_title || "Developer";
        const loc = location || "India";

        console.log(`🔎 Background Job Search: ${title} in ${loc}`);

        // Call the scraper service
        const liveJobs = await fetchIndeedJobs(title, loc);

        return NextResponse.json({ live_jobs: liveJobs });

    } catch (error) {
        console.error("Job Search Error:", error);
        // Return empty array on error so UI doesn't crash
        return NextResponse.json({ live_jobs: [] });
    }
}