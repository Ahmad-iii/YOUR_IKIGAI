import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey){
    throw new Error("Jani Gemini API key is not set. Please set the VITE_GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'});

const generativeIkigaiAnalysis = async (answers) =>{
    try {
        const prompt = `Analyze these Ikigai responses and return a JSON object:\n${JSON.stringify(answers, null, 2)}`;
        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }],
        });
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Error in generativeIkigaiAnalysis:", error);
        return { error: true, message: error.message || "Failed to analyze responses" };
    }
}

export { generativeIkigaiAnalysis };