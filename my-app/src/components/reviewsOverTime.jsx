import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';


const ReviewsOverTimeChart = () => {
    const {details} = useContext(UserContext)
    var data = details.timestamp_updated
    // const data = groupReviewsByMonth(dates);

return (
    <div className="w-full h-full p-6 bg-[#181D3B] rounded-2xl text-[#F2FAFE] p-8 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-[#F2FAFE]">Cumulative Reviews Over Time</h2>
        <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
            <XAxis dataKey="month" stroke="#A5B4FC" tick={{ fontSize: 12 }} axisLine={true} tickLine={false} />
            <YAxis stroke="#A5B4FC" tick={{ fontSize: 12 }} axisLine={true} tickLine={false} />
            <Tooltip
            contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: 8 }}
            labelStyle={{ color: '#93C5FD' }}
            itemStyle={{ color: '#FACC15' }}
            />
            <Line
            type="monotone"
            dataKey="count"
            stroke="#60A5FA"
            strokeWidth={3}
            dot={{ r: 3, fill: '#93C5FD' }}
            activeDot={{ r: 6, stroke: '#FACC15', strokeWidth: 2 }}
            animationDuration={800}
            />
        </LineChart>
        </ResponsiveContainer>
    </div>
    );
};

export default ReviewsOverTimeChart;