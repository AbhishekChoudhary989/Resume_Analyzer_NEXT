export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;

    try {
        // 1. Import the library
        const lib = (await import("pdfjs-dist/build/pdf.mjs")) as any;

        // 2. Point to the LOCAL worker in your public folder
        // ✅ TRICK: Added '?v=5.4.624' to force browser to ignore old cached versions
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs?v=5.4.624";

        console.log("✅ PDF Preview Worker Configured (Local)");

        pdfjsLib = lib;
        return lib;
    } catch (error) {
        console.error("❌ Failed to load PDF.js library:", error);
        throw new Error("Could not load PDF preview engine");
    }
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();

        // 3. Load Document (Using CDN for Font Maps is fine and recommended)
        const loadingTask = lib.getDocument({
            data: arrayBuffer,
            cMapUrl: `https://unpkg.com/pdfjs-dist@${lib.version}/cmaps/`,
            cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // 4. Render Setup
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) return { imageUrl: "", file: null, error: "Canvas Context Failed" };

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // 5. White Background (Critical for non-transparent images)
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 6. Render
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    const originalName = file.name.replace(/\.pdf$/i, "");
                    const imageFile = new File([blob], `${originalName}-preview.png`, {
                        type: "image/png",
                    });

                    resolve({
                        imageUrl: URL.createObjectURL(blob),
                        file: imageFile,
                    });
                } else {
                    resolve({ imageUrl: "", file: null, error: "Blob creation failed" });
                }
            }, "image/png");
        });

    } catch (err: any) {
        console.error("❌ PDF Preview Error:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Preview failed: ${err.message || err}`,
        };
    }
}