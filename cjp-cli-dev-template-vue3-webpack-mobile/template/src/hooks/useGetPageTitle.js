import { useRoute } from 'vue-router'

/**
 * 获取页面标题，传参优先级最高，如果没传，route.meta中有title，则返回meta中的title，否则返回默认的title '智慧水利'
 * @returns { title: (t) => title}
 * @example
 * import { useGetPageTitle } from '@hooks/useGetPageTitle.js'
 *
 * const getPageTitle = useGetPageTitle()
 *
 * <VPage :navTitle="getPageTitle.title()"></VPage>
 */
export const useGetPageTitle = () => {
  function title(t) {
    // useRoute() 是一个 Composition API 钩子函数，需要在组件的 setup() 函数内部调用，否则会报错
    const route = useRoute()
    const title = route.meta.title

    // 动态修改title
    document.title = title

    return t || title || '智慧水利'
  }

  return {
    title,
  }
}
