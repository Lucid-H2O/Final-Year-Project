import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

import WordCloud from "react-d3-cloud"
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);

function WordCloudBox() {

  const {details} = useContext(UserContext)
  var data = details.wordCloud.map(data => ({ text: data[0], value: data[1] }))
  
  
  const values = data.map(word => word.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const fontSize = (word) => {
    const minSize = 30;  // Minimum font size
    const maxSize = 60; // Maximum font size

    // Normalize word value to the range [0, 1]
    const normalizedValue = (word.value - minValue) / (maxValue - minValue);

    // Scale to the desired size range
    return minSize + normalizedValue * (maxSize - minSize);
  };

  return (
    <div className='bg-[#181D3B] rounded-2xl shadow-lg p-4'>
      <WordCloud
        data={data}
        width={600}  // More square-like dimensions
        height={500}
        font="Times"
        fontStyle="italic"
        fontWeight="bold"
        fontSize={fontSize}
        spiral="archimedean"  // Better for rectangular layouts
        rotate={0}  // Remove random rotation
        padding={2}  // Tighter padding
        random={() => 0.5}  // More deterministic layout
        fill={(d, i) => schemeCategory10ScaleOrdinal(i)}
        onWordClick={(event, d) => {
          console.log(`onWordClick: ${d.text}`);
        }}
        onWordMouseOver={(event, d) => {
          console.log(`onWordMouseOver: ${d.text}`);
        }}
        onWordMouseOut={(event, d) => {
          console.log(`onWordMouseOut: ${d.text}`);
        }}
      />
    </div>
  );
}


export default WordCloudBox