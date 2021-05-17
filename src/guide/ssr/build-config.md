# ビルド設定

SSR プロジェクトの webpack 設定は、クライアント用のプロジェクトと似ています。 webpack の設定に慣れていなければ、 [Vue CLI](https://cli.vuejs.org/guide/webpack.html#working-with-webpack) や [Vue Loader の手動設定](https://vue-loader.vuejs.org/guide/#manual-setup) のドキュメントに詳しい情報があります。

## クライアント用ビルドとの主な相違点

1. サーバサイドのコード用に [webpack マニフェスト](https://webpack.js.org/concepts/manifest/) を作成する必要があります。これは、すべてのモジュールが出力されたバンドルにどのようにマッピングされるかを追跡するため、 webpack が保持している JSON ファイルです。

2. [アプリケーションの依存関係を外部化](https://webpack.js.org/configuration/externals/) するべきです。これにより、サーバのビルドがずっと速くなり、バンドルしたファイルサイズも小さくなります。このとき、 webpack で処理する必要のある依存関係（`.css` や `.vue` ファイルなど）を除外する必要があります。

3. webpack の [target](https://webpack.js.org/concepts/targets/) を Node.js に変更する必要があります。これによって、 webpack は Node に適した方法で動的インポートを扱うことができ、また `vue-loader` に Vue コンポーネントをコンパイルするとき、サーバ向けのコードを出力するように指定できます。

4. サーバエントリをビルドする際には、 SSR で動作することを示す環境変数を定義する必要があります。プロジェクトの `package.json` にいくつか `scripts` を追加すると便利かもしれません:

```json
"scripts": {
  "build:client": "vue-cli-service build --dest dist/client",
  "build:server": "SSR=1 vue-cli-service build --dest dist/server",
  "build": "npm run build:client && npm run build:server",
}
```

## 設定例

以下は Vue CLI プロジェクトに SSR を追加する `vue.config.js` の例ですが、どのような webpack ビルドにも対応できます。

```js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
  chainWebpack: webpackConfig => {
    // cache-loader の無効化が必要です。そうしないと、クライアントのビルドはサーバのビルドから
    // キャッシュされたコンポーネントを使ってしまいます。
    webpackConfig.module.rule('vue').uses.delete('cache-loader')
    webpackConfig.module.rule('js').uses.delete('cache-loader')
    webpackConfig.module.rule('ts').uses.delete('cache-loader')
    webpackConfig.module.rule('tsx').uses.delete('cache-loader')

    if (!process.env.SSR) {
      // クライアント用エントリファイルの基点
      webpackConfig
        .entry('app')
        .clear()
        .add('./src/entry-client.js')
      return
    }

    // サーバ用エントリファイルの基点
    webpackConfig
      .entry('app')
      .clear()
      .add('./src/entry-server.js')

    // これにより webpack は Node に適した方法で動的インポートを扱うことができ、
    // Vue コンポーネントをコンパイルするときに、
    // サーバ向けのコードを発行するように 'vue-loader' に指示します。
    webpackConfig.target('node')
    // これは Node スタイルのエクスポートを使うようにサーバ用のバンドルに指示します。
    webpackConfig.output.libraryTarget('commonjs2')

    webpackConfig
      .plugin('manifest')
      .use(new WebpackManifestPlugin({ fileName: 'ssr-manifest.json' }))

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // アプリケーションの依存関係を外部化します。
    // これによりサーバでのビルドがずっと速くなり、バンドルしたファイルのサイズも小さくなります。

    // webpack で処理する必要がある依存関係を外部化しないでください。
    // また `global` を変更する依存を許可リスト化する必要があります（Polyfill など）
    webpackConfig.externals(nodeExternals({ allowlist: /\.(css|vue)$/ }))

    webpackConfig.optimization.splitChunks(false).minimize(false)

    webpackConfig.plugins.delete('preload')
    webpackConfig.plugins.delete('prefetch')
    webpackConfig.plugins.delete('progress')
    webpackConfig.plugins.delete('friendly-errors')

    webpackConfig.plugin('limit').use(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    )
  }
}
```

## Externals の注意点

`externals` オプションでは、 CSS ファイルを許可リスト化していることに気づいてください。これは依存関係にあるファイルからインポートされた CSS は、 webpack によって処理されるべきだからです。もし webpack に依存する他の種類のファイル（`*.vue` や `*.sass` など）をインポートしているなら、同じように許可リストへ追加する必要があります。

`runInNewContext: 'once'` や `runInNewContext: true` を使っている場合、 `global` を変更する Polyfill、例えば `babel-polyfill` を許可リストに登録する必要があります。これは New Context モードを使っている場合に **サーバ用のバンドル内のコードは独自の `global` オブジェクト** を持っているからです。サーバ上ではまったく必要ないため、 実際はクライアントのエントリでインポートするほうが簡単です。

## `clientManifest` の生成

サーバ用のバンドルに加えて、クライアント用のビルドマニフェストも生成できます。クライアント用マニフェストとサーバ用バンドルによって、レンダラーは _サーバとクライアント両方の_ ビルドの情報を持つことになります。これによりレンダリングされた HTML に [preload / prefetch ディレクティブ](https://css-tricks.com/prefetching-preloading-prebrowsing/)、 `<link>`、 `<script>` タグを自動的に推測して注入することができます。

利点は 2 つあります:

1. 生成されたファイル名にハッシュがある場合、正しいアセットの URL を注入するため、 `html-webpack-plugin` を置き換えることができます。

2. webpack のオンデマンドなコード分割機能を活用したバンドルをレンダリングするときに、最適なチャンクがプリロード・プリフェッチされるようにします。また、必要な非同期チャンクに対しては賢く `<script>` タグを注入することで、クライアントでのウォーターフォールリクエストを回避し、 TTI (time-to-interactive) を向上させることができます。
