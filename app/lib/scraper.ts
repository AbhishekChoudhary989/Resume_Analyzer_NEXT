import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

export async function fetchIndeedJobs(jobTitle: string, location: string) {
    try {
        console.log(`⚡ Fetching Live Jobs for: ${jobTitle} in ${location}...`);

        const input = {
            position: jobTitle,
            location: location,
            country: "IN",
            maxItems: 5,
            parseCompanyDetails: false,
            saveOnlyUniqueItems: true,
            followApplyRedirects: false
        };

        const run = await client.actor("hMvNSpz3JnHgl5jkh").call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        if (!items || items.length === 0) return [];

        return items.map((job: any) => ({
            title: job.positionName || job.title || "Unknown Role",
            company: job.company || "Unknown Company",
            salary: job.salary || "Not disclosed",
            location: job.location || location,
            url: job.url || job.companyUrl || "https://indeed.com"
        }));

    } catch (error: any) {
        console.error("Apify Scraper Error:", error.message);
        return [];
    }
}