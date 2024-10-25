import React from 'react';
import { FaUserFriends } from 'react-icons/fa'; // Example of importing an icon
import Card from '../components/Card';

// Ensure the correct path to the Card component

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">

      <Card/>
  
    </div>
  );
};

export default Dashboard;
