import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Login from 'views/pages/authentication3/Login3';
import Register from 'views/pages/authentication3/Register3';
import ForgotPassword from 'views/pages/authentication3/ForgotPassword';
import VerifyOtp from 'views/pages/authentication3/VerifyOtp';
import ResetPassword from 'views/pages/authentication3/ResetPassword';
import ProtectedRoute from './ProtectedRoute';
import Homepage from 'views/utilitiess/LandingPageUtilities/Homepage';
import ViewmorePromos from 'views/utilitiess/LandingPageUtilities/ViewmorePromos';
import ViewmoreSuccess from 'views/utilitiess/LandingPageUtilities/ViewmoreSuccess';

// Interview routes
const UtilsInterviewInterface = Loadable(lazy(() => import('views/utilitiess/Jobs/InterviewSession')));
const UtilsFinalReport = Loadable(lazy(() => import('views/utilitiess/Jobs/InterviewComponents/FinalReport ')));

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// utilities routing
const UtilsBanner = Loadable(lazy(() => import('views/utilitiess/dashboard/Banner')));
const UtilsPromo = Loadable(lazy(() => import('views/utilitiess/dashboard/Promo')));
const UtilsNews = Loadable(lazy(() => import('views/utilitiess/dashboard/News')));
const UtilsSuccessStory = Loadable(lazy(() => import('views/utilitiess/dashboard/SuccessStory')));

const UtilsUsers = Loadable(lazy(() => import('views/utilitiess/mcqUtilities/Users')));
const UtilsSettings = Loadable(lazy(() => import('views/utilitiess/mcqUtilities/Settings')));
const UtilsPayments = Loadable(lazy(() => import('views/utilitiess/mcqUtilities/Payments')));
const UtilsCertificate = Loadable(lazy(() => import('views/utilitiess/mcqUtilities/certificate/CertificateGenerator')));
const UtilsService = Loadable(lazy(() => import('views/utilitiess/mcqUtilities/Service')));

const MainRoutes = {
  path: '/',

  children: [
    { path: '/', element: <Homepage /> },
    { path: '/viewmorepromo', element: <ViewmorePromos /> },
    { path: '/viewmoresuccess', element: <ViewmoreSuccess/> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/verify-otp', element: <VerifyOtp /> },
    { path: '/reset-password', element: <ResetPassword /> },
    { path: '/interview/:sessionId', element: <UtilsInterviewInterface /> },
    { path: '/interview-session/:sessionId', element: <UtilsInterviewInterface /> },
    { path: '/interview-report/:sessionId', element: <UtilsFinalReport /> },
    { path: '/finalreport/:sessionId', element: <UtilsFinalReport /> },
    {
      path: '/',
      element: <ProtectedRoute element={<MainLayout />} />,
      children: [
        {
          path: 'dashboard',
          children: [
            { path: '', element: <DashboardDefault /> },
            { path: 'banner', element: <UtilsBanner /> },
            { path: 'news', element: <UtilsNews /> },
            { path: 'promo', element: <UtilsPromo /> },
            { path: 'success-story', element: <UtilsSuccessStory /> },
            { path: 'certificate', element: <UtilsCertificate /> },
            { path: 'payments', element: <UtilsPayments /> },
            { path: 'users', element: <UtilsUsers /> },
            { path: 'settings', element: <UtilsSettings /> },
            { path: 'service', element: <UtilsService /> }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
