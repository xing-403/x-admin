/**
 * 个人信息相关接口（对接 RuoYi-Vue-Plus 后端 SysProfileController）
 */
import request from '#/utils/request';

/** 个人中心用户信息（profile 接口专用，字段未脱敏） */
export interface ProfileUser {
  userId: number;
  deptId: number;
  userName: string;
  nickName: string;
  userType: string;
  email: string;
  phoneNumber: string;
  /** 用户性别（0男 1女 2未知） */
  gender: string;
  /** 头像 OSS ID */
  avatar: number;
  /** 头像地址（后端翻译） */
  avatarUrl: string;
  loginIp: string;
  loginDate: string;
  deptName: string;
}

/** 个人信息返回 */
export interface ProfileVo {
  user: ProfileUser;
  roleGroup: string;
  postGroup: string;
}

/** 修改个人信息参数 */
export interface UpdateProfileParams {
  nickName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  avatar?: string;
}

/** 修改密码参数 */
export interface UpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
}

/** OSS 上传返回（对接 SysOssController.upload -> SysOssUploadVo） */
export interface OssUploadVo {
  /** 文件访问地址 */
  url: string;
  /** 原始文件名 */
  originalName: string;
  /** OSS 主键（字符串形式） */
  ossId: string;
}

/** 获取当前登录用户个人信息 */
export function getProfile(): Promise<ProfileVo> {
  return request.get('/system/user/profile') as unknown as Promise<ProfileVo>;
}

/**
 * 上传头像：multipart/form-data，无需加密。
 * 后端返回 ossId，供 updateProfile({ avatar }) 引用。
 */
export function uploadAvatar(file: File): Promise<OssUploadVo> {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/resource/oss/upload', formData) as unknown as Promise<OssUploadVo>;
}

/** 修改当前登录用户个人信息（明文接口） */
export function updateProfile(data: UpdateProfileParams): Promise<void> {
  return request.put('/system/user/profile', data) as unknown as Promise<void>;
}

/**
 * 修改密码：@ApiEncrypt 接口，请求体需 AES 加密。
 * 后端要求 JSON body { oldPassword, newPassword }。
 */
export function updatePassword(data: UpdatePasswordParams): Promise<void> {
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    data,
    transformRequest: [(d: unknown) => d],
    headers: {
      isEncrypt: 'true',
      'Content-Type': 'application/json',
    },
  }) as unknown as Promise<void>;
}
