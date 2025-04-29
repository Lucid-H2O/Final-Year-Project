import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

import { useContext } from 'react';
import { UserContext } from '../context/userContext';

const processTopAspects = (aspectGroups) => {
    const countMap = { positive: {}, negative: {} };
  
    aspectGroups.flat().forEach(({ term, sentiment }) => {
      const normalized = term.trim().toLowerCase();
      if (sentiment.toLowerCase() === "positive" || sentiment.toLowerCase() === "negative") {
        const sentimentKey = sentiment.toLowerCase();
        countMap[sentimentKey][normalized] = (countMap[sentimentKey][normalized] || 0) + 1;
      }
    });
  
    const toSortedArray = (obj) =>
      Object.entries(obj)
        .map(([term, count]) => ({ term, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);
  
    return {
      positive: toSortedArray(countMap.positive),
      negative: toSortedArray(countMap.negative),
    };
};


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { term, count } = payload[0].payload;
    return (
      <div className="bg-[#0F172A] text-[#F2FAFE] p-3 rounded-xl shadow-md border border-blue-500">
        <p className="text-sm font-semibold">Aspect: <span className="text-blue-300">{term}</span></p>
        <p className="text-sm">Mentions: <span className="text-green-400">{count}</span></p>
      </div>
    );
  }
  return null;
};
  
const TopAspectsChart = () => {
    const {details} = useContext(UserContext)
    var aspects = details.aspects_with_sentiment
    const { positive, negative } = processTopAspects(aspects);
  

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#181D3B] rounded-2xl text-[#F2FAFE] p-8 shadow-lg">
            <h2 className="text-xl font-bold mb-2">Top 10 Positive Aspects</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positive} layout="vertical">
                <XAxis type="number" allowDecimals={false} stroke="#A5B4FC" />
                <YAxis dataKey="term" type="category" width={75}  stroke="#A5B4FC" interval={0} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="count" fill="#4ade80" name="Mentions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
    
          <div className="bg-[#181D3B] rounded-2xl text-[#F2FAFE] p-8 shadow-lg">
            <h2 className="text-xl font-bold mb-2">Top 10 Negative Aspects</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={negative} layout="vertical">
                <XAxis type="number" allowDecimals={false} stroke="#A5B4FC"/>
                <YAxis dataKey="term" type="category" width={75} stroke="#A5B4FC" interval={0} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />}/>
                <Legend />
                <Bar dataKey="count" fill="#f87171" name="Mentions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
  };
  
export default TopAspectsChart;
  