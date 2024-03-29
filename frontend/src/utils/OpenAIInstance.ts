import OpenAI from "openai/index.mjs";

export const openai = new OpenAI({
    apiKey: `${import.meta.env.VITE_OPENAI_API_KEY}`,
    baseURL: `${import.meta.env.VITE_OPENAI_BASE_URL}`,
    dangerouslyAllowBrowser: true,
});
