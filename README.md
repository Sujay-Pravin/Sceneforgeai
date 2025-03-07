# SceneForge AI

Transform your text descriptions into cinematic videos using AI-powered scene generation and video synthesis.

## Features

- 🎬 AI-powered scene breakdown
- 🎥 Automatic video generation from text
- 🎯 Multiple tone options
- 🔊 Text-to-speech narration
- 🎵 Background music support
- 📝 Support for text input and file upload

## Tech Stack

- Frontend:

  - React with TypeScript
  - Tailwind CSS for styling
  - Lucide React for icons
  - Vite for build tooling

- Backend:
  - Node.js with Express
  - Google's Gemini AI for scene generation
  - Python for video processing
  - MoviePy for video editing
  - Pexels API for video content

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- API Keys:
  - Google Gemini API
  - Pexels API

## Installation

1. Clone the repository

```bash
git clone [repository-url]
cd project
```

2. Install Node.js dependencies

```bash
npm install
```

3. Install Python dependencies

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=2000
NODE_ENV=development
```

## Running the Application

1. Start the backend server:

```bash
node server.js
```

2. In a new terminal, start the frontend development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
project/
├── src/
│   ├── components/          # React components
│   ├── services/           # API services
│   └── App.tsx            # Main application component
├── public/                # Static assets
├── server.js             # Express backend server
├── generate_video.py     # Python video generation script
└── package.json         # Project dependencies
```

## Usage

1. Enter your scene description in the text input or upload a file
2. Select the desired tone for your video
3. Click "Submit" to generate the AI scene breakdown
4. Wait for the video generation process to complete
5. Preview and download your generated video

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Pexels for providing the video content API
- Google's Gemini AI for powering the scene generation
- The open-source community for the amazing tools and libraries
