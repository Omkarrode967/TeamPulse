import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { FaProjectDiagram, FaTasks, FaClipboardList, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const ICONS = [
  <FaProjectDiagram className="w-7 h-7" />, // Total Projects
  <FaTasks className="w-7 h-7" />,          // Total Tasks
  <FaClipboardList className="w-7 h-7" />, // Todo
  <FaSpinner className="w-7 h-7 animate-spin-slow" />, // In Progress
  <FaCheckCircle className="w-7 h-7" />,    // Done
];

const CARD_GRADIENTS = [
  'from-blue-400 to-blue-600',
  'from-gray-400 to-gray-600',
  'from-yellow-300 to-yellow-500',
  'from-purple-400 to-purple-600',
  'from-green-400 to-green-600',
];

const SHADOWS = [
  'shadow-blue-300/40',
  'shadow-gray-400/40',
  'shadow-yellow-300/40',
  'shadow-purple-300/40',
  'shadow-green-300/40',
];

const DashboardCards = ({ projectCount, taskCount, todoCount, inProgressCount, doneCount, dueDateBreakdown = [] }) => {
  const cardData = [
    { title: 'Total Projects', count: projectCount },
    { title: 'Total Tasks', count: taskCount },
    { title: 'Todo Tasks', count: todoCount },
    { title: 'In Progress Tasks', count: inProgressCount },
    { title: 'Done Tasks', count: doneCount },
  ];

  const data = [
    { name: 'To Do', value: todoCount },
    { name: 'In Progress', value: inProgressCount },
    { name: 'Done', value: doneCount },
  ];
  const COLORS = ['#0080ff', '#e94504', '#17a6b1'];

  const lineData = dueDateBreakdown.map(entry => ({
    date: new Date(entry._id).toISOString().split('T')[0],
    tasksDue: entry.tasksDue
  }));

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`rounded-2xl bg-gradient-to-br ${CARD_GRADIENTS[index]} ${SHADOWS[index]} shadow-xl p-5 flex flex-col items-start gap-3 transform transition-transform hover:scale-105 hover:shadow-2xl`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/30 rounded-full p-2 text-white shadow-md">
                {ICONS[index]}
              </span>
              <h3 className="text-lg font-bold text-white drop-shadow">{card.title}</h3>
            </div>
            <p className="text-4xl font-extrabold text-white drop-shadow-lg">{card.count}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-6 px-6">
        {/* pie chart */}
        <div className="w-125 h-72 bg-gradient-to-br from-blue-100 via-white to-cyan-100 m-2 rounded-2xl shadow-lg border border-blue-200 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-blue-700 mb-2 mt-4">Task Status Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* line chart */}
        <div className="w-175 h-72 bg-gradient-to-br from-purple-100 via-white to-indigo-100 m-2 rounded-2xl shadow-lg border border-purple-200 flex flex-col">
          <h2 className="text-lg font-semibold text-purple-700 ml-6 mt-4 mb-2">Tasks Due Over Time</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tasksDue"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
