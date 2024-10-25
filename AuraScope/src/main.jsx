import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './Page/Login';
import NotFound from './Page/NotFound';
import Homepage from './Page/Homepage';
import Dashboard from './Page/Dashboard';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>  
        <Route path="" element={<Homepage />} />  
        <Route path="/login" element={<Login/>} /> 
        <Route path="dashboard" element={<Dashboard/>} /> 
      </Route>
      <Route path="*" element={<NotFound />} />  
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
