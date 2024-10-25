import React from 'react';

const Card = ({ icon: IconComponent, title, description }) => {
  return (
    <div className="bg-white p-1 px-24 py-8 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105 border border-white">
      {IconComponent && <IconComponent className="text-blue-400 text-4xl mb-4" />}
      <h3 className="text-xl font-semibold text-blue-400 mb-2">{title}</h3>
      <p className="text-gray-800 text-center">{description}</p>


      <div>
        <button className='mt-6'> Analyze</button>
      </div>
    </div>
  );
};

export default Card;
