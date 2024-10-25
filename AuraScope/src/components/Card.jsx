import React from 'react';
import { FaUserFriends } from 'react-icons/fa'; // Example of importing an icon

const Card = () => {
  return (
    <div className="p-8 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105 border border-white">
      <FaUserFriends className="text-blue-400 text-4xl mb-4" />
      <h3 className="text-xl font-semibold text-blue-400 mb-2">Collaborative Learning</h3>
      <p className="text-gray-300 text-center">
        Students can contribute their own notes, creating a growing repository of resources that benefits the entire community.
      </p>
    </div>
  );
};

export default Card;
