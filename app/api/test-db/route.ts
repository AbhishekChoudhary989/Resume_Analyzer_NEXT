import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db'; // ✅ FIXED: Added curly braces { }
import Test from '@/models/Test';

export async function GET() {
    try {
        // 1. Connect to DB
        await connectDB();

        // 2. Create a test entry
        const newEntry = await Test.create({
            name: "Connection Test Success!",
        });

        // 3. Return the data to the browser
        return NextResponse.json({
            success: true,
            message: "Data saved to MongoDB!",
            data: newEntry
        });
    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}