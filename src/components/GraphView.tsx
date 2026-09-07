import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HourlyData } from '../types';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface GraphViewProps {
  hourly: HourlyData;
  selectedDateStr: string;
}

export const GraphView: React.FC<GraphViewProps> = ({ hourly, selectedDateStr }) => {
  // Filter hourly data for the selected date only
  const filteredIndices = hourly.time
    .map((time, index) => (time.startsWith(selectedDateStr) ? index : -1))
    .filter(index => index !== -1);

  // Take every 3 hours to make graph less crowded
  const sparseIndices = filteredIndices.filter((_, i) => i % 3 === 0);

  const labels = sparseIndices.map(i => format(parseISO(hourly.time[i]), 'ha'));
  const dataPoints = sparseIndices.map(i => hourly.temperature_2m[i]);

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Temperature (°C)',
        data: dataPoints,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 14, weight: 'bold' as const, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y}°C`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 12 },
          color: '#6b7280',
        }
      },
      y: {
        border: { display: false },
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 12 },
          color: '#6b7280',
          callback: (value: any) => `${value}°`,
        }
      },
    },
  };

  return (
    <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Hourly Temperature</h3>
      <div className="w-full h-64 relative">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};
