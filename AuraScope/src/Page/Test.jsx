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
 <>

<UpperBodyPostureAnalyzer/>
 
 </>
  )
}

export default Test;
