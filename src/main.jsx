import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginForm from './Components/LoginForm/LoginForm.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import Deck from './Components/Dashboard/Deck.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginForm/>
  },
  {
    path: "/dashboard",
    element: <Dashboard/>
  },
  ,
  {
    path: "/dashboard/deck",
    element: <Deck/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)