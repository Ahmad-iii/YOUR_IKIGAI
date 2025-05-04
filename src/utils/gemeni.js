import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Gemini API key is not set. To fix this:\n" +
    "1. Make sure your .env file is in the project root directory (not in src/)\n" +
    "2. Your .env file should contain: VITE_GEMINI_API_KEY=your_api_key_here\n" +
    "3. Restart your development server after making these changes"
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateIkigaiAnalysis = async (answers) => {
  const maxRetries = 3;
  const baseDelay = 2000;

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
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const analysisPrompt = `You're not just an Ikigai analyst - you're a career matchmaker with a sense of humor! Analyze these responses and create a JSON object that's specific, actionable, and occasionally funny. Return ONLY the JSON object, no additional text.
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
      let parsed;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error("Raw response:", text);
          throw new Error("No JSON found in response");
        }
        const jsonStr = jsonMatch[0]
          .replace(/\\n/g, "")
          .replace(/\s+/g, " ")
          .replace(/\/\/.+?(?=,|$)/g, "");
        parsed = JSON.parse(jsonStr);
      } catch (error) {
        console.error("Json Parsing error:", error);
        console.error("Raw text:", text);
        throw new Error("Invalid JSON response from API");
      }
      if (!validateResponse(parsed)) {
        console.error("Invalid response structure:", parsed);
        throw new Error("Invalid response structure");
      }
      const processedResponse = {
        ...parsed,
        scores: Object.entries(parsed.scores).reduce((acc, [key, value]) => {
          acc[key] =
            typeof value === "number"
              ? value
              : Math.round(parseFloat(value) * 100);
          return acc;
        }, {}),
      };
      return processedResponse;
    } catch (error) {
      console.error("Error in generateIkigaiAnalysis:", error);
      if (attempt < maxRetries - 1) {
        console.log(`Retrying... Attempt ${attempt + 2}/${maxRetries}`);
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }
      return {
        error: true,
        message:
          error.message || "Failed to analyze responses. Please try again.",
      };
    }
  }
  return {
    error: true,
    message: "Maximum retry attempts reached. Please try again later.",
  };
};

export { generateIkigaiAnalysis };
function validateResponse(response) {
  try {
    if (!response || typeof response !== "object") {
      console.error("Response is not an object:", response);
      return false;
    }
    const requiredFields = [
      "scores",
      "insights",
      "recommendations",
      "careerMatches",
      "funInsight",
      "summary",
    ];
    const requiredScores = ["passion", "skills", "impact", "career"];
    const hasAllFields = requiredFields.every((field) => {
      const hasField = response[field] !== undefined;
      if (!hasField) console.error(`Missing required field: ${field}`);
      return hasField;
    });
    const hasValidScores = requiredScores.every((score) => {
      const scoreValue = response.scores?.[score];
      const isValid =
        (typeof scoreValue === "number" || typeof scoreValue === "string") &&
        !isNaN(parseFloat(scoreValue)) &&
        parseFloat(scoreValue) >= 0 &&
        parseFloat(scoreValue) <= 100;
      if (!isValid) console.error(`Invalid score for ${score}:`, scoreValue);
      return isValid;
    });
    const hasEnoughRecommendations =
      Array.isArray(response.recommendations) &&
      response.recommendations.length >= 3;
    if (!hasEnoughRecommendations) {
      console.error("Invalid recommendations:", response.recommendations);
    }
    const hasValidCareerMatches =
      Array.isArray(response.careerMatches) &&
      response.careerMatches.length >= 3 &&
      response.careerMatches.every(
        (match) => match.title && match.whyItFits && match.nextStep
      );
    if (!hasValidCareerMatches) {
      console.error("Invalid career matches:", response.careerMatches);
    }
    const hasFunInsight =
      typeof response.funInsight === "string" && response.funInsight.length > 0;
    const hasSummary =
      typeof response.summary === "string" && response.summary.length > 0;
    if (!hasFunInsight) console.error("Missing or invalid funInsight");
    if (!hasSummary) console.error("Missing or invalid summary");
    return (
      hasAllFields &&
      hasValidScores &&
      hasEnoughRecommendations &&
      hasValidCareerMatches &&
      hasFunInsight &&
      hasSummary
    );
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}


