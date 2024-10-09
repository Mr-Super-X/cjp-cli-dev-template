<!--
 * @Description: 专区组件
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-06-28 11:33:04
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-07-01 15:18:33
 * @FilePath: \am-portal-mobile-yzy-fe\src\views\home\components\SpecialDistrict.vue
-->
<template>
  <div class="special-district">
    <VCard>
      <div class="card-header">
        <span class="title">数说水利</span>
      </div>

      <div class="card-content">
        <div class="scroll-box">
          <div class="list">
            <div class="list-item" v-for="item in cardList" :key="item.title" @click="handleLink(item)">
              <img class="item-bg" :src="item.img" alt="" />
              <div class="item-content">
                <div class="title">{{ item.title }}</div>
                <div class="btn">立即查看</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VCard>
  </div>
</template>

<script setup name="SpecialDistrict">
import { ref } from 'vue'

const cardList = ref([
  {
    title: '政务办件评效',
    img: require('../../../assets/images/district-bg1.png'),
  },
  {
    title: '水利工程建设',
    img: require('../../../assets/images/district-bg2.png'),
  },
  {
    title: '节水专栏',
    img: require('../../../assets/images/district-bg3.png'),
  },
  {
    title: '水库专栏',
    img: require('../../../assets/images/district-bg4.png'),
  },
])

const handleLink = item => {}
</script>

<style scoped lang="scss">
.special-district {
  margin-top: pxToRem($base-padding-spacing-1);

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: pxToRem($base-padding-spacing-1) pxToRem($base-padding-spacing);
    .title {
      font-size: 20px;
      line-height: 20px;
      font-weight: 600;
    }
  }

  .card-content {
    padding: 0 0 pxToRem(16) pxToRem($base-padding-spacing);
    .scroll-box {
      overflow-x: auto;

      .list {
        white-space: nowrap;
        &-item {
          display: inline-block;
          position: relative;
          width: pxToRem(296);
          height: pxToRem(176);
          border-radius: pxToRem($border-radius);
          overflow: hidden;
          margin-right: pxToRem($base-padding-spacing-1);

          .item-bg {
            position: relative;
            left: 0;
            right: 0;
            margin: auto;
            height: 100%;
          }

          .item-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: pxToRem($base-padding-spacing-1);
            box-sizing: border-box;

            .title {
              font-size: 16px;
              line-height: 16px;
              color: $color-white;
            }

            .btn {
              margin-top: pxToRem(30);
              width: pxToRem(128);
              height: pxToRem(48);
              padding: 0 pxToRem(16);
              border-radius: pxToRem(48);
              background: rgba(255, 255, 255, 0.5);
              font-size: 12px;
              line-height: pxToRem(48);
              color: $color-white;
            }
          }
        }
      }
    }
  }
}
</style>
