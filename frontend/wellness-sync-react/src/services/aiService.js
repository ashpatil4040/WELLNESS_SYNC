class AIService {
  constructor() {
    this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.huggingfaceKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
    this.openaiUrl = 'https://api.openai.com/v1';
    this.huggingfaceUrl = 'https://api-inference.huggingface.co/models';
    // Use a free model from Hugging Face
    this.freeModel = 'microsoft/DialoGPT-medium';
  }

  async generatePersonalizedInsights(userData) {
    const { habits, moodData, journals } = userData;
    
    // Try free AI first, then fallback
    try {
      const prompt = this.buildInsightsPrompt(habits, moodData, journals);
      const aiResponse = await this.callFreeAI(prompt);
      if (aiResponse) {
        return aiResponse;
      }
    } catch (error) {
      console.error('Free AI Error:', error);
    }
    
    // If both free AI and OpenAI fail, use fallback
    return this.getFallbackInsight(habits, moodData);
  }

  async callFreeAI(prompt) {
    // Try using Ollama (local) first if available
    try {
      const ollamaResponse = await this.callOllama(prompt);
      if (ollamaResponse) return ollamaResponse;
    } catch (error) {
      console.log('Ollama not available, trying other free options');
    }

    // Try Hugging Face free tier
    try {
      const hfResponse = await this.callHuggingFace(prompt);
      if (hfResponse) return hfResponse;
    } catch (error) {
      console.log('Hugging Face not available');
    }

    // Try local Groq if key is available
    try {
      const groqResponse = await this.callGroq(prompt);
      if (groqResponse) return groqResponse;
    } catch (error) {
      console.log('Groq not available');
    }

    return null;
  }

  async callOllama(prompt) {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1',
          prompt: `You are a wellness coach AI assistant. Provide personalized, encouraging, and actionable insights based on the user's wellness data. Keep responses concise and supportive (2-3 sentences max).

User data: ${prompt}

Provide helpful wellness advice:`,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 200
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.response?.trim();
      }
    } catch (error) {
      throw new Error('Ollama not available');
    }
    return null;
  }

  async callHuggingFace(prompt) {
    // Using a free text generation model
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `As a wellness coach: ${prompt.substring(0, 200)}`,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            return_full_text: false
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && data[0].generated_text) {
          return data[0].generated_text.trim();
        }
      }
    } catch (error) {
      throw new Error('Hugging Face not available');
    }
    return null;
  }

  async callGroq(prompt) {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!groqKey) return null;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama2-70b-4096',
          messages: [
            {
              role: 'system',
              content: 'You are a wellness coach AI assistant. Provide personalized, encouraging, and actionable insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      }
    } catch (error) {
      throw new Error('Groq not available');
    }
    return null;
  }

  buildInsightsPrompt(habits, moodData, journals) {
    const habitSummary = habits?.length > 0 
      ? habits.map(h => `${h.name}: ${h.completed}/${h.target} ${h.unit} (${h.streak} day streak)`).join(', ')
      : 'No habits tracked yet';
    
    const moodSummary = moodData?.length > 0
      ? `Average mood: ${(moodData.reduce((acc, m) => acc + m.mood, 0) / moodData.length).toFixed(1)}/5`
      : 'No mood data yet';

    const journalSummary = journals?.length > 0
      ? `${journals.length} journal entries recorded`
      : 'No journal entries yet';

    return `Please analyze this wellness data and provide 2-3 personalized insights and recommendations:

Habits: ${habitSummary}
Mood: ${moodSummary}
Journal: ${journalSummary}

Focus on patterns, achievements, and actionable next steps.`;
  }

  getFallbackInsight(habits, moodData) {
    if (!habits || habits.length === 0) {
      return "🌟 Welcome to your wellness journey! Start by adding a few habits you'd like to track. Small, consistent actions lead to big transformations.";
    }

    const completedHabits = habits.filter(h => h.completed >= h.target).length;
    const completionRate = (completedHabits / habits.length) * 100;

    if (completionRate >= 80) {
      return "🎉 Amazing progress! You're crushing your wellness goals. Keep up this fantastic momentum and consider adding a new challenge to continue growing.";
    } else if (completionRate >= 50) {
      return "👍 Good job staying consistent with your habits! Focus on the ones you're missing most often - small improvements compound over time.";
    } else {
      return "💪 Every journey starts with a single step. Don't be discouraged - pick one habit to focus on today and build from there. You've got this!";
    }
  }

  getQuotaExceededMessage() {
    return "🤖 AI insights are temporarily unavailable due to API limits. Don't worry - you're doing great! Keep tracking your habits and celebrating your progress. The most important wellness coach is your own self-awareness.";
  }

  async generateHabitSuggestions(currentHabits, userGoals) {
    try {
      const prompt = `Based on current habits: ${currentHabits?.map(h => h.name).join(', ') || 'none yet'} and user goals: ${userGoals || 'general wellness'}, suggest 3 new healthy habits. Be specific and practical.`;
      const aiResponse = await this.callFreeAI(prompt);
      
      if (aiResponse) {
        // Try to parse AI response into structured format
        return this.parseHabitSuggestions(aiResponse);
      }
    } catch (error) {
      console.error('AI Habit Suggestions Error:', error);
    }
    
    return this.getFallbackHabitSuggestions();
  }

  parseHabitSuggestions(aiResponse) {
    // Try to extract habit suggestions from AI response
    const suggestions = [];
    const lines = aiResponse.split('\n').filter(line => line.trim());
    
    const habitIcons = ['🏃', '💧', '📚', '🧘', '🥗', '😴', '🚶', '📱', '🙏', '💪'];
    
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].replace(/^\d+\.?\s*/, '').trim();
      if (line.length > 5) {
        suggestions.push({
          name: line.substring(0, 50),
          icon: habitIcons[i % habitIcons.length],
          target: 1,
          unit: 'time',
          description: `AI suggested: ${line}`
        });
      }
    }
    
    return suggestions.length > 0 ? suggestions : this.getFallbackHabitSuggestions();
  }

  getFallbackHabitSuggestions() {
    return [
      { name: 'Read for 20 minutes', icon: '📚', target: 20, unit: 'minutes', description: 'Expand your mind daily' },
      { name: 'Take a walk', icon: '🚶', target: 1, unit: 'walk', description: 'Fresh air and movement' },
      { name: 'Practice gratitude', icon: '🙏', target: 3, unit: 'things', description: 'Write down 3 grateful thoughts' },
      { name: 'Limit screen time', icon: '📱', target: 2, unit: 'hours', description: 'Digital wellness break' },
      { name: 'Connect with someone', icon: '💬', target: 1, unit: 'person', description: 'Reach out to a friend or family' }
    ];
  }

  async generateMoodInsight(moodData, todayMood) {
    if (!moodData || moodData.length === 0) {
      return "🌈 Start tracking your mood to discover patterns and insights about your emotional wellbeing!";
    }

    // For now, use fallback since AI quota is exceeded
    const avgMood = moodData.reduce((acc, m) => acc + m.mood, 0) / moodData.length;
    const trend = todayMood > avgMood ? 'improving' : todayMood < avgMood ? 'declining' : 'stable';

    const insights = {
      improving: "📈 Your mood seems to be on an upward trend! Keep doing what's working for you.",
      declining: "🌱 It's natural to have ups and downs. Consider what might help boost your mood today.",
      stable: "🎯 Your mood has been consistent. Stability is a sign of good emotional balance!"
    };

    return insights[trend];
  }
}

export default new AIService();
