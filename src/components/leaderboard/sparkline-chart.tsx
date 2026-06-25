'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineChartProps {
  data: number[];
  width?: number | `${number}%`;
  height?: number;
}

export function SparklineChart({ data, width = '100%', height = 24 }: SparklineChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !data || data.length === 0) {
    return <div style={{ width, height }} className="bg-transparent" />;
  }

  // Convert raw numbers to a shape suitable for Recharts
  const chartData = data.map((val, index) => ({
    index,
    value: val,
  }));

  // Trend color depends on cumulative final net performance
  const startVal = data[0] || 0;
  const endVal = data[data.length - 1] || 0;
  const isPositive = endVal >= startVal;
  const strokeColor = isPositive ? '#10b981' : '#f43f5e'; // Neon Green / Neon Rose Red

  return (
    <div style={{ width, height }} className="flex items-center">
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
