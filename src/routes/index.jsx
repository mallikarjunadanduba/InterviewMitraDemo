import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import EcomRoutes from './EcomRoutes';
import AcademyRoutes from './AcademyRoutes';
import UpskillsRoutes from './UpSkillsRoutes';
import JobsRoutes from './JobsRoutes';
import BackgroundVerficationRoutes from './BackgroundVerficationRoutes';

// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([MainRoutes, AcademyRoutes, UpskillsRoutes, EcomRoutes,JobsRoutes,BackgroundVerficationRoutes], {
  // basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
