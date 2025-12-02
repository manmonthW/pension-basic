// app.js
App({
  onLaunch() {
    // 小程序启动
    console.log('养老金计算器小程序启动');

    // 检查小程序版本
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      console.log('检查更新:', res.hasUpdate);
    });

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(function () {
      console.log('新版本下载失败');
    });
  },

  onShow() {
    console.log('小程序显示');
  },

  onHide() {
    console.log('小程序隐藏');
  },

  globalData: {
    version: '1.0.0',
    city: '北京'
  }
});
