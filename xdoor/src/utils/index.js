export default {
  /**
   * 获取cookie
   * */
  getCookie: function (name) {
    let arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if (arr = document.cookie.match(reg))
      return (arr[2]);
    else
      return null;
  },

  /**
   * 存cookie
   * */
  setCookie: function (c_name, value, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  },

  /**
   * 删除cookie
   * */
  delCookie: function (name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = this.getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  },


  /**
   * 日期转时间戳
   * */
  get_unix_time: function (dateStr, type) {
    var newstr = dateStr.replace(/-/g, '/');
    var date = new Date(newstr);
    var time_str = date.getTime().toString();
    if (type == 1) {
      return time_str.substr(0, 13);
    } else if (type == 2) {
      return time_str.substr(0, 7);
    } else {
      return time_str.substr(0, 13);
    }

  },

  /**
   * 时间戳转日期
   * */
  formatDate: function (now, type) {
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    if (date.toString().length == 1) {
      date = "0" + date;
    }
    let hour = now.getHours();
    if (hour.toString().length == 1) {
      hour = "0" + hour;
    }
    let minute = now.getMinutes();
    if (minute.toString().length == 1) {
      minute = "0" + minute;
    }
    let second = now.getSeconds();
    if (second.toString().length == 1) {
      second = "0" + second;
    }
    if (type == 1) {
      return year + "/" + month + "/" + date + " " + hour + ':' + minute + ":" + second;
    } else if (type == 2) {
      return year + "/" + month + "/" + date;
    } else if (type == 3) {
      return year + "/" + month;
    } else if (type == 4) {
      return year;
    } else {
      return year + "/" + month + "/" + date + " " + hour + ':' + minute + ":" + second;
    }

  },

  /**
   * 获取url参数
   * */
  getQueryString: function (parameter, context) {
    let query = context || location.href;
    let regExp = new RegExp("[?&]" + parameter + "=([^?&]+)([?&].*)?$");
    return regExp.test(query) ? RegExp.$1 : null;
  },

  /**
   * 是否整数
   * */
  isInteger: function (obj) {
    return obj % 1 === 0
  },
  /**
   * 是否正整数
   * */
  isPositiveInteger: function (s) {
    let re = /^[0-9]+$/;
    return re.test(s)
  },
  /**
   * 验证手机号
   * */
  isPhone: function (number) {
    let phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    return phoneReg.test(number);
  },

  /**
   * 计算日期之间相差天数
   * */
  // getDateDiff: function (startDate, endDate) {
  //   let startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
  //   let endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
  //   let dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
  //   return dates;
  // },

  getDateDiff: function (startDate, endDate) {
    let startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    let endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    let dates = (startTime - endTime) / (1000 * 60 * 60 * 24);
    return dates;
  },

  getDateMonthDiff: function (date1, date2) {
    // 拆分年月日
    date1 = date1.split('-');
    // 得到月数
    date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
    // 拆分年月日
    date2 = date2.split('-');
    // 得到月数
    date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
    let m = Math.abs(date1 - date2);
    return m;
  },
  isNumber: function (val) {
    let regPos = /^\d+(\.\d+)?$/; //非负浮点数
    let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    } else {
      return false;
    }

  },
  doPrint: function () {
    let bdhtml = window.document.body.innerHTML;
    let sprnstr = "<!--startprint-->";
    let eprnstr = "<!--endprint-->";
    let prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
    prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
    window.document.body.innerHTML = prnhtml;
    window.print();
  },

  getWeek: function (i) {
    let now = new Date();
    let firstDay = new Date(now - (now.getDay() - 1) * 86400000);
    firstDay.setDate(firstDay.getDate() + i);
    let mon = Number(firstDay.getMonth()) + 1;
    return now.getFullYear() + "/" + mon + "/" + firstDay.getDate();
  },
  dateAdd: function (interval, number, date) {
//     // 加五天.
//     var newDate = DateAdd("d ", 5, now);
//     alert(newDate.toLocaleDateString())
// // 加两个月.
//     newDate = DateAdd("m ", 2, now);
//     alert(newDate.toLocaleDateString())
// // 加一年
//     newDate = DateAdd("y ", 1, now);
//     alert(newDate.toLocaleDateString())
    switch (interval) {
      case "y": {
        date.setFullYear(date.getFullYear() + number);
        return date;
        break;
      }
      case "q": {
        date.setMonth(date.getMonth() + number * 3);
        return date;
        break;
      }
      case "m": {
        date.setMonth(date.getMonth() + number);
        return date;
        break;
      }
      case "w": {
        date.setDate(date.getDate() + number * 7);
        return date;
        break;
      }
      case "d": {
        date.setDate(date.getDate() + number);
        return date;
        break;
      }
      case "-d": {
        date.setDate(date.getDate() - number);
        return date;
        break;
      }

      default: {
        date.setDate(date.getDate() + number);
        return date;
        break;
      }
    }
  }
}

