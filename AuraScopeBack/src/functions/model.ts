import { Router, Request, Response } from 'express';
import axios from 'axios';

export const modal = async (req: Request, res: Response) => {
    const { resumeText, numFlashcards } = req.body; // Get resume text and number of flashcards from the request

    console.log("Received resume text:", resumeText); // Log the received resume text

    // Check if resumeText is provided
    if (!resumeText) {
        return res.status(400).json({ error: 'resumeText is required' });
    }

    // Define your API key (keep this secure in a real application)
    const apiKey = 'AIzaSyD8ZBJkzUkpC46RmH6D84K8R9XwzwSAbSU';

    // Check if the API key is defined
    if (!apiKey) {
        console.error('API key is not defined. Please set REACT_APP_GEMINI_API_KEY in your environment variables.');
        return res.status(500).json({ error: 'API key is not defined.' });
    }

    // Construct the prompt for the API request
    const prompt = `Please generate ${numFlashcards} flashcards with questions and answers based on the following context:\n${resumeText} with keys - {id, question, answer}. Output should always be JSON format.`;

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

        // Log the API response
        console.log("API Response:", response.data);

        // Return the generated flashcards
        return res.json(response.data);
    } catch (error) {
        console.error('Error communicating with Gemini API:', error);
        return res.status(500).send("Error generating flashcards.");
    }
};
