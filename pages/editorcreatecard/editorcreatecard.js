// pages/editorcreatecard/editorcreatecard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo:null,
    headicon: '/images/editorcreatecard/tx.png'//默认
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //得到用户信息
    this.getCardInfo();


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

  },
  getCardInfo:function(){
    var that=this;
    const db = wx.cloud.database()
    db.collection('cardInfo').where({
      _openid: app.globalData.openId
    }).get({
      success: function (res) {
        if(res.data.length>0){
          that.setData({ cardInfo: res.data[0],headicon:res.data[0].headicon})
        }
        
      }
    })
  },
  uploadHeadicon:function(){
    console.log("上传头像")
    this.doChooseImage();
  },
  //选择图片
  doChooseImage: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var path = res.tempFilePaths[0];
        that.setData({ headicon:path})
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  //上传图片
  doUpload: function () {
    var that = this;
    var headicon=that.data.headicon;
    var cloudPath = that.getUUID() + headicon.match(/\.[^.]+?$/)[0];
    return wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: headicon
    }).then(res=>{
      var fileID = res.fileID;
      that.setData({ headicon: fileID })
      return res;
    })
  },
  getUUID: function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);

    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  },
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;
    if (that.data.cardInfo==null||that.data.headicon != that.data.cardInfo.headicon){
      that.doUpload().then(res=>{
        that.setFormData(data);
      });
    }else{
      this.setFormData(data);
    }
  },
  setFormData:function(data){
    var that = this;
    var tempCardInfo = {
      name: data.name,
      jobInfo: data.jobInfo,
      headicon: that.data.headicon,//单独取
      company: data.company,
      address: data.address,
      mobilephone: data.mobilephone,
      email: data.email,
      url: data.url,
      weixin: data.weixin,
      telephone: data.telephone,
      business: data.business,
      cardType: 1 //默认
    }
    if (that.data.cardInfo == null) {//创建    
      //添加操作
      that.addCard(tempCardInfo)

    } else {//编辑
      //更新操作
      tempCardInfo.cardType = that.data.cardInfo.cardType;//卡片类型
      that.updateCard(tempCardInfo, that.data.cardInfo._id)
    }
  },
  //创建名片
  addCard: function (tempCardInfo){
    const db = wx.cloud.database()
    db.collection('cardInfo').add({
      data: tempCardInfo,
      success: function (res) {
        wx.showToast({
          title: '创建成功',
          icon: 'none'
        })
        app.globalData.cardInfo = tempCardInfo;
        wx.redirectTo({
          url: '/pages/index/index'
        })
      },
      fail: function () {
        console.error
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  },
  //更新名片
  updateCard: function (tempCardInfo,cardId){
    const db = wx.cloud.database()
    db.collection('cardInfo').doc(cardId).update({
      data: tempCardInfo,
      success: function(res){
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
        app.globalData.cardInfo = tempCardInfo;
        wx.redirectTo({
          url: '/pages/index/index'
        })
      },
      fail: function(){
        console.error
        wx.showToast({
          title: '修改失败',
          icon: 'none'
        })
      }
    })
   
  }
})