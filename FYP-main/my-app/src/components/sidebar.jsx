// Sidebar.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isHovered, setIsHovered] = useState(null);

  const tabs = [
    { id: 'steam', label: 'Steam' },
    { id: 'personal', label: 'Personal' }
  ];

  return (
    <motion.div 
    initial={{ x: -250 }}
    animate={{ x: 0 }}
    transition={{ type: 'spring', stiffness: 100 }}
    className="w-64 bg-[#0A0D1C] rounded-xl mb-10 ml-10"
  >
    
    <nav className="p-4">
      <ul className="space-y-2">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(tab.id)}
              onHoverEnd={() => setIsHovered(null)}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full px-4 py-3 rounded-lg text-left transition-colors duration-300 flex items-center ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="relative z-10 flex items-center">
                {tab.id === 'steam' && (
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {tab.id === 'personal' && (
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                {tab.label}
              </span>
              {isHovered === tab.id && (
                <motion.span
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-gray-700 rounded-lg"
                  style={{ borderRadius: 8 }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          </li>
        ))}
      </ul>
    </nav>
  </motion.div>
  );
};

export default Sidebar;