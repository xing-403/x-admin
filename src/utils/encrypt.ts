/**
 * 请求/响应加解密工具
 *
 * 对应 RuoYi-Vue-Plus 后端的 @ApiEncrypt 双层方案：
 *  - 请求：随机 AES 密钥 → 用后端公钥 RSA 加密该密钥(base64) 放入 `encrypt-key` 头；
 *          请求体使用 AES(ECB/PKCS7) 加密后发送。
 *  - 响应：后端用公钥 RSA 加密响应 AES 密钥(base64) 放入 `encrypt-key` 头，
 *          响应体为 AES(ECB/PKCS7) 密文；前端用后端私钥解密头、再用密钥解密体。
 *
 * 说明：RuoYi-Vue-Plus 前后端均内置这对密钥用于演示加解密（非生产级安全方案）。
 */

import CryptoJS from 'crypto-js';
import forge from 'node-forge';

// 后端 application.yml 中 api-decrypt.publicKey（X.509，用于加密请求头）
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDm6u8q8X78onmbU4wGMq3b4ufbWE18YzuWo5jwkUlwWPTPcENbZYtveyTepp2Od1CTDcjhTUmVYvFkhaCF46UfOxZrwoSZc3jf3WXXd0hLOPBHuulynknj2KsWvKDuRig7J2o4KbDhyl0nnlUiMrIiD0tv1rBKpNCJ/T+MN0bERQIDAQAB
-----END PUBLIC KEY-----`;

// 后端 application.yml 中 api-decrypt.privateKey（PKCS#8，用于解密响应头）
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAO8QO5Eg4zehk9aP1SShzmlCSVHg8Ufr9yWeN4WqMMsiAPJC+PGGCoBlAD4T14Pqq7oWxc+Yrx2Nwv6eHdwUfPilfjveMO87dK977zIvdVFDSfalGBDZrTUwmzL5bBNkIFhZ/RWctEi8A1ShZCDL2/P3irtVrjh2DsDX/cgJ/7EDAgMBAAECgYEAhNZAQyRDHWZq/45soS5Hw7VRiG21pIE5k22W7G7lLfp3DCaqrYoNy8pTmCruVh7PzVdaE0CEDaf38gNqFCBOT8iTFQiYV3am4W3hsEQM5wmVBeTvCM5P2jsaaBQbqmneRjiZVbs6ha205JSho1Oc85NbaZa8gFVjwZgZWJrbzgECQQD/iZWhkRPtbdeai/Xk7D/eIXKh1Gxid0rWKQq8ikxbaiergn47XzNKrpROVyka3Gn85o7jJphgxp99R3r8sH71AkEA738Dn7xs+I4Y+MLa2EcT78JG3f/VhlWS/ks3qGJ2dfqwS7ntnmf5Q+2Xw+9UcuiK/TxD8K/0inSCkIMeWBOFFwJBAIoTebq3faEJfTqQ7ekojsokIKC4+2epNdLKknaV8/RhQ9Y0yKikJD7yXkiGaDuPZeW1Xvf2XtfL+1niSd5IMBECQDCOOMbe5dzyuj9dCg+FQZZ/dey2XK0Slm22BD/ATrIWtD12IaXXAKNz/Sv9TsrJOLykxkV69wJHIt13p+RFeNsCQGn5XGRn4ZCRVCesJYXyx29MTqkl8sD/gzYcURTZYjHqX2EvtvAyC6gBm9H0EbxmHIi4Oq0tITzklCXj5SpvBEw=
-----END PRIVATE KEY-----`;

const RSA_SCHEME = 'RSAES-PKCS1-V1_5';

/** 生成 32 字节(64 hex 字符) 随机字符串作为 AES-256 密钥 */
function randomAesKey(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface EncryptedRequest {
  /** AES 加密后的请求体（base64 字符串） */
  body: string;
  /** 放入 `encrypt-key` 请求头的 RSA 密文（base64 字符串） */
  encryptKey: string;
}

/**
 * 加密请求：对请求体做 AES 加密，并对 AES 密钥做 RSA 加密放入头。
 * @param data 待发送的业务对象
 */
export function encryptRequest(data: object): EncryptedRequest {
  const aesKey = randomAesKey();

  const body = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(aesKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  const publicKey = forge.pki.publicKeyFromPem(PUBLIC_KEY);
  // 头 = RSA( base64(aesKey) )
  const aesKeyBase64 = forge.util.encode64(aesKey);
  const encryptedHeader = publicKey.encrypt(aesKeyBase64, RSA_SCHEME);
  const encryptKey = forge.util.encode64(encryptedHeader);

  return { body, encryptKey };
}

/**
 * 解密响应：从 `encrypt-key` 头解出 AES 密钥，再解密响应体为对象。
 * @param encryptedBody AES 密文（base64 字符串）
 * @param encryptKeyHeader 响应头 `encrypt-key` 的值（RSA 密文 base64）
 */
export function decryptResponse(encryptedBody: string, encryptKeyHeader: string): any {
  const privateKey = forge.pki.privateKeyFromPem(PRIVATE_KEY);
  const encryptedHeaderBytes = forge.util.decode64(encryptKeyHeader);
  const aesKeyBase64 = privateKey.decrypt(encryptedHeaderBytes, RSA_SCHEME);
  const aesKey = forge.util.decode64(aesKeyBase64);

  const bytes = CryptoJS.AES.decrypt(encryptedBody, CryptoJS.enc.Utf8.parse(aesKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  const json = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(json);
}
