import { JSEncrypt } from 'jsencrypt'
import { sha256 as Sha256 } from 'js-sha256'

/**
 * sha256 加密
 * @param {String} text - 明文
 * @return {String} 密文
 */
export function sha256(text) {
  return Sha256(text)
}

/**
 * rsa 加密
 * @param {String} text - 明文
 * @return {String} 密文
 */
export function rsaEncrypt(text) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(process.env.VUE_APP_RSA_PUBLIC_KEY)
  const rsa = encryptor.encrypt(text)
  return rsa
}
