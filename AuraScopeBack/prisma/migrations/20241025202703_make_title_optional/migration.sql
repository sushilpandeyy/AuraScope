-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT DEFAULT 'https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "testid" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resumeData" TEXT NOT NULL,
    "status" TEXT DEFAULT 'NotStarted',
    "shoulderSymmetryScore" INTEGER DEFAULT 0,
    "armPositionScore" INTEGER DEFAULT 0,
    "headAlignmentScore" INTEGER DEFAULT 0,
    "confidenceScore" INTEGER DEFAULT 0,
    "conversationData" JSONB,
    "moodAnalysisScore" INTEGER,
    "eyeContactScore" INTEGER,
    "bodyLanguageSummary" TEXT,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "testType" TEXT NOT NULL DEFAULT 'SoftSkills',
    "question" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("testid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
