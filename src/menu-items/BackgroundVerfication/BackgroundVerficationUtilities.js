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
  IconAd2
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
  IconAd2
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const BackgroundVerficationUtilities = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    

    
    {
      id: 'payments',
      title: 'Payments',
      type: 'item',
      url: '/verfication/payments',
      icon: icons.IconCurrencyRupee,
      breadcrumbs: false
    },
   
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/verfication/settings',
      icon: icons.IconSettings,
      breadcrumbs: false
    },
   
  ]
};

export default BackgroundVerficationUtilities;
