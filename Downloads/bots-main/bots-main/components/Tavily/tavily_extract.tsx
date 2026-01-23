'use client';

const { tavily } = require('@tavily/core');
const apiKey = process.env.TAVILY_API_KEY;
const client = tavily({ apiKey });
client.extract(["https://www.britannica.com/science/general-relativity","https://www.britannica.com/science/cosmological-constant","https://en.wikipedia.org/wiki/Galaxy","https://www.britannica.com/science/universe","https://en.wikipedia.org/wiki/Hubble%27s_law"], {
    query: "get all the images and data",
    chunksPerSource: 5,
    extractDepth: "advanced",
    includeImages: true,
    includeFavicon: true,
    includeUsage: true
})
.then(console.log);