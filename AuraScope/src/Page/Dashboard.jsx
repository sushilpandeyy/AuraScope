import React from 'react';
import { FaUserFriends } from 'react-icons/fa'; // Example of importing an icon
import Card from '../components/Card';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Hardcoded Card */}
      <Card
        icon={FaUserFriends}
        title="Collaborative Learning"
        description="Students can contribute their own notes, creating a growing repository of resources that benefits the entire community."
      />

      <Card
        icon={FaUserFriends}
        title="Personalized Learning"
        description="Tailor your study experience to your own pace and style with personalized notes and resources."
      />

      <Card
        icon={FaUserFriends}
        title="Community Sharing"
        description="Share your knowledge and collaborate with peers to create a rich learning environment."
      />
    </div>
  );
};

export default Dashboard;
