# サーバ設定

[コードの構造](./structure.html) と [webpack の設定](./build-config.html) でも説明したとおり、 Express サーバのコードにもいくつかの変更を必要とします。

- バンドル結果のビルドした `app.js` を使ってアプリケーションを作成する必要があります。ファイルパスは、webpack マニフェストを使って見つけられます:

  ```js
  // server.js
  const path = require('path')
  const manifest = require('./dist/server/ssr-manifest.json')

  const appPath = path.join(__dirname, './dist', 'server', manifest['app.js'])
  const createApp = require(appPath).default
  ```

- すべてのアセットへ正しいパスを定義しなければなりません:

  ```js
  // server.js
  server.use(
    '/img',
    express.static(path.join(__dirname, './dist/client', 'img'))
  )
  server.use('/js', express.static(path.join(__dirname, './dist/client', 'js')))
  server.use(
    '/css',
    express.static(path.join(__dirname, './dist/client', 'css'))
  )
  server.use(
    '/favicon.ico',
    express.static(path.join(__dirname, './dist/client', 'favicon.ico'))
  )
  ```

- `index.html` のコンテンツをサーバサイドでレンダリングしたアプリケーションのコンテンツに置き換える必要があります:

  ```js
  // server.js
  const indexTemplate = fs.readFileSync(
    path.join(__dirname, '/dist/client/index.html'),
    'utf-8'
  )

  server.get('*', async (req, res) => {
    const { app } = createApp()

    const appContent = await renderToString(app)

    const html = indexTemplate
      .toString()
      .replace('<div id="app">', `<div id="app">${appContent}`)

    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  })
  ```

以下は Express サーバのすべてのコードです:

```js
const path = require('path')
const express = require('express')
const fs = require('fs')
const { renderToString } = require('@vue/server-renderer')
const manifest = require('./dist/server/ssr-manifest.json')

const server = express()

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js'])
const createApp = require(appPath).default

server.use('/img', express.static(path.join(__dirname, './dist/client', 'img')))
server.use('/js', express.static(path.join(__dirname, './dist/client', 'js')))
server.use('/css', express.static(path.join(__dirname, './dist/client', 'css')))
server.use(
  '/favicon.ico',
  express.static(path.join(__dirname, './dist/client', 'favicon.ico'))
)

server.get('*', async (req, res) => {
  const { app } = await createApp()

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

console.log('You can navigate to http://localhost:8080')

server.listen(8080)
```
