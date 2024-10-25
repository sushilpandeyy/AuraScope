import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Test = () => {
  const { id } = useParams();
  const [testDetails, setTestDetails] = useState(null);

  useEffect(() => {
    fetch(`/api/tests/${id}`)
      .then((res) => res.json())
      .then((data) => setTestDetails(data));
  }, [id]);

  return (
    <div>
      <h1>Test Details for Test ID: {id}</h1>
      {testDetails ? (
        <div>
          <p>Test Name: {testDetails.name}</p>
          <p>Score: {testDetails.score}</p>
          {/* Additional test details */}
        </div>
      ) : (
        <p>Loading test details...</p>
      )}
    </div>
  );
};

export default Test;
