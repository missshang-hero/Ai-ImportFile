import { useEffect } from 'react';
import { useUserStore } from '@/store';

/**
 * 初始化用户信息
 */
export default function useInitUser() {
  const fetchUserInfo = useUserStore((state) => state.fetchUserInfo);
  const fetchPermissionCodes = useUserStore((state) => state.fetchPermissionCodes);

  useEffect(() => {
    fetchUserInfo();
    fetchPermissionCodes();
  }, []);
}
