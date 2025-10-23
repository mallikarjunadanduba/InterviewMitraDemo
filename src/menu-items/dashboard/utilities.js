// assets
import {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconPaperBag,
  IconCurrencyRupee,
  IconCertificate,
  IconAd2,
  IconNews,
  IconGift,
  IconUsers,
  IconTools
} from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconCurrencyRupee,
  IconCertificate,
  IconAd2,
  IconNews,
  IconGift,
  IconUsers,
  IconTools
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    // {
    //   id: 'banner',
    //   title: 'Banner',
    //   type: 'item',
    //   url: '/dashboard/banner',
    //   icon: icons.IconAd2,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'news',
    //   title: 'News',
    //   type: 'item',
    //   url: '/dashboard/news',
    //   icon: icons.IconNews,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'promo',
    //   title: 'Promo',
    //   type: 'item',
    //   url: '/dashboard/promo',
    //   icon: icons.IconGift,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'success-story',
    //   title: 'Success Story',
    //   type: 'item',
    //   url: '/dashboard/success-story',
    //   icon: icons.IconCertificate,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'certificate',
    //   title: 'Certificate',
    //   type: 'item',
    //   url: '/dashboard/certificate',
    //   icon: icons.IconCertificate,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'users',
    //   title: 'Users',
    //   type: 'item',
    //   url: '/dashboard/users',
    //   icon: icons.IconUsers,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'service',
    //   title: 'Service',
    //   type: 'item',
    //   url: '/dashboard/service',
    //   icon: icons.IconTools,
    //   breadcrumbs: false
    // },
    {
      id: 'payments',
      title: 'Payments',
      type: 'item',
      url: '/dashboard/payments',
      icon: icons.IconCurrencyRupee,
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/dashboard/settings',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
  ]
};

export default utilities;
