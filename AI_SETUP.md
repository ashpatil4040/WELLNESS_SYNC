# AI Setup Instructions

## Setting up OpenAI API (Optional)

The wellness app includes AI-powered insights and suggestions. To enable this feature:

### 1. Get an OpenAI API Key
- Visit [OpenAI Platform](https://platform.openai.com/api-keys)
- Sign up or log in to your account
- Create a new API key
- Copy the key (starts with `sk-`)

### 2. Configure Environment Variables
- Copy `.env.example` to `.env` in the frontend directory:
```bash
cd frontend/wellness-sync-react
cp .env.example .env
```

- Edit `.env` and add your API key:
```
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
VITE_API_BASE_URL=http://localhost:5000
NODE_ENV=development
```

### 3. Restart the Frontend
After adding the API key, restart your development server:
```bash
npm run dev
```

## AI Features

Once configured, the AI will provide:
- **Personalized Insights**: Analysis of your wellness patterns
- **Mood Analysis**: Trends and recommendations based on mood data
- **Habit Suggestions**: AI-generated habit recommendations
- **Motivational Messages**: Contextual encouragement and tips

## Fallback Behavior

If no API key is provided, the app will use built-in fallback messages and still function fully. The AI features will show helpful static content instead of dynamic AI-generated insights.

## Cost Considerations

- OpenAI API usage is pay-per-use
- The wellness app uses GPT-3.5-turbo which is cost-effective
- Typical usage generates only a few cents per day per user
- All AI calls are cached and optimized to minimize costs
