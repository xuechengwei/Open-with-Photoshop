function clickHandler (info) {
    // chrome.extension.getBackgroundPage().console.log(info.srcUrl);
    chrome.runtime.sendNativeMessage('com.lvye.openwithphotoshop', {src: info.srcUrl});
}
chrome.contextMenus.create({
    "title": "Open with photoshop",
    "contexts": ["image"],
    "onclick": clickHandler
})
