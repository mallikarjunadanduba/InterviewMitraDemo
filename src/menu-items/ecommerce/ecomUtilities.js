// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill, IconSettings, IconUser, IconPaperBag } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconPaperBag
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const ecomUtilities = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/ecommerce/users',
      icon: icons.IconUser,
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/ecommerce/settings',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
  ]
};

export default ecomUtilities;
