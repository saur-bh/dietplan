import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import MealPlanView from '../components/MealPlanView';
import TrackingDashboard from '../components/TrackingDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import { ChartBarIcon, CalendarDaysIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState(null);
  const [trackedMeals, setTrackedMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plan');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load meal plans
      const mealPlansRef = collection(db, 'users', user.uid, 'mealPlans');
      const mealPlansSnapshot = await getDocs(mealPlansRef);
      
      if (!mealPlansSnapshot.empty) {
        // Get the most recent meal plan
        const plans = mealPlansSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const latestPlan = plans.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )[0];
        setMealPlan(latestPlan);
      }

      // Load tracking data for today
      const today = format(new Date(), 'yyyy-MM-dd');
      const trackingRef = doc(db, 'users', user.uid, 'trackingLogs', today);
      const trackingSnapshot = await getDoc(trackingRef);
      
      if (trackingSnapshot.exists()) {
        setTrackedMeals(trackingSnapshot.data().trackedMeals || {});
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMealToggle = async (mealKey, isTracked) => {
    const updatedTrackedMeals = {
      ...trackedMeals,
      [mealKey]: isTracked
    };
    
    setTrackedMeals(updatedTrackedMeals);

    try {
      // Save to Firebase
      const today = format(new Date(), 'yyyy-MM-dd');
      const trackingRef = doc(db, 'users', user.uid, 'trackingLogs', today);
      
      await setDoc(trackingRef, {
        date: today,
        trackedMeals: updatedTrackedMeals,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

    } catch (error) {
      console.error('Error saving tracking data:', error);
      // Revert the state on error
      setTrackedMeals(trackedMeals);
    }
  };

  const handleRefreshPlan = () => {
    // Navigate back to home to create a new plan
    window.location.href = '/';
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadUserData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <CalendarDaysIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Meal Plan Found</h2>
          <p className="text-gray-600 mb-6">
            You haven't created a meal plan yet. Let's get started!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create My First Plan
          </button>
        </div>
      </div>
    );
  }

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
        <button
          onClick={handleRefreshPlan}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Refresh Plan</span>
        </button>
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
            onMealToggle={handleMealToggle}
            trackedMeals={trackedMeals}
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