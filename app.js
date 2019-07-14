//app.js
App({
  onLaunch: function () {

    wx.cloud.init({
      env: 'dev-7f01e',
      traceUser: true
    })
    //通过云函数获取openid
    this.getOpenId();

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
  },
  globalData: {
    cardInfo: null,
    userInfo: null,
    openId: null
  },
  getOpenId: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        that.globalData.openId = res.result.event.userInfo.openId
      }
    })
  },
})