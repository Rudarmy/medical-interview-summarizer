# Medical Interview Summarizer

An AI-powered application that transcribes and summarizes patient interviews for pain management specialists using Google's Gemini AI.

## Features

- 🎤 Audio file upload and transcription
- 📝 Manual transcript input
- 🌐 Multi-language support
- 🏥 Clinical summary generation
- 📋 Structured medical output

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Medical_Interview_Summarizer_V11
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Replace `your_actual_api_key_here` with your actual API key in `.env.local`

4. **Run the app**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Deploy

### Option 1: Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key

### Option 2: Vercel
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key

### Option 3: GitHub Pages
1. Update `vite.config.ts` with your repository base path
2. Build and deploy using GitHub Actions

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI processing | Yes |

## Security Notes

⚠️ **Important**: Never commit your actual API keys to version control. The `.env.local` file is gitignored for security.

## Technology Stack

- React 19
- TypeScript
- Vite
- Google Gemini AI
- Tailwind CSS (inferred from styling)
