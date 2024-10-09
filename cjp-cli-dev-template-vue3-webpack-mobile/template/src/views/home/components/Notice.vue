<!--
 * @Description: 公告
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-06-27 11:04:05
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-09-23 16:30:30
 * @FilePath: \am-portal-mobile-yzy-fe\src\views\home\components\Notice.vue
-->
<template>
  <VCard class="box">
    <!-- 迭代六新需求，插入消息模块 -->
    <section class="message">
      <div class="left">
        <div class="picture">
          <img class="icon-avatar" :src="userinfo.user?.avatar || defaultPicture" alt="" />
        </div>
        <div class="username">{{ userinfo.user?.username }}</div>
        <div class="msg-count" @click="handleGoMsg" v-if="isShowMessage">有{{ unreadMsgCount }}条新消息</div>
      </div>
      <div class="right">
        <img @click="handleReload" class="icon-reload" src="@img/icon-reload.png" alt="" />
      </div>
    </section>
    <section class="notice" @click="handleGoList" v-if="isShowNotice">
      <div class="left-icon">
        <img class="icon-notice" src="@img/icon-notice.png" alt="" />
      </div>
      <div class="swiper-box">
        <van-swipe class="my-swipe" :autoplay="5000" :show-indicators="false" vertical>
          <van-swipe-item v-for="item in list" :key="item.id" @click.stop="handleGoNotice(item)">
            <p class="van-ellipsis text">{{ item.title }}</p>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="right-icon">
        <img class="icon-clover" src="@img/icon-clover.png" alt="" />
      </div>
    </section>
  </VCard>
</template>

<script setup name="Notice">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout, thirdPartyLogin } from '@request/commonApi'
import { findMyList, updateReadStatus, querySucceedMsgCount } from '../apis'
import { useUserStore } from '@store/user.js'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userinfo } = storeToRefs(userStore)
const router = useRouter()
const list = ref([])
const defaultPicture = require('@img/icon-picture.png')
const unreadMsgCount = ref(0)
const isShowMessage = ref(false) // 是否显示消息未读数量
const isShowNotice = ref(false) // 是否显示通知公告组件

// 获取未读消息数量
const getUnreadMessage = () => {
  return querySucceedMsgCount({
    readStatus: 0, // 0表示查询未读消息数量
  }).then(data => {
    unreadMsgCount.value = data || 0
    isShowMessage.value = unreadMsgCount.value > 0
  })
}

const getList = () => {
  return findMyList({
    page: 1,
    size: 5, // 展示最新的5条
    reqEndpoint: 2, // 指定为移动端
    status: 2, // 指定状态为有效公告
    noticeTypeList: ['1'], // 指定只要通知公告类型
  }).then(data => {
    list.value = data?.records || []
    isShowNotice.value = list.value.length > 0 // 如果有公告，则显示通知公告组件
  })
}

const init = () => {
  getUnreadMessage()
  getList()
}

init()

// 跳转通知列表
const handleGoList = () => {
  router.push('/notice')
}

// 跳转消息列表
const handleGoMsg = () => {
  router.push('/message')
}

// 标记为已读
const markToReaded = ids => {
  return updateReadStatus({ ids }).then(data => {})
}

// 跳转通知详情
const handleGoNotice = row => {
  const { id, readStatus } = row
  router.push({ path: '/noticeDetail', query: { id } })

  // 如果消息未读，则标记为已读
  if (readStatus == 0) {
    markToReaded([id])
  }
}

// 刷新用户登录信息
const handleReload = async () => {
  // 注销并自动静默登录（粤政易app中会自动重定向并登录，浏览器中会跳转登录页需重新输入账密）
  await logout()
  await thirdPartyLogin()
}
</script>

<style scoped lang="scss">
.box {
  padding: 0 pxToRem(40);
}
.message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: pxToRem(24) 0;
  border-bottom: 1px solid $color-white-1;

  .left {
    display: flex;
    align-items: center;
  }

  .picture {
    width: pxToRem(64);
    height: pxToRem(64);
    border-radius: 50%;
    overflow: hidden;
    margin-right: pxToRem(24);
    .icon-avatar {
      width: 100%;
    }
  }

  .username {
    font-size: 16px;
    color: $color-black-1;
    margin-right: pxToRem(24);
    max-width: pxToRem(180);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .msg-count {
    font-size: 16px;
    color: $color-black-1;
  }

  .right {
    .icon-reload {
      width: pxToRem(40);
    }
  }
}
.notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: pxToRem(96);
  padding: pxToRem(24) 0;

  .left-icon {
    .icon-notice {
      width: pxToRem(68);
      height: pxToRem(48);
    }
  }

  .right-icon {
    display: flex;
    align-items: center;
    .icon-clover {
      width: pxToRem($base-padding-spacing-1);
      height: pxToRem($base-padding-spacing-1);
    }
  }

  .swiper-box {
    flex: 1;
    overflow: hidden;
    height: pxToRem(96);
    padding: 0 pxToRem(24);
    .van-swipe {
      height: 100%;
    }
    .van-swipe-item {
      width: 100%;
      height: pxToRem(96);
      display: flex;
      align-items: center;

      .text {
        width: 100%;
        font-size: 14px;
        line-height: 14px;
        color: #262626;
        margin-top: 3px; // 修复视差偏移
      }
    }
  }
}
</style>
