# ソースコードの構造

## ステートフルなシングルトンの回避

クライアントのみのコードを書くとき、コードは毎回新しいコンテキストで評価されると考えることができます。しかし、 Node.js サーバは長時間実行されるプロセスです。コードがプロセスにはじめて要求されるとき、コードは一度評価されメモリ内にとどまります。つまり、シングルトンのオブジェクトを作成すると、すべての受信リクエストの間で共有されることになり、リクエスト間での状態の汚染リスクがあるということです。

よって、 **リクエストごとに新しいルート Vue インスタンスを作成する** 必要があります。そのためには、リクエストごとに新しいアプリケーションのインスタンスを作成する、繰り返し実行可能なファクトリ関数を書く必要があります:

```js
// app.js
const { createSSRApp } = require('vue')

function createApp() {
  return createSSRApp({
    data() {
      return {
        user: 'John Doe'
      }
    },
    template: `<div>Current user is: {{ user }}</div>`
  })
}
```

そして、サーバコードはこのようになります:

```js
// server.js
const { renderToString } = require('@vue/server-renderer')
const server = require('express')()
const { createApp } = require('src/app.js')

server.get('*', async (req, res) => {
  const app = createApp()

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

同じルールが他のインスタンス（ルータやストアなど）にも当てはまります。ルータやストアをモジュールから直接エクスポートしてアプリケーション全体にインポートするのではなく、 `createApp` で新しいインスタンスを作成して、ルート Vue インスタンスから注入する必要があります。

## ビルド手順の導入

ここまでは、同じ Vue アプリケーションをクライアントに配信する方法をまだ説明していませんでした。そのためには、 webpack で Vue アプリケーションのバンドルが必要です。

- サーバコードを webpack で処理する必要があります。例えば、 `.vue` ファイルは `vue-loader` の処理が必要で、 `file-loader` でのファイルのインポートや、 `css-loader` での CSS のインポートなど、多くの webpack 固有の機能は Node.js で直接動作しません。

- 同じように、最新の Node.js は ES2015 の機能を完全にサポートしていますが、古いブラウザではコードのトランスパイルが必要で、クライアントサイドのビルドも別に行う必要があります。

基本的な考え方は、 webpack でアプリケーションをクライアントとサーバの両方にバンドルすることです。サーバ用のバンドルは、サーバ上で静的な HTML をレンダリングするために使われ、クライアント用のバンドルは、静的なマークアップを Hydrate（ハイドレート）するためにブラウザに送信されます。

![architecture](https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png)

セットアップの詳細については後のセクションで説明しますが、ここではビルドのセットアップが完了して、 webpack を有効にした Vue アプリケーションのコードが書けるようになったと仮定してみます。

## webpack によるコード構造

サーバとクライアントの両方のアプリケーションを処理するのに webpack を使うようになったため、ソースコードの大部分はユニバーサルな方法で書くことができ、すべての webpack の機能にアクセスすることができます。同時に、 [ユニバーサルなコードを書く](./universal.html) ときに留意すべき点がいくつかあります。

簡単なプロジェクトはこのようなものです:

```bash
src
├── components
│   ├── MyUser.vue
│   └── MyTable.vue
├── App.vue
├── app.js # 共通のエントリ
├── entry-client.js # ブラウザでのみ実行
└── entry-server.js # サーバでのみ実行
```

### `app.js`

`app.js` は、アプリケーションの共通のエントリです。クライアント専用のアプリケーションでは、このファイルの中で Vue アプリケーションのインスタンスを作成して、 DOM に直接マウントします。しかし SSR では、その責務はクライアント専用のエントリファイルに移されます。代わりに `app.js` でアプリケーションのインスタンスを作成して、エクスポートします:

```js
import { createSSRApp } from 'vue'
import App from './App.vue'

// ルートコンポーネントを作成するためのファクトリ関数をエクスポート
export default function(args) {
  const app = createSSRApp(App)

  return {
    app
  }
}
```

### `entry-client.js`

クライアント用のエントリは、ルートコンポーネントのファクトリを使ってアプリケーションを作成し、 DOM にマウントします:

```js
import createApp from './app'

// クライアント固有の初回起動ロジック

const { app } = createApp({
  // ここでアプリケーションのファクトリに追加の引数を渡すことが可能
})

// これは App.vue テンプレートのルート要素に `id="app"` が前提
app.mount('#app')
```

### `entry-server.js`

サーバ用のエントリは、レンダリングごとに繰り返し呼び出される関数を default でエクスポートします。いまのところは、アプリケーションのインスタンスを返す以外の機能はありませんが、あとでサーバサイドのルートマッチングやデータのプリフェッチのロジックをここに加えます。

```js
import createApp from './app'

export default function() {
  const { app } = createApp({
    /*...*/
  })

  return {
    app
  }
}
```
