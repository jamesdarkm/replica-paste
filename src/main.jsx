import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginSignup from './Components/Account/LoginSignup.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import Deck from './Components/Dashboard/Deck.jsx';
import DropZone from './Components/Dashboard/DropZone.jsx';
import Onboard from './Components/Onboard/Onboard.jsx';
import Log from './Components/Account/LoginForm.jsx';
import Sig from './Components/Account/SignupForm.jsx';

import { AuthProvider } from "./Context/authContext";

import Tests from './Tests/Tests.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/test",
    element: <Tests/>
  },
  {
    path: "/log",
    element: <Log/>
  },
  {
    path: "/sig",
    element: <Sig/>
  },
  {
    path: "/",
    element: <LoginSignup/>
  }, 
  {
    path: "/onboard",
    element: <Onboard/>
  },
  {
    path: "/dashboard",
    element: <Dashboard/>
  },
  {
    path: "/dashboard/deck/:id",
    element: <Deck/>
  },
  {
    path: "/dashboard/deck/dropzone",
    element: <DropZone/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>,
)