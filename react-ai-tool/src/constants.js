export const apiKey = import.meta.env.VITE_API_KEY;

// Using 1.5-flash for stability
export const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
