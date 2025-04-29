import React from 'react';
import { UserContext } from '../context/userContext';

const Header = () => {

  return (
    <div className={"h-24 p-6 m-10 mb-8 bg-gradient-to-b bg-[#0A0D1C] text-white shadow-lg flex justify-between rounded-lg"}>
      <h1 className="text-4xl  text-white">Sentiment Analysis Dashboard</h1>
      <h1 className="text-4xl  text-white">FYP24090</h1>
    </div>
  );
};

export default Header;