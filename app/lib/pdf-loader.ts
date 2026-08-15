import pdf from 'pdf-parse';

export async function parsePdf(dataBuffer: Buffer) {
    try {
        const data = await pdf(dataBuffer);
        console.log(`Success! Extracted ${data.text.length} characters using pdf-parse.`);
        return {
            text: data.text || "",
            numpages: data.numpages || 1
        };
    } catch (error: any) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Failed to process text layers: " + error.message);
    }
}