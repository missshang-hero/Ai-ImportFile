import { useRoutes } from 'react-router-dom';
import { chatRoutes } from './modules/chat'; // 聊天模块路由
import Home from '../pages/Home';

const routes = [
  ...chatRoutes,
  {
    path: '/',
    element: <Home />,
  },
];

function RouterElement() {
  return useRoutes(routes);
}

export default RouterElement;
