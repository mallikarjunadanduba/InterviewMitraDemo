// assets
import { IconDashboard, IconLayoutDashboard } from '@tabler/icons-react';

// constant
const icons = { IconLayoutDashboard, IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const upSKills = {
  id: 'upSkills',
  title: 'Upskills',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Upskills',
      type: 'item',
      url: '/upSkills',
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false
    }
  ]
};

export default upSKills;
