import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAmAUsZxbb420vT6ISD5fzAXwh144wIXw4";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getProductRecommendations = async (userPreferences, productHistory) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Based on the following user preferences: ${JSON.stringify(userPreferences)}
                  and their product history: ${JSON.stringify(productHistory)},
                  suggest 5 products that they might be interested in.
                  Return the result as a JSON array of product objects with name, category, and price.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return JSON.parse(text);
};

export const getChatbotResponse = async (userQuery) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are a helpful assistant for a wholesale e-commerce platform. 
                  Answer the following user query: "${userQuery}"
                  Provide a concise and helpful response.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const getProductDescription = async (productName, features) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate a compelling product description for ${productName} 
                  with the following features: ${JSON.stringify(features)}.
                  The description should be engaging and highlight the product's benefits.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
