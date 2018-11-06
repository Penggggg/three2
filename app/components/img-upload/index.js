const config = require('../../config/cos/index.js');
const COS = require('../../lib/cos-v5/index.js');

// components/img-upload/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /** 最大上传数 */
    max: {
      type: Number,
      value: 9
    },
    /** 已上传列表 */
    hasBeenUploaded: {
      type: Array,
      value: [ ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /** 上传列表 */
    list: [ ],
    /** 已上传列表 */
    has: [ ],
    /** cos */
    cos: new COS({
      getAuthorization: function (params, callback) {
        var authorization = COS.getAuthorization({
          SecretId: config.SecretId,
          SecretKey: config.SecretKey,
          Method: params.Method,
          Key: params.Key
        });
        callback(authorization);
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    /** 选择文件 */
    upload: function( ) {
      const that = this;
      wx.chooseImage({
        count: that.data.max - that.data.has.length - that.data.list.length,
        sizeType: ['original'],
        success: function( res ) {
          const filePaths = res.tempFilePaths;
          filePaths.map( file => {
            const Key = file.substr(file.lastIndexOf('/') + 1);
            const Url = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`;
            that.data.cos.postObject({
              Bucket: config.Bucket,
              Region: config.Region,
              Key: Key,
              FilePath: file,
              onProgress: function (info) {
              }
            }, (err, data ) => that.upLoadSuccess(err, data, Url ));
          });
        },
      })
    },

    /** 上传成功的回调 */
    upLoadSuccess( err, data, imgUrl ) {
      const that = this;
      if (err && err.error) {
        wx.showModal({
          title: '返回错误',
          showCancel: false,
          content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode,
        });
      } else if (err) {
        wx.showModal({
          title: '请求出错',
          showCancel: false,
          content: '请求出错：' + err + '；状态码：' + err.statusCode,
        });
      } else {
        this.setData({
          list: [ ...this.data.list, imgUrl ]
        })
        wx.showToast({ title: '上传成功', icon: 'success', duration: 1500 });
        // 发送事件
        setTimeout(( ) => {
          that.triggerEvent('change', [ ...this.data.has, ...this.data.list ]);
        }, 0 );
      }
    },

    /** 删除图片 */
    deleteImg( event ) {
      const that = this;
      const { has, list } = this.data;
      const { typee, index } = event.currentTarget.dataset;
      if ( typee === 'hasBeenUploaded') {
        const temp = [ ...has ];
        temp.splice( index, 1 );
        this.setData({ has: temp });
      } else if ( typee === 'newUploaded') {
        const temp = [ ...list ];
        temp.splice( index, 1);
        this.setData({ list: temp });
      }
      setTimeout(() => {
        that.triggerEvent('change', [ ...this.data.has, ...this.data.list ]);
      }, 0);
    },

    /** 预览图片 */
    preview( event ) {
      wx.previewImage({
        current: event.currentTarget.dataset.url,
        urls: [ ...this.data.has, ...this.data.list ],
      })
    },

  },

  attached: function () {
    this.setData({
      has: [ ...this.data.hasBeenUploaded ]
    });
  }
})
