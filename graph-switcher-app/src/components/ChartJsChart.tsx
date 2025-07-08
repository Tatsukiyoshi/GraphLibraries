// src/components/ChartJsChart.js
import { useEffect, useRef } from 'react';
import { Chart } from 'react-chartjs-2'; // Chart.jsのReactラッパー
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { labels, quantityData, priceData } from '../data/chartData';

// Chart.jsのコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ChartJsChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // コンポーネントがアンマウントされる際に古いチャートインスタンスを破棄
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const data = {
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
        type: 'line',
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: false,
        tension: 0.1,
        yAxisID: 'y-price'
      }
    ]
  };

  const options = {
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
        type='bar'
        data={data}
        options={options}
      />
    </div>
  );
};

export default ChartJsChart;
