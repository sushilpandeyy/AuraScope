import { Router, Request, Response } from 'express';
import axios from 'axios';

export const modal = async (req: Request, res: Response) => {
    const { resumeText } = req.body;

    console.log("Received resume text:", resumeText);

    // Check if resumeText is provided
    if (!resumeText) {
        return res.status(400).json({ error: 'resumeText is required' });
    }

    // API key (keep this secure)
    const apiKey = 'AIzaSyD8ZBJkzUkpC46RmH6D84K8R9XwzwSAbSU';
    if (!apiKey) {
        console.error('API key is not defined. Please set GEMINI_API_KEY in your environment variables.');
        return res.status(500).json({ error: 'API key is not defined.' });
    }

    // Construct the prompt to generate HR soft-skill questions
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

        // Log and return the response
        console.log("API Response:", response.data);
        return res.json(response.data);
    } catch (error) {
        console.error('Error communicating with Gemini API:', error);
        return res.status(500).send("Error generating HR soft-skill questions.");
    }
};
