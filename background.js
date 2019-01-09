chrome.contextMenus.create({
  id: 'chrome_base64',
  // title: 'Base64 encode/decode selected text"',
  // title: 'Base64 encode/decode "%s"',
  title: '使用 Base64 加解密 "%s"',
  contexts: ['selection', 'editable'],
  onclick: function (info, tab) {
    // console.log(info, tab)
    // info.editable ?
    chrome.tabs.sendMessage(tab.id, {
      action: 'click'
    })
  }
});
