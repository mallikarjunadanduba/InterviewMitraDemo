import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Login from 'views/pages/authentication3/Login3';
import Register from 'views/pages/authentication3/Register3';
import ProtectedRoute from './ProtectedRoute';

// utilities routing
const UtilsSetPapers = Loadable(lazy(() => import('views/utilitiess/ecomUtilities/SetPaper')));
const UtilsViewPapers = Loadable(lazy(() => import('views/utilitiess/ecomUtilities/ViewSavedPaper')));
const UtilsUsers = Loadable(lazy(() => import('views/utilitiess/ecomUtilities/Users')));
const UtilsSettings = Loadable(lazy(() => import('views/utilitiess/ecomUtilities/Settings')));

const Ecommerce = Loadable(lazy(() => import('views/ecommerce')));

const EcomRoutes = {
  path: '/',
  children: [
    { path: '/', element: <Login /> },
    { path: '/register', element: <Register /> },
    {
      path: '/',
      element: <ProtectedRoute element={<MainLayout />} />,
      children: [
        {
          path: 'ecommerce',
          children: [
            { path: '', element: <Ecommerce /> },
            { path: 'set-papers', element: <UtilsSetPapers /> },
            { path: 'view-papers', element: <UtilsViewPapers /> },
            { path: 'users', element: <UtilsUsers /> },
            { path: 'settings', element: <UtilsSettings /> }
          ]
        }
      ]
    }
  ]
};

export default EcomRoutes;
