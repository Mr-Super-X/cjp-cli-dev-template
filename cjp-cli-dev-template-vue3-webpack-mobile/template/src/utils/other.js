/**
 * 将arraybuffer翻译成json对象
 * @param {*} arraybuffer
 * @returns json
 */
export function translateArrayBufferToJson(arraybuffer) {
  if (arraybuffer instanceof ArrayBuffer) {
    const decoder = new TextDecoder('utf-8')
    const jsonString = decoder.decode(new Uint8Array(arraybuffer))

    return JSON.parse(jsonString)
  } else {
    console.warn('translateArrayBuffer方法传入的数据类型不是ArrayBuffer')
    return {}
  }
}

/**
 * 将blob翻译成json对象
 * @param {*} blob
 * @returns json
 */
export function translateBlobToJson(blob) {
  return new Promise((resolve, reject) => {
    // 尝试将 Blob 转换为文本并解析为 JSON
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result)
        resolve(json)
      } catch (e) {
        reject(new Error('blob解析为JSON出错'))
      }
    }
    reader.onerror = () => {
      reject('读取blob失败')
    }
    reader.readAsText(blob)
  })
}

/**
 * 拷贝需要的字段组成参数对象
 * @param {*} source 要拷贝的数据源对象
 * @param {*} needFields 需要的字段列表
 * @returns 拷贝好的参数对象
 */
export function copyNeedFields(source = {}, needFields = []) {
  return Object.fromEntries(Object.entries(source).filter(([key, _]) => needFields.includes(key)))
}
