// pages/index2/index2.js
const app = getApp();
var QRcode='';
var shareImgUrl='';
Page({
 

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   
    that.setData({
      userInfo: app.globalData.userInfo,
      cardInfo: app.globalData.cardInfo
    });
    var scene = decodeURIComponent(options.scene)

    // 生成页面的二维码
    wx.request({
      //注意：下面的access_token值可以不可以直接复制使用，需要自己请求获取
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=23_9jEQlIg6hwWtZMmOYVPnahxubRVkf6vfzbStpuaPq67RFTf5dA36rrdE5YHhx-KCi_94E3OKQqkFKpvKC28nXaj5COayLqStqrnrkqHBS-Ff91BBFlWF8rHzRqt2DGpj7Qdp-GLEKzgELKUaDIYiAEAVAQ',
      data: {
        scene: '000',
        page: ""  //这里按照需求设置值和参数   
      },
      method: "POST",
      responseType: 'arraybuffer',  //设置响应类型
      success(res) {       
        QRcode = wx.arrayBufferToBase64(res.data);  //对数据进行转换操作
        
        that.setData({
          QRcode:QRcode
        })
      },
      fail(e) {
        console.log(e)
      }
    });


    //获取当前设备屏幕宽高 在onLoad生命周期里执行
      wx.getSystemInfo({
        success(res) {
          that.setData({
            deviceWidth: res.windowWidth,
            deviceHeight: res.windowHeight
          })
        }
      });
   
  },
 
  //生成图片 
  showImage: function () {
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas');
    var imgPath = '/images/sharecode/bg_code.png';
    var imgUserPath = that.data.cardInfo.headicon
    var code = "data:image/png;base64," + QRcode;
    //绘制图像到画布 x y width height
    ctx.drawImage(imgPath, 0, 0, (that.data.deviceWidth / 750) * 600, (that.data.deviceHeight / 1334) * 500);
    ctx.setFillStyle('white')
    //创建一个矩形
    ctx.fillRect(0, (that.data.deviceHeight / 1334) * 500, (that.data.deviceWidth / 750) * 600, (that.data.deviceHeight / 1334) * 350);
   
    //绘制图像到画布
    ctx.drawImage(imgUserPath, (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 530, (that.data.deviceWidth / 750) * 120, (that.data.deviceWidth / 750) * 120)

    //创建文字
    ctx.setFontSize((that.data.deviceWidth / 750) * 32)
    ctx.setFillStyle('#333333')
    //文案 x y
    ctx.fillText(that.data.cardInfo.name, (that.data.deviceWidth / 750) * 140, (that.data.deviceHeight / 1334) * 590)

    ctx.setFontSize((that.data.deviceWidth / 750) * 24)
    ctx.setFillStyle('#666666')
    ctx.fillText(that.data.cardInfo.jobInfo, (that.data.deviceWidth / 750) * 140, (that.data.deviceHeight / 1334) * 630)

    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#999999')
    ctx.fillText('扫一扫上面的二维码图案', (that.data.deviceWidth / 750) * 40, (that.data.deviceHeight / 1334) * 730)
    ctx.fillText('收藏我的名片', (that.data.deviceWidth / 750) * 40, (that.data.deviceHeight / 1334) * 760)

    //绘制图像到画布
    ctx.drawImage(code, (that.data.deviceWidth / 750) * 320, (that.data.deviceHeight / 1334) * 560, (that.data.deviceWidth / 750) * 250, (that.data.deviceWidth / 750) * 250)
    // ctx.setShadow(10 ,'rgba(153,153,153,1)')
    
    //渲染
    ctx.draw();
    this.save();
   
  
  },
   //保存图片 
  save(){
    
    //需要把canvas转成图片后才能保存
    setTimeout(() => {
    //获取临时路径
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 634,
      height: 1960,
      destWidth: 1268,  //2倍关系
      destHeight: 1960, //2倍关系
      canvasId: 'myCanvas',
      success: function (res) {
         //保存本地相册 
          wx.saveImageToPhotosAlbum({
            //shareImgSrc为canvas赋值的图片路径
            filePath: res.tempFilePath,
            success(res) {
              wx.showModal({
                title: '保存成功',
                content: '图片成功保存到相册',
                showCancel: false,
                confirmText: '确认',
                confirmColor: '#21e6c1',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    wx.redirectTo({
                      url: '/pages/index/index',
                    })
                  }else{

                  }
                },
                fail: function (res) {
                  console.log("--保存-fail----");
                }

              });
            },
            fail: function (res) {
              console.log("---fail----");
              wx.showToast({
                title: '已取消保存',
                time: 4000,
                icon: 'none'
              })
              wx.redirectTo({
                url: '/pages/sharecode/sharecode',
              })

            }
          });
        
      },
      fail: function (res) {
        console.log(res)
      }
    });
    }, 300);
  },
  codetap: function(){
    console.log("识别")
    wx.redirectTo({
      url: '/pages/index/index',
      success: function(res) {
        console.log("识别成功·")
      },
      fail: function(res) {
        console.log("识别失败")
      },
      complete: function(res) {
        console.log("识别完成")
      },
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