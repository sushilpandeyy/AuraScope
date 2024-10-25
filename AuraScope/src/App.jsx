import React from 'react';
import { Outlet } from 'react-router-dom';
const App = () => {
  return (
  <>
  
      <Outlet /> {/* Outlet for rendering nested routes */}
      </>
  );
};

export default App;
