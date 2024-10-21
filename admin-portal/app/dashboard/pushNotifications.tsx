import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function PushNotifications(data:any) {
  // Data for the pie chart
  const chartData = {
    labels: ['Notification delivered to device', 'User dismisses notification', 'Notification while app in use'],
    datasets: [
      {
        label: '',
        data: [data.data[0].users, data.data[1].users, data.data[2].users], // Use the incoming data
        backgroundColor: ['#6B46C1', '#87BEFF', '#50CB88'], // Purple, Light Blue, Green
        borderWidth: 1,
      },
    ],
  };

  // Options for the pie chart
  const options = {
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
      datalabels: {
        formatter: (value: number, ctx: any) => {
          const total = ctx.chart._metasets[0].total;
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
        color: '#FFFFFF',
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">Push Notifications Statistics</h3>
      <div className="aspect-w-1 aspect-h-1 mb-2">
        <Pie data={chartData} options={options} />
      </div>
      <div className="flex flex-row md:flex-row lg:flex-row lg:text-sm justify-center gap-1">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#6B46C1] rounded-full mr-2"></div>
          <span className="text-med md:text-xs lg:text-sm">{data.data[0].users} {data.data[0].event.split("_")[1][0].toUpperCase() + data.data[0].event.split("_")[1].substring(1)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#87BEFF] rounded-full mr-2"></div>
          <span className="text-med md:text-xs lg:text-sm">{data.data[1].users} {data.data[1].event.split("_")[1][0].toUpperCase() + data.data[1].event.split("_")[1].substring(1)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#50CB88] rounded-full mr-2"></div>
          <span className="text-med md:text-xs lg:text-sm">{data.data[2].users} {data.data[2].event.split("_")[1][0].toUpperCase() + data.data[2].event.split("_")[1].substring(1)}</span>
        </div>
      </div>
    </div>
  );
}
