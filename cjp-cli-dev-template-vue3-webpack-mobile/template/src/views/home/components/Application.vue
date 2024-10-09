<!--
 * @Description: 常用应用组件
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-06-28 09:47:21
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-08-15 19:02:21
 * @FilePath: \am-portal-mobile-yzy-fe\src\views\home\components\Application.vue
-->
<template>
  <div class="application">
    <VCard>
      <div class="card-header">
        <span class="title">常用应用</span>
        <div class="btn">
          <span class="text" @click="handleLink">查看全部</span>
          <img class="icon" src="../../../assets/images/chevron-right.png" alt="" />
        </div>
      </div>
      <div class="card-list">
        <div class="card-list-item" v-for="item in cardList" :key="item.id" @click="handleClickItem(item)">
          <VLazyRequestImg imgClass="icon" :id="getFetchParams(item).id" :startLoad="isLoaded" />
          <div class="title van-multi-ellipsis--l2">{{ item.name }}</div>
        </div>
      </div>
    </VCard>
  </div>
</template>

<script setup name="Application">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUseApplications } from '../apis'
import { useSsoStore } from '@store/sso.js'
import { isInYzyApp } from '@utils/index.js'

const router = useRouter()
const ssoStore = useSsoStore()
const isLoaded = ref(false)

const cardList = ref([
  // {
  //   id: 1,
  //   title: '水资源管理 (行政管理端）',
  //   icon: require('../../../assets/images/icon-water.png'),
  //   link: '',
  // },
  // {
  //   id: 2,
  //   title: '水资源调度',
  //   icon: require('../../../assets/images/icon-water-dispatch.png'),
  //   link: '',
  // },
  // {
  //   id: 3,
  //   title: '水文综合业务',
  //   icon: require('../../../assets/images/icon-business.png'),
  //   link: '',
  // },
  // {
  //   id: 4,
  //   title: '水土保持',
  //   icon: require('../../../assets/images/icon-soil-water.png'),
  //   link: '',
  // },
  // {
  //   id: 5,
  //   title: '水利知识服务中心子平台',
  //   icon: require('../../../assets/images/icon-book.png'),
  //   link: '',
  // },
  // {
  //   id: 6,
  //   title: '水利物联网 平台',
  //   icon: require('../../../assets/images/icon-ball.png'),
  //   link: '',
  // },
  // {
  //   id: 7,
  //   title: '智慧水利项目管理',
  //   icon: require('../../../assets/images/icon-folder.png'),
  //   link: '',
  // },
  // {
  //   id: 8,
  //   title: '数字孪生场景应用',
  //   icon: require('../../../assets/images/icon-square.png'),
  //   link: '',
  // },
])

const getFetchParams = item => {
  // 获取数据
  const manageImg = item.manageImg ? JSON.parse(item.manageImg) : {}
  const { fileId: id } = manageImg
  return { id }
}

const getList = () => {
  const params = {
    endpointType: 2, // 2表示粤政易端
  }
  return getUseApplications(params).then(data => {
    cardList.value = data
    isLoaded.value = true
  })
}

getList()

const handleLink = () => {
  router.push('/apps')
}

// 点击跳转应用
const handleClickItem = async item => {
  const params = {
    systemCode: item.code,
  }
  const linkUrl = await ssoStore.ssoLogin(params)
  console.log('跳转链接:', linkUrl)
  // 如果在粤政易app中，直接使用重定向，否则调用window.open
  if (isInYzyApp()) {
    location.href = linkUrl
  } else {
    window.open(linkUrl, '_blank')
  }
}
</script>

<style scoped lang="scss">
.application {
  margin-top: pxToRem($base-padding-spacing-1);
  .v-card {
    padding: pxToRem($base-padding-spacing-1) pxToRem($base-padding-spacing);
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
    }

    .btn {
      display: flex;
      align-items: center;
      .text {
        font-size: 14px;
        line-height: 15px;
        color: $color-green;
      }
      .icon {
        width: pxToRem(40);
        height: pxToRem(40);
        display: block;
      }
    }
  }
  .card-list {
    display: flex;
    flex-wrap: wrap;
    gap: pxToRem(0) pxToRem(35);
    &-item {
      width: pxToRem(140);
      // height: pxToRem(192);
      text-align: center;
      margin-top: pxToRem($base-padding-spacing-1);

      :deep(.icon) {
        width: pxToRem(96);
        height: pxToRem(96);
        margin: 0 auto pxToRem(20);
      }

      .title {
        font-size: 14px;
        line-height: 22px;
        color: $color-black-1;
        margin-top: pxToRem(-12);
      }
    }
  }
}
</style>
