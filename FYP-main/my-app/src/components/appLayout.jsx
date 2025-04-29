// AppLayout.jsx (or whatever your parent component is)
import { useState } from 'react';
import Sidebar from './sidebar';
import Dashboard from './dashboard';
import Header from './Header';

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState('steam');

  return (
    <div className='bg-[#121927]'>
        <div>
        <Header />
        </div>
        <div className="flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <Dashboard activeTab={activeTab} />
        </div>
    </div>
  );
};

export default AppLayout;