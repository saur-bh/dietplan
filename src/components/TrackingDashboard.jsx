import React from 'react';
import { ChartBarIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const TrackingDashboard = ({ trackedMeals, mealPlan }) => {
  if (!mealPlan || Object.keys(trackedMeals).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">No tracking data yet</p>
        <p className="text-sm text-gray-400 mt-1">Start tracking your meals to see your progress</p>
      </div>
    );
  }

  // Calculate progress statistics
  const totalMeals = mealPlan.weekPlan.reduce((total, week) => {
    const weekMeals = week.days ? 
      week.days.reduce((dayTotal, day) => dayTotal + (day.meals?.length || 0), 0) :
      (week.meals?.length || 0);
    return total + weekMeals;
  }, 0);

  const trackedMealCount = Object.values(trackedMeals).filter(Boolean).length;
  const progressPercentage = totalMeals > 0 ? (trackedMealCount / totalMeals) * 100 : 0;

  // Sample weekly progress data
  const weeklyData = [
    { week: 'Week 1', tracked: Math.floor(trackedMealCount * 0.4), target: Math.floor(totalMeals * 0.25) },
    { week: 'Week 2', tracked: Math.floor(trackedMealCount * 0.3), target: Math.floor(totalMeals * 0.25) },
    { week: 'Week 3', tracked: Math.floor(trackedMealCount * 0.2), target: Math.floor(totalMeals * 0.25) },
    { week: 'Week 4', tracked: Math.floor(trackedMealCount * 0.1), target: Math.floor(totalMeals * 0.25) }
  ];

  // Sample macro distribution
  const macroData = [
    { name: 'Protein', value: 30, color: '#10b981' },
    { name: 'Carbs', value: 45, color: '#f59e0b' },
    { name: 'Fat', value: 25, color: '#ef4444' }
  ];

  const streakDays = Math.floor(trackedMealCount / 3); // Assuming 3 meals per day

  return (
    <div className="space-y-6">
      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-800">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <TrophyIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-2xl font-bold text-gray-800">{streakDays} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <FireIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Meals Tracked</p>
              <p className="text-2xl font-bold text-gray-800">{trackedMealCount}/{totalMeals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="target" fill="#e5e7eb" name="Target" />
              <Bar dataKey="tracked" fill="#3b82f6" name="Tracked" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Macro Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Macro Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {Object.entries(trackedMeals)
            .filter(([_, tracked]) => tracked)
            .slice(-5)
            .reverse()
            .map(([mealKey, _], index) => {
              const [week, day, meal] = mealKey.split('-');
              return (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Week {parseInt(week) + 1}, Day {parseInt(day) + 1} - Meal {parseInt(meal) + 1}
                    </p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="text-green-600 text-sm">✓</div>
                </div>
              );
            })
          }
          {Object.keys(trackedMeals).filter(key => trackedMeals[key]).length === 0 && (
            <p className="text-gray-500 text-sm">No meals tracked yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingDashboard;