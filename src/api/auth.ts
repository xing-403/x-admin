/**
 * 认证相关接口（对接 RuoYi-Vue-Plus 后端）
 */
import request from '#/utils/request';

/** 登录表单参数 */
export interface LoginParams {
  username: string;
  password: string;
  code?: string;
  uuid?: string;
}
/** 登录成功返回 */
export interface LoginVo {
  access_token: string;
  client_id: string;
  refresh_expire_in: string;
  expire_in: string;
  openid: string;
  refresh_token: string;
  scope: string;
}

/** 验证码返回 */
export interface CaptchaVo {
  captchaEnabled: boolean;
  uuid: string;
  img: string;
}

/** 用户信息返回 */
export interface UserInfoVo {
  user: Record<string, any>;
  permissions: string[];
  roles: string[];
}

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || 'e5cd7e4891bf95d1d19206ce24a7b32e';

/** 获取图片验证码（非加密接口） */
export function getCode(): Promise<CaptchaVo> {
  return request.get('/auth/code') as unknown as Promise<CaptchaVo>;
}

/**
 * 登录：请求体 AES 加密、请求头 RSA 加密，走 @ApiEncrypt 通道。
 */
export function login(data: LoginParams): Promise<LoginVo> {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      ...data,
      clientId: CLIENT_ID,
      grantType: 'password',
    },
    transformRequest: [(d: any) => d],
    headers: {
      isEncrypt: 'true',
      'Content-Type': 'application/json',
    },
  }) as unknown as Promise<LoginVo>;
}

/** 获取当前用户信息（需 token） */
export function getInfo(): Promise<UserInfoVo> {
  return request.get('/system/user/getInfo') as unknown as Promise<UserInfoVo>;
}

/** 退出登录 */
export function logout(): Promise<void> {
  return request.post('/auth/logout') as unknown as Promise<void>;
}

export function refreshToken(refreshToken: string): Promise<LoginVo> {
  return request({
    url: '/auth/refresh',
    method: 'post',
    data: { refreshToken, clientId: CLIENT_ID },
    headers: { isRefresh: 'true' },
  }) as unknown as Promise<LoginVo>;
}
