import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateAndSaveSoftSkillQuestions = async (resumeText: string, testId: number) => {
    // Ensure resumeText is provided
    console.log("IOT SRSsx")
    if (!resumeText) {
        throw new Error('resumeText is required');
    }

    // API key (keep this secure)
    const fetchApiKey = () => {
        const apiKey = 'AIzaSyD8ZBJkzUkpC46RmH6D84K8R9XwzwSAbSU'; // Replace with the method to fetch the key securely
        return apiKey;
    };
    
    const apiKey = fetchApiKey();
    if (!apiKey) {
        console.error('API key is not defined. Please set GEMINI_API_KEY in your environment variables.');
        throw new Error('API key is not defined');
    }

    // Construct the prompt for generating HR soft-skill questions
    const prompt = `Generate a set of HR interview questions and answers based on soft skills relevant to the following resume context:\n${resumeText}. Structure the response in JSON format with keys: {id, question, answer}.`;

    // Define the API URL for the Gemini model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
        // Send a POST request to the Gemini API
        const response = await axios.post(apiUrl, {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Log the full response data for debugging
        console.log("API Response Data:", response.data?.candidates?.[0]?.content.parts[0]);

        // Extract the generated content from the response data
        const generatedContent = response.data?.candidates?.[0]?.content.parts[0];

        if (!generatedContent) {
            throw new Error('No content received from the API.');
        }

        return response.data?.candidates?.[0]?.content.parts[0];

    } catch (error) {
        console.error('Error communicating with Gemini API:', error);
        throw new Error('Error generating HR soft-skill questions');
    }
};
