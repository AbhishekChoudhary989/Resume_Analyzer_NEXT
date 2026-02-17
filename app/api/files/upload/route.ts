import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('files') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define the upload directory (public/uploads)
        const uploadDir = join(process.cwd(), 'public', 'uploads');

        // Ensure the directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory already exists
        }

        // Create a unique filename to prevent overwrites
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = file.name.replace(/\s+/g, '-'); // Remove spaces
        const filename = `${uniqueSuffix}-${originalName}`;
        const filepath = join(uploadDir, filename);

        // Write the file to the filesystem
        await writeFile(filepath, buffer);

        // Return the URL that the frontend can use
        // Note: In production, you'd upload to S3/Cloudinary.
        // For local dev, serving from public/uploads works.
        const url = `/uploads/${filename}`;

        return NextResponse.json([{ name: file.name, url }]);
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}