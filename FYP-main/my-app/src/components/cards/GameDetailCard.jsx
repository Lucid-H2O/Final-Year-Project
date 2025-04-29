import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

export default function GameDetailCard() {

    const {details} = useContext(UserContext)

    const ListSection = ({ title, items, limit=4 }) => {
        const itemString = items
            .slice(0, limit) // Limit to the first 4 items
            .map((item, index) => (
                <span key={index}>
                    {item}
                    {index < items.length - 1  && ', '}
                </span>
            ));
    
        return (
            <div className="text-md text-[#F2FAFE]">
                <span className='font-semibold'>{title}: </span>
                {itemString}
                {items.length > 4 && (
                    <span className="">...</span>
                )}
            </div>
        );
    };

    function decodeHtmlEntities(text) {
        const map = {
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&#039;': "'",
          '&#39;': "'", // Alternative apostrophe encoding
        };
        
        return text.replace(/&(amp|lt|gt|quot|#039|#39);/g, (m) => map[m]);
      }


  return (

            <div className=" col-span-3 text-lg gap-2 bg-[#181D3B] rounded-2xl text-[#F2FAFE] p-8 shadow-lg flex flex-col">
                <div className='text-3xl mb-4 font-semibold '>{details.name}</div>

                <div>{decodeHtmlEntities(details.description)}</div>

                <ListSection title="Developers" items={details.developers} />
                <ListSection title="Publishers" items={details.publishers} />
                <ListSection title="Categories" items={details.genres} />
                <ListSection title="Tags" items={details.tags} limit={8} />
    
                <div><span className='font-semibold text-[#F2FAFE]'>Release Date: </span>{details.release_date}</div>
                
            </div>

  )
}


