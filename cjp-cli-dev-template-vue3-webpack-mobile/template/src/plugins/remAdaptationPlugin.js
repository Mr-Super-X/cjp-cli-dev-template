/**
 * 设置视口大小和缩放
 * @description 由于initial-scale = 理想视口宽度 / 视觉视口宽度，所以设置initial-scale=1.0; 就相当于让视觉视口等于理想视口。
 */
function setViewport() {
  let metaEl = document.documentElement.querySelector('meta[name="viewport"]')

  if (!metaEl) {
    // 设置viewport
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'viewport')
    meta.setAttribute('content', `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`)

    document.head.appendChild(meta)
  } else {
    console.log("meta['viewport']已存在")
  }
}

/**
 * 设置根节点html文字大小来适配rem，以828px的设计稿、2倍屏为例
 * 828为逻辑像素，414为物理像素，那么828 / 10 = 82.8
 * 此时1rem的逻辑像素为82.8px，2倍屏的物理像素为828 / 2 / 10 = 41.4px，
 * 3倍屏的物理像素为828 / 3 / 10 = 27.6px，以此类推
 *
 * 使用rem的好处在于只需要适配一种比例，其它的比例也都能得到比较好的适配效果
 * 假设现在UI上的容器宽度为200px，此时通过less/scss等预编译语言即可写成width: 200/82.8rem
 * 目前该项目使用scss预处理，已封装函数pxToRem，使用pxToRem(元素的逻辑像素)
 */
function setHtmlFontSize() {
  if (document.documentElement.clientWidth > 1024) {
    // 页面宽度大于1024px让其宽度等于1024px（ipad pro宽度为1024），居中
    document.documentElement.style.width = '1024px'
    document.documentElement.style.margin = '0 auto'
  }
  // 根节点字体大小等于宽度/10px
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px'
}

/**
 * 监听页面变化重置状态
 */
function listenWindowResize() {
  // 页面发生变化时重置font-size
  // 防止多个事件重复执行，增加延迟300ms操作(防抖)
  var tid
  window.addEventListener(
    'resize',
    function () {
      clearTimeout(tid)
      tid = setTimeout(setHtmlFontSize, 300)
    },
    false
  )
  window.addEventListener(
    'pageshow',
    function (e) {
      if (e.persisted) {
        clearTimeout(tid)
        tid = setTimeout(setHtmlFontSize, 300)
      }
    },
    false
  )
}

// rem适配插件
const remAdaptationPlugin = {
  install(vue, options) {
    setViewport()
    setHtmlFontSize()
    listenWindowResize()
  },
}

export default remAdaptationPlugin
