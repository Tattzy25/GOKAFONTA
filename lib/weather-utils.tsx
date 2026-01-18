import React from 'react';

export function formatWeatherOutput(data: any): React.ReactNode {
  if (!data || typeof data !== 'object') return 'Weather data unavailable';
  return (
    <div className="space-y-2">
      <div className="font-semibold">{data.location}</div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Temperature</div>
          <div className="font-medium">{data.temperature}°F</div>
        </div>
        <div>
          <div className="text-muted-foreground">Condition</div>
          <div className="font-medium capitalize">{data.condition}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Humidity</div>
          <div className="font-medium">{data.humidity}%</div>
        </div>
        <div>
          <div className="text-muted-foreground">Wind Speed</div>
          <div className="font-medium">{data.windSpeed} mph</div>
        </div>
      </div>
    </div>
  );
}
