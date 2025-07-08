// src/components/RechartsChart.tsx
import React from 'react';
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
import { chartData } from '../data/chartData'; // ChartDataItem をインポート
import type { ChartDataItem } from '../data/chartData'; // ChartDataItem をインポート

interface FormattedRechartsDataItem extends ChartDataItem {
    name: string; // Recharts の XAxis で使用するカテゴリ名
}

const RechartsChart: React.FC = () => {
  // Rechartsは日付オブジェクトを直接扱えるが、XAxisのnameに表示するためにnameプロパティを追加
  const formattedData: FormattedRechartsDataItem[] = chartData.map((d: ChartDataItem) => ({
    ...d,
    name: new Date(d.date).toLocaleDateString('ja-JP', { month: 'short' })
  }));

  // 価格データの最小・最大値を取得し、D3と同じルールで余白を追加
  const priceMin = Math.min(...chartData.map(d => d.price));
  const priceMax = Math.max(...chartData.map(d => d.price));
  const yPriceMin = priceMin * 0.9;
  const yPriceMax = priceMax * 1.1;

  return (
    <div style={{ width: 800, height: 500 }}>
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
          <YAxis
            yAxisId="price"
            orientation="right"
            stroke="#82ca9d"
            label={{ value: '価格', angle: 90, position: 'insideRight' }}
            domain={[yPriceMin, yPriceMax]} // D3と同じルール
          />
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
