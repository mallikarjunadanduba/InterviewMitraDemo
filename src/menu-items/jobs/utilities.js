// assets
import {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconSettings,
  IconUser,
  IconCurrencyRupee,
  IconCertificate,
  IconAd2,
  IconBook2,
  IconTargetArrow,
  IconBriefcase,
  IconBrain,
  IconFileText
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
  IconBook2,
  IconTargetArrow,
  IconBriefcase,
  IconBrain,
  IconFileText
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    // {
    //   id: 'profile',
    //   title: 'Digital Profile',
    //   type: 'item',
    //   url: '/jobs/profile',
    //   icon: icons.IconUser,
    //   breadcrumbs: false
    // },
    {
      id: 'interviewPreparation',
      title: 'Interview Preparation',
      type: 'item',
      url: '/jobs/interview-preparation',
      icon: icons.IconBook2,
      breadcrumbs: false
    },
    // {
    //   id: 'tests',
    //   title: 'Test Assessment',
    //   type: 'item',
    //   url: '/jobs/tests',
    //   icon: icons.IconTargetArrow,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'mockupinterview',
    //   title: 'Mockup Interview',
    //   type: 'item',
    //   url: '/jobs/mockup-interview',
    //   icon: icons.IconAd2,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'placement',
    //   title: 'Placement',
    //   type: 'item',
    //   url: '/jobs/placement',
    //   icon: icons.IconBriefcase,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'ai_agent',
    //   title: 'AI Agent',
    //   type: 'item',
    //   url: '/jobs/ai-agent',
    //   icon: icons.IconBrain,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'pdfViewer',
    //   title: 'PDF Viewer',
    //   type: 'item',
    //   url: '/jobs/pdf-viewer', // This should match your route path
    //   icon: icons.IconFileText,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'payments',
    //   title: 'Payments',
    //   type: 'item',
    //   url: '/jobs/payments',
    //   icon: icons.IconCurrencyRupee,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'settings',
    //   title: 'Settings',
    //   type: 'item',
    //   url: '/jobs/settings',
    //   icon: icons.IconSettings,
    //   breadcrumbs: false
    // }

  ]
};


export default utilities;