import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

const CircularChart = () => {

  const {details} = useContext(UserContext)

  const percentage = details.pos_reviews_count / details.reviewCount * 100

  var labels = ''
  var color = ''
  if(percentage>80){
    labels = 'Extremely Positive'
    color = '#1ee014'
  }else if(percentage>60){
    labels = 'Slightly Positive'
    color = '#1ee014'
  }else if(percentage>30){
    labels = 'Slightly Negative'
    color = '#d11d1d'
  }else{
    labels = 'Extremely Negative'
    color = '#d11d1d'
  }

  var data = {
    series: [percentage.toFixed(1)],
    options: {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '60%',
          },
          dataLabels: {
          name: {
            color: color, // Label text color (e.g., light blue)
            fontSize: '16px',
            fontWeight: 'bold',
          },
          value: {
            color: color, // Percentage value color (e.g., white)
            fontSize: '24px',
            fontWeight: 'bold',
          }
        }
      },
        },
      labels: [labels],
    },
  }

  return (
  <div className='col-span-2 text-center bg-[#181D3B] rounded-2xl text-[#F2FAFE] p-8 shadow-lg'>
                    <ReactApexChart 
            options={data.options} 
            series={data.series} 
            type="radialBar" 
            height={350} 
          />
      </div>




  );
};

export default CircularChart;