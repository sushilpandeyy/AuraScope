import React, { useState, useEffect } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testName, setTestName] = useState('');
  const [resumeText, setResumeText] = useState(''); // Holds resume text directly as input
  const [tests, setTests] = useState([]); // Holds existing test data

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to handle navigation to test details
  const handleTestCardClick = (testId) => {
    navigate(`/test/${testId}`);
  };

  // Handle form submission to create a new test session
  const handleCreateTest = async (e) => {
    e.preventDefault();

    if (testName && resumeText) {
      const userId = sessionStorage.getItem('user');
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
          const uniqueId = uuidv4();
          const newTest = { id: uniqueId, name: testName, resume: resumeText };

          setTests([...tests, newTest]);
          closeModal();
          navigate(`/test/${uniqueId}`, { state: { testName, resume: resumeText } });
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

  useEffect(() => {
    // Simulate fetching test data from an API
    const fetchTests = async () => {
      const existingTests = [
        { id: 'test-1', name: 'Math Test 101', score: 85 },
        { id: 'test-2', name: 'Science Test 202', score: 92 },
      ];
      setTests(existingTests);
    };

    fetchTests();
  }, []);

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
