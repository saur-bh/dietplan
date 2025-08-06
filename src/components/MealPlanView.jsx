import React, { useState } from 'react';
import { CalendarDaysIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

const MealPlanView = ({ mealPlan, onMealToggle, trackedMeals = {} }) => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);

  if (!mealPlan || !mealPlan.weekPlan) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <CalendarDaysIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">No meal plan generated yet</p>
        <p className="text-sm text-gray-400 mt-1">Upload your health report and generate a plan to get started</p>
      </div>
    );
  }

  const currentWeek = mealPlan.weekPlan[selectedWeek];
  const currentDay = currentWeek?.days?.[selectedDay] || currentWeek;

  const getMealKey = (weekIndex, dayIndex, mealIndex) => {
    return `${weekIndex}-${dayIndex}-${mealIndex}`;
  };

  const isMealTracked = (weekIndex, dayIndex, mealIndex) => {
    const key = getMealKey(weekIndex, dayIndex, mealIndex);
    return trackedMeals[key] || false;
  };

  const handleMealCheck = (weekIndex, dayIndex, mealIndex) => {
    const key = getMealKey(weekIndex, dayIndex, mealIndex);
    onMealToggle(key, !isMealTracked(weekIndex, dayIndex, mealIndex));
  };

  const calculateDayMacros = (meals) => {
    return meals.reduce((totals, meal) => {
      const mealMacros = meal.items.reduce((mealTotals, item) => ({
        calories: mealTotals.calories + (item.calories || 0),
        protein: mealTotals.protein + (item.protein || 0),
        carbs: mealTotals.carbs + (item.carbs || 0),
        fat: mealTotals.fat + (item.fat || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      return {
        calories: totals.calories + mealMacros.calories,
        protein: totals.protein + mealMacros.protein,
        carbs: totals.carbs + mealMacros.carbs,
        fat: totals.fat + mealMacros.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const dayMacros = calculateDayMacros(currentDay.meals || []);
  const targetMacros = mealPlan.dailyMacros || dayMacros;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Your Meal Plan</h2>
          </div>
          <div className="text-sm text-gray-500">
            4-Week Shredding Program
          </div>
        </div>

        {/* Week and Day Navigation */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
            <div className="flex space-x-2">
              {mealPlan.weekPlan.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedWeek(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedWeek === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
            <div className="flex flex-wrap gap-2">
              {(currentWeek?.days || [currentWeek]).map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedDay === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.day || `Day ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Macros Overview */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Targets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(targetMacros.calories)}</div>
            <div className="text-sm text-gray-600">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(targetMacros.protein)}g</div>
            <div className="text-sm text-gray-600">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{Math.round(targetMacros.carbs)}g</div>
            <div className="text-sm text-gray-600">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{Math.round(targetMacros.fat)}g</div>
            <div className="text-sm text-gray-600">Fat</div>
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="p-6">
        <div className="space-y-6">
          {(currentDay.meals || []).map((meal, mealIndex) => {
            const mealMacros = meal.items.reduce((totals, item) => ({
              calories: totals.calories + (item.calories || 0),
              protein: totals.protein + (item.protein || 0),
              carbs: totals.carbs + (item.carbs || 0),
              fat: totals.fat + (item.fat || 0)
            }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

            const isTracked = isMealTracked(selectedWeek, selectedDay, mealIndex);

            return (
              <div
                key={mealIndex}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  isTracked ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <h4 className="text-lg font-semibold text-gray-800">{meal.meal}</h4>
                  </div>
                  <button
                    onClick={() => handleMealCheck(selectedWeek, selectedDay, mealIndex)}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      isTracked
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {isTracked ? (
                      <CheckCircleIconSolid className="w-6 h-6" />
                    ) : (
                      <CheckCircleIcon className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Meal Items */}
                <div className="space-y-2 mb-4">
                  {meal.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <span className="text-gray-800 font-medium">{item.food}</span>
                        <span className="text-gray-600 ml-2">({item.grams}g)</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.calories}cal • {item.protein}p • {item.carbs}c • {item.fat}f
                      </div>
                    </div>
                  ))}
                </div>

                {/* Meal Macros Summary */}
                <div className="flex justify-between items-center text-sm bg-gray-50 rounded-lg p-3">
                  <span className="font-medium text-gray-700">Meal Totals:</span>
                  <div className="flex space-x-4 text-gray-600">
                    <span>{Math.round(mealMacros.calories)} cal</span>
                    <span>{Math.round(mealMacros.protein)}p</span>
                    <span>{Math.round(mealMacros.carbs)}c</span>
                    <span>{Math.round(mealMacros.fat)}f</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MealPlanView;