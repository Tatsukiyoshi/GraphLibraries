import { useState } from 'react';
import D3Chart from './components/D3Chart';
import ChartJsChart from './components/ChartJsChart';
import RechartsChart from './components/RechartsChart';
import './App.css'; // スタイルシートをインポート

const App = () => {
  const [currentChart, setCurrentChart] = useState('d3'); // 初期表示はD3.js

  const renderChart = () => {
    switch (currentChart) {
      case 'd3':
        return <D3Chart />;
      case 'chartjs':
        return <ChartJsChart />;
      case 'recharts':
        return <RechartsChart />;
      default:
        return <D3Chart />;
    }
  };

  return (
    <div className="App">
      <h1>グラフライブラリ比較</h1>
      <div className="button-container">
        <button onClick={() => setCurrentChart('d3')} className={currentChart === 'd3' ? 'active' : ''}>
          D3.js
        </button>
        <button onClick={() => setCurrentChart('chartjs')} className={currentChart === 'chartjs' ? 'active' : ''}>
          Chart.js
        </button>
        <button onClick={() => setCurrentChart('recharts')} className={currentChart === 'recharts' ? 'active' : ''}>
          Recharts
        </button>
      </div>
      <div className="chart-container">
        {renderChart()}
      </div>
    </div>
  );
};

export default App;
