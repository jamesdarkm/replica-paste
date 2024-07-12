import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginSignup from './Components/Account/LoginSignup.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import Deck from './Components/Dashboard/Deck.jsx';
import DropZone from './Components/Dashboard/DropZone.jsx';

import Login from './Components/Account/LoginForm.jsx';
import SignUp from './Components/Account/SignupForm.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  }, 
  {
    path: "/create-account",
    element: <SignUp/>
  }, 
  {
    path: "/dashboard",
    element: <Dashboard/>
  },
  {
    path: "/dashboard/deck",
    element: <Deck/>
  },
  {
    path: "/dashboard/deck/dropzone",
    element: <DropZone/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)