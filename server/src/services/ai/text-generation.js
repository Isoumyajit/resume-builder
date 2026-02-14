const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Stream content from Gemini
 */
async function* streamContent(prompt) {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  for await (const chunk of response) {
    yield chunk.text.trim() + " ";
  }
}

/**
 * Generate a single bullet point for experience
 */
async function generateExperienceBullet({ jobTitle, company, techStack }) {
  const prompt = `Generate 4 professional bullet points for:
Role: ${jobTitle} at ${company}
Tech: ${techStack || "N/A"}

Requirements:
- Start with strong action verb
- Include quantifiable impact if possible
- No bullet symbol, just the text
- Professional, concise language
- 4 bullet points
- Each bullet point should be 250 characters minimum
- Each bullet point should be 270 characters maximum strictly
- If the bullet point is more than 270 characters then first shorten it.
- The points should be strictly 270 characters maximum at any cost.
- Each bullet point should be a one or two sentence bullet point
- Each bullet point should be a professional, concise language
- After one bullet point, add a new line

Return ONLY the bullet text, nothing else.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text.trim();
}

/**
 * Stream a project description
 */
async function* generateProjectDescription({
  projectName,
  techStack,
  url = "",
}) {
  const prompt = `Generate a professional resume project description:
Project: ${projectName}
Tech Stack: ${techStack}
url: ${url || "N/A"}

Requirements:
- 1-2 concise sentences
- Highlight key features and technical achievements
- Min 200 characters
- Max 300 characters
- Professional tone
- No bullet points
- If url is provided, add the viewer can check it out using the url given above don't add it in the description
- If url is not provided, don't mention it

Return ONLY the description text.`;

  yield* streamContent(prompt);
}

module.exports = {
  generateExperienceBullet,
  generateProjectDescription,
};
