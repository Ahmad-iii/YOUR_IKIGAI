import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Jani Gemini API key is not set. Please set the VITE_GEMINI_API_KEY environment variable."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generateIkigaiAnalysis = async (answers) => {
  try {
    const questionMapping = {
      passion: [0, 1, 2],
      skills: [3, 4],
      impact: [5, 6],
      career: [7, 8],
    };
    const groupedAnswers = Object.entries(questionMapping).reduce(
      (acc, [dimension, indices]) => {
        acc[dimension] = indices.map((i) => answers[i]).filter(Boolean);
        return acc;
      },
      {}
    );
    const analysisPrompt = `You're not just an Ikigai analyst - you're a career matchmaker with a sense of humor! Analyze these responses and create a JSON object that's specific, actionable, and occasionally funny. Retrurn ONLY the JSON object, no additional text.
User's responses:
${Object.entries(groupedAnswers)
  .map(
    ([category, answers]) =>
      `${category.toUpperCase()}:
${answers.map((a, idx) => `${idx + 1}. "${a}"`).join("\n")}`
  )
  .join("\n\n")}
Required JSON structure (follow this EXACTLY):
{
  "scores": {
    "passion": 75,
    "skills": 65,
    "impact": 55,
    "career": 40
    },
    "insights": {
        "passion": "Short, specific insight with personality",
        "skills": "Clear statement about unique abilities",
        "impact": "How they want to change the world",
        "career": "What they need in a work environment"
    },
    "recommendations": [
        "3-5 SPECIFIC job titles or roles that match their profile",
        "A specific learning path or certification to pursue",
        "A fun, slightly cheeky suggestion related to their answers"
    ],
    "careerMatches": [
        {
            "title": "Specific job title #1",
            "whyItFits": "Explanation connecting to multiple answers",
            "nextStep": "Immediate action they could take"
        },
        {
            "title": "Specific job title #2",
            "whyItFits": "Different reasoning",
            "nextStep": "Different specific action"
        },
        {
            "title": "Specific job title #3",
            "whyItFits": "Another unique match reason",
            "nextStep": "Another concrete step"
        }
    ],
    "funInsight": "A humorous observation about their answers that's still respectful",
    "summary": "Concise, personality-filled summary with specific direction"    
    }`;
    const result = await model.generateContent({
      contents: [{ parts: [{ text: analysisPrompt }] }],
    });
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Raw response:", text);
      throw new Error("No JSON found in response");
    }
    const jsonStr = jsonMatch[0]
      .replace(/\\n/g, "")
      .replace(/\s+/g, " ")
      .replace(/\/\/.+?(?=,|$)/g, "");
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (error) {
    console.error("Error in generateIkigaiAnalysis:", error);
    return {
      error: true,
      message: error.message || "Failed to analyze responses",
    };
  }
};

export { generateIkigaiAnalysis };
