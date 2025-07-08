// src/components/ChartJsChart.tsx
import React, { useEffect, useRef } from 'react';
import { Chart } from 'react-chartjs-2'; // Chart.jsのReactラッパー
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, BarController, LineController } from 'chart.js';
import { labels, quantityData, priceData } from '../data/chartData';
import type { ChartData, ChartOptions } from 'chart.js';

// Chart.jsのコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,    // 追加
  LineController    // 追加
);

const ChartJsChart: React.FC = () => {
  const chartRef = useRef<ChartJS<'bar' | 'line'> | null>(null); // ChartJS インスタンスの型を指定

  useEffect(() => {
    // コンポーネントがアンマウントされる際に古いチャートインスタンスを破棄
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // ChartData の型を指定
  const data: ChartData<'bar' | 'line'> = { // グラフタイプが bar と line の複合なので | で指定
    labels: labels,
    datasets: [
      {
        label: '数量 (棒)',
        data: quantityData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y-quantity'
      },
      {
        label: '価格 (折れ線)',
        data: priceData,
        type: 'line' as const, // Chart.js の type はリテラル型として扱う
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: false,
        tension: 0.1,
        yAxisID: 'y-price'
      }
    ]
  };

  // ChartOptions の型を指定
  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false, // 親要素のサイズに合わせる
    plugins: {
      title: {
        display: true,
        text: '月別 数量と価格の推移'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '月'
        }
      },
      'y-quantity': {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: '数量'
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false
        }
      },
      'y-price': {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: '価格'
        },
        grid: {
          drawOnChartArea: false
        },
        min: 400,
        max: 600
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3>Chart.js 複合グラフ</h3>
      <Chart
        ref={chartRef}
        type='bar' // デフォルトタイプ
        data={data}
        options={options}
      />
    </div>
  );
};

export default ChartJsChart;
