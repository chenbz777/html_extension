// export default class UserDefined

class UserDefined {

  constructor() {
  }

  get version() {

    return '1.0.0';
  }

  get docs() {

    return 'https://github.com/chenbz777/html_extension';
  }

  get router() {

    const getParameter = () => {
      const query = location.search.substring(1);
      const vars = query.split("&");

      const temp = {};

      vars.forEach(item => {
        const valueArr = item.split("=");

        temp[valueArr[0]] = valueArr[1];
      });

      return temp;
    }

    return {
      length: history.length,
      back: history.back,  // fn
      go: history.go,  // fn
      open: location.href,  // fn
      replace: location.replace,  // fn, 相当于完全重载页面,不保留前进后退
      reload: location.reload,  // fn, 重载页面,保留前进后退
      getParameter,  // fn
    }
  }

  get cookie() {

    const all = () => {
      const cookieAll = document.cookie.replace(/\s*/g, '');

      const cookieArr = cookieAll.split(";");

      const temp = {};

      cookieArr.forEach(item => {
        const valueArr = item.split("=");

        temp[valueArr[0]] = valueArr[1];
      });

      return temp;
    };

    const get = (key) => {
      if (!key) {
        return all();
      }

      const valueAll = all();

      if (valueAll[key]) {
        return valueAll[key];
      }

      return null;
    };

    const set = (key, value = '', expires) => {
      if (!key) {
        return false;
      }

      if (expires) {
        const date = new Date();
        date.setSeconds(date.getSeconds() + expires);

        document.cookie = `${key}=${value};expires=${date.toGMTString()}`;

        return true;
      }

      document.cookie = `${key}=${value}`;
      return true;
    };

    const has = (key) => {
      if (!key) {
        return false;
      }

      if (get(key)) {
        return true;
      }

      return false;
    };

    const remove = (key) => {
      if (!key) {
        return false;
      }

      const value = get(key);

      if (!value) {
        return false;
      }

      const date = new Date();
      date.setSeconds(date.getSeconds() - 1);

      document.cookie = `${key}=${value};expires=${date.toGMTString()}`;

      return true;
    };

    const setJson = (key, value, expires) => {
      set(key, JSON.stringify(value), expires);

      return true;
    };

    const getJson = (key) => {

      const value = get(key);

      if (!value) {
        return null;
      }

      return JSON.parse(value);
    };

    return {
      get,  // fn
      set,  // fn
      remove,  // fn
      has,  // fn
      setJson,  // fn
      getJson,  // fn
    }
  }

  get request() {

    const baseRequest = (config) => {
      // console.log('baseRequest', config);

      const request = new XMLHttpRequest();

      // 允许携带cookie
      // request.withCredentials = true;

      let { method = 'GET', url, header = {}, data = {}, loading = false, timeout = 6 * 1000 } = config;

      // 超时时间，单位是毫秒
      request.timeout = timeout;

      // 是否显示loading
      if (loading) {
        this.loading.show();
      }

      if (method === 'GET') {
        let tempData = '?';

        for (const key in data) {
          tempData += `${key}=${data[key]}&`;
        }

        url += tempData;
      }

      if (method === 'POST') {
        header = Object.assign({
          'Content-Type': 'application/json'
        }, header);
      }

      return new Promise((resolve, reject) => {

        // 请求完成
        request.onload = () => {

          if (request.readyState === request.DONE) {
            if (request.status === 200) {

              const response = JSON.parse(request.response);

              // console.log('请求完成: ', url);
              // console.log('响应数据: ', response);

              if (response.code !== 200) {
                reject(`响应code异常: ${response.code}/${response.msg || response.message || '请求失败'}`)
              } else {
                resolve(response);
              }

            } else {
              reject('请求错误状态码: ' + request.status)
            }
          }
        };

        // 请求超时
        request.ontimeout = (err) => {
          console.log('ontimeout: ', err);

          reject('请求超时: ' + url);
        };

        // 请求失败
        request.onerror = (err) => {
          console.log('onerror: ', err);

          reject('请求失败: ' + url);
        };

        request.open(method, url, true);

        request.onloadend = () => {
          if (loading) {
            this.loading.close();
          }
        }

        // 设置header
        for (const key in header) {
          request.setRequestHeader(key, header[key]);
        }

        // console.log('request: ', request);

        request.send(method === 'GET' ? 'null' : JSON.stringify(data));
      });
    }

    const get = (url, data, config) => {

      return baseRequest({
        method: 'GET',
        url,
        data,
        ...config,
      });
    }

    const post = (url, data, config) => {

      return baseRequest({
        method: 'POST',
        url,
        data,
        ...config,
      });
    }

    const put = (url, data, config) => {

      return baseRequest({
        method: 'PUT',
        url,
        data,
        ...config,
      });
    }

    const destroy = (url, data, config) => {

      return baseRequest({
        method: 'DELETE',
        url,
        data,
        ...config,
      });
    }

    return {
      get,  // fn
      post,  // fn
      put,  // fn
      destroy,  // fn
    };
  }

  get page() {

    const setTitle = (title) => {
      if (!title) {

        return false;
      }

      document.title = title;
    }

    const goTop = (top = 0) => {
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }

    const isMobile = () => {

      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);;
    };

    const isWx = () => {
      return /MicroMessenger/i.test(window.navigator.userAgent);
    }

    return {
      title: document.title,
      setTitle,  // fn
      ua: navigator.userAgent,
      url: document.URL,
      goTop,  // fn
      isMobile: isMobile(),
      isPc: !isMobile(),
      isWx: isWx(),
    }
  }

  get utils() {
    const copyText = (text) => {
      if (!text) {
        return false;
      }

      const input = document.createElement("input");

      input.setAttribute("value", text);

      document.body.appendChild(input);

      input.select();

      const copy = document.execCommand("copy");

      document.body.removeChild(input);

      return copy;
    }

    const getTokenValue = (oldToken) => {

      if (!oldToken) {
        return false;
      }

      try {
        const token = oldToken.replace("_", "/").replace("-", "+");

        const decodedData = window.atob(token.split(".")[1]);

        return JSON.parse(decodedData);
      } catch (e) {
        return false;
      }
    }

    // format {String} - 日期格式，例如：'yyyy-MM-dd hh:mm:ss' or 'yyyy-MM-dd' or 'hh:mm:ss'
    const formatDate = (format = 'yyyy-MM-dd hh:mm:ss', date = new Date()) => {

      const yyyy = date.getFullYear();
      const MM = (date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : `0${(date.getMonth() + 1)}`;
      const dd = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`;

      const hh = date.getHours() > 10 ? date.getHours() : `0${date.getHours()}`;
      const mm = date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`;
      const ss = date.getSeconds() > 10 ? date.getSeconds() : `0${date.getSeconds()}`;

      if (format === 'yyyy-MM-dd hh:mm:ss') {
        return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
      }

      if (format === 'yyyy-MM-dd') {
        return `${yyyy}-${MM}-${dd}`;
      }

      if (format === 'hh:mm:ss') {
        return `${hh}:${mm}:${ss}`;
      }
    };

    const getValueType = (value) => {

      let type = typeof value;

      if (type === 'object') {
        if (Array.isArray(value)) {
          return 'array';
        }

        if (value === null) {
          return 'null';
        }

        if (Array.isArray(value)) {
          return 'array';
        }
      }

      return type;
    }

    return {
      copyText,  // fn
      getTokenValue,  // fn
      formatDate,  // fn
      getValueType,  // fn
    }
  }

  get loading() {

    const show = () => {

      if (document.getElementById('ud_loading_style')) {
        return false;
      }

      const style = document.createElement('style');
      style.innerHTML = `
      .ud-loading-mask {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2000;
        width: 100vw;
        height: 100vh;
        margin: 0;
        /* background-color: rgba(122, 122, 122, 0.8); */
        background-color: rgba(0, 0, 0, 0.7);
        transition: opacity 0.3s;
  
        display: -webkit-flex;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        box-sizing: border-box;
      }
  
      .ud-loading {
        text-align: center;
      }
  
      .ud-loading__text {
        color: #409eff;
        margin: 3px 0;
        font-size: 16px;
      }
  
      .ud-loading__icon {
        display: inline-block;
      }
  
      .ud-loading__icon {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
      }
  
      .ud-loading__icon div {
        animation: ud-loading__icon 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: 40px 40px;
      }
  
      .ud-loading__icon div:after {
        content: " ";
        display: block;
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #409eff;
        margin: -4px 0 0 -4px;
      }
  
      .ud-loading__icon div:nth-child(1) {
        animation-delay: -0.036s;
      }
  
      .ud-loading__icon div:nth-child(1):after {
        top: 63px;
        left: 63px;
      }
  
      .ud-loading__icon div:nth-child(2) {
        animation-delay: -0.072s;
      }
  
      .ud-loading__icon div:nth-child(2):after {
        top: 68px;
        left: 56px;
      }
  
      .ud-loading__icon div:nth-child(3) {
        animation-delay: -0.108s;
      }
  
      .ud-loading__icon div:nth-child(3):after {
        top: 71px;
        left: 48px;
      }
  
      .ud-loading__icon div:nth-child(4) {
        animation-delay: -0.144s;
      }
  
      .ud-loading__icon div:nth-child(4):after {
        top: 72px;
        left: 40px;
      }
  
      .ud-loading__icon div:nth-child(5) {
        animation-delay: -0.18s;
      }
  
      .ud-loading__icon div:nth-child(5):after {
        top: 71px;
        left: 32px;
      }
  
      .ud-loading__icon div:nth-child(6) {
        animation-delay: -0.216s;
      }
  
      .ud-loading__icon div:nth-child(6):after {
        top: 68px;
        left: 24px;
      }
  
      .ud-loading__icon div:nth-child(7) {
        animation-delay: -0.252s;
      }
  
      .ud-loading__icon div:nth-child(7):after {
        top: 63px;
        left: 17px;
      }
  
      .ud-loading__icon div:nth-child(8) {
        animation-delay: -0.288s;
      }
  
      .ud-loading__icon div:nth-child(8):after {
        top: 56px;
        left: 12px;
      }
  
      @keyframes ud-loading__icon {
        0% {
          transform: rotate(0deg);
        }
  
        100% {
          transform: rotate(360deg);
        }
      }
      `;
      style.id = 'ud_loading_style';
      document.getElementsByTagName('head').item(0).appendChild(style);

      const div = document.createElement('div');
      div.id = 'ud_loading';
      div.className = 'ud-loading-mask';
      div.innerHTML = `
          <div class="ud-loading">

            <div class="ud-loading__icon">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>

            <div class="ud-loading__text">永远相信美好的事情 即将发生</div>
          </div>
      `;

      document.body.appendChild(div);

      document.body.style.overflowY = 'hidden';

      return true;
    }

    const close = () => {
      if (document.getElementById('ud_loading')) {
        document.body.removeChild(document.getElementById('ud_loading'));
        document.getElementsByTagName('head').item(0).removeChild(document.getElementById('ud_loading_style'));

        document.body.style.overflowY = '';

        return true;
      }

      return false;
    }

    return {
      show,  // fn
      close,  // fn
    }
  }

  get dialog() {

    const show = (data = {}, callback) => {

      if (document.getElementById('ud_dialog')) {
        document.body.removeChild(document.getElementById('ud_dialog'));
        document.getElementsByTagName('head').item(0).removeChild(document.getElementById('ud_dialog_style'));
      }

      const { title = '提示', content, confirmText = '确定', cancelText = '取消', showCancel = true } = data;

      const style = document.createElement('style');
      style.innerHTML = `
      .ud-dialog-mask {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2000;
        width: 100vw;
        height: 100vh;
        margin: 0;
        /* background-color: rgba(122, 122, 122, 0.8); */
        background-color: rgba(0, 0, 0, 0.7);
        transition: opacity 0.3s;
        letter-spacing: 1px;
  
        display: -webkit-flex;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        box-sizing: border-box;
      }
  
      .ud-dialog {
        background-color: white;
        border-radius: 8px;
        min-width: 300px;
      }
  
      .ud-dialog__body {
        padding: 15px;
        text-align: center;
      }
  
      .ud-dialog__title {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 15px;
      }
  
      .ud-dialog__content {
        font-size: 18px;
        color: #7f7f7f;
        margin-bottom: 10px;
      }
  
      .ud-dialog__footer {
        position: relative;
        border-top: 1px solid rgba(0, 0, 0, .1);
  
        display: flex;
      }
  
      .ud-dialog__footer--division {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
  
        width: 1px;
        height: 100%;
        background-color: rgba(0, 0, 0, .1);
      }
  
      .ud-dialog__footer__btn {
        flex: 1;
  
        font-size: 20px;
        text-align: center;
        font-weight: 500;
        padding: 15px;
      }
  
      .ud-dialog__footer__btn--confirm {
        color: #5a6b92;
      }
  
      .ud-dialog__footer__btn--cancel {}
      `;
      style.id = 'ud_dialog_style';
      document.getElementsByTagName('head').item(0).appendChild(style);

      const dialogMask = document.createElement('div');
      dialogMask.id = 'ud_dialog';
      dialogMask.className = 'ud-dialog-mask';

      const dialog = document.createElement('div');
      dialog.className = 'ud-dialog';

      const dialogBody = document.createElement('div');
      dialogBody.className = 'ud-dialog__body';

      const dialogTitle = document.createElement('div');
      dialogTitle.className = 'ud-dialog__title';
      dialogTitle.innerHTML = title;

      const dialogContent = document.createElement('div');
      dialogContent.className = 'ud-dialog__content';
      dialogContent.innerHTML = content;

      const dialogFooter = document.createElement('div');
      dialogFooter.className = 'ud-dialog__footer';

      const dialogFooterDivision = document.createElement('div');
      dialogFooterDivision.className = 'ud-dialog__footer--division';

      const cancelBtn = document.createElement('div');
      cancelBtn.className = 'ud-dialog__footer__btn ud-dialog__footer__btn--cancel';
      cancelBtn.innerHTML = cancelText;
      cancelBtn.onclick = () => {
        window.ud.dialog.close();

        callback?.call(this, false);
      }

      const confirmBtn = document.createElement('div');
      confirmBtn.className = 'ud-dialog__footer__btn ud-dialog__footer__btn--confirm';
      confirmBtn.innerHTML = confirmText;
      confirmBtn.onclick = () => {
        window.ud.dialog.close();

        callback?.call(this, true);
      }

      // const div = document.createElement('div');
      // div.id = 'ud_dialog';
      // div.className = 'ud-dialog-mask';
      // div.innerHTML = `
      //     <div class="ud-dialog">
      //     <div class="ud-dialog__body">
      //       <div class="ud-dialog__title">${title}</div>
      //       <div class="ud-dialog__content">${content}</div>
      //     </div>
      //     <div class="ud-dialog__footer">
      //       <div class="ud-dialog__footer__btn ud-dialog__footer__btn--cancel" onclick="${() => { console.log('取消按钮'); }}">${cancelText}</div>
      //       <div class="ud-dialog__footer--division"></div>
      //       <div class="ud-dialog__footer__btn ud-dialog__footer__btn--confirm">${confirmText}</div>
      //     </div>
      //   </div>
      // `;

      dialogMask.appendChild(dialog);

      dialog.appendChild(dialogBody);
      dialog.appendChild(dialogFooter);

      dialogBody.appendChild(dialogTitle);
      if (content) {
        dialogBody.appendChild(dialogContent);
      }


      if (showCancel) {
        dialogFooter.appendChild(cancelBtn);
        dialogFooter.appendChild(dialogFooterDivision);
      }
      dialogFooter.appendChild(confirmBtn);

      document.body.appendChild(dialogMask);

      document.body.style.overflowY = 'hidden';

      return true;
    }

    const close = () => {
      if (document.getElementById('ud_dialog')) {
        document.body.removeChild(document.getElementById('ud_dialog'));
        document.getElementsByTagName('head').item(0).removeChild(document.getElementById('ud_dialog_style'));

        document.body.style.overflowY = '';

        return true;
      }

      return false;
    }

    return {
      show,  // fn
      close,  // fn
    }
  }

  toast(text) {

    if (!text) {
      return false;
    }

    if (document.getElementById('toast')) {
      const oldDiv = document.getElementById('toast');

      clearTimeout(oldDiv.title);

      document.body.removeChild(oldDiv);
    }

    const style = ` position: fixed;
                    top: 50%;
                    left: 50%;
                    z-index: 3000;
                    display: -webkit-box;
                    display: -webkit-flex;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-sizing: content-box;
                    min-width: 88px;
                    max-width: 70%;
                    padding: 16px;
                    color: #fff;
                    font-size: 14px;
                    line-height: 20px;
                    white-space: normal;
                    text-align: center;
                    word-break: break-all;
                    background-color: rgba(0, 0, 0, 0.7);
                    border-radius: 8px;
                    transform: translate3d(-50%, -50%, 0);`;

    const div = document.createElement('div');
    div.style = style;
    div.id = 'toast';
    div.innerHTML = text;

    const timingId = setTimeout(() => {
      document.body.removeChild(div);

      clearTimeout(timingId);
    }, 2000);

    div.title = timingId;

    document.body.appendChild(div);
  }

  identification(key) {
    if (!key) {
      return false;
    }

    if (document.getElementById('identification')) {
      document.body.removeChild(document.getElementById('identification'));
    }

    const identification = document.createElement('div');
    identification.id = 'identification';
    identification.innerHTML = `
    <div class="identification"
    style="position: fixed; top: 20px; right: 10px; z-index: 9999; font-size: 20px; font-weight: 400; color: rgba(245, 247, 250, 0.01);pointer-events:none;">
    ${key}</div>
  <div class="identification"
    style="position: fixed;top: 50px;right: 10px;z-index: 9999;font-size: 20px;font-weight: 400;color: rgba(48, 49, 51, 0.01);pointer-events:none;">
    ${key}</div>
  <div class="identification"
    style="position: fixed;bottom: 20px;left: 10px;z-index: 9999;font-size: 20px;font-weight: 400;color: rgba(238, 105, 95, 0.01);pointer-events:none;">
    ${key}</div>
  <div class="identification"
    style="position: fixed; bottom: 50px;left: 10px;z-index: 9999; font-size: 20px;font-weight: 400;color: rgba(244, 190, 79, 0.01);pointer-events:none;">
    ${key}</div>
    `;

    document.body.appendChild(identification);

    return true;
  }

  log(...args) {

    try {
      let key = '';
      let value = '';

      if (args.length === 1) {
        key = 'default_key';
        value = args[0];
      }

      if (args.length > 1) {
        key = args[0];
        value = args[1];
      }

      const data = {};
      data[key] = value;

      console.log('[log]: ', data);

    } catch (err) {
      console.error('[log_error]: ', err);
    }

    console.log(...args);
  }

}

const userDefined = new UserDefined();

window.ud = userDefined;