import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

export const generateDietPlan = httpsCallable(functions, 'generateDietPlan');

export const saveMealTracking = httpsCallable(functions, 'saveMealTracking');

export const getUserMealPlan = httpsCallable(functions, 'getUserMealPlan');

export const getUserTrackingData = httpsCallable(functions, 'getUserTrackingData');

// Alternative direct API call (if you prefer client-side API calls)
export const callOpenAIDirectly = async (prompt) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
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

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};