/**
 * 认证相关接口（对接 RuoYi-Vue-Plus 后端）
 */
import request from '#/utils/request';
import { encryptRequest } from '#/utils/encrypt';

/** 登录表单参数 */
export interface LoginParams {
  username: string;
  password: string;
  code?: string;
  uuid?: string;
}

/** 登录成功返回 */
export interface LoginVo {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  refreshExpireIn: number;
  clientId: string;
  openid: string;
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
  const { body, encryptKey } = encryptRequest({
    username: data.username,
    password: data.password,
    code: data.code ?? '',
    uuid: data.uuid ?? '',
    clientId: CLIENT_ID,
    grantType: 'password',
  });
  return request({
    url: '/auth/login',
    method: 'post',
    data: body,
    transformRequest: [(d: any) => d],
    headers: {
      'encrypt-key': encryptKey,
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
