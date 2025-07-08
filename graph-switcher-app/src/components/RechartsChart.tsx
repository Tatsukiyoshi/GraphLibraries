// src/components/RechartsChart.js
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { chartData } from '../data/chartData';

const RechartsChart = () => {
  // Rechartsは日付オブジェクトを直接扱えるが、XAxisのnameに表示するためにnameプロパティを追加
  const formattedData = chartData.map(d => ({
    ...d,
    name: new Date(d.date).toLocaleDateString('ja-JP', { month: 'short' }) // "1月", "2月" のように表示
  }));

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3>Recharts 複合グラフ</h3>
      <ResponsiveContainer>
        <ComposedChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          {/* 左Y軸 (数量) */}
          <YAxis yAxisId="quantity" orientation="left" stroke="#8884d8" label={{ value: '数量', angle: -90, position: 'insideLeft' }} />
          {/* 右Y軸 (価格) */}
          <YAxis yAxisId="price" orientation="right" stroke="#82ca9d" label={{ value: '価格', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />

          {/* 棒グラフ */}
          <Bar yAxisId="quantity" dataKey="quantity" name="数量" fill="#8884d8" />
          {/* 折れ線グラフ */}
          <Line yAxisId="price" type="monotone" dataKey="price" name="価格" stroke="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsChart;
