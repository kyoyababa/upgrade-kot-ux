chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(<number>tab.id, {}, (msg) => {
    console.log(msg);
  });
});
