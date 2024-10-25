import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
    const { email, name, password, image } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                image: image || undefined,  // Use provided image or let Prisma default it
            },
        });

        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while signing up' });
    }
};

