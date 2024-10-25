import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTest = async (data: {
  userId: number;
  name: string;
  resumeData: object;
}) => {
  try {
    const newTest = await prisma.test.create({
      data: {
        userId: data.userId,
        resumeData: data.resumeData, 
        status: "NotStarted", // Default status; can be modified as needed
      },
    });
    return newTest;
  } catch (error) {
    console.error("Error creating test:", error);
    throw new Error("Failed to create test");
  }
};
