import React from 'react'

export default function InfoCard(props) {

  return (
    <div className='text-center bg-[#181D3B] rounded-2xl text-[#F2FAFE] p-8 shadow-lg'>
            <h1 className='text-2xl mb-2'>{props.label}</h1>
            <div className='text-center text-2xl'>{props.data}</div>
    </div>
  )
}
