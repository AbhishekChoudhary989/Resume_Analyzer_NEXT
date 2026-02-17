import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();

// ✅ Helper to safely find and parse JSON from messy AI responses
export const safeJSONParse = (text: string) => {
    try {
        // 1. Try parsing directly (Best case)
        return JSON.parse(text);
    } catch (e) {
        // 2. If that fails, look for JSON inside markdown blocks like ```json { ... } ```
        // This Regex finds the content between the first "{" and the last "}"
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (e2) {
                console.error("Failed to extract JSON:", text);
                return null;
            }
        }
        return null;
    }
};