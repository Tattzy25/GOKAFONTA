// Start a research task
const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });

const { request_id } = await tvly.research("What are the latest developments in AI?");

// Poll for results
const pollForResults = async () => {
  while (true) {
    const result = await tvly.getResearch(request_id);
    
    if (data.status === "completed") {
      console.log(data.content);  // The research report
      console.log(data.sources);  // List of sources
      return data;
    } else if (data.status === "failed") {
      throw new Error("Research failed");
    }
    
    await new Promise(r => setTimeout(r, 2000)); // Wait 2s
  }
};

await pollForResults();
Models
mini — Fast, efficient for focused queries
pro — Comprehensive, multi-angle research

Streaming
Set stream: true to receive real-time updates via Server-Sent Events.