/**
 * 全局请求封装（基于 axios）
 *  - 统一注入 Authorization（Bearer）头
 *  - 自动处理 @ApiEncrypt 响应解密（读取 `encrypt-key` 头）
 *  - 统一解析 RuoYi 的 R 信封：code=200 返回 data，否则抛出错误
 */
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { message } from 'antdv-next';

import { decryptResponse } from './encrypt';

const baseURL = import.meta.env.VITE_APP_BASE_API || '';

const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
});

// 通过模块级变量持有 token，避免与 user store 形成循环依赖
let authToken = '';

/** 设置/清除全局 Authorization 头（由 user store 调用） */
export function setAuthToken(token: string) {
  authToken = token;
  if (token) {
    request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete request.defaults.headers.common['Authorization'];
  }
}

request.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.set('Authorization', `Bearer ${authToken}`);
  }
  return config;
});

request.interceptors.response.use(
  (response: AxiosResponse) => {
    // @ApiEncrypt 响应：存在 encrypt-key 头则需解密
    const encryptKey = response.headers['encrypt-key'];
    if (encryptKey) {
      const raw = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      try {
        response.data = decryptResponse(raw, encryptKey);
      } catch {
        return Promise.reject(new Error('响应解密失败'));
      }
    }

    const res = response.data;
    // 标准 R 信封：{ code, msg, data }
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code === 200) {
        return res.data;
      }
      message.error(res.msg || '请求失败');
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    const status = error.response?.status;
    const res = error.response?.data;
    const msg = res?.msg || error.message || '网络异常';
    // 401 未认证：交由调用方/路由守卫处理登出
    message.error(status === 401 ? '登录已过期，请重新登录' : msg);
    return Promise.reject(error);
  },
);

export default request;
