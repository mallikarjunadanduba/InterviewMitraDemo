// assets
import {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconPaperBag,
  IconCurrencyRupee
} from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconPaperBag,
  IconCurrencyRupee
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const academyUtilities = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'masters',
      title: 'Masters',
      type: 'collapse',
      icon: icons.IconWindmill,
      url: null,
      children: [
        {
          id: 'category',
          title: 'Category',
          type: 'item',
          url: '/academy/category',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'academy',
      title: 'Academy',
      type: 'collapse',
      icon: icons.IconPaperBag,
      url: null,
      children: [
        {
          id: 'courses',
          title: 'Academy Courses',
          type: 'item',
          url: '/academy/courses',
          breadcrumbs: false
        },
        {
          id: 'modules',
          title: 'Academy Modules',
          type: 'item',
          url: '/academy/modules',
          breadcrumbs: false
        },
        {
          id: 'topics',
          title: 'Academy Topics',
          type: 'item',
          url: '/academy/topics',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments',
      type: 'item',
      url: '/academy/payments',
      icon: icons.IconCurrencyRupee,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/academy/users',
      icon: icons.IconUser,
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/academy/settings',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
  ]
};

export default academyUtilities;
