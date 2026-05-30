import { readPdfText } from 'pdf-text-reader';

/**
 * Extracts raw text lines from a PDF Buffer array.
 * ✅ PURE VERCEL COMPATIBLE: No Webpack overrides, no require hooks,
 * no node_modules file path searches, and zero compilation errors.
 */
export async function parsePdf(dataBuffer: Buffer) {
    try {
        // Safe conversion of memory stream buffer to Uint8Array
        const uint8Array = new Uint8Array(dataBuffer);

        // Parse raw text directly using native standard ES modules
        const fullText = await readPdfText({ data: uint8Array });

        console.log(`✅ Success! Extracted ${fullText.length} characters using native reader.`);

        return {
            text: fullText || "",
            numpages: 1
        };
    } catch (error: any) {
        console.error("PDF Native Reading Error:", error);
        throw new Error("Failed to process text layers: " + error.message);
    }
}