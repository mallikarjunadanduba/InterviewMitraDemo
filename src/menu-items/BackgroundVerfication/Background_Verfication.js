// assets
import { IconDashboard, IconLayoutDashboard } from '@tabler/icons-react';

// constant
const icons = { IconLayoutDashboard, IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const Background_Verfication = {
  id: 'BackgroundVerfication',
  title: 'backgroundverfication',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'backgroundverfication',
      type: 'item',
      url: '/verfication',
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false
    }
  ]
};

export default Background_Verfication;
