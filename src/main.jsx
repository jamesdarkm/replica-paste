import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginSignup from './Components/Account/LoginSignup.jsx';
import ForgotPassword from './Components/Account/ForgotPassword.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import DashboardTeams from './Components/Dashboard/DashboardTeams.jsx';
import Deck from './Components/Dashboard/Deck.jsx';
import DropZone from './Components/Dashboard/DropZone.jsx';
import Card from './Components/Dashboard/Card.jsx';
import CommentsTest from './Components/CommentsTest/CommentsTest.jsx';
import Onboard from './Components/Onboard/Onboard.jsx';
import Invite from './Components/Invite/Invite.jsx';
import Notify from './Components/Payments/Notify.jsx';
import Return from './Components/Payments/Return.jsx';
import Cancel from './Components/Payments/Cancel.jsx';
import Checkout from './Components/Payments/Checkout.jsx';
import BillingOverview from './Components/Payments/Billing Overview.jsx';

import { AuthProvider } from './Context/authContext';

import Tests from './Tests/Tests.jsx';
import RequestPasswordReset from './Tests/RequestPasswordReset.jsx';
import ResetPassword from './Tests/ResetPassword.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/reset',
        element: <ResetPassword />,
    },
    {
        path: '/reseter',
        element: <RequestPasswordReset />,
    },
    {
        path: '/test',
        element: <Tests />,
    },
    {
        path: '/',
        element: <LoginSignup />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: '/onboard',
        element: <Onboard />,
    },
    {
        path: '/dashboard/:teamId',
        element: <Dashboard />,
    },
    {
        path: '/dashboard/',
        element: <DashboardTeams />,
    },
    {
        path: '/dashboard/deck/:id',
        element: <Deck />,
    },
    {
        path: '/dashboard/deck/dropzone',
        element: <DropZone />,
    },
    {
        path: '/dashboard/deck/card/:id',
        element: <Card />,
    },
    {
        path: '/comments',
        element: <CommentsTest />,
    },
    {
        path: '/return',
        element: <Return />,
    },
    {
        path: '/notify',
        element: <Notify />,
    },
    {
        path: '/cancel',
        element: <Cancel />,
    },
    {
        path: '/checkout',
        element: <Checkout />,
    },
    {
        path: '/billing-overview',
        element: <BillingOverview />,
    },
    {
        path: '/invite',
        element: <Invite />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
);
