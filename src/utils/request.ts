import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'antdv-next';
import { encrypt, encryptBase64, encryptWithAes, generateAesKey } from './encrypt';

const baseURL = import.meta.env.VITE_APP_BASE_API || '';

const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    clientid: import.meta.env.VITE_APP_CLIENT_ID,
  },
});

// 通过模块级变量持有 token，避免与 user store 形成循环依赖
let authToken = '';

/** 设置/清除全局 Authorization 头（由 user store 调用） */
export function setAuthToken(token: string) {
  authToken = token;
  if (token) {
    request.defaults.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete request.defaults.headers['Authorization'];
  }
}

request.interceptors.request.use((config) => {
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }
  // FormData 上传：清除显式 Content-Type，让 axios 自动设置为 multipart/form-data（含 boundary）
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = undefined as unknown as string;
  }
  // 是否需要加密
  const isEncrypt = config.headers?.isEncrypt === 'true';
  if (isEncrypt && (config.method === 'post' || config.method === 'put')) {
    // 生成一个 AES 密钥
    const aesKey = generateAesKey();
    config.headers['encrypt-key'] = encrypt(encryptBase64(aesKey));
    config.data =
      typeof config.data === 'object'
        ? encryptWithAes(JSON.stringify(config.data), aesKey)
        : encryptWithAes(config.data, aesKey);
  }
  return config;
});

request.interceptors.response.use(
  (response: AxiosResponse) => {
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
    const router = useRouter();
    const route = useRoute();
    const status = error.response?.status;
    const res = error.response?.data;
    const msg = res?.msg || error.message || '网络异常';
    // 401 未认证：交由调用方/路由守卫处理登出
    if (status === 401) {
      router.replace({
        name: 'Login',
        query: {
          redirect: route.fullPath,
        },
      });
    }
    message.error(status === 401 ? '登录已过期，请重新登录' : msg);
    return Promise.reject(error);
  },
);

export default request;
