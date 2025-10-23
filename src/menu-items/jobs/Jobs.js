// assets
import { IconDashboard, IconLayoutDashboard } from '@tabler/icons-react';

// constant
const icons = { IconLayoutDashboard, IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const jobs = {
  id: 'jobs',
  title: 'Interviews',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/jobs',
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false
    }
  ]
};

export default jobs;
