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

interface RechartsChartProps {
  theme: 'light' | 'dark';
}

const RechartsChart: React.FC<RechartsChartProps> = ({ theme }) => {
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

  // テーマごとの色設定
  const bgColor = theme === 'dark' ? '#222' : '#fff';
  const fontColor = theme === 'dark' ? '#eee' : '#222';
  const gridColor = theme === 'dark' ? '#444' : '#ccc';

  return (
    <div style={{ width: 800, height: 500, background: bgColor, color: fontColor }}>
      <h3>Recharts 複合グラフ</h3>
      <ResponsiveContainer>
        <ComposedChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke={fontColor} tick={{ fill: fontColor }} />
          {/* 左Y軸 (数量) */}
          <YAxis yAxisId="quantity" orientation="left" stroke="#8884d8" tick={{ fill: fontColor }} label={{ value: '数量', angle: -90, position: 'insideLeft', fill: fontColor }} />
          {/* 右Y軸 (価格) */}
          <YAxis
            yAxisId="price"
            orientation="right"
            stroke="#82ca9d"
            tick={{ fill: fontColor }}
            label={{ value: '価格', angle: 90, position: 'insideRight', fill: fontColor }}
            domain={[yPriceMin, yPriceMax]} // D3と同じルール
          />
          <Tooltip contentStyle={{ background: bgColor, color: fontColor, borderColor: gridColor }} />
          <Legend wrapperStyle={{ color: fontColor }} />

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
