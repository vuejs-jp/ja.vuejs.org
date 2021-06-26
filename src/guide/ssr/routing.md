# ルーティングとコード分割

## `vue-router` によるルーティング

ここまでのサーバコードで、任意の URL を受け付ける `*` ハンドラを使っていることに気づいたかもしれません。これにより訪問した URL を Vue アプリケーションに渡すことができ、クライアントとサーバの両方で同じルーティング設定を再利用することができます！

この目的のためには、公式の [vue-router](https://github.com/vuejs/vue-router-next) ライブラリを使うことをお勧めします。まず、ルータを作るためのファイルを作成します。アプリケーションのインスタンスと同様に、リクエストごとに新しいルータのインスタンスが必要なので、このファイルでは `createRouter` 関数をエクスポートします:

```js
// router.js
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import MyUser from './components/MyUser.vue'

const isServer = typeof window === 'undefined'

const history = isServer ? createMemoryHistory() : createWebHistory()

const routes = [{ path: '/user', component: MyUser }]

export default function() {
  return createRouter({ routes, history })
}
```

そして `app.js` と、クライアントとサーバのエントリを更新します:

```js
// app.js
import { createSSRApp } from 'vue'
import App from './App.vue'
import createRouter from './router'

export default function(args) {
  const app = createSSRApp(App)
  const router = createRouter()

  app.use(router)

  return {
    app,
    router
  }
}
```

```js
// entry-client.js
const { app, router } = createApp({
  /*...*/
})
```

```js
// entry-server.js
const { app, router } = createApp({
  /*...*/
})
```

## コード分割

コード分割、またはアプリの一部を遅延読み込みすることは、初期レンダリングのためにブラウザがダウンロードしなければならないアセットのサイズを減らすことができ、大きなバンドルを持つアプリケーションの TTI (time-to-interactive) を大幅に改善できます。重要なのは初期画面で 「必要なものだけ読み込む」ことです。

Vue Router は、 [遅延読み込みのサポート](https://next.router.vuejs.org/guide/advanced/lazy-loading.html) を提供しており、 [webpack がその時点でコード分割すること](https://webpack.js.org/guides/code-splitting-async/) を可能にしています。必要なのは:

```js
// これを変更して
import MyUser from './components/MyUser.vue'
const routes = [{ path: '/user', component: MyUser }]

// このようにします:
const routes = [
  { path: '/user', component: () => import('./components/MyUser.vue') }
]
```

クライアントとサーバのどちらでも、コンポーネント内のフックを適切に呼び出すために、ルータが非同期のルートコンポーネントを事前に解決するのを待つ必要があります。このため、 [router.isReady](https://next.router.vuejs.org/api/#isready) メソッドでクライアントのエントリを更新しましょう:

```js
// entry-client.js
import createApp from './app'

const { app, router } = createApp({
  /* ... */
})

router.isReady().then(() => {
  app.mount('#app')
})
```

また、 `server.js` スクリプトを更新する必要があります:

```js
// server.js
const path = require('path')

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js'])
const createApp = require(appPath).default

server.get('*', async (req, res) => {
  const { app, router } = createApp()

  await router.push(req.url)
  await router.isReady()

  const appContent = await renderToString(app)

  fs.readFile(path.join(__dirname, '/dist/client/index.html'), (err, html) => {
    if (err) {
      throw err
    }

    html = html
      .toString()
      .replace('<div id="app">', `<div id="app">${appContent}`)
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  })
})
```
