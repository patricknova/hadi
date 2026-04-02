import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const geminiKey = process.env.GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(geminiKey);
  
  try {
    // There is no direct listModels in the client, but we can try a simple generation with a known model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hi");
    console.log("Success with gemini-1.5-flash");
  } catch (e) {
    console.log("Failed with gemini-1.5-flash, trying gemini-pro...");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Hi");
      console.log("Success with gemini-pro");
    } catch (e2) {
      console.log("Failed with gemini-pro too.");
      console.error(e2);
    }
  }
}

listModels();
