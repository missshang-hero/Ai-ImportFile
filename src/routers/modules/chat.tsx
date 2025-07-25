import type { RouteObject } from '../types/index';
import Chat from '../../pages/chat';

export const chatRoutes: RouteObject[] = [
  {
    path: '/chat',
    element: <Chat />,
  },
];
