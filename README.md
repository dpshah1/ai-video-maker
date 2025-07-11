# PDF to Video Content Generator

A Next.js application that uses Google Gemini API and OpenAI to convert PDF documents into engaging educational videos with voice over in the style of 3Blue1Brown.

## Features

- Upload multiple PDF files
- Extract text content from PDFs
- Process content with Google Gemini AI
- Generate educational video scripts and content
- Generate Manim animations from scripts
- Generate AI voice overs using OpenAI TTS
- Combine video and audio into final educational videos
- Clean, modern UI with real-time processing status

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up APIs:**
   - **Google Gemini API:** Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **OpenAI API:** Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a `.env.local` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Install FFmpeg (required for video processing):**
   ```bash
   ./setup-ffmpeg.sh
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How it Works

1. **Upload PDFs:** Users can select and upload multiple PDF files
2. **Text Extraction:** The app extracts text content from each PDF
3. **AI Processing:** Google Gemini analyzes the content and generates educational video scripts
4. **Voice Over Generation:** OpenAI TTS creates professional voice overs from the scripts
5. **Animation Generation:** OpenAI GPT-4 generates Manim Python code for animations
6. **Video Rendering:** Manim renders the animations into video files
7. **Video Combination:** FFmpeg combines the video with voice over audio
8. **Final Output:** Complete educational videos with synchronized audio and visuals

## API Endpoints

- `POST /api/process-pdf` - Processes uploaded PDFs with Gemini API
- `POST /api/generate-voiceover` - Generates voice over audio using OpenAI TTS
- `POST /api/generate-manim` - Generates Manim animation code using OpenAI GPT-4
- `POST /api/render-manim` - Renders Manim code into video files
- `POST /api/combine-video` - Combines video and audio using FFmpeg
- `GET /api/voiceover/[sessionId]` - Serves generated voice over files
- `GET /api/video/[sessionId]` - Serves rendered video files
- `GET /api/combined-video/[sessionId]` - Serves final combined videos

## Technologies Used

- Next.js 15
- Google Generative AI SDK
- OpenAI API (GPT-4 and TTS)
- Manim (Mathematical Animation Engine)
- FFmpeg (Video Processing)
- PDF parsing with pdf-parse
- Tailwind CSS for styling
- React 19

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key
- `OPENAI_API_KEY` - Your OpenAI API key (for GPT-4 and TTS)

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── process-pdf/
│   │   │   └── route.js
│   │   ├── generate-voiceover/
│   │   │   └── route.js
│   │   ├── generate-manim/
│   │   │   └── route.js
│   │   ├── render-manim/
│   │   │   └── route.js
│   │   ├── combine-video/
│   │   │   └── route.js
│   │   ├── voiceover/[sessionId]/
│   │   │   └── route.js
│   │   ├── video/[sessionId]/
│   │   │   └── route.js
│   │   └── combined-video/[sessionId]/
│   │       └── route.js
│   ├── layout.js
│   └── page.js
├── setup-ffmpeg.sh
└── ...
```
