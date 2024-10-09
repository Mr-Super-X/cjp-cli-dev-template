<!--
 * @Description: 这个登录页主要为了调试用，当直接在浏览器输入地址进行访问时，如果登录过期则跳转该页面进行快速调试
 * 如果从粤政易跳转过来，则还是回到主线逻辑。
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-08-05 15:00:40
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-08-13 15:21:19
 * @FilePath: \am-portal-mobile-yzy-fe\src\views\login\index.vue
-->
<template>
  <article class="login">
    <h1 class="welcome-tips">您好，欢迎登录！</h1>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="form.code"
          name="验证码"
          label="验证码"
          placeholder="验证码"
          :rules="[{ required: true, message: '请填写验证码' }]"
        >
          <template #button>
            <van-image @click="handleChangeQrCode" width="100" :src="qrCodeSrc" />
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button class="btn-login" round block type="primary" native-type="submit">登 录</van-button>
      </div>
    </van-form>
  </article>
</template>

<script setup name="login">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, getQrCode } from './apis'
import { rsaEncrypt, setToken } from '@utils/index.js'

// 定义变量
const router = useRouter()
const form = ref({
  username: '',
  password: '',
  code: '',
})

// 验证码src
const qrCodeSrc = ref('')
// 验证码接口返回的key，用于透传登录接口
const qrCodeKey = ref('')

/**
 * 获取验证码
 */
const fetchQrCode = () => {
  const params = {}
  getQrCode(params, {
    responseType: 'blob',
    headers: {
      Authorization: `Basic ${rsaEncrypt(process.env.VUE_APP_CLEARTEXT)}`,
    },
  }).then(({ key, data }) => {
    qrCodeSrc.value = URL.createObjectURL(data)
    qrCodeKey.value = key // 登录接口需要
  })
}

fetchQrCode()

const onSubmit = () => {
  const params = {
    ...form.value,
    password: rsaEncrypt(form.value.password), // 加密
    key: qrCodeKey.value,
  }
  login(params).then(data => {
    // 如果没拿到数据表示登录失败，return 并刷新验证码
    if (!data) return fetchQrCode()
    const { token_type, access_token } = data
    // 设置token
    setToken(`${token_type} ${access_token}`)
    // 跳转首页
    router.push('/home')
  })
}

// 更换验证码
const handleChangeQrCode = () => {
  fetchQrCode()
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background-color: $theme-color;
  background-image: linear-gradient(45deg, #00b39d 0%, #09ada2 80%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .welcome-tips {
    font-size: 25px;
    font-weight: 800;
    color: #fff;
    margin-bottom: pxToRem(60);
  }

  .btn-login {
    background-color: #fff;
    border-color: #fff;
    color: $color-black-1;
  }

  // 样式对齐
  :deep(.van-field__value) {
    .van-field__body {
      align-items: flex-start;
    }
    .van-field__control {
      height: 24px;
    }
  }
}
</style>
