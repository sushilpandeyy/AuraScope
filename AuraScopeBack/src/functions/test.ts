import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { generateAndSaveSoftSkillQuestions } from './model';
import { stringify } from 'querystring';

const prisma = new PrismaClient();


export const addtest = async (req: Request, res: Response) => {
    const { userId, resumeData, title } = req.body;

    try {
        const added = await prisma.test.create({
            data: {
                userId,
                resumeData,
                question: '[]', // Default value for the question field
                title, // Add required fields like 'title' here
            },
        });
        
        const qqq = JSON.stringify(await generateAndSaveSoftSkillQuestions(resumeData, added.testid));
        await prisma.test.update(
            {
                where: {
                    testid: added.testid,
                  },
                  data: {
                    question : qqq,
                  },
            }
        )
        return res.status(200).json({ message: 'Test created' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the test' });
    }
};

export const getTestsByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        // Find all Test records associated with the userId
        const tests = await prisma.test.findMany({
            where: { userId: parseInt(userId) },
        });

        return res.status(200).json(tests);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while retrieving tests' });
    }
};

