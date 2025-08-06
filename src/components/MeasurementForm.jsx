import React, { useState } from 'react';
import { ScaleIcon, UserIcon } from '@heroicons/react/24/outline';

const MeasurementForm = ({ measurements, onMeasurementsChange }) => {
  const [formData, setFormData] = useState(measurements || {
    weight: '',
    height: '',
    waist: '',
    neck: '',
    bodyFat: '',
    age: '',
    gender: '',
    activityLevel: '',
    goal: 'fat-loss'
  });

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onMeasurementsChange(updatedData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4 sm:mb-6">
        <ScaleIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Body Measurements</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="75"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="175"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waist Circumference (cm)
            </label>
            <input
              type="number"
              value={formData.waist}
              onChange={(e) => handleInputChange('waist', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Neck Circumference (cm)
            </label>
            <input
              type="number"
              value={formData.neck}
              onChange={(e) => handleInputChange('neck', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="38"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body Fat % (optional)
            </label>
            <input
              type="number"
              value={formData.bodyFat}
              onChange={(e) => handleInputChange('bodyFat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg border text-center ${formData.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => handleInputChange('gender', 'male')}
              >
                Male
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg border text-center ${formData.gender === 'female' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => handleInputChange('gender', 'female')}
              >
                Female
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
            <div className="flex flex-col gap-2 mt-2">
              {[
                { value: 'sedentary', label: 'Sedentary' },
                { value: 'light', label: 'Light' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'active', label: 'Active' },
                { value: 'extremely', label: 'Extremely' }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`w-full py-2 rounded-lg border text-left px-3 ${formData.activityLevel === opt.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => handleInputChange('activityLevel', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Goal</label>
        <div className="flex flex-col gap-2 mt-2 max-w-xs">
          {[
            { value: 'fat-loss', label: 'Fat Loss / Shredding' },
            { value: 'muscle-gain', label: 'Muscle Gain' },
            { value: 'maintenance', label: 'Maintenance' },
            { value: 'recomposition', label: 'Body Recomposition' }
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`w-full py-2 rounded-lg border text-left px-3 ${formData.goal === opt.value ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => handleInputChange('goal', opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeasurementForm;