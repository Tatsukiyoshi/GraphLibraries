import React, { useState } from 'react';
import ChartJsChart from './components/ChartJsChart';
import RechartsChart from './components/RechartsChart';
import D3Chart from './components/D3Chart';
import './App.css'; // スタイルシートをインポート

const App: React.FC = () => {
  const [currentChart, setCurrentChart] = useState('d3'); // 初期表示はD3.js
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const renderChart = () => {
    switch (currentChart) {
      case 'd3':
        return <D3Chart theme={theme} />;
      case 'chartjs':
        return <ChartJsChart theme={theme} />;
      case 'recharts':
        return <RechartsChart theme={theme} />;
      default:
        return <D3Chart theme={theme} />;
    }
  };

  return (
    <div style={{ background: theme === 'dark' ? '#222' : '#fff', minHeight: '100vh', color: theme === 'dark' ? '#eee' : '#222' }}>
      <button onClick={toggleTheme} style={{ margin: 16 }}>
        {theme === 'light' ? 'ダークモード' : 'ライトモード'}に切り替え
      </button>
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
