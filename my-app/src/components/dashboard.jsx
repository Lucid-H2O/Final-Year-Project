import React from 'react'
import { useState, useContext } from 'react';

// import MyResponsiveRadialBar from '../data_vis_components/RadialBar'
import InfoCard from './cards/InfoCard';
import CurrentPlayers from './cards/CurrentPlayers'
import WordCloudBox from './cards/WordCloudBox'
import FileUploader from './cards/FileUpload';
import GameDetailCard from './cards/GameDetailCard';
import getDetails from '../api/getDetails'
import CircularChart from './cards/CircularChart';
import TopAspectChart from './topAspectChart';
import ReviewsOverTimeChart from './reviewsOverTime';

import { UserContext } from '../context/userContext';

function Dashboard({ activeTab }) {

    const {details, setDetails} = useContext(UserContext)

    // State to hold the input value
    const [inputValue, setInputValue] = useState('');

    // State to hold the Loading value
    const [loading, setLoading] = useState(false);

    // State to hold the upload value
    const [personalUploaded, setPersonalUploaded] = useState(false);

    // Function to handle input changes
    const handleChange = (event) => {
      setInputValue(event.target.value);
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        const data = await getDetails(inputValue);
        setDetails(data);
      } catch (err) {
        console.error("Invalid Steam Game ID", err);
      } finally {
        setLoading(false);
        setInputValue(''); // Clear input after loading completes
      }
    };

    const dashboardClasses = 'h-full grow p-10 pt-0 flex flex-col bg-[#121927] ';
  
    // Conditional form styling
    const formClasses = `mb-4 bg-[#181D3B] rounded-2xl text-[#F2FAFE] flex w-full gap-2 shadow-lg`;


  return (
      
      <div className={dashboardClasses}>

      {/* Steam-specific content */}
      {activeTab === 'steam' && (
        <>
          <form onSubmit={handleSubmit} className={formClasses}>
              <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                
                
                placeholder="Enter App ID ..."
                className='flex-1 px-6 py-4 rounded-xl shadow-2xl'
              />
              <button type="submit" className='bg-blue-600 text-white shadow-md px-4 py-3 rounded-lg'>Submit</button>
          </form>
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
          {!loading && (
          <>
          <div className="grid grid-cols-5 gap-4 grow-3 ">
            <GameDetailCard/>
            <CircularChart/>
          </div>
          <div className="mt-4"><TopAspectChart /></div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <InfoCard theme="steam" label='Current Players' data={details.players}/>
            <InfoCard theme="steam" label='Positive Reviews' data={details.pos_reviews_count}/>
            <InfoCard theme="steam" label='Negative Reviews' data={details.neg_reviews_count}/>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 grow-5">
            <ReviewsOverTimeChart/>
            <WordCloudBox theme="steam"/>
            {/* <div className="bg-[#14213F] text-[#F2FAFE] p-4 rounded-lg"></div>
            <CurrentPlayers theme="steam"/> */}
          </div>
          </>
          )}
        </>
      )}

        {/* Personal-specific content */}
        {activeTab === 'personal' && (
        <>
          {!personalUploaded && (
            <FileUploader onUploadSuccess={() => setPersonalUploaded(true)}/>
          )}
          {personalUploaded && (
            <>
              <div className="grid grid-cols-5 gap-4 grow-3 ">
                <div className="col-span-3"><ReviewsOverTimeChart/></div>
                <CircularChart/>
              </div>
              <div className="mt-4"><TopAspectChart /></div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <InfoCard theme="steam" label='Positive Reviews' data={details.pos_reviews_count}/>
                <InfoCard theme="steam" label='Negative Reviews' data={details.neg_reviews_count}/>
              </div>
              <div className="grid gap-4 mt-4 grow-5">
                <WordCloudBox theme="steam"/>
                {/* <div className="bg-[#14213F] text-[#F2FAFE] p-4 rounded-lg"></div>
                <CurrentPlayers theme="steam"/> */}
              </div>
            </>
          )}
        </>
      )}
      </div>

    
  )
}

export default Dashboard;
