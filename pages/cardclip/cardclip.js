// miniprogram/pages/myCards.js
var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    collection: null,
    visit: null
  },

  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentTab: '0',
      date: util.formatDate(new Date())
    });
    this.mycollection();
    this.visited();
  },
  mycollection: function(e){
    var that = this;
    const db = wx.cloud.database();
    db.collection('collection').where({
      _openid: app.globalData.openId,
    }).get({
      success: function (s) {
        if(s.data.length>0){
          that.setData({
            collection: s.data[0].collections
          })
        }
      },
      fail: function(s){
        console.log(s)
      }
    });

  },
  visited: function(){  
    if (this.data.visit==null){
      this.getVisitData();
    }else{
      this.getVisitCount();
    }
  },
  getVisitData:function(){
    var that=this;
    const db = wx.cloud.database();
    db.collection('visit').where({
      visitedId: app.globalData.openId
    }).get({
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({ visit: res.data})
        }
      }
    })
  },
  //访问记录没办法被删除
  getVisitCount:function(){
    var that = this;
    const db = wx.cloud.database();
    db.collection('visit').orderBy('time', 'desc').where({
      visitedId: app.globalData.openId
    }).count({
      success: function (res) {
        if(that.data.visit.length<res.data.length){
          that.getVisitData();
        }
      }
    })
  },
  toCollectionPage:function(data){
    var cid=data.currentTarget.dataset.cid;
    wx.redirectTo({
      url: '/pages/shareinfo/shareinfo?shareUid=' + cid
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})