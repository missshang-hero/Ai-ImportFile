import { APP_ID } from '../../config';
import http from '../../utils/http';
import type { IUserInfo } from './types';

// 获取用户信息
export const getUserInfo = (): Promise<{ data: IUserInfo }> => http.get(`https://xxx.com/portal/accounts`);

// btn 功能点权限列表
export const getBtnFunctions = (app_id: string | number = APP_ID): Promise<string[]> =>
  http.get(`https://xxx.com/portal/common/${app_id}/functions`);
