import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Login from 'views/pages/authentication3/Login3';
import Register from 'views/pages/authentication3/Register3';
import ForgotPassword from 'views/pages/authentication3/ForgotPassword';
import VerifyOtp from 'views/pages/authentication3/VerifyOtp';
import ResetPassword from 'views/pages/authentication3/ResetPassword';
import ProtectedRoute from './ProtectedRoute';

// dashboard routing
const BackgroundVerficationDefault = Loadable(lazy(() => import('views/BackgroundVerfication')));

// utilities routing
const UtilsBanner = Loadable(lazy(() => import('views/utilitiess/dashboard/Banner')));
const UtilsPromo = Loadable(lazy(() => import('views/utilitiess/dashboard/Promo')));
const UtilsNews = Loadable(lazy(() => import('views/utilitiess/dashboard/News')));
const UtilsSuccessStory = Loadable(lazy(() => import('views/utilitiess/dashboard/SuccessStory')));


const UtilsSettings = Loadable(lazy(() => import('views/utilitiess/mcqUtilities/Settings')));
const UtilsPayments = Loadable(lazy(() => import('views/utilitiess/mcqUtilities/Payments')));


const BackgroundVerficationRoutes = {
  path: '/',

  children: [
    { path: '/', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/verify-otp', element: <VerifyOtp /> },
    { path: '/reset-password', element: <ResetPassword /> },
    {
      path: '/',
      element: <ProtectedRoute element={<MainLayout />} />,
      children: [
        {
          path: 'verfication',
          children: [
            { path: '', element: <BackgroundVerficationDefault /> },
            { path: 'banner', element: <UtilsBanner /> },
            { path: 'news', element: <UtilsNews /> },
            { path: 'promo', element: <UtilsPromo /> },
            { path: 'success-story', element: <UtilsSuccessStory /> },
            
            { path: 'payments', element: <UtilsPayments /> },
            
            { path: 'settings', element: <UtilsSettings /> },
          
          ]
        }
      ]
    }
  ]
};

export default BackgroundVerficationRoutes;
