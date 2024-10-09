import { toast } from '@utils/index.js'
import { request } from '@request'
import { translateBlobToJson } from '@utils/index.js'

/**
 * 图片下载功能hook
 *
 * @example
 * import { useImageDownload } from '@hooks/useImageDownload.js'
 *
 * const imageDownload = useImageDownload()
 *
 * 简要传参：
 * imageDownload.requestAndDownload({ params: { id }})
 * 完整传参：
 * imageDownload.requestAndDownload({ url: '', method: '', params: {}, ...others })
 */
export const useImageDownload = () => {
  /**
   * 下载图片
   * @param res 响应体
   */
  async function downloadImage(res) {
    // 下载接口存在http状态码200而实际内部自定义错误码500等情况，由于responseType被设置为blob
    // 因此响应体会被转成blob，这里通过将blob翻译成json对错误进行容错处理
    const resDataJson = await translateBlobToJson(res.data)
    if (resDataJson.code != 200) return console.error(`下载接口报错: ${JSON.stringify(resDataJson)}`)

    try {
      // 创建Blob对象并创建一个指向该参数对象的URL
      const b = new Blob([res.data])
      // 根据传入的参数b创建一个指向该参数对象的URL
      const url = URL.createObjectURL(b)

      return url // url会被输出为：blob:http://localhost:9000/5fa6bfc5-5a43-418d-82fa-bd8c943ff2c9
    } catch (error) {
      console.error('下载图片失败，请稍后再试')
    }
  }

  /**
   * 请求接口通用包装
   * @param config axios config配置
   * @returns
   */
  function requestApi(config) {
    // 合并处理好的config并添加默认配置
    const reqConfig = Object.assign(
      {
        // headers: { 'Content-Type': 'application/octet-stream' }, // 告知服务器接收二进制流数据
        responseType: 'blob',
      },
      config,
      {}
    )

    // 通过处理后的配置来调用axios请求
    return request(reqConfig)
  }

  /**
   * 请求文件并下载
   * @param config axios config配置
   */
  function requestAndDownload(config = {}) {
    // 如果不传，url默认值为文件中心下载接口，请求方法默认为get
    const { url = '/docc/attachment/download', method = 'get' } = config
    const options = Object.assign(
      {},
      {
        url,
        method,
      },
      config
    )
    return this.requestApi(options).then(res => {
      const data = res?.data
      if (data) {
        return this.downloadImage(res)
      } else {
        toast('下载图片时出现错误')
      }
    })
  }

  return {
    downloadImage,
    requestApi,
    requestAndDownload,
  }
}
