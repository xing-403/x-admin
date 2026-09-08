import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'antdv-next';
import { encrypt, encryptBase64, encryptWithAes, generateAesKey } from './encrypt';
import { useUserStore } from '#/store/modules/user';

const baseURL = import.meta.env.VITE_APP_BASE_API || '';
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];
const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    clientid: import.meta.env.VITE_APP_CLIENT_ID,
  },
});
request.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers['Authorization'] = `Bearer ${userStore.token}`;
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
  async (response: AxiosResponse) => {
    const userStore = useUserStore();
    const originalConfig = response.config as InternalAxiosRequestConfig;
    const res = response.data;
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code === 200) {
        return res.data;
      } else if (res.code === 401) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            pendingRequests.push((newAccessToken: string) => {
              originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
              resolve(axios(originalConfig));
            });
          });
        }

        isRefreshing = true;
        try {
          await userStore.refreshToken();
          const newToken = userStore.token;
          pendingRequests.forEach((cb) => cb(newToken));
          pendingRequests = [];
          originalConfig.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalConfig);
        } catch (err) {
          // refreshToken 本身失效/出错 → 清空用户信息，跳转登录
          userStore.logout();
          message.error('登录已过期，请重新登录');
          // 清空队列
          pendingRequests.forEach((cb) => cb(''));
          pendingRequests = [];
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
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
