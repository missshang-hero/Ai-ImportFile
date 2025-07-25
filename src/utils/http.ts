import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { setCommonHeaders } from './appInfo';

// 请求拦截器
function reqResolve(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  config.headers = config.headers || {};
  setCommonHeaders(config.headers);
  return config;
}
function reqReject(error: Error) {
  return Promise.reject(error);
}

// 响应拦截器
function repResolve(response: AxiosResponse) {
  const { code, msg } = response?.data || {};
  if (String(code) === '0' || String(code) === '2000') {
    return response.data;
  }
  message.error(msg || '系统错误');
  return Promise.reject(response.data);
}
function repReject(error: AxiosError) {
  const status = error.response?.status;
  if (status && status >= 500) {
    message.error('系统错误');
  } else if (status === 401) {
    // 可跳转登录
  } else {
    message.error(error.message || '系统错误');
  }
  return Promise.reject(error);
}

export function createAxios(options: AxiosRequestConfig = {}): AxiosInstance {
  const defaultOptions = {
    timeout: 120000,
  };
  const service: AxiosInstance = axios.create({
    ...defaultOptions,
    ...options,
  });
  service.interceptors.request.use(reqResolve, reqReject);
  service.interceptors.response.use(repResolve, repReject);
  return service;
}

export const defAxios = createAxios();

export default defAxios;
