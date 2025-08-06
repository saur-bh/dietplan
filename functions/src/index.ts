import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';
import * as cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize CORS
const corsHandler = cors({ origin: true });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: functions.config().openai.key
});

export const generateDietPlan = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  }

  const { healthReportText, measurements, foods } = data;

  try {
    const prompt = `You are my personal AI Nutrition Coach and expert meal planner.

My health report:
${healthReportText || 'No health report provided'}

My current measurements:
- Weight: ${measurements.weight}kg
- Height: ${measurements.height}cm
- Waist: ${measurements.waist}cm
- Neck: ${measurements.neck}cm
- Body Fat: ${measurements.bodyFat}%
- Age: ${measurements.age}
- Gender: ${measurements.gender}
- Activity Level: ${measurements.activityLevel}
- Primary Goal: ${measurements.goal}

My available foods:
${foods.join(', ')}

Design a **4-week fat-loss meal plan** specifically tailored to my profile with:
- 3-4 meals per day optimized for fat loss and muscle retention
- Each meal: exact grams, calories, protein, carbs, fat
- Daily macro targets and totals
- Weekly grocery lists
- High-protein focus with controlled carbs and adequate fiber
- Meal timing recommendations
- Supplement suggestions if needed
- Hydration guidance

Please output the response in this exact JSON format:
{
  "weekPlan": [
    {
      "week": "Week 1",
      "days": [
        {
          "day": "Day 1",
          "meals": [
            {
              "meal": "Breakfast",
              "time": "7:00 AM",
              "items": [
                {
                  "food": "Oats",
                  "grams": 50,
                  "calories": 190,
                  "protein": 7,
                  "carbs": 32,
                  "fat": 3
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "dailyMacros": {
    "calories": 2000,
    "protein": 150,
    "carbs": 200,
    "fat": 60
  },
  "weeklyGroceryLists": [
    {
      "week": 1,
      "items": ["Oats - 500g", "Chicken breast - 1kg"]
    }
  ],
  "supplements": ["Whey protein", "Multivitamin"],
  "hydration": "3-4 liters of water daily",
  "notes": "Additional guidance and tips"
}

Make sure the plan is realistic, sustainable, and uses the foods I have available. Focus on creating variety while maintaining nutritional targets for effective fat loss.`;

    const response = await openai.chat.completions.create({
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
    });

    const mealPlanText = response.choices[0].message.content;
    
    // Try to parse JSON from the response
    let mealPlan;
    try {
      const jsonMatch = mealPlanText?.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : mealPlanText;
      mealPlan = JSON.parse(jsonString || '{}');
    } catch (parseError) {
      throw new functions.https.HttpsError(
        'internal',
        'Failed to parse meal plan from AI response'
      );
    }

    // Save to Firestore
    const userId = context.auth.uid;
    const planId = `plan_${Date.now()}`;
    
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('mealPlans')
      .doc(planId)
      .set({
        ...mealPlan,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        measurements,
        foods,
        healthReportText
      });

    return { success: true, planId, mealPlan };

  } catch (error) {
    console.error('Error generating diet plan:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate diet plan'
    );
  }
});

export const saveMealTracking = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  }

  const { date, trackedMeals } = data;
  const userId = context.auth.uid;

  try {
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('trackingLogs')
      .doc(date)
      .set({
        date,
        trackedMeals,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

    return { success: true };

  } catch (error) {
    console.error('Error saving meal tracking:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to save meal tracking'
    );
  }
});

export const getUserMealPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  }

  const userId = context.auth.uid;

  try {
    const mealPlansSnapshot = await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('mealPlans')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (mealPlansSnapshot.empty) {
      return { success: true, mealPlan: null };
    }

    const mealPlan = mealPlansSnapshot.docs[0].data();
    return { success: true, mealPlan };

  } catch (error) {
    console.error('Error getting meal plan:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to get meal plan'
    );
  }
});

export const getUserTrackingData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  }

  const { startDate, endDate } = data;
  const userId = context.auth.uid;

  try {
    let query = admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('trackingLogs');

    if (startDate) {
      query = query.where('date', '>=', startDate);
    }
    if (endDate) {
      query = query.where('date', '<=', endDate);
    }

    const trackingSnapshot = await query.get();
    const trackingData = trackingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, trackingData };

  } catch (error) {
    console.error('Error getting tracking data:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to get tracking data'
    );
  }
});