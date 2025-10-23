import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Login from 'views/pages/authentication3/Login3';
import Register from 'views/pages/authentication3/Register3';
import ProtectedRoute from './ProtectedRoute';

// utilities routing
const UtilsPayments = Loadable(lazy(() => import('views/utilitiess/upSkillsUtilities/Payments')));
const UtilsMyCourses = Loadable(lazy(() => import('views/utilitiess/upSkillsUtilities/MyCourse')));
const UtilsUsers = Loadable(lazy(() => import('views/utilitiess/upSkillsUtilities/Users')));
const UtilsSettings = Loadable(lazy(() => import('views/utilitiess/upSkillsUtilities/Settings')));
const UtilsCourseDetails = Loadable(lazy(() => import('views/utilitiess/upSkillsUtilities/CourseDetails')));
const UtilsSingleCourseDetails = Loadable(lazy(() => import('views/utilitiess/upSkillsUtilities/SingleCourseDetails')));
const UtilsMcqModule = Loadable(lazy(() => import('views/utilitiess/upSkillsUtilities/Mcq/McqModule')));
const UpSkills = Loadable(lazy(() => import('views/upSkills')));

const UpskillsRoutes = {
  path: '/',
  children: [
    { path: '/', element: <Login /> },
    { path: '/register', element: <Register /> },
    {
      path: '/',
      element: <ProtectedRoute element={<MainLayout />} />,
      children: [
        {
          path: 'upSkills',
          children: [
            { path: '', element: <UpSkills /> },
            { path: 'my-courses', element: <UtilsMyCourses /> },
            { path: 'payments', element: <UtilsPayments /> },
            // { path: 'users', element: <UtilsUsers /> },
            // { path: 'settings', element: <UtilsSettings /> },
            { path: 'courses', element: <UtilsCourseDetails /> },
            { path: 'courses/course-details', element: <UtilsSingleCourseDetails/>},
            { path: 'course-details/:courseId', element: <UtilsSingleCourseDetails/>},
            { path: 'mcqmodule', element: <UtilsMcqModule/> },

          ]
        }
      ]
    }
  ]
};

export default UpskillsRoutes;