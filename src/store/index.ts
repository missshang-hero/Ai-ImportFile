import { create } from 'zustand';
import { getUserInfo, getBtnFunctions } from '../services/portal';
import type { IUserInfo } from '../services/portal/types';

interface UserState {
  user: IUserInfo | null;
  permissionCodes: string[];
  setUser: (user: IUserInfo) => void;
  setPermissionCodes: (codes: string[]) => void;
  clearUser: () => void;
  fetchUserInfo: () => Promise<void>;
  fetchPermissionCodes: () => Promise<void>;
}

const DEFAULT_USER: IUserInfo = {
  user_id: '',
  user_name: '',
  picture_url: '',
  permissions: null,
  env: '',
  phone: '',
  tenant_id: 0,
  account_type: 0,
  product_id: 0,
  account_name: '',
  app_id: 0,
  app_names: [],
  handle_id: 0,
  ip: '',
  nonce: 0,
  open_id: '',
  org_list: [],
  token_md5: '',
  token_version: null,
  user_xh_id: '',
};

export const useUserStore = create<UserState>((set) => ({
  user: DEFAULT_USER,
  permissionCodes: [],
  setUser: (user) => set({ user }),
  setPermissionCodes: (codes) => set({ permissionCodes: codes }),
  clearUser: () => set({ user: DEFAULT_USER, permissionCodes: [] }),
  fetchUserInfo: async () => {
    const res = await getUserInfo();
    set({ user: res.data });
  },
  fetchPermissionCodes: async () => {
    const res = await getBtnFunctions();
    set({ permissionCodes: res });
  },
}));
