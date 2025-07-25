import { APP_ID, FROM_APP_ID, TOKEN_CODE } from '../config';

// 来源 appid 初始化
export const fromAppIdInit = () => {
  // 优先从 URL 上获取 appid，如果 appid 不等于 APP_ID，则设置 appid
  const fromAppId = new URLSearchParams(window.location.search).get(FROM_APP_ID);
  if (fromAppId && fromAppId !== APP_ID) {
    sessionStorage.setItem(FROM_APP_ID, fromAppId);
  }
};
/**
 * 获取 fromAppId
 */
export function getFromAppId() {
  return String(sessionStorage.getItem(FROM_APP_ID) || APP_ID);
}

/**
 * 获取 token
 */
export function getToken() {
  return String(
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(TOKEN_CODE))
      ?.split('=')[1],
  );
}

/**
 * 设置通用 headers
 */
export function setCommonHeaders(headers: Record<string, unknown>) {
  headers['xbb-app-id'] = getFromAppId();
  headers['Authorization'] = getToken();
}
