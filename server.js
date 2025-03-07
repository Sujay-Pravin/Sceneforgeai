import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { generateSceneBreakdown } from './src/services/groqService.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.post('/api/groq', async (req, res) => {
  try {
    const { script } = req.body;
    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    const aiResponse = await generateSceneBreakdown(script);
    const pythonScript = join(__dirname, 'generate_video.py');
    
    exec(`python "${pythonScript}" "${aiResponse}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).json({ error: 'Failed to generate video' });
      }

      try {
        const output = JSON.parse(stdout);
        res.json(output);
      } catch (e) {
        console.error('Error parsing Python output:', e);
        res.json({ message: 'Video generation started', output: stdout });
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process request' });
  }
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));