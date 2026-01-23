'use client';

const { tavily } = require('@tavily/core');
const apiKey = process.env.TAVILY_API_KEY;
const client = tavily({ apiKey });
client.search("Who is on the product team at LangChain?", {
    includeAnswer: "advanced",
    searchDepth: "advanced",
    maxResults: 20,
    timeRange: "week",
    includeImages: true,
    includeImageDescriptions: true,
    includeFavicon: true,
    includeUsage: true,
    includeRawContent: "markdown",
    chunksPerSource: 5,
    country: "united states",
    includeDomains: [
        "linkedin.com/in"
        ],
    excludeDomains: [
        "boolala.com"
        ]
})
.then(console.log);