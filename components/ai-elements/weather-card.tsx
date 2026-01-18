import React from 'react';

interface WeatherCardProps {
  location: string;
  temperatureF: number;
  condition: string;
  humidityPercent: number;
  windMph: number;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  temperatureF,
  condition,
  humidityPercent,
  windMph,
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{location}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{condition}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {temperatureF}°
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Fahrenheit</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
            💧
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Humidity</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{humidityPercent}%</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
            🌬️
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Wind</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{windMph} mph</div>
          </div>
        </div>
      </div>
    </div>
  );
};
