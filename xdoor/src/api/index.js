let WM = {};

/**
 * 配置参数
 * */
WM.config = {
  domain: "xlock.moozun.com",
  // servletUrl: "http://xlock.moozun.com/api/",
  servletUrl: "api/",
  // servletUrl: "http://192.168.1.12:13010/api/",
  qiniuUrl: "http://dev.pic.moozun.com/",
};

/**
 * ajax封装
 * */
WM.ajaxRequest = function (url, data, arrCallback, callback, async, type) {
  if (!type) {
    type = 'post'
  }

  $.ajax({
    type: type,
    url: url,
    data: data,
    async: async ? false : true,
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    // headers: {
    //   "platform": 3,
    //   "app": 2
    // },
    success: function (response) {
      console.log(url);
      console.log(data);
      console.log(response);

      if (response.code == 1001) {
        // delCookie('adminId');
        delCookie('token');
        callback && callback('no');
      } else {
        arrCallback && arrCallback(response);
      }
    }, error: function (e) {
      console.log("error status:" + e.status);
      let status = e.status;
      if (status == 400 || status == 500 || status == 404 || status == 504 || status == 405) {
        alert('服务器开小差啦，请稍后再试！');
      }
    }
  });
};

export default {
  ajax: function (url, data, arrCallback, callback, config, type) {

    if (config) {
      if (config.ajaxAsync) {
        WM.ajaxRequest(WM.config.servletUrl + url, data, arrCallback, callback, true, type);
      }
      if (config.needToken) {
        // WM.ajaxRequest(WM.config.servletUrl + url, data, arrCallback, callback, false, type);

        let token = getCookie('token');
        if (token) {
          data.token = token;
          WM.ajaxRequest(WM.config.servletUrl + url, data, arrCallback, callback, false, type);
        } else {
          callback && callback('no');
        }
      }
    } else {
      WM.ajaxRequest(WM.config.servletUrl + url, data, arrCallback, callback, false, type);
    }
  },
  qiniuUrl: function () {
    return WM.config.qiniuUrl;
  }
}

/**
 * 取cookie  getCookie(cookie名)
 */
function getCookie(name) {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

/**
 * 设置cookie  setCookie(cookie名,要存的内容,时间)
 */
function setCookie(c_name, value, expiredays) {
  let exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

/**
 * 删除cookie  delCookie(cookie名)
 */
function delCookie(name) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
