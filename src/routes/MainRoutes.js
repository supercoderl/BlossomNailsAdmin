import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import NailCalendar from 'pages/application/booking-forms/Calendar';
import Gallery from 'pages/application/Gallery';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const Customer = Loadable(lazy(() => import('pages/application/Customer')));
const User = Loadable(lazy(() => import('pages/application/User')));
const Message = Loadable(lazy(() => import('pages/application/Message')));
const Profile = Loadable(lazy(() => import('pages/user/Profile')));
const Service = Loadable(lazy(() => import('pages/application/Service')));
const Category = Loadable(lazy(() => import('pages/application/Category')));
const Booking = Loadable(lazy(() => import('pages/application/Booking')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    },
    {
      path: 'application',
      children: [
        {
          path: 'customer',
          children: [
            {
              path: 'default',
              element: <Customer />
            }
          ]
        },
        {
          path: 'user',
          children: [
            {
              path: 'default',
              element: <User />
            }
          ]
        },
        {
          path: 'service',
          children: [
            {
              path: 'default',
              element: <Service />
            }
          ]
        },
        {
          path: 'category',
          children: [
            {
              path: 'default',
              element: <Category />
            }
          ]
        },
        {
          path: 'gallery',
          children: [
            {
              path: 'default',
              element: <Gallery />
            }
          ]
        },
        {
          path: 'booking',
          children: [
            {
              path: 'default',
              element: <Booking />
            },
            {
              path: 'calendar',
              element: <NailCalendar />
            }
          ]
        },
        {
          path: 'message',
          children: [
            {
              path: 'default',
              element: <Message />
            }
          ]
        },
        {
          path: 'profile',
          children: [
            {
              path: 'default',
              element: <Profile />
            }
          ]
        },
      ]
    },
  ]
};

export default MainRoutes;
