import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import MealPlanView from '../components/MealPlanView';
import { generateDietPlan } from '../api/dietApi';
import MeasurementForm from '../components/MeasurementForm';
import TrackingDashboard from '../components/TrackingDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import { ChartBarIcon, CalendarDaysIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [trackedMeals, setTrackedMeals] = useState({});
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [measurementData, setMeasurementData] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  // Handler to regenerate meal plan with new measurements
  const handleRegeneratePlan = async (newMeasurements) => {
    if (!user) return;
    setRegenerating(true);
    try {
      // Save new measurements to user doc
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        measurements: newMeasurements,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      // Get foods and healthReportText from latest plan (or fetch from Firestore if needed)
      const latestPlan = mealPlans[0];
      const foods = latestPlan?.foods || [];
      const healthReportText = latestPlan?.healthReportText || '';

      // Call backend to generate new plan
      await generateDietPlan({
        healthReportText,
        measurements: newMeasurements,
        foods
      });

      setShowMeasurementModal(false);
      setMeasurementData(null);
      // Reload user data to show new plan
      window.location.reload();
    } catch (e) {
      // Optionally show error
    } finally {
      setRegenerating(false);
    }
  };
  const [activeTab, setActiveTab] = useState('plan');
  const [saving, setSaving] = useState(false);

  // Save tracked meal quantities to Firestore
  const handleQuantityChange = async (mealKey, itemIndex, value) => {
    if (!user) return;
    setTrackedMeals(prev => ({
      ...prev,
      [`${mealKey}-${itemIndex}`]: value
    }));
    // Save to Firestore for today
    const today = format(new Date(), 'yyyy-MM-dd');
    const trackingRef = doc(db, 'users', user.uid, 'trackingLogs', today);
    setSaving(true);
    try {
      await setDoc(trackingRef, {
        trackedMeals: {
          ...trackedMeals,
          [`${mealKey}-${itemIndex}`]: value
        }
      }, { merge: true });
    } catch (e) {
      // Optionally show error
    } finally {
      setSaving(false);
    }
  };

  // Find selected meal plan
  const mealPlan = mealPlans.find(p => p.id === selectedPlanId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Diet Dashboard</h1>
          <p className="text-gray-600">
            Plan created on {new Date(mealPlan.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMeasurementModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Update Measurements</span>
          </button>
          <button
            onClick={handleRefreshPlan}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Refresh Plan</span>
          </button>
        </div>
      {/* Measurement Modal */}
      {showMeasurementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowMeasurementModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Update Your Measurements</h2>
            <MeasurementForm
              measurements={measurementData || {}}
              onMeasurementsChange={setMeasurementData}
            />
            <div className="flex justify-end mt-4">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handleRegeneratePlan(measurementData)}
                disabled={regenerating}
              >
                {regenerating ? 'Updating...' : 'Save & Regenerate Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('plan')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plan'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-5 h-5" />
              <span>Meal Plan</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tracking'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-5 h-5" />
              <span>Progress Tracking</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'plan' && (
          <MealPlanView 
            mealPlan={mealPlan} 
            onMealToggle={() => {}}
            trackedMeals={trackedMeals}
            onQuantityChange={handleQuantityChange}
          />
        )}
        {activeTab === 'tracking' && (
          <TrackingDashboard 
            trackedMeals={trackedMeals}
            mealPlan={mealPlan}
          />
        )}
      </div>

      {/* Quick Stats */}
      {mealPlan && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {mealPlan.weekPlan?.length || 4}
              </div>
              <div className="text-sm text-gray-600">Weeks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {mealPlan.dailyMacros?.calories || 0}
              </div>
              <div className="text-sm text-gray-600">Daily Calories</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {mealPlan.dailyMacros?.protein || 0}g
              </div>
              <div className="text-sm text-gray-600">Daily Protein</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(trackedMeals).filter(Boolean).length}
              </div>
              <div className="text-sm text-gray-600">Meals Tracked</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;