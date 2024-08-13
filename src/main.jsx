import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginSignup from './Components/Account/LoginSignup.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import DashboardTeams from './Components/Dashboard/DashboardTeams.jsx';
import Deck from './Components/Dashboard/Deck.jsx';
import DropZone from './Components/Dashboard/DropZone.jsx';
import CommentsTest from './Components/CommentsTest/CommentsTest.jsx';
import Onboard from './Components/Onboard/Onboard.jsx';

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
    path: "/",
    element: <LoginSignup/>
  }, 
  {
    path: "/onboard",
    element: <Onboard/>
  },
  {
    path: "/dashboard/decks",
    element: <Dashboard/>
  },
  {
    path: "/dashboard/",
    element: <DashboardTeams/>
  },
  {
    path: "/dashboard/deck/:id",
    element: <Deck/>
  },
  {
    path: "/dashboard/deck/dropzone",
    element: <DropZone/>
  },
  {
    path: "/comments",
    element: <CommentsTest/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>,
)