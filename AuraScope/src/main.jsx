import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';
import Login from '../Page/Login';


// Define router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>  
        <Route path="" element={<Homepage />} />  
        <Route path="login" element={<Login/>} /> 
      </Route>
      <Route path="*" element={<NotFound />} />  
    </>
  )
);

// Render the router provider
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);