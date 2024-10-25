import React from 'react'
import Example from './Illustrator'
import Study from '../assets/Animation - 1729892186721.json';

const Hero = () => {
  return (
    <>
      <div className="hidden md:block md:w-1/2 mt-8 md:mt-0">
        <Example animationData={Study} />
      </div>
    
    </>
  )
}

export default Hero