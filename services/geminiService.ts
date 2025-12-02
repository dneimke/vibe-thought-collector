
import { GoogleGenAI, Type } from "@google/genai";
import { Thought, SynthesisResult, DailySummary } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

// Schema for a single processed thought
const thoughtSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A concise, descriptive title for the thought. Should be 3-7 words."
        },
        content: {
            type: Type.STRING,
            description: "The original content of the thought, verbatim."
        },
        tags: {
            type: Type.ARRAY,
            description: "An array of 3-5 relevant lowercase keyword tags for categorization.",
            items: { type: Type.STRING }
        }
    },
    required: ["title", "content", "tags"]
};

// Schema for synthesis result
const synthesisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A comprehensive summary answering the user's query based on the provided thoughts."
        },
        sourceIds: {
            type: Type.ARRAY,
            description: "An array of the IDs of the original thoughts used to generate the summary.",
            items: { type: Type.STRING }
        }
    },
    required: ["summary", "sourceIds"]
};

const dailySummarySchema = {
    type: Type.OBJECT,
    properties: {
        theme: {
            type: Type.STRING,
            description: "The central theme provided for the summary."
        },
        summary: {
            type: Type.STRING,
            description: "A short, punchy, and impactful summary (2-3 sentences) of the provided thoughts related to the theme. It should be written as an insightful reflection or a powerful statement."
        }
    },
    required: ["theme", "summary"]
};


export const processThought = async (content: string): Promise<Omit<Thought, 'id' | 'createdAt'>> => {
    const prompt = `Analyze the following user-submitted thought. Extract a title and generate relevant tags. Return the original content as well.

Thought:
---
${content}
---
`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: thoughtSchema,
        }
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as Omit<Thought, 'id' | 'createdAt'>;
};

export const synthesizeThoughts = async (query: string, thoughts: Thought[]): Promise<SynthesisResult> => {
    const thoughtsContext = thoughts.map(t => `
ID: ${t.id}
Title: ${t.title}
Content: ${t.content}
Tags: [${t.tags.join(', ')}]
---
`).join('\n');

    const prompt = `You are an AI assistant helping a user synthesize their personal notes and thoughts.
Based ONLY on the provided thoughts below, answer the user's query with a comprehensive summary.
Also, you MUST identify the 'ID' of every thought that was used to create the summary.

User's Query: "${query}"

Thoughts:
---
${thoughtsContext}
---
`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: synthesisSchema,
        }
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Post-processing to ensure all source IDs are valid
    const validSourceIds = result.sourceIds.filter((id: string) => thoughts.some(t => t.id === id));

    return {
        summary: result.summary,
        sourceIds: validSourceIds,
    };
};

export const generateDailySummary = async (theme: string, thoughts: Thought[]): Promise<DailySummary> => {
    const thoughtsContext = thoughts.map(t => `- ${t.content}`).join('\n');
    const prompt = `Based on the following thoughts about "${theme}", generate a short, punchy, and impactful summary (2-3 sentences). This summary should be an insightful reflection or a powerful statement that captures the essence of these ideas.

Thoughts on "${theme}":
---
${thoughtsContext}
---
`;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: dailySummarySchema,
        }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as DailySummary;
};
