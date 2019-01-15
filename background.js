chrome.contextMenus.create({
  id: 'chrome_base64',
  // title: 'Base64 encode/decode selected text"',
  title: chrome.i18n.getMessage("contextMenusTitle"),
  contexts: ['selection', 'editable'],
  onclick: function (info, tab) {
    // console.log(info, tab)
    // info.editable ?
    chrome.tabs.sendMessage(tab.id, {
      action: 'click'
    })
  }
})
