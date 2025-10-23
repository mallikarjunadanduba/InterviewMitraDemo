// assets
import {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconPaperBag,
  IconCurrency,
  IconCurrencyRupee,
  IconBook,
  IconCreditCard
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
  IconCurrencyRupee,
  IconBook,
  IconCreditCard
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const upSkillsUtilities = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    // {
    //   id: 'masters',
    //   title: 'Masters',
    //   type: 'collapse',
    //   icon: icons.IconWindmill,
    //   url: null,
    //   children: [
    //     {
    //       id: 'category',
    //       title: 'Category',
    //       type: 'item',
    //       url: '/upSkills/category',
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    // {
    //   id: 'upskill',
    //   title: 'Upskills',
    //   type: 'collapse',
    //   icon: icons.IconPaperBag,
    //   url: null,
    //   children: [
    //     {
    //       id: 'courses',
    //       title: 'Upskills Courses',
    //       type: 'item',
    //       url: '/upSkills/courses',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'modules',
    //       title: 'Upskills Modules',
    //       type: 'item',
    //       url: '/upSkills/modules',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'topics',
    //       title: 'Upskills Topics',
    //       type: 'item',
    //       url: '/upSkills/topics',
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    {
      id: 'my-courses',
      title: 'My Courses',
      type: 'item',
      url: '/upSkills/my-courses',
      icon: icons.IconBook,
      breadcrumbs: false
    },
    {
      id: 'payments',
      title: 'Payments',
      type: 'item',
      url: '/upSkills/payments',
      icon: icons.IconCreditCard,
      breadcrumbs: false
    },
    // {
    //   id: 'users',
    //   title: 'Users',
    //   type: 'item',
    //   url: '/upSkills/users',
    //   icon: icons.IconUser,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'settings',
    //   title: 'Settings',
    //   type: 'item',
    //   url: '/upSkills/settings',
    //   icon: icons.IconSettings,
    //   breadcrumbs: false
    // }
  ]
};

export default upSkillsUtilities;
