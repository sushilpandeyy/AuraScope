import React from 'react';
import { useNavigate } from 'react-router-dom';

function Takemeto({ destination }) {
  const navigate = useNavigate(); // Get the navigate function from React Router

  const handleNavigation = () => {
    navigate(destination); // Use the destination prop for navigation
  };

  return (
    <div>
      <p>hekko</p>
      <button onClick={handleNavigation}>Go to Target Page</button>
    </div>
  );
}

export default Takemeto;
