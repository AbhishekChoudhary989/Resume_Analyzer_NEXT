import pdfParse from 'pdf-parse';

/**
 * Extracts text from a PDF Buffer using pdf-parse.
 * ✅ SERVERLESS OPTIMIZED: Runs entirely in memory without relying on
 * physical disk paths, node_modules paths, or local worker files.
 */
export async function parsePdf(dataBuffer: Buffer) {
    try {
        // Parse the raw PDF data buffer entirely inside server RAM memory
        const data = await pdfParse(dataBuffer);

        console.log(`✅ Success! Extracted ${data.text?.length || 0} characters using pure-JS parser.`);

        return {
            text: data.text || "",
            numpages: data.numpages || 1
        };
    } catch (error: any) {
        console.error("Pure-JS PDF Parsing Error:", error);
        throw new Error("Failed to parse PDF content: " + error.message);
    }
}