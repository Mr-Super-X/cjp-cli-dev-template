import { toast } from '@utils/index.js'
import { request } from '@request'
import { translateArrayBufferToJson } from '@utils/index.js'

/**
 * 文件下载功能hook
 *
 * @example
 * import { useFileDownload } from '@hooks/useFileDownload.js'
 *
 * const fileDownload = useFileDownload()
 *
 * 简要传参：
 * fileDownload.requestAndDownload({ params: { id }})
 * 完整传参：
 * fileDownload.requestAndDownload({ url: '', method: '', params: {}, '自定义文件名', '自定义文件扩展如xslx' })
 */
export const useFileDownload = () => {
  /**
   * 下载文件
   * @param res 响应体
   * @param fName 自定义文件名称
   * @param ext 自定义文件扩展
   */
  function downloadFile(res, fName, ext) {
    // 下载接口存在http状态码200而实际内部自定义错误码500等情况，由于responseType被设置为arraybuffer
    // 因此响应体会被转成arraybuffer，这里通过将arraybuffer翻译成json对错误进行容错处理
    const resDataJson = translateArrayBufferToJson(res.data)
    if (resDataJson.code != 200) return console.error(`下载接口报错: ${JSON.stringify(resDataJson)}`)

    try {
      let fileInfo // 文件信息
      // 获取文件信息
      const contentDisposition = res.headers.get('Content-Disposition')
      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        const matches = filenameRegex.exec(contentDisposition)
        if (matches != null && matches[1]) {
          fileInfo = matches[1].replace(/['"]/g, '')
        }
      }
      // 获取文件扩展名
      const filename = fName || decodeURIComponent(fileInfo.split('.')[0]) // 获取文件名
      const extension = ext || fileInfo.split('.').pop() // 获取文件的扩展名

      // 创建Blob对象并创建一个指向该参数对象的URL
      const b = new Blob([res.data])
      // 根据传入的参数b创建一个指向该参数对象的URL
      const url = URL.createObjectURL(b)
      const link = document.createElement('a')
      document.body.appendChild(link)
      // 设置导出的文件名和格式
      link.download = filename + '.' + extension
      // 下载链接
      link.href = url
      // 点击获取文件
      link.click()

      // 清理
      // 移除a标签
      document.body.removeChild(link)
      // 销毁下载链接
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast('下载文件失败，请稍后再试')
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
        // responseType: 'blob',
        responseType: 'arraybuffer', // 指定数据源为arraybuffer，否则下载的文件会乱码
      },
      config,
      {}
    )

    // 通过处理后的配置来调用axios请求
    return request(reqConfig)
  }

  /**
   * 请求文件并下载
   * @param config axios config配置，增加自定义filename、extension字段（非必传）
   */
  function requestAndDownload(config = {}) {
    // 如果不传，url默认值为文件中心下载接口，请求方法默认为get
    const { url = '/docc/attachment/download', method = 'get', filename, extension } = config
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
        return this.downloadFile(res, filename, extension)
      } else {
        toast('下载文件时出现错误')
      }
    })
  }

  return {
    downloadFile,
    requestApi,
    requestAndDownload,
  }
}
