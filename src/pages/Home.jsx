import React, { useState } from 'react';
import { jsonRepair } from '../utils/jsonRepair';
import PhotoUpload from '../components/PhotoUpload';
import MicInput from '../components/MicInput';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { callOpenAIDirectly } from '../api/dietApi';
import UploadReport from '../components/UploadReport';
import MeasurementForm from '../components/MeasurementForm';
import FoodInput from '../components/FoodInput';
import LoadingSpinner from '../components/LoadingSpinner';
import { SparklesIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [extractedText, setExtractedText] = useState('');
  const [measurements, setMeasurements] = useState({});
  const [foods, setFoods] = useState([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [micText, setMicText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [planResult, setPlanResult] = useState(null);

  const createPrompt = () => {
    return `You are my personal genetic-based AI Nutrition Coach and expert meal planner.

Context:
- This plan may be for a child, or for someone with ADHD or autism, so please consider neurodiversity, sensory sensitivities, and behavioral needs.
- The user may have an Indian cultural background, so respect Indian food preferences, family eating patterns, and common dietary restrictions (e.g., vegetarianism, religious fasting, spice tolerance).
- If the user is a child, ensure the plan is age-appropriate, fun, and easy for parents to implement.

My health report:
${extractedText || 'No health report provided'}

User-typed or spoken preferences/symptoms:
${micText || 'None provided'}

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

${photoUrl ? `My photo is available at this URL: ${photoUrl}` : ''}

Geo-location: (auto-detect or user-provided)

Design a meal plan tailored to my genetics, neurotype, preferences, and available foods. If the health report is a PDF and text could not be extracted, you may receive the PDF directly for analysis.

Output the response in JSON as before.`;
  };

  const handleGeneratePlan = async () => {
    if (!extractedText && !measurements.weight) {
      setError('Please provide either a health report or basic measurements to generate a plan.');
      return;
    }

    if (foods.length === 0) {
      setError('Please add some available foods to create your meal plan.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = createPrompt();
      console.log('Generating meal plan with prompt:', prompt);

      // Call OpenAI API
      const response = await callOpenAIDirectly(prompt);
      console.log('OpenAI response:', response);

      // Try to parse JSON from the response
      let mealPlan;
      try {
        // Extract JSON from response if it's wrapped in text
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        let jsonString = jsonMatch ? jsonMatch[0] : response;
        console.log('Raw AI response before JSON.parse:', response);
        try {
          mealPlan = JSON.parse(jsonString);
        } catch (parseError1) {
          // Try to repair JSON and parse again
          try {
            jsonString = jsonRepair(jsonString);
            mealPlan = JSON.parse(jsonString);
          } catch (parseError2) {
            console.error('Error parsing JSON:', parseError2);
            setError(
              <div>
                <b>Failed to parse meal plan from AI response.</b>
                <div className="text-xs">Raw response:</div>
                <pre className="bg-gray-100 text-xs p-2 rounded overflow-x-auto max-h-48 whitespace-pre-wrap">{String(response)}</pre>
              </div>
            );
            return;
          }
        }
        setPlanResult(mealPlan);
      } catch (parseError) {
        // Should not reach here
        setError('Unknown error parsing meal plan.');
        return;
      }

      // Save to Firebase
      const planId = `plan_${Date.now()}`;
      const userDocRef = doc(db, 'users', user.uid);
      const planDocRef = doc(db, 'users', user.uid, 'mealPlans', planId);

      // Save user data and meal plan
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      await setDoc(planDocRef, {
        ...mealPlan,
        createdAt: new Date().toISOString(),
        measurements,
        foods,
        healthReportText: extractedText,
        photoUrl
      });

      console.log('Meal plan saved successfully');

      // Navigate to dashboard
      // Optionally, navigate or just show the plan below

    } catch (error) {
      console.error('Error generating meal plan:', error);
      setError(error.message || 'Failed to generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = () => {
    return (extractedText || measurements.weight) && foods.length > 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 px-2 sm:px-4 md:px-8">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-full">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Create Your Personalized Diet Plan
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Upload your health report, enter your measurements, and let AI create a 
          4-week shredding meal plan tailored specifically for you.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Show meal plan result if available */}
      {planResult && (
        <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Your Personalized Meal Plan</h2>
          {planResult.meal_plan?.overview && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Overview</h3>
              <ul className="list-disc ml-6 text-gray-700">
                <li><b>Goal:</b> {planResult.meal_plan.overview.goal}</li>
                {planResult.meal_plan.overview.genetic_considerations && (
                  <li><b>Genetic Considerations:</b>
                    <ul className="list-disc ml-6">
                      {Object.entries(planResult.meal_plan.overview.genetic_considerations).map(([k, v]) => (
                        <li key={k}><b>{k.replace(/_/g, ' ')}:</b> {v}</li>
                      ))}
                    </ul>
                  </li>
                )}
                {planResult.meal_plan.overview.neurodiversity_considerations && (
                  <li><b>Neurodiversity Considerations:</b>
                    <ul className="list-disc ml-6">
                      {Object.entries(planResult.meal_plan.overview.neurodiversity_considerations).map(([k, v]) => (
                        <li key={k}><b>{k.replace(/_/g, ' ')}:</b> {v}</li>
                      ))}
                    </ul>
                  </li>
                )}
                {planResult.meal_plan.overview.cultural_preferences && (
                  <li><b>Cultural Preferences:</b>
                    <ul className="list-disc ml-6">
                      {Object.entries(planResult.meal_plan.overview.cultural_preferences).map(([k, v]) => (
                        <li key={k}><b>{k.replace(/_/g, ' ')}:</b> {v}</li>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          )}
          {planResult.meal_plan?.daily_meal_plan && (
            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Day-by-Day Plan</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="p-2 border">Day</th>
                      <th className="p-2 border">Breakfast</th>
                      <th className="p-2 border">Lunch</th>
                      <th className="p-2 border">Dinner</th>
                      <th className="p-2 border">Snacks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(planResult.meal_plan.daily_meal_plan).map(([day, meals]) => (
                      <tr key={day} className="border-b">
                        <td className="p-2 border font-bold capitalize">{day}</td>
                        {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                          <td className="p-2 border align-top" key={mealType}>
                            {meals[mealType] ? (
                              <div>
                                <div className="font-semibold">{meals[mealType].name}</div>
                                <div className="text-xs text-gray-600 mb-1">{meals[mealType].nutritional_benefits}</div>
                                <div className="text-xs"><b>Ingredients:</b> {meals[mealType].ingredients?.join(', ')}</div>
                                <div className="text-xs"><b>Instructions:</b> {meals[mealType].instructions}</div>
                              </div>
                            ) : <span className="text-gray-400">-</span>}
                          </td>
                        ))}
                        <td className="p-2 border align-top">
                          {meals.snacks && meals.snacks.length > 0 ? (
                            <ul className="list-disc ml-4">
                              {meals.snacks.map((snack, idx) => (
                                <li key={idx}>
                                  <div className="font-semibold">{snack.name}</div>
                                  <div className="text-xs text-gray-600 mb-1">{snack.nutritional_benefits}</div>
                                  <div className="text-xs"><b>Ingredients:</b> {snack.ingredients?.join(', ')}</div>
                                  <div className="text-xs"><b>Instructions:</b> {snack.instructions}</div>
                                </li>
                              ))}
                            </ul>
                          ) : <span className="text-gray-400">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 0: Speak or Type Preferences/Symptoms */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">0</div>
          <h2 className="text-xl font-semibold text-gray-800">Speak or Type Your Preferences / Symptoms</h2>
        </div>
        <div className="ml-8">
          <MicInput onText={setMicText} label="Speak or type your report, symptoms, or food preferences" placeholder="E.g. I feel tired after eating bread. Prefer Mediterranean food. Lactose intolerant..." />
        </div>
      </div>

      {/* Step 1: Health Report */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
          <h2 className="text-xl font-semibold text-gray-800">Upload Health Report (Optional)</h2>
        </div>
        <p className="text-gray-600 text-sm ml-8">
          Upload your medical report, blood work, or health assessment for personalized recommendations.
        </p>
        <div className="ml-8">
          <UploadReport onTextExtracted={setExtractedText} extractedText={extractedText} />
        </div>
      </div>

      {/* Step 1.5: Photo Upload */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1.5</div>
          <h2 className="text-xl font-semibold text-gray-800">Upload Photo (Optional)</h2>
        </div>
        <div className="ml-8">
          <PhotoUpload userId={user?.uid} onPhotoUploaded={setPhotoUrl} existingPhotoUrl={photoUrl} />
        </div>
      </div>

      {/* Step 2: Measurements */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
          <h2 className="text-xl font-semibold text-gray-800">Body Measurements</h2>
        </div>
        <p className="text-gray-600 text-sm ml-8">
          Enter your current body measurements and fitness goals.
        </p>
        <div className="ml-8">
          <MeasurementForm measurements={measurements} onMeasurementsChange={setMeasurements} />
        </div>
      </div>

      {/* Step 3: Available Foods */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
          <h2 className="text-xl font-semibold text-gray-800">Available Foods</h2>
        </div>
        <p className="text-gray-600 text-sm ml-8">
          Add foods that are easily available to you in your location.
        </p>
        <div className="ml-8">
          <FoodInput foods={foods} onFoodsChange={setFoods} />
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center pt-8">
        <button
          onClick={handleGeneratePlan}
          disabled={!isFormValid() || isGenerating}
          className={`
            px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200
            ${isFormValid() && !isGenerating
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 transform hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Your Plan...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-6 h-6" />
              <span>Generate My Diet Plan</span>
            </div>
          )}
        </button>
      </div>

      {isGenerating && (
        <div className="relative text-center py-8">
          {photoUrl && (
            <div className="flex flex-col items-center justify-center mb-6 relative">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg">
                <img src={photoUrl} alt="Scanning..." className="w-full h-full object-cover" />
                {/* Animated scanning bar */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-green-300 to-blue-400 opacity-80 animate-scan-bar"></div>
                </div>
              </div>
              <div className="mt-3 text-blue-600 font-semibold text-base animate-pulse">Scanning your photo for personalized insights...</div>
            </div>
          )}
          <LoadingSpinner message="AI is analyzing your profile and creating your personalized meal plan..." />
        </div>
      )}
    </div>
  );
};

export default Home;