import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes({ connection, setHasNotification }) {
  return useRoutes([MainRoutes({ connection, setHasNotification }), LoginRoutes]);
}
