import { toast } from '@utils/index.js'

/**
 * 指数补偿架构封装
 * @description 按照指数的时间倍数重复发送请求，避免因网络波动带来的体验问题，同时减轻服务器压力。
 * 第一次请求时也就是第一次调用doFetch时会注册一个setTimeout，它会在一段时间之后再执行一次doFetch，
 * 如果在执行doFetch时已经resolved了就会return终止执行，所以它最终就只resolve一次，这样我们的指数补偿程序功能就完成了
 *
 *    —— 100ms
 *    —— 200ms
 *    —— 400ms
 *    —— 800ms
 *    —— 1600ms
 *    —— 3200ms
 *    —— fail
 *
 * @param f promise 请求方法，如axios、axios.get、axios.post、...，必传
 * @param method string 请求方法（get/post/...） 非必传
 * @returns promise 返回值与直接调用axios的返回一致，包含config、data、headers、request、status、statusText等信息，
 * 查看axios响应结构文档：http://www.axios-js.com/zh-cn/docs/#%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84
 * @example
 * const POST = exponentialCompensation(axios.post, 'post')
 *
 * return POST(options)
 */
function exponentialCompensation(fn, method) {
  let resolved = false
  let t = 1
  const maxRetries = 5 // 最大重试次数

  return options => {
    return new Promise((resolve, reject) => {
      function doFetch() {
        // 如果resolved已经是true，说明在一个请求和重试周期内请求成功了，需要阻止继续重试
        // 如果t > Math.pow(2, maxRetries)，即超过了 2 的 5 次方（32）说明此时已经到达最大重试间隔，需要阻止继续重试
        if (resolved || t > Math.pow(2, maxRetries)) {
          reject(new Error('请求超时或失败')) // 超过最大重试次数时 reject
          return
        }

        // 将参数分别从options中解构出来
        const { url, data, params, ...other } = options

        // 创建请求方法，根据类型method进行参数绑定
        let requestFn
        switch (method) {
          case 'post':
          case 'put':
          case 'patch':
            requestFn = fn.bind(null, url, data, { ...other })
            break
          case 'get':
          case 'delete':
          case 'head':
          case 'options':
            requestFn = fn.bind(null, url, { params, ...other })
            break
          default:
            requestFn = fn.bind(null, { ...options })
        }

        // 因为是个闭包，所以可以访问父函数的参数
        requestFn()
          .then(response => {
            // 如果第一次请求成功了，就把数据返回给promise，并将resolved状态置为true，停止后面的重试
            if (!resolved) {
              resolved = true
              resolve(response)
            }
          })
          .catch(e => {
            // 如果当前请求的状态码为401，则抛出错误并停止后续重试
            if (e?.request?.status === 401) {
              reject(e?.message || '未授权，请重新登录')
              return
            }
            /**
             * 初始执行 doFetch 时 t 的值是 1，如果请求失败了走入下面的逻辑。
             * 第一次请求失败调用 setTimeout 时，t 的值为 1，所以 setTimeout 的延迟是 100 毫秒，随后 t 变为 2。
             * 第二次请求失败调用 setTimeout 时，t 的值为 2，所以延迟是 200 毫秒，随后 t 变为 4。
             * 第三次请求失败调用时，t 为 4，延迟是 400 毫秒，随后 t 变为 8。
             * 第四次调用时，t 为 8，延迟是 800 毫秒，随后 t 变为 16。
             * 第五次调用时，t 为 16，延迟是 1600 毫秒，随后 t 变为 32。
             * 第六次调用时，t 为 32，延迟是 3200 毫秒，随后 t 变为 64。
             * 第七次调用时，此时 t 已经超过了 2 的 5 次方（32），会停止执行。
             *
             * 在这段代码中，doFetch包含初始执行在内一共执行了7次，而requestFn一共执行了6次，
             * 重试次数指的是 requestFn 函数实际执行的次数，即请求失败后，通过 setTimeout 设置的延迟后再次执行 requestFn 的次数。
             * 在这段代码中，只有在请求失败后才会进行重试，因此重试的次数由请求的成功或失败决定。最多重试 maxRetries 次，即 5 次
             */
            setTimeout(doFetch, t * 100) // 在指数递增的时间后重试
            t *= 2 // 翻倍增加延迟时间

            // 最后一次重试失败时，弹出提示
            if (t > Math.pow(2, maxRetries)) {
              toast('网络环境不稳定，请稍后再试')
            }
          })
      }

      doFetch()
    })
  }
}

export default exponentialCompensation

// function exponentialCompensation(axiosMethod, method, maxDelay = 3200) {
//   // 定义指数递增的时间间隔
//   const delays = [0, 200, 400, 800, 1600, 3200]

//   return async function (options) {
//     for (let i = 0; i < delays.length; i++) {
//       try {
//         // 设置请求方法为传入的 method
//         options.method = method
//         // 发起请求
//         const response = await axiosMethod(options)
//         return response.data // 返回请求结果
//       } catch (error) {
//         if (i === delays.length - 1) {
//           throw error // 最后一次仍然失败则抛出错误
//         } else {
//           // 使用 await 进行延迟
//           await new Promise(resolve => setTimeout(resolve, delays[i]))
//         }
//       }
//     }
//   }
// }
