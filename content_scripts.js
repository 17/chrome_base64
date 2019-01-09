chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    case 'click':
      decode_or_encode_selection()
      break;
    default:
      break;
  }
})

// chrome.runtime.sendMessage({}, (response) => {
//   console.log(response)
// })

// https://stackoverflow.com/a/14880260
String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
}

function decode_or_encode_selection() {
  const sel = window.getSelection()
  console.log(sel)
  if (sel.anchorNode == sel.focusNode) {
    // 是否在同一个节点
    if (sel.isCollapsed) {
      let el
      // 表单元素最大特点 isCollapsed === ture
      try {
        // 以防意外
        el = sel.anchorNode.childNodes[sel.extentOffset]
      } catch (e) {
        alert('获取元素错误')
        return
      }
      // console.log(el.nodeName, ~['TEXTAREA', 'INPUT'].indexOf(el.nodeName))
      if (~['TEXTAREA', 'INPUT'].indexOf(el.nodeName)) {
        const start = el.selectionStart
        const end = el.selectionEnd
        const sel_str = el.value.substring(start, end)
        const r_str = is_base64(sel_str)? decodeURIComponent(escape(window.atob(sel_str))): window.btoa(unescape(encodeURIComponent(sel_str)))
        el.value = el.value.replaceBetween(start, end, r_str)
        return
      }
      alert('暂不支持此元素')
    } else {
      if (sel.anchorNode.nodeName == '#text') {
        let start = sel.anchorOffset
        let end = sel.extentOffset
        if (end < start) {
          start = sel.extentOffset
          end = sel.anchorOffset
        }
        const sel_str = sel.anchorNode.textContent.substring(start, end)
        const r_str = is_base64(sel_str)? decodeURIComponent(escape(window.atob(sel_str))): window.btoa(unescape(encodeURIComponent(sel_str)))
        sel.anchorNode.textContent = sel.anchorNode.textContent.replaceBetween(start, end, r_str)
        return
      }
      alert('暂不支持此元素')
    }
  } else {
    alert('暂不支持跨多个元素转换')
  }
}


function is_base64(str) {
  // https://github.com/miguelmota/is-base64/blob/master/is-base64.js#L15
  var regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?'
  // return (new RegExp('^' + regex + '$', 'gi')).test(str)
  if (!(new RegExp('^' + regex + '$', 'gi')).test(str)) {
    return false
  }
  try {
    decodeURIComponent(escape(window.atob(str)))
  } catch (error) {
    // Malformed UTF-8 data
    return false
  }
  return true
  // try {
  //   decode_str = window.atob(str)
  // } catch(e) {
  //   return [false, '']
  // }
  // return [true, decode_str]
}