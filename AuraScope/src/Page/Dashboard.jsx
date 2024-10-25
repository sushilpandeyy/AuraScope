import React, { useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testName, setTestName] = useState('');
  const [resume, setResume] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleNavigation = (e) => {
    e.preventDefault();
    if (testName && resume) {
      closeModal();
      navigate('/test');
    } else {
      alert("Please enter a test name and upload your resume");
    }
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen p-8">
      {/* Header Section */}
      <div className="text-center mb-12 flex items-center justify-between">
        <h2 className="text-4xl font-extrabold text-gray-900">Recent Tests</h2>
        <button
          onClick={openModal}
          className="ml-auto mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition duration-200"
        >
          Take Test
        </button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card
          icon={FaUserFriends}
          title="Collaborative Learning"
          description="Students can contribute their own notes, creating a growing repository of shared knowledge."
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

      {/* Modal for Test Name and Resume Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Prepare for Test</h3>
            <form onSubmit={handleNavigation}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Test Name
                </label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white focus:outline-none focus:border-indigo-500"
                  placeholder="Enter the test name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Upload Resume
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none"
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className=" mr-4 px-4 py-2 text-white hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
                >
                  Submit and Go to Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
