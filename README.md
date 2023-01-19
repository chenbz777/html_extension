# user_defined文档



## 引入

```html
<script src="http://127.0.0.1:5500/user_defined.js"></script>
```



## 使用

**对象挂载在window下，使用`window.ud`访问**

### 版本号

```js
window.ud.version  // 1.0.0
```



### 路由

```js
// 历史记录数
window.ud.router.length  // 1

// 返回上一页
window.ud.router.back(-1)

// 返回上一页
window.ud.router.go(-1)

// 打开新的链接
window.ud.router.open()

// 相当于完全重载页面,不保留前进后退
window.ud.router.replace()

// 重载页面,保留前进后退
window.ud.router.reload()

// 地址栏参数
window.ud.router.parameter
```



### cookie

```js
// 获取全部cookie
window.ud.cookie.get()

// 获取指定cookie
window.ud.cookie.get('key')

// 设置cookie
window.ud.cookie.set('key', 'value')

// 删除cookie
window.ud.cookie.remove('key')

// 判断cookie是否存在
window.ud.cookie.has('key')

// 设置JSON类型数据
window.ud.cookie.setJson('key')

// 获取JSON类型数据
window.ud.cookie.getJson('key')
```



### 请求

```js
// get
window.ud.request.get('url', 'data', 'header')

// post
window.ud.request.post('url', 'data', 'header')

// put
window.ud.request.put('url', 'data', 'header')

// delete
window.ud.request.destroy('url', 'data', 'header')
```

> ##### 注意
>
> 默认不携带cookie



### 页面

```js
// 获取页面标题
window.ud.page.getTitle

// 设置页面标题
window.ud.page.setTitle('title')

// 获取页面ua
window.ud.page.ua

// 获取页面完整url
window.ud.page.url

// 返回顶部
window.ud.page.goTop(0)

// 是否移动端
window.ud.page.isMobile

// 是否pc端
window.ud.page.isPc

// 是否在微信浏览器下
window.ud.page.isWx
```



### 工具

```js
// 复制文本
window.ud.utils.copyText('复制文本')
```



### loading

```js
// 显示loading
window.ud.loading.show()

// 关闭loading
window.ud.loading.close()
```



### 对话框

```js
// 显示对话框
const dialogData = {
  title: '提示',
  content: '提示内容',
  showCancel: true,
}

window.ud.dialog.show(dialogData, (res) => {
  console.log('对话框回调', res);
});

// 关闭loading
window.ud.dialog.close()
```



### 标识

```js
window.ud.identification('openid')
```

> 根据图片，在截图右上角，打开ps，调整曲线，即可看到对应的文字