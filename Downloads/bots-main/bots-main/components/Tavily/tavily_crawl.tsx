'use client';

const { tavily } = require('@tavily/core');
const apiKey = process.env.TAVILY_API_KEY;
const client = tavily({ apiKey });
client.crawl("https://ui.shadcn.com/", {
    instructions: "get all the codes and directories",
    limit: 200,
    maxDepth: 5,
    maxBreadth: 100,
    extractDepth: "advanced",
    includeImages: true,
    includeFavicon: true,
    includeUsage: true
})
.then(console.log);