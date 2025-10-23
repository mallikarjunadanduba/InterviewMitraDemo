// assets
import { IconDashboard, IconLayoutDashboard } from '@tabler/icons-react';

// constant
const icons = { IconLayoutDashboard, IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const academy = {
  id: 'academy',
  title: 'Academy',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Academy',
      type: 'item',
      url: '/academy',
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false
    }
  ]
};

export default academy;
