# はじめに

> このガイドは執筆調整中です

## インストール

サーバサイドレンダリングのアプリケーションを作成するためには、 `@vue/server-renderer` パッケージのインストールが必要です:

```bash
npm install @vue/server-renderer
## OR
yarn add @vue/server-renderer
```

#### 注意点

- Node.js のバージョンは 10 以上を推奨します。
- `@vue/server-renderer` と `vue` のバージョンが一致する必要があります。
- `@vue/server-renderer` はいくつかの Node.js ネイティブモジュールに依存しているため、 Node.js でのみ使用できます。将来的には他の JavaScript ランタイムで実行できるよりシンプルなビルドを提供するかもしれません。

## Vue アプリケーションのレンダリング

`createApp` で作ったクライアント専用の Vue アプリケーションとは異なり、 SSR アプリケーションは `createSSRApp` で作る必要があります:

```js
const { createSSRApp } = require('vue')

const app = createSSRApp({
  data() {
    return {
      user: 'John Doe'
    }
  },
  template: `<div>Current user is: {{ user }}</div>`
})
```

それでは、 `renderToString` 関数を使い、アプリケーションのインスタンスを文字列にレンダリングしてみます。この関数は、レンダリングされた HTML に解決される Promise を返します。

```js{2,13}
const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')

const app = createSSRApp({
  data() {
    return {
      user: 'John Doe'
    }
  },
  template: `<div>Current user is: {{ user }}</div>`
})

const appContent = await renderToString(app)
```

## サーバとの連携

アプリケーションを実行するために、この例では [Express](https://expressjs.com/) を利用します:

```bash
npm install express
## OR
yarn add express
```

```js
// server.js

const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')
const server = require('express')()

server.get('*', async (req, res) => {
  const app = createSSRApp({
    data() {
      return {
        user: 'John Doe'
      }
    },
    template: `<div>Current user is: {{ user }}</div>`
  })

  const appContent = await renderToString(app)
  const html = `
  <html>
    <body>
      <h1>My First Heading</h1>
      <div id="app">${appContent}</div>
    </body>
  </html>
  `

  res.end(html)
})

server.listen(8080)
```

この Node.js スクリプトを実行すると、 `localhost:8080` で静的な HTML ページが表示されます。しかし、このコードは _Hydrate_ ではありません: Vue はまだサーバから送られてきた静的な HTML を引き継いでいて、クライアント側のデータ変更に反応できる動的な DOM に変えていません。これについては [クライアントサイド Hydration](hydration.html) セクションで説明します。
