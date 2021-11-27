# 実運用への展開

::: info
以下のヒントのほとんどは、 [Vue CLI](https://cli.vuejs.org) を使っている場合、デフォルトで有効になっています。このセクションは、カスタムビルドのセットアップを使っている場合にのみ関連します。
:::

## プロダクションモードをオンにする

開発中、 Vue は一般的なエラーや落とし穴に役立つたくさんの警告を提供しています。しかし、これらの警告文は実運用では役に立たず、アプリケーションのペイロードの大きさを肥大化させてしまいます。 さらに、これらの警告チェックの中には、 [プロダクションモード](https://cli.vuejs.org/guide/mode-and-env.html#modes) では避けることのできる小さなランタイムコストがあります。

### ビルドツールなし

フルビルドを使う場合、つまりビルドツールを使わずに script タグで Vue を直接含める場合は、必ず縮小バージョン (minified version:コードが小さくされたバージョン) を本番で使ってください。これは、 [インストールガイド](/guide/installation.html#cdn) に記載されています。

### ビルドツールあり

Webpack や Browserify などのビルドツールを使う場合は、プロダクションモードは Vue のソースコード内の `process.env.NODE_ENV` で決定され、デフォルトでは開発モードになります。どちらのビルドツールも、 Vue のプロダクションモードを有効にするために、この変数を上書きする方法を提供しており、警告はビルド中に Minifier (圧縮・軽量化) によって取り除かれます。Vue CLI では事前設定されていますが、どのように行われているか知っておくことはよいでしょう:

#### Webpack

Webpack 4+ では、 `mode` オプションを使えます:

```js
module.exports = {
  mode: 'production'
}
```

#### Browserify

- 実際の `NODE_ENV` 環境変数に `"production"` を設定して、バンドルコマンドを実行してください。これは `vueify` にホットリロードや開発関連のコードを含まないように指示します。

- バンドルにグローバルな [envify](https://github.com/hughsk/envify) の変換を適用します。これにより、 Minifier は環境変数の条件ブロックに含まれた Vue のソースコードのすべての警告を取り除くことができます。例えば:

  ```bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- または、 [envify](https://github.com/hughsk/envify) を Gulp で使うと:

  ```js
  // envify のカスタムモジュールで環境変数を指定
  const envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // node_modules ファイルを処理するために必要
      { global: true },
      envify({ NODE_ENV: 'production' })
    )
    .bundle()
  ```

- または、 [envify](https://github.com/hughsk/envify) を Grunt と [grunt-browserify](https://github.com/jmreidy/grunt-browserify) で使うと:

  ```js
  // envify のカスタムモジュールで環境変数を指定
  const envify = require('envify/custom')

  browserify: {
    dist: {
      options: {
        // grunt-browserify のデフォルトの順序からはずれる関数
        configure: (b) =>
          b
            .transform('vueify')
            .transform(
              // node_modules ファイルを処理するために必要
              { global: true },
              envify({ NODE_ENV: 'production' })
            )
            .bundle()
      }
    }
  }
  ```

#### Rollup

[@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace) を使ってください:

```js
const replace = require('@rollup/plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## テンプレートのプリコンパイル

DOM 内のテンプレートや、 JavaScript 内のテンプレートリテラルを使う場合、テンプレートから Render 関数へのコンパイルは実行時に行われます。ほとんどの場合、この方法で十分な速度が得られますが、アプリケーションがパフォーマンスを重視される場合は避けたほうがよいです。

テンプレートをプリコンパイルする最も簡単な方法は、 [単一ファイルコンポーネント](/guide/single-file-component.html) を使うことです。これは関連するビルドセットアップが自動的にプリコンパイルを行います。これにより、ビルドされたコードは生のテンプレート文字列ではなく、すでにコンパイルされた Render 関数が含まれることになります。

Webpack を使っていて、 JavaScript とテンプレートファイルを分離したい場合は、 [vue-template-loader](https://github.com/ktsn/vue-template-loader) を使うと、ビルドステップでテンプレートファイルを JavaScript の Render 関数に変換することもできます。

## コンポーネントの CSS を抽出

単一ファイルコンポーネントを使う場合、コンポーネント内の CSS は JavaScript を介して `<style>` タグとして動的に差し込まれます。これにはわずかなランタイムコストがかかります。また、サーバーサイドレンダリングを使っている場合は、「瞬間的にスタイルのないコンテンツ」を引き起こします。同じファイルにすべてのコンポーネントの CSS を抽出することで、このような問題を回避して、よりよい CSS の最小化やキャッシュ化をすることができます。

その方法については、各ビルドツールのドキュメントを参照してください:

- [Webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (`vue-cli` の Webpack テンプレートには、これがあらかじめ設定されています)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://rollup-plugin-vue.vuejs.org/)

## ランタイムエラーの追跡

コンポーネントのレンダリング中にランタイムエラーが発生した場合、グローバルの `app.config.errorHandler` に設定した関数があれば、それに渡されます。Vue の [公式インテグレーション](https://sentry.io/for/vue/) を提供している [Sentry](https://sentry.io) のようなエラー追跡サービスと一緒にこのフックを活用するのはよいアイデアかもしれません。
