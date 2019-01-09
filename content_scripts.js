chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case 'click':
      decodeEncodeSelection()
      break
    default:
      break
  }
})

// chrome.runtime.sendMessage({}, (response) => {
//   console.log(response)
// })

// https://stackoverflow.com/a/14880260
// String.prototype.replaceBetween = function (start, end, what) {
//   return this.substring(0, start) + what + this.substring(end)
// }

function replaceBetween (str, start, end, what) {
  return str.substring(0, start) + what + str.substring(end)
}

function decodeEncodeSelection () {
  const sel = window.getSelection()
  // console.log(sel)

  // 是否在同一个节点 (是否可以被替换)
  if (sel.anchorNode === sel.focusNode) {
    // 表单元素
    // 表单元素最大特点 isCollapsed === ture
    if (sel.isCollapsed) {
      try {
        // 以防意外
        var el = sel.anchorNode.childNodes[sel.extentOffset]
      } catch (error) {
        alert('获取元素错误，请重试。')
        return
      }
      if (~['TEXTAREA', 'INPUT'].indexOf(el.nodeName)) {
        const start = el.selectionStart
        const end = el.selectionEnd
        const selStr = el.value.substring(start, end)
        const rStr = Base64.decode_or_encode(selStr)
        el.value = replaceBetween(el.value, start, end, rStr)
        return
      }
    }

    // 文本元素
    if (sel.anchorNode.nodeName === '#text') {
      let start = sel.anchorOffset
      let end = sel.extentOffset
      if (end < start) {
        start = sel.extentOffset
        end = sel.anchorOffset
      }
      const selStr = sel.anchorNode.textContent.substring(start, end)
      const rStr = Base64.decode_or_encode(selStr)
      sel.anchorNode.textContent = replaceBetween(sel.anchorNode.textContent, start, end, rStr)
      return
    }
  }

  // 默认
  const selStr = sel.toString()
  const rStr = Base64.decode_or_encode(selStr)
  // const tips = (Base64.is_base64(sel_str)? '解密': '加密') + '完成'
  prompt('', rStr)
}

const Base64 = {
  decode (str) {
    return decodeURIComponent(escape(window.atob(str)))
  },
  encode (str) {
    return window.btoa(unescape(encodeURIComponent(str)))
  },
  is_base64 (str) {
    // https://github.com/miguelmota/is-base64/blob/master/is-base64.js#L15
    // var regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?';
    // return (new RegExp('^' + regex + '$', 'gi')).test(str)
    // const regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gi
    const regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/
    if (!regex.test(str)) {
      return false
    }
    try {
      this.decode(str)
    } catch (error) {
      // Malformed UTF-8 data
      return false
    }
    return true
  },
  decode_or_encode (str) {
    return this.is_base64(str) ? this.decode(str) : this.encode(str)
  }
}
