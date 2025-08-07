import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

export const generateDietPlan = httpsCallable(functions, 'generateDietPlan');

export const saveMealTracking = httpsCallable(functions, 'saveMealTracking');

export const getUserMealPlan = httpsCallable(functions, 'getUserMealPlan');

export const getUserTrackingData = httpsCallable(functions, 'getUserTrackingData');

// Alternative direct API call (if you prefer client-side API calls)
export const callOpenAIDirectly = async (prompt) => {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const deepseekBase = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

  // Try OpenAI first if key is present and not a placeholder
  if (openaiKey && !openaiKey.includes('your_openai_api_key')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a professional nutritionist and personal trainer specialized in creating personalized meal plans.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      } else {
        // If OpenAI returns 401 or other error, fallback to DeepSeek
        if (deepseekKey) {
          return await callDeepSeek(prompt, deepseekKey, deepseekBase);
        }
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
    } catch (err) {
      if (deepseekKey) {
        return await callDeepSeek(prompt, deepseekKey, deepseekBase);
      }
      throw err;
    }
  } else if (deepseekKey) {
    // If no OpenAI key, use DeepSeek
    return await callDeepSeek(prompt, deepseekKey, deepseekBase);
  } else {
    throw new Error('No valid OpenAI or DeepSeek API key configured');
  }
};

// Helper for DeepSeek API
const callDeepSeek = async (prompt, apiKey, baseUrl) => {
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a professional nutritionist and personal trainer specialized in creating personalized meal plans.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
};