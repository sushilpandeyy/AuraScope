import { Router, Request, Response } from 'express';
import { spawn } from 'child_process';

const modelrouter = Router();


modelrouter.post("/generate-question", (req, res) => {
    const { resumeText } = req.body;
  
    const pythonProcess = spawn("python3", ["T5Server.py", resumeText]);
  
    pythonProcess.stdout.on("data", (data) => {
      const question = JSON.parse(data).question;
      res.json({ question });
    });
  
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
      res.status(500).send("Error generating question.");
    });
  });
