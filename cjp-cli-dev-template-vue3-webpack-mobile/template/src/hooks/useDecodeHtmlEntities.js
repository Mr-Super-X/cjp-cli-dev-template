// 这里添加更多的替换逻辑，根据需要处理其他实体
const replacements = {
  '&amp;nbsp;': '&nbsp;', // 将&amp;nbsp;转译成&nbsp;
  // 添加更多的替换规则
}

export function useDecodeHtmlEntities() {
  /**
   * 替换转译错误渲染失败的html文本
   * @param {*} content 富文本内容
   * @returns 替换后的富文本
   */
  function decodeHtml(content) {
    if (!content) return '' // 如果值为 undefined 或 null，直接返回空字符串或者其他默认值

    // 执行替换
    let decodedValue = content
    for (const entity in replacements) {
      if (replacements.hasOwnProperty(entity)) {
        decodedValue = decodedValue.replace(new RegExp(entity, 'g'), replacements[entity])
      }
    }

    return decodedValue
  }

  return {
    decodeHtml,
  }
}
