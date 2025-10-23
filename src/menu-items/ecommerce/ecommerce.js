// assets
import { IconDashboard, IconLayoutDashboard } from '@tabler/icons-react';

// constant
const icons = { IconLayoutDashboard, IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const ecommerce = {
  id: 'ecommerce',
  title: 'Ecommerce',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Ecommerce',
      type: 'item',
      url: '/ecommerce',
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false
    }
  ]
};

export default ecommerce;
