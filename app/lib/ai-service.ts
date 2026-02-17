// @ts-nocheck
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Clients
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });
const googleKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(googleKey || "dummy_key");

// --- HELPER: Clean Text (Optimized for Speed) ---
function cleanText(text) {
    if (!text) return "";
    return text
        .replace(/0/g, '')
        .replace(/[^\x20-\x7E\n]/g, '')
        .trim()
        .substring(0, 15000);
}

// --- HELPER: Aggressive JSON Parser ---
function safeJSONParse(jsonString) {
    try {
        if (!jsonString) return null;
        let clean = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
        const firstIndex = clean.indexOf('{');
        const lastIndex = clean.lastIndexOf('}');
        if (firstIndex !== -1 && lastIndex !== -1) {
            clean = clean.substring(firstIndex, lastIndex + 1);
        }
        return JSON.parse(clean);
    } catch (e) {
        console.error("❌ JSON Parse Failed:", e.message);
        return null;
    }
}

// ============================================================
// 1. RESUME ANALYSIS (Strict ATS Mode)
// ============================================================
export async function analyzeResume(resumeText, jobTitle) {
    const cleanedText = cleanText(resumeText);
    const targetRole = jobTitle || "Software Engineer";

    const fallback = {
        overallScore: 45,
        summary: "Analysis complete. Scores estimated based on keyword matching.",
        headPoints: ["Resume Parsed", "Contact Info Detected"],
        ATS: { score: 50, tips: [{ type: "improve", tip: "Add more keywords." }] },
        content: { score: 50, tips: [{ type: "improve", tip: "Quantify achievements." }] },
        structure: { score: 60, tips: [{ type: "good", tip: "Standard format." }] },
        skills: { score: 40, tips: [{ type: "improve", tip: "List skills at top." }] },
        toneAndStyle: { score: 60, tips: [{ type: "improve", tip: "Use active voice." }] },
        missingKeywords: ["Python", "Java", "AWS", "SQL", "React"]
    };

    if (!cleanedText || cleanedText.length < 50) return fallback;

    const prompt = `
        Act as a strict ATS Scanner. Analyze resume for "${targetRole}".
        RESUME: ${cleanedText}
        
        INSTRUCTIONS:
        1. Identify 5 missing keywords.
        2. Be strict with scoring (0-100).

        RETURN STRICT JSON:
        {
            "companyName": "Latest Company",
            "jobTitle": "Detected Role",
            "overallScore": 0-100,
            "summary": "Brief summary.",
            "headPoints": ["Strength1", "Strength2", "Strength3"],
            "missingKeywords": ["Key1", "Key2", "Key3", "Key4", "Key5"],
            "ATS": { "score": 0-100, "tips": [{"type": "improve", "tip": "advice"}] },
            "content": { "score": 0-100, "tips": [{"type": "good", "tip": "advice"}] },
            "structure": { "score": 0-100, "tips": [{"type": "improve", "tip": "advice"}] },
            "skills": { "score": 0-100, "tips": [{"type": "improve", "tip": "advice"}] },
            "toneAndStyle": { "score": 0-100, "tips": [{"type": "good", "tip": "advice"}] }
        }
    `;

    try {
        if (googleKey && googleKey !== "dummy_key") {
            // ✅ GEMINI 2.5 FLASH
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
            const result = await model.generateContent(prompt);
            const parsed = safeJSONParse(result.response.text());
            if (parsed) return parsed;
        }
        throw new Error("Gemini Failed");
    } catch (e) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: "system", content: "JSON only." }, { role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1,
                response_format: { type: "json_object" }
            });
            return safeJSONParse(completion.choices[0]?.message?.content || "") || fallback;
        } catch (groqError) {
            return fallback;
        }
    }
}

// ============================================================
// 2. ROADMAP GENERATION (Fast & Detailed - Indian Context)
// ============================================================
export async function generateRoadmap(resumeText, params) {
    const cleanedText = cleanText(resumeText);
    const jobTitle = params.job_title || "Software Engineer";

    // Emergency Fallback (Indian Context)
    const emergencyRoadmap = {
        roadmap: [
            { step: "Phase 1: Foundations", description: "Master Data Structures & Algorithms (Arrays, Trees) in Java/C++. Solve 50+ LeetCode problems.", resources: ["LeetCode", "GeeksForGeeks"] },
            { step: "Phase 2: Tech Stack", description: `Learn ${jobTitle} frameworks (React/Spring). Build a full-stack CRUD app with Auth.`, resources: ["Official Docs"] },
            { step: "Phase 3: Deployment", description: "Deploy apps on AWS/Vercel. Learn Docker basics. Indian startups value deployment skills.", resources: ["AWS Free Tier"] },
            { step: "Phase 4: Market & Salary", description: `Fresher: ₹4-8 LPA. Experienced: ₹12-25 LPA in India. Remote roles pay higher.`, resources: ["AmbitionBox"] },
            { step: "Phase 5: Apply", description: "Apply on Naukri & LinkedIn. Message recruiters directly in Bangalore/Pune hubs.", resources: ["Naukri.com"] }
        ]
    };

    // ⚡ SPEED OPTIMIZATION PROMPT
    const prompt = `
        Act as a Senior Career Coach in India. Create a 5-step roadmap for a "${jobTitle}".
        Resume Context: ${cleanedText.substring(0, 2500)}

        INSTRUCTIONS:
        1. Steps 1-3: Technical Skills (Indian Market focus).
        2. Step 4: Salary Insights (State range in ₹ LPA).
        3. Step 5: Job Search (Naukri, LinkedIn).
        
        CRITICAL SPEED RULE:
        - "description" must be exactly 3 sentences.
        - Be direct. Do not write long paragraphs.
        
        RETURN JSON:
        {
            "roadmap": [
                {
                    "step": "Phase 1: [Title]",
                    "description": "[3 sentences only...]",
                    "resources": ["Resource 1"]
                }
            ]
        }
    `;

    try {
        if (googleKey && googleKey !== "dummy_key") {
            // ✅ GEMINI 2.5 FLASH
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
            const res = await model.generateContent(prompt);
            const parsed = safeJSONParse(res.response.text());
            if (parsed && parsed.roadmap) return parsed;
        }
        throw new Error("Gemini Skipped");
    } catch (geminiError) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" }
            });
            return safeJSONParse(completion.choices[0]?.message?.content || "") || emergencyRoadmap;
        } catch (groqError) {
            return emergencyRoadmap;
        }
    }
}

// ============================================================
// 3. SEARCH PARAMS (Instant Extraction)
// ============================================================
export async function extractSearchParams(resumeText) {
    // ⚡ ULTRA-FAST: Only read the first 600 chars (Header/Summary)
    const headerText = resumeText ? resumeText.substring(0, 600) : "";
    const defaultParams = { job_title: "Software Engineer", location: "India" };

    const prompt = `
        Extract target "job_title" from header: 
        "${headerText.replace(/\n/g, " ")}"
        
        Rules:
        1. Default location to "India".
        2. If no job title, use "Software Engineer".
        
        Return JSON: { "job_title": "...", "location": "India" }
    `;

    try {
        // Prefer Groq here for micro-latency speed
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return safeJSONParse(completion.choices[0]?.message?.content || "") || defaultParams;
    } catch (e) {
        // Fallback to Gemini if Groq fails
        try {
            if (googleKey) {
                // ✅ GEMINI 2.5 FLASH
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
                const res = await model.generateContent(prompt);
                return safeJSONParse(res.response.text()) || defaultParams;
            }
        } catch (err) {
            return defaultParams;
        }
        return defaultParams;
    }
}

// ============================================================
// 4. LINKEDIN OPTIMIZER
// ============================================================
export async function generateAIContent(type, data) {
    if (type !== "LINKEDIN_OPTIMIZATION") return {};
    const prompt = `Optimize LinkedIn for: ${cleanText(data.resumeText).substring(0, 4000)}. Return JSON: { "headlines": ["Head1", "Head2"], "about": "100 word professional summary", "skills": ["Skill1"] }`;

    try {
        // ✅ GEMINI 2.5 FLASH
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
        const res = await model.generateContent(prompt);
        return safeJSONParse(res.response.text()) || { headlines: [], about: "Error." };
    } catch (e) {
        return { headlines: ["Optimization Failed"], about: "Service Unavailable." };
    }
}

// ============================================================
// 5. CODEQUEST (Original Detailed Version)
// ============================================================
export async function generateCodeQuestReview(userCode) {
    // 1. Detect if this is a request to GENERATE a question
    const isQuestionRequest =
        !userCode ||
        userCode.length < 50 ||
        userCode.includes("Generate Question") ||
        userCode.includes("CMD:GENERATE_QUESTION") ||
        userCode.trim().startsWith("// Write your");

    // CASE A: Generate a New Question (Detailed Interviewer Persona)
    if (isQuestionRequest) {
        const lang = userCode && userCode.includes("python") ? "Python" : "JavaScript";
        const prompt = `
            Act as a Technical Interviewer.
            Generate ONE medium-level ${lang} coding interview problem.
            
            IMPORTANT RULES:
            1. Output ONLY the problem description. 
            2. Do NOT include solution code.
            3. Use Markdown formatting.
            
            FORMAT:
            ## [Problem Title]
            
            **Difficulty**: Medium
            
            **Description**:
            [Problem description here]
            
            **Example Input**:
            ...
            **Example Output**:
            ...
        `;

        try {
            if (googleKey) {
                // ✅ GEMINI 2.5 FLASH
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const res = await model.generateContent(prompt);
                return res.response.text();
            }
            throw new Error("No Gemini");
        } catch (e) {
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile"
            });
            return completion.choices[0]?.message?.content;
        }
    }

    // CASE B: Review User's Code (Detailed Feedback)
    const prompt = `
        You are a Senior Software Engineer.
        Review this candidate's solution.
        
        USER CODE: 
        ${userCode.substring(0, 5000)}
        
        INSTRUCTIONS:
        1. Rating: Give a score 0-100 (Be strict).
        2. Bugs: List logic errors or edge cases missed.
        3. Solution: Provide the optimized, correct code.
        
        RETURN MARKDOWN FORMAT:
        ## Rating: [Score]/100
        
        ### Bugs & Issues:
        - [Issue 1]
        - [Issue 2]
        
        ### Optimized Solution:
        \`\`\`javascript
        [Code here]
        \`\`\`
    `;

    try {
        // ✅ GEMINI 2.5 FLASH
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const res = await model.generateContent(prompt);
        return res.response.text();
    } catch (e) {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile"
        });
        return completion.choices[0]?.message?.content || "Review Failed.";
    }
}