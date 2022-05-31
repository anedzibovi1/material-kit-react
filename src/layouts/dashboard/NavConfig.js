// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'orders',
    path: '/dashboard/orders',
    icon: getIcon('ant-design:shopping-cart-outlined'),
  },
  {
    title: 'wishlist',
    path: '/dashboard/wishlist',
    icon: getIcon('bi:box2-heart'),
  },
];

export default navConfig;
