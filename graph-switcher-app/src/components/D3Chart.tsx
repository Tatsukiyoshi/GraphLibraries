// src/components/D3Chart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { chartData } from '../data/chartData';

const D3Chart = () => {
  const svgRef = useRef('');

  useEffect(() => {
    const data = chartData.map(d => ({
      date: d3.timeParse("%Y-%m-%d")(d.date),
      quantity: +d.quantity,
      price: +d.price
    }));

    // 古いグラフをクリア
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 60, right: 80, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // スケール
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, width])
      .padding(0.3);

    const yScaleQuantity = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.quantity) * 1.1])
      .range([height, 0]);

    const yScalePrice = d3.scaleLinear()
      .domain([d3.min(data, d => d.price) * 0.9, d3.max(data, d => d.price) * 1.1])
      .range([height, 0]);

    // 軸
    svg.append("g")
      .attr("class", "d3-axis d3-x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m月")));

    svg.append("g")
      .attr("class", "d3-axis d3-y-axis-quantity")
      .call(d3.axisLeft(yScaleQuantity))
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
      .call(d3.axisRight(yScalePrice))
      .append("text")
      .attr("transform", "rotate(90)")
      .attr("y", -margin.right + 15)
      .attr("x", height / 2)
      .attr("dy", "1em")
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .text("価格");

    // 棒グラフ
    svg.selectAll(".d3-bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "d3-bar")
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScaleQuantity(d.quantity))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScaleQuantity(d.quantity));

    // 折れ線グラフ
    const line = d3.line()
      .x(d => xScale(d.date) + xScale.bandwidth() / 2)
      .y(d => yScalePrice(d.price));

    svg.append("path")
      .datum(data)
      .attr("class", "d3-line")
      .attr("d", line);

    // 折れ線グラフの点
    svg.selectAll(".d3-dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "d3-dot")
      .attr("cx", d => xScale(d.date) + xScale.bandwidth() / 2)
      .attr("cy", d => yScalePrice(d.price))
      .attr("r", 4)
      .attr("fill", "orange")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);

    // 凡例 (D3側でCSSクラスで色を指定)
    const legend = svg.append("g")
        .attr("class", "d3-legend")
        .attr("transform", `translate(${width - 120}, ${-margin.top + 20})`);

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
        .text("価格");

  }, []); // 依存配列が空なので、マウント時に一度だけ実行

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>D3.js 複合グラフ</h3>
      <svg ref={svgRef} id="d3-chart-svg"></svg>
    </div>
  );
};

export default D3Chart;
