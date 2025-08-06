import React, { useState } from 'react';
import { PlusIcon, XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const FoodInput = ({ foods, onFoodsChange }) => {
  const [currentFood, setCurrentFood] = useState('');
  const [foodList, setFoodList] = useState(foods || []);

  const addFood = () => {
    if (currentFood.trim() && !foodList.includes(currentFood.trim())) {
      const updatedList = [...foodList, currentFood.trim()];
      setFoodList(updatedList);
      onFoodsChange(updatedList);
      setCurrentFood('');
    }
  };

  const removeFood = (index) => {
    const updatedList = foodList.filter((_, i) => i !== index);
    setFoodList(updatedList);
    onFoodsChange(updatedList);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFood();
    }
  };

  const commonEuropeanFoods = [
    'Chicken breast', 'Salmon', 'Eggs', 'Greek yogurt', 'Oats',
    'Rice', 'Quinoa', 'Sweet potatoes', 'Broccoli', 'Spinach',
    'Almonds', 'Olive oil', 'Avocado', 'Cottage cheese', 'Tuna',
    'Lentils', 'Chickpeas', 'Turkey', 'Beef', 'Cod',
    'Brussels sprouts', 'Cauliflower', 'Bell peppers', 'Tomatoes',
    'Cucumber', 'Carrots', 'Blueberries', 'Apples', 'Bananas'
  ];

  const addCommonFood = (food) => {
    if (!foodList.includes(food)) {
      const updatedList = [...foodList, food];
      setFoodList(updatedList);
      onFoodsChange(updatedList);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <ShoppingBagIcon className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">Available Foods</h2>
      </div>

      <div className="space-y-6">
        {/* Add food input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentFood}
            onChange={(e) => setCurrentFood(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter food item (e.g., Chicken breast, Broccoli...)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={addFood}
            disabled={!currentFood.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Current food list */}
        {foodList.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Your Available Foods:</h3>
            <div className="flex flex-wrap gap-2">
              {foodList.map((food, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{food}</span>
                  <button
                    onClick={() => removeFood(index)}
                    className="hover:bg-green-200 rounded-full p-1 transition-colors duration-200"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common European foods */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Add Common Foods:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {commonEuropeanFoods.map((food) => (
              <button
                key={food}
                onClick={() => addCommonFood(food)}
                disabled={foodList.includes(food)}
                className={`
                  px-3 py-2 text-sm rounded-lg border transition-colors duration-200 text-left
                  ${foodList.includes(food)
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }
                `}
              >
                {food}
              </button>
            ))}
          </div>
        </div>

        {foodList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ShoppingBagIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Add foods that are available to you in Europe</p>
            <p className="text-xs text-gray-400 mt-1">This helps create a personalized meal plan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodInput;