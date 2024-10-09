export function debounce(input, timeout) {
  let timer
  return event => {
    if (event.target.composing === true) {
      return
    }
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
    timer = setTimeout(() => {
      input(event)
      clearTimeout(timer)
      timer = undefined
    }, timeout)
  }
}

export function isFunction(param) {
  return Object.prototype.toString.call(param) === '[object Function]'
}

// 处理中文输入可能会触发多次的问题。可借助compositionstart和compositionend来实现。
function compositionStart(e) {
  e.target.composing = true
}
function compositionEnd(e) {
  e.target.composing = false
  const event = new Event('input', { bubbles: true })
  e.target?.dispatchEvent(event)
}

let inputFunction

// 要同时支持input和封装的input组件，因此需要循环去找这个input元素
function findInput(el) {
  const queue = []
  queue.push(el)
  while (queue.length > 0) {
    const current = queue.shift()
    if (current?.tagName === 'INPUT') {
      return current
    }

    if (current?.childNodes) {
      queue.push(...current.childNodes)
    }
  }

  return null
}

// 指令内容
const definition = {
  mounted(el, binding) {
    const { value, arg } = binding
    if (value && isFunction(value)) {
      let delay = 300 // 默认防抖时间
      // 获取指令上传递的参数
      if (arg && !Number.isNaN(arg)) {
        delay = Number(arg)
      }
      inputFunction = debounce(value, delay) // 执行函数防抖处理
      const input = findInput(el) // 找到input元素
      // 如果找到了则绑定相应事件
      if (input) {
        input.addEventListener('input', inputFunction)
        // 处理中文输入可能会触发多次的问题。可借助compositionstart和compositionend来实现。
        input.addEventListener('compositionstart', compositionStart)
        input.addEventListener('compositionend', compositionEnd)
      }
      // 用于在卸载阶段找到该元素，便于移除事件
      el._INPUT = input
    }
  },
  beforeUnmount(el) {
    if (el._INPUT) {
      el._INPUT.removeEventListener('input', inputFunction)
      el._INPUT.removeEventListener('compositionstart', compositionStart)
      el._INPUT.removeEventListener('compositionend', compositionEnd)
      el._INPUT = null
    }
  },
}

const inputDebounce = {
  install(app, options) {
    app.directive('inputDebounce', definition)
  },
}

// 导出指令
// input输入防抖指令，用法：v-inputDebounce="onInput"  v-inputDebounce:1000="onInput"
export default inputDebounce
