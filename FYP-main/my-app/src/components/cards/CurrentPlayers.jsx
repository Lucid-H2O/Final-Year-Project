import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function CurrentPlayers() {

  const {details} = useContext(UserContext)

  return (
    <div className='text-center bg-[#181D3B] rounded-2xl text-[#F2FAFE] shadow-lg p-8'>
            <h1 className='text-3xl mb-2'>Current Player Count</h1>
            <div className='text-center text-2xl'>{details.players}</div>
    </div>
  )
}

export default CurrentPlayers
