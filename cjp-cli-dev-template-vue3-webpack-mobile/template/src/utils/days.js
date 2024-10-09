/**
 * 按UI定制dayjs方法，可以将所有日期时间相关的操作都放在这里处理
 */

import dayjs from 'dayjs'

/**
 * 格式化日期
 * @param {*} date 日期时间
 * @param {*} format 默认格式'YYYY/MM/DD'
 * @returns
 */
export function formatDate(date, format = 'YYYY/MM/DD') {
  return dayjs(date).format(format)
}
