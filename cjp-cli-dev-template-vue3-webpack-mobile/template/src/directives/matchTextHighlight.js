/**
 * 对匹配文字进行高亮显示
 */
const highlight = (el, binding, exceptTags) => {
  const searchText = binding.value

  // 如果输入内容不存在则阻断
  if (!searchText) return

  const regex = new RegExp(searchText, 'gi')

  const highlightText = text => {
    // 每次进行新的高亮前移除之前的高亮标记（因为每次高亮都是插入span标签进行处理，不移除会导致输入新内容匹配失败）
    const cleanedText = text.replace(/<span class="highlight">([^<]+)<\/span>/gi, '$1')
    // 保留指定标签内的内容不进行高亮处理，如果不传，默认排除i标签
    // 如果没有这一步，当输入英文内容时，会错误的把标签内容也进行高亮并插入到页面中
    const parts = cleanedText.split(new RegExp(`(</?(?:${exceptTags.join('|')}|i)[^>]*>)`, 'gi'))
    const highlightedParts = parts.map(part => {
      if (exceptTags.some(tag => part.startsWith(`<${tag}`))) {
        return part // 不处理指定标签内的内容
      } else if (part.startsWith('<i')) {
        return part // 不处理<i>标签内的内容
      } else {
        return part.replace(regex, match => `<span class="highlight">${match}</span>`)
      }
    })

    el.innerHTML = highlightedParts.join('')
  }

  highlightText(el.innerHTML)
}

// 指令内容
const definition = {
  mounted(el, binding, vnode) {
    if (binding.value) {
      const exceptTags =
        vnode.props && vnode.props['except-tags'] ? vnode.props['except-tags'].split(',').map(tag => tag.trim()) : []
      highlight(el, binding, exceptTags)
    }
  },
  // 监听绑定值的变化，在值变化时重新高亮显示文本
  updated(el, binding, vnode) {
    if (binding.value !== binding.oldValue) {
      const exceptTags =
        vnode.props && vnode.props['except-tags'] ? vnode.props['except-tags'].split(',').map(tag => tag.trim()) : []
      // 只有在绑定值变化时重新高亮显示文本
      highlight(el, binding, exceptTags)
    }
  },
  // 清理工作，清除可能存在的定时器等
  unmounted(el) {},
}

/**
 * 匹配文字进行高亮显示指令
 * @example
 *
 * const searchText = ref('长')
 *
 * <div v-matchTextHighlight="searchText">这是一段很长的文案</div>
 *
 * 如果要匹配的文本中有标签内容，且要对指定标签内的内容不进行高亮显示，则按如下示例使用，传入except-tags来排除标签
 * <div v-matchTextHighlight="searchText" except-tags="div,p">这是一段很长的文案。<div>这是一个不需要高亮处理的div标签内部文本。</div></div>
 */
const matchTextHighlight = {
  install(app, options) {
    app.directive('matchTextHighlight', definition)
  },
}

/**
 * 导出指令
 */
export default matchTextHighlight

// -----------------------------另一种实现-----------------------------------

// const highlight = (el, binding) => {
//   const searchText = binding.value.text || binding.value
//   const excludedTags = binding.value.exclude || [] // 获取传入的排除标签数组

//   // 如果输入内容不存在则阻断
//   if (!searchText) return

//   const regex = new RegExp(searchText, 'gi')

//   const highlightText = text => {
//     // 移除之前的高亮标记
//     const cleanedText = text.replace(/<span class="highlight">([^<]+)<\/span>/gi, '$1')

//     // 保留指定的排除标签不进行高亮处理
//     const parts = cleanedText.split(new RegExp(`(${excludedTags.map(tag => `<${tag}[^>]*>.*?<\/${tag}>`).join('|')})`, 'gi'))

//     const highlightedParts = parts.map(part => {
//       if (excludedTags.some(tag => part.startsWith(`<${tag}`))) {
//         return part // 不处理排除标签内的内容
//       } else {
//         return part.replace(regex, match => `<span class="highlight">${match}</span>`)
//       }
//     })

//     el.innerHTML = highlightedParts.join('')
//   }

//   highlightText(el.innerHTML)
// }

// // 指令内容
// const definition = {
//   mounted(el, binding) {
//     if (typeof binding.value === 'object' && binding.value.text) {
//       highlight(el, binding)
//     } else if (typeof binding.value === 'string') {
//       highlight(el, binding)
//     }
//   },
//   // 监听绑定值的变化，在值变化时重新高亮显示文本
//   updated(el, binding) {
//     if (typeof binding.value === 'object' && (binding.value.text !== binding.oldValue.text || binding.value.exclude !== binding.oldValue.exclude)) {
//       highlight(el, binding)
//     } else if (typeof binding.value === 'string' && binding.value !== binding.oldValue) {
//       highlight(el, binding)
//     }
//   },
//   // 清理工作，清除可能存在的定时器等
//   unmounted(el) {},
// }

// /**
//  * 匹配文字进行高亮显示指令
//  * @example
//  *
//  * const searchText = ref('长')
//  * const excludeTags = ref(['i'])
//  *
//  * <div v-matchTextHighlight="{ text: searchText, exclude: excludeTags }">这是一段很长的文案，其中<i>这部分不高亮</i></div>
//  *
//  * 或者
//  *
//  * <div v-matchTextHighlight="searchText">这是一段很长的文案</div>
//  */
// const matchTextHighlight = {
//   install(app, options) {
//     app.directive('matchTextHighlight', definition)
//   },
// }

// /**
//  * 导出指令
//  */
// export default matchTextHighlight

// 使用

/* <template>
  <div>
    <!-- 使用默认用法，只传入搜索文本 -->
    <div v-matchTextHighlight="searchKeyword">这是一段很长的文案，其中<i>这部分不高亮</i></div>

    <!-- 传入搜索文本和排除的标签 -->
    <div v-matchTextHighlight="{ text: searchKeyword, exclude: ['i'] }">这是一段很长的文案，其中<i>这部分不高亮</i></div>
  </div>
</template> */
