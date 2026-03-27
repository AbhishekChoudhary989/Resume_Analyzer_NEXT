// @ts-nocheck
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Initialize Clients
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });
const googleKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(googleKey || "dummy_key");

// --- HELPER: Clean Text ---
function cleanText(text: string) {
    if (!text) return "";
    return text
        .replace(/\0/g, '')
        .replace(/[^\x20-\x7E\n]/g, '')
        .trim()
        .substring(0, 15000);
}

// --- HELPER: Safe JSON Parser ---
function safeJSONParse(jsonString: string) {
    try {
        if (!jsonString) return null;
        let clean = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
        const first = clean.indexOf('{');
        const last = clean.lastIndexOf('}');
        if (first !== -1 && last !== -1) {
            clean = clean.substring(first, last + 1);
        }
        return JSON.parse(clean);
    } catch (e) {
        return null;
    }
}

// ============================================================
// 1. RESUME ANALYSIS (Strict ATS Mode)
// ============================================================
export async function analyzeResume(resumeText: string, jobTitle: string) {
    const cleanedText = cleanText(resumeText);
    const targetRole = jobTitle || "Software Engineer";

    const fallback = {
        overallScore: 40,
        summary: "Analysis incomplete. Please retry.",
        headPoints: ["Resume Parsed"],
        ATS: { score: 40, tips: [{ type: "improve", tip: "Ensure resume matches job description." }] },
        content: { score: 50, tips: [] },
        structure: { score: 60, tips: [] },
        skills: { score: 40, tips: [] },
        toneAndStyle: { score: 70, tips: [] },
        missingKeywords: ["Java", "Python", "React"]
    };

    const prompt = `
        You are a Ruthless ATS Scanner.
        TARGET ROLE: "${targetRole}"
        RESUME: ${cleanedText}

        INSTRUCTIONS:
        1. Compare strictly against "${targetRole}".
        2. If the resume is for a different field, score under 40.
        3. Identify 5 missing keywords relevant to the role.
        
        RETURN EXACT JSON:
        {
            "companyName": "Last Company",
            "jobTitle": "Detected Role",
            "overallScore": 0-100,
            "summary": "2-sentence summary.",
            "headPoints": ["Strength1", "Strength2", "Strength3"],
            "missingKeywords": ["Key1", "Key2", "Key3"],
            "ATS": { "score": 0-100, "tips": [{"type": "improve", "tip": "advice"}] },
            "content": { "score": 0-100, "tips": [{"type": "good", "tip": "advice"}] },
            "structure": { "score": 0-100, "tips": [{"type": "improve", "tip": "advice"}] },
            "skills": { "score": 0-100, "tips": [{"type": "improve", "tip": "advice"}] },
            "toneAndStyle": { "score": 0-100, "tips": [{"type": "good", "tip": "advice"}] }
        }
    `;

    try {
        if (googleKey && googleKey !== "dummy_key") {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
            const result = await model.generateContent(prompt);
            const parsed = safeJSONParse(result.response.text());
            if (parsed) return parsed;
        }
        throw new Error("Gemini Failed");
    } catch (error) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: "system", content: "Strict ATS Scanner. JSON only." }, { role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile",
                temperature: 0.2,
                response_format: { type: "json_object" }
            });
            return safeJSONParse(completion.choices[0]?.message?.content) || fallback;
        } catch (groqError) {
            return fallback;
        }
    }
}

// ============================================================
// 2. ROADMAP GENERATION
// ============================================================
export async function generateRoadmap(resumeText: string, params: any) {
    const cleanedText = cleanText(resumeText);
    const fallback = { roadmap: [{ step: "Basics", description: "Learn fundamentals.", resources: [] }] };

    const prompt = `
        Create a 5-step roadmap for ${params.job_title || "Developer"} in ${params.location || "India"}.
        RESUME CONTEXT: ${cleanedText.substring(0, 4000)}
        
        RETURN JSON: 
        { "roadmap": [{ "step": "Phase 1: ...", "description": "3 sentences max.", "resources": ["Resource 1"] }] }
    `;

    try {
        if (googleKey && googleKey !== "dummy_key") {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
            const res = await model.generateContent(prompt);
            const parsed = safeJSONParse(res.response.text());
            if (parsed) return parsed;
        }
        throw new Error("Gemini Failed");
    } catch (e) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" }
            });
            return safeJSONParse(completion.choices[0]?.message?.content) || fallback;
        } catch (err) {
            return fallback;
        }
    }
}

// ============================================================
// 3. SEARCH PARAMS
// ============================================================
export async function extractSearchParams(resumeText: string) {
    const cleanedText = cleanText(resumeText);
    const defaultParams = { job_title: "Software Engineer", location: "India" };

    const prompt = `Extract job_title and location from: ${cleanedText.substring(0, 1000)}. Return JSON: { "job_title": "...", "location": "..." }`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return safeJSONParse(completion.choices[0]?.message?.content) || defaultParams;
    } catch (e) {
        try {
            if (googleKey) {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" }});
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
// 4. LINKEDIN OPTIMIZER (PROFESSIONAL UPGRADE)
// ============================================================
export async function generateAIContent(type: string, data: any) {
    if (type !== "LINKEDIN_OPTIMIZATION") return {};

    // ⚡ KEY FIX: Limit text drastically to speed up generation
    const cleanResume = cleanText(data.resumeText).substring(0, 4000);

    const prompt = `
        You are an expert LinkedIn Profile Optimizer. Based on the following parsed resume, generate a comprehensive LinkedIn profile upgrade in strictly JSON format.
        RESUME: ${cleanResume}

        REQUIREMENTS:
        1. "headlines": Generate 3 headlines that go beyond just a job title. Include the role, the value they bring, and what makes them tick.
        2. "storyAbout": Write a story-driven 'About' section (not just a list of skills). Explain why their skills matter and the impact they make.
        3. "topSkills": Identify exactly 5 to 10 highly relevant core skills from the resume that the user should pin to their profile to increase connection requests.
        4. "credentialsAndProjects": Extract any certifications, courses, and projects from the resume. Format them into ready-to-paste text for LinkedIn's specific 'Licenses & Certifications' and 'Projects' sections.
        5. "manualChecklist": Provide 2-3 manual actions the user must take on their app (e.g., "Use the LinkedIn mobile app to record your name pronunciation so recruiters say it correctly", "Update your background banner").

        RETURN EXACT JSON:
        {
          "headlines": ["Headline 1", "Headline 2", "Headline 3"],
          "storyAbout": "String containing the story-driven about section.",
          "topSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
          "credentialsAndProjects": [{"title": "Project/Cert Name", "description": "Ready-to-paste description..."}],
          "manualChecklist": ["Action 1", "Action 2"]
        }
    `;

    // Safe fallback structure to prevent frontend crashes
    const fallbackResponse = {
        headlines: ["Optimization Failed - Please try again"],
        storyAbout: "Service Unavailable.",
        topSkills: [],
        credentialsAndProjects: [],
        manualChecklist: ["Please check your connection and try again later."]
    };

    try {
        if (googleKey && googleKey !== "dummy_key") {
            // ✅ USING GEMINI 2.5 FLASH
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
            const res = await model.generateContent(prompt);
            const parsed = safeJSONParse(res.response.text());

            // Ensure the primary fields exist before returning
            if (parsed && parsed.headlines && parsed.storyAbout) {
                return parsed;
            }
        }
        throw new Error("Gemini Failed");
    } catch (e) {
        // FALLBACK TO GROQ IF GEMINI FAILS (Faster backup)
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" }
            });
            return safeJSONParse(completion.choices[0]?.message?.content) || fallbackResponse;
        } catch (err) {
            return fallbackResponse;
        }
    }
}

// ============================================================
// 5. CODEQUEST
// ============================================================
export async function generateCodeQuestReview(userCode: string) {
    const isQuestionRequest =
        !userCode ||
        userCode.length < 50 ||
        userCode.includes("Generate Question") ||
        userCode.includes("CMD:GENERATE_QUESTION") ||
        userCode.trim().startsWith("// Write your");

    if (isQuestionRequest) {
        const lang = userCode && userCode.includes("python") ? "Python" : "JavaScript";
        const prompt = `
            Act as a Technical Interviewer.
            Generate ONE medium-level ${lang} coding interview problem.
            
            IMPORTANT:
            1. Output ONLY the problem description.
            2. Do NOT include the solution code.
            
            FORMAT (Markdown):
            ## [Problem Title]
            **Difficulty:** Medium
            
            **Problem Statement:**
            [Description]
            
            **Example:**
            Input: ...
            Output: ...
        `;

        try {
            if (googleKey) {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const res = await model.generateContent(prompt);
                return res.response.text();
            }
            throw new Error("No Gemini");
        } catch (e) {
            try {
                const completion = await groq.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "llama-3.3-70b-versatile"
                });
                return completion.choices[0]?.message?.content;
            } catch(err) {
                return "## Two Sum\nFind two numbers that add up to target.";
            }
        }
    }

    const prompt = `
        You are a Senior Software Engineer.
        Review this candidate's solution.
        
        USER CODE:
        ${userCode.substring(0, 5000)}

        INSTRUCTIONS:
        1. Rating: 0-100 (Be strict).
        2. Bugs: List logic errors.
        3. Solution: Provide the optimized, correct code.

        RETURN MARKDOWN:
        ## Rating: [Score]/100
        
        ### 🐛 Analysis
        - [Point 1]
        
        ### ✅ Optimal Solution
        \`\`\`javascript
        [Code]
        \`\`\`
    `;

    try {
        if (googleKey) {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const res = await model.generateContent(prompt);
            return res.response.text();
        }
        throw new Error("Gemini Failed");
    } catch (e) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile"
            });
            return completion.choices[0]?.message?.content || "Review Failed.";
        } catch (err) {
            return "## Review Unavailable";
        }
    }
}