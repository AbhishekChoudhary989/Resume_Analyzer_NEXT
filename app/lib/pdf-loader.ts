import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';

/**
 * Extracts text from a PDF Buffer using pdfjs-dist.
 * ✅ FIX: Finds the local worker file and converts it to a 'file://' URL.
 * This satisfies Node.js security requirements on Windows.
 */
export async function parsePdf(dataBuffer: Buffer) {

    // 1. Locate the worker file inside your node_modules
    const workerPath = path.join(
        process.cwd(),
        'node_modules',
        'pdfjs-dist',
        'legacy',
        'build',
        'pdf.worker.mjs'
    );

    // 2. verify it actually exists (Good for debugging)
    if (!fs.existsSync(workerPath)) {
        throw new Error(`Worker file not found at: ${workerPath}`);
    }

    // 3. Convert path (C:\Users\...) to URL (file:///C:/Users/...)
    // This solves the "Protocol c:" error you saw earlier.
    pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

    // 4. Load Document
    const uint8Array = new Uint8Array(dataBuffer);
    const loadingTask = pdfjsLib.getDocument({
        data: uint8Array,
        useSystemFonts: true,
        disableFontFace: true,
        verbosity: 0,
    });

    try {
        const pdfDocument = await loadingTask.promise;
        const numPages = pdfDocument.numPages;
        let fullText = "";

        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => (item as any).str)
                .join(' ');
            fullText += pageText + "\n";
        }

        console.log(`✅ Success! Extracted ${fullText.length} characters.`);

        return {
            text: fullText,
            numpages: numPages
        };
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Failed to parse PDF content.");
    }
}