import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

const RatingGraph = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, index) => `Rating ${index + 1}`),
        datasets: [
          {
            label: 'Rating Progress',
            data: data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 6,
          },
        },
      },
    });
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default RatingGraph;
