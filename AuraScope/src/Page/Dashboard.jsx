import React, { useState, useEffect } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import axios from 'axios'

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testName, setTestName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [tests, setTests] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Retrieve user ID from session storage
  const user = sessionStorage.getItem('user');
  const userId = user ? parseInt(JSON.parse(user).id, 10) : null;

  // Function to handle navigation to test details
  const handleTestCardClick = (testId) => {
    navigate(`/test/${testId}`);
  };

  // Fetch tests data specific to the user
  useEffect(() => {
    const fetchTests = async () => {
      if (userId) {
        try {
          const response = await axios.post('http://localhost:3000/test', {
            userId,
          });
          setTests(response.data); // Assuming response.data is an array of tests for the user
        } catch (error) {
          console.error('Error fetching test data:', error);
        }
      }
    };

    fetchTests();
  }, [userId]);

  // Handle form submission to create a new test session
  const handleCreateTest = async (e) => {
    e.preventDefault();

    if (testName && resumeText) {
      if (!userId) {
        alert('User ID not found in session');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/createtest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            resumeData: resumeText,
            title: testName,
          }),
        });

        if (response.ok) {
          const newTest = await response.json(); // Assuming response returns the new test object
          setTests([...tests, newTest]);
          closeModal();
          navigate(`/test/${newTest.id}`, { state: { testName, resume: resumeText } });
        } else {
          alert('Failed to create test');
        }
      } catch (error) {
        alert('Error submitting test data');
      }
    } else {
      alert('Please enter a test name and resume details');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen p-8 w-full">
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
        {tests.map((test) => (
          <Card
            key={test.id}
            icon={FaUserFriends}
            title={test.name}
            description={`Score: ${test.score ?? 'Pending'}`}
            onClick={() => handleTestCardClick(test.id)}
          />
        ))}
      </div>

      {/* Modal for Test Name and Resume Text Input */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Prepare for Test</h3>
            <form onSubmit={handleCreateTest}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Test Name</label>
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
                <label className="block text-gray-700 text-sm font-semibold mb-2">Resume Text</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white focus:outline-none focus:border-indigo-500"
                  placeholder="Enter resume details here"
                  rows="5"
                  required
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-4 px-4 py-2 text-gray-700 hover:text-gray-900"
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
