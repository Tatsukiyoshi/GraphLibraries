// src/components/D3Chart.tsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { ChartDataItem } from '../data/chartData'; // ChartDataItem をインポート
import { chartData } from '../data/chartData';

// D3で整形後のデータの型定義
interface FormattedDataItem {
  date: Date;
  quantity: number;
  price: number;
}

interface D3ChartProps {
  theme: 'light' | 'dark';
}

const D3Chart: React.FC<D3ChartProps> = ({ theme }) => {
  const svgRef = useRef<SVGSVGElement | null>(null); // useRef の型を指定
  const chartWidth = 800;
  const chartHeight = 500;

  const bgColor = theme === 'dark' ? '#222' : '#fff';
  const fontColor = theme === 'dark' ? '#eee' : '#222';
  const gridColor = theme === 'dark' ? '#444' : '#ccc';

  useEffect(() => {
    // データを整形し、型を適用
    const parsedData: FormattedDataItem[] = chartData.map((d: ChartDataItem) => ({
      date: d3.timeParse("%Y-%m-%d")(d.date) as Date, // d3.timeParse は Date | null を返すため、as Date で断言
      quantity: +d.quantity,
      price: +d.price
    }));

    // SVG要素が存在しない場合は何もしない
    if (!svgRef.current) return;

    // 古いグラフをクリア
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 60, right: 80, bottom: 40, left: 60 };
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // SVG要素を選択し、グループ要素を追加
    const svg = d3.select(svgRef.current)
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .style("background-color", bgColor)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // スケール
    const xScale = d3.scaleBand<Date>() // domain の型を指定
      .domain(parsedData.map(d => d.date))
      .range([0, width])
      .padding(0.3);

    const yScaleQuantity = d3.scaleLinear<number, number>() // domain と range の型を指定
      .domain([0, d3.max(parsedData, d => d.quantity)! * 1.1]) // d3.max は undefined を返す可能性があるため ! で断言
      .range([height, 0]);

    const yScalePrice = d3.scaleLinear<number, number>()
      .domain([d3.min(parsedData, d => d.price)! * 0.9, d3.max(parsedData, d => d.price)! * 1.1])
      .range([height, 0]);

    // グリッド線ジェネレータ
    // const makeYGridlinesQuantity = () => d3.axisLeft(yScaleQuantity).ticks(5);

    // 左Y軸のグリッド線
    svg.append("g")
      .attr("class", "d3-grid")
      .call(
        d3.axisLeft(yScaleQuantity)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => "")
      );

    // 軸の描画
    svg.append("g")
      .attr("class", "d3-axis d3-x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m月")));

    svg.append("g")
      .attr("class", "d3-axis d3-y-axis-quantity")
      .call(d3.axisLeft(yScaleQuantity).ticks(5))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 15)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .text("数量");

    svg.append("g")
      .attr("class", "d3-axis d3-y-axis-price")
      .attr("transform", `translate(${width},0)`)
      .call(d3.axisRight(yScalePrice).ticks(5))
      .append("text")
      .attr("transform", "rotate(90)")
      .attr("y", -margin.right + 15)
      .attr("x", height / 2)
      .attr("dy", "1em")
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .text("価格");

    // 棒グラフ
    svg.selectAll<SVGRectElement, FormattedDataItem>(".d3-bar") // 選択要素とデータ型を指定
      .data(parsedData)
      .enter().append("rect")
      .attr("class", "d3-bar")
      .attr("x", d => xScale(d.date)!) // d3.scaleBand の戻り値は undefined の可能性があるので ! で断言
      .attr("y", d => yScaleQuantity(d.quantity))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScaleQuantity(d.quantity));

    // 折れ線グラフのジェネレータ
    const line = d3.line<FormattedDataItem>() // データ型を指定
      .x(d => xScale(d.date)! + xScale.bandwidth() / 2)
      .y(d => yScalePrice(d.price));

    // 折れ線グラフ
    svg.append("path")
      .datum(parsedData) // datum にもデータ型を指定
      .attr("class", "d3-line")
      .attr("d", line);

    // 折れ線グラフの点
    svg.selectAll<SVGCircleElement, FormattedDataItem>(".d3-dot") // 選択要素とデータ型を指定
      .data(parsedData)
      .enter().append("circle")
      .attr("class", "d3-dot")
      .attr("cx", d => xScale(d.date)! + xScale.bandwidth() / 2)
      .attr("cy", d => yScalePrice(d.price))
      .attr("r", 4)
      .attr("fill", "orange")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);

    // 凡例
    const legend = svg.append("g")
        .attr("class", "d3-legend")
        .attr("transform", `translate(${width - 120}, ${-margin.top + 5})`);

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", "steelblue");

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("fill", fontColor)
        .text("数量");

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 25)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", "orange");

    legend.append("text")
        .attr("x", 24)
        .attr("y", 34)
        .attr("dy", ".35em")
        .attr("fill", fontColor)
        .text("価格");

    // 軸やラベルの色をテーマに応じて変更
    svg.selectAll('.d3-axis text').attr('fill', fontColor);
    svg.selectAll('.d3-axis path').attr('stroke', fontColor);
    svg.selectAll('.d3-axis line').attr('stroke', gridColor);
  }, [theme]);

  return (
    <div style={{ textAlign: 'center', background: bgColor, color: fontColor }}>
      <h3>D3.js 複合グラフ</h3>
      <svg ref={svgRef} id="d3-chart-svg"></svg>
    </div>
  );
};

export default D3Chart;