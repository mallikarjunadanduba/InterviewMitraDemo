import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Data representing resume completion status
const data = [
  { name: 'Completed', value: 60 }, // 60% completed
  { name: 'In Progress', value: 30 }, // 30% in progress
  { name: 'Not Started', value: 10 }, // 10% not started
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function AnimatedPieChart() {
  const [activeIndex, setActiveIndex] = useState(null);

  // Custom tooltip to show percentage
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
          <p>{`${payload[0].name} : ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex flex-col justify-center items-center h-screen">
      {/* Enhanced Heading */}
      {/* <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 text-center px-4"
        style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
      >
        Resume Completion Percentage
      </motion.h1> */}


      {/* Pie Chart */}
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // Show percentage on the pie chart
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              style={{
                transition: 'transform 0.3s ease',
                transform: activeIndex === index ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </motion.div>
  );
}