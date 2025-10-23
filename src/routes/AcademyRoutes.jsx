import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Login from 'views/pages/authentication3/Login3';
import Register from 'views/pages/authentication3/Register3';
import ProtectedRoute from './ProtectedRoute';

// utilities routing
const UtilsPayments = Loadable(lazy(() => import('views/utilitiess/academyUtilities/Payments')));
const UtilsViewPapers = Loadable(lazy(() => import('views/utilitiess/academyUtilities/ViewSavedPaper')));
const UtilsUsers = Loadable(lazy(() => import('views/utilitiess/academyUtilities/Users')));
const UtilsSettings = Loadable(lazy(() => import('views/utilitiess/academyUtilities/Settings')));
const UtilsCategory = Loadable(lazy(() => import('views/utilitiess/academyUtilities/masters/Category')));
const UtilsCourses = Loadable(lazy(() => import('views/utilitiess/academyUtilities/courses/AcademyCourses')));
const UtilsModules = Loadable(lazy(() => import('views/utilitiess/academyUtilities/courses/AcademyModule')));
const UtilsTopics = Loadable(lazy(() => import('views/utilitiess/academyUtilities/courses/AcademyTopic')));
const Academy = Loadable(lazy(() => import('views/academy')));

const AcademyRoutes = {
  path: '/',
  children: [
    { path: '/', element: <Login /> },
    { path: '/register', element: <Register /> },
    {
      path: '/',
      element: <ProtectedRoute element={<MainLayout />} />,
      children: [
        {
          path: 'academy',
          children: [
            { path: '', element: <Academy /> },
            { path: 'payments', element: <UtilsPayments /> },
            { path: 'view-papers', element: <UtilsViewPapers /> },
            { path: 'users', element: <UtilsUsers /> },
            { path: 'settings', element: <UtilsSettings /> },
            { path: 'category', element: <UtilsCategory /> },
            { path: 'courses', element: <UtilsCourses /> },
            { path: 'modules', element: <UtilsModules /> },
            { path: 'topics', element: <UtilsTopics /> }
          ]
        }
      ]
    }
  ]
};

export default AcademyRoutes;
