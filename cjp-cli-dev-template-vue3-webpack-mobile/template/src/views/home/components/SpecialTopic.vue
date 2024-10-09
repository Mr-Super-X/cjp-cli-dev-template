<!--
 * @Description: 专题组件
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-06-28 11:33:04
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-07-03 10:40:21
 * @FilePath: \am-portal-mobile-yzy-fe\src\views\home\components\SpecialTopic.vue
-->
<template>
  <div class="special-district">
    <VCard>
      <div class="card-header">
        <span class="title">预警信息</span>
      </div>

      <div class="card-content">
        <div class="scroll-box">
          <div class="list">
            <div class="list-item" v-for="item in cardList" :key="item.title" @click="handleLink(item)">
              <img class="item-bg" :src="item.img" alt="" />
              <div class="item-content">
                <div class="title">
                  <div class="left">
                    <span>{{ item.title }}</span>
                    <img class="icon" src="../../../assets/images/icon-right_bracket.png" alt="" />
                  </div>
                  <img class="right-icon" :src="item.rightIcon" alt="" />
                </div>
                <div class="description">{{ item.description }}</div>
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
import { useRouter } from 'vue-router'

const router = useRouter()

const cardList = ref([
  {
    title: '实时雨情',
    description: '各站点降雨量实时统计',
    img: require('../../../assets/images/topic-bg1.png'),
    rightIcon: require('../../../assets/images/topic-icon1.png'),
  },
  {
    title: '实时水情',
    description: '各站点水位实时统计',
    img: require('../../../assets/images/topic-bg2.png'),
    rightIcon: require('../../../assets/images/topic-icon2.png'),
  },
  {
    title: '台风路径',
    description: '台风轨迹实时查询',
    img: require('../../../assets/images/topic-bg3.png'),
    rightIcon: require('../../../assets/images/topic-icon3.png'),
  },
])

const handleLink = item => {
  router.push('/warn')
}
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
          width: pxToRem(480);
          height: pxToRem(160);
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
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              .left {
                display: flex;
                align-items: center;
                font-size: 16px;
                line-height: 24px;
                color: $color-white;
                .icon {
                  width: pxToRem(40);
                  height: pxToRem(40);
                }
              }

              .right-icon {
                width: pxToRem(64);
                height: pxToRem(64);
              }
            }

            .description {
              font-size: 12px;
              line-height: 12px;
              color: $color-white;
            }
          }
        }
      }
    }
  }
}
</style>
