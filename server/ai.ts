import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-your-api-key" 
});

export async function handleAIAssistantQuery(query: string): Promise<string> {
  try {
    const systemPrompt = `
      You are an expert educational AI assistant for EduTech AI, a personalized learning platform.
      You're here to help users with their learning journey by answering questions about their courses,
      explaining challenging concepts, and providing additional learning resources.
      
      Be friendly, encouraging, and concise. Focus on providing accurate, educational answers.
      If you don't know something, be honest and suggest resources where they might find more information.
      
      Keep your answers educational, helpful, and appropriate for learners of all ages.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to process your request with the AI assistant. Please try again later.");
  }
}

export async function generatePersonalizedRecommendations(
  userId: number,
  interests: string[],
  completedCourses: string[]
): Promise<any> {
  try {
    const prompt = `
      Based on the user's interests (${interests.join(", ")}) and completed courses (${completedCourses.join(", ")}),
      recommend 3 courses they should take next. Format the response as a JSON array with objects containing:
      {
        "title": "Course title",
        "description": "Brief description",
        "category": "Course category",
        "reason": "Why this course is recommended"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error("OpenAI recommendations error:", error);
    throw new Error("Failed to generate personalized recommendations");
  }
}
