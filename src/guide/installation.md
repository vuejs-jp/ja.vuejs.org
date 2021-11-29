# インストール

Vue.js は、段階的に導入できるように設計されています。これは要件に応じて、複数の方法でプロジェクトに組み込むことができることを意味します。

Vue.js をプロジェクトに追加するには主に 4 つの方法があります:

1. ページ上で [CDN パッケージ](#cdn) として取り込む
2. JavaScript ファイルをダウンロードして、 [自分でホストする](#自分でホストする)
3. [npm](#npm) を使ってインストールする
4. 公式の [CLI](#cli) を使ってプロジェクトの基礎を作る。これはモダンなフロントエンドのワークフローのためのバッテリー同梱のようなビルドセットアップを提供します (例えば、ホットリロード、保存時に Lint など)

## リリースノート

最新のバージョン: ![npm](https://img.shields.io/npm/v/vue/next.svg)

各バージョンの詳細なリリースノートは、 [GitHub](https://github.com/vuejs/vue-next/blob/master/CHANGELOG.md) で入手できます。

## Vue Devtools

> 現在ベータ版 - Vuex と Router の統合は WIP です

<VideoLesson href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3?friend=vuejs" title="Learn how to install Vue Devtools on Vue School">Learn how to install and use Vue Devtools in a free Vue School lesson</VideoLesson>

Vue を使用する場合は、ブラウザに [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) をインストールすることをおすすめします。これにより、Vue アプリケーションをよりユーザーフレンドリーなインターフェースで調査、デバッグすることが可能になります。

[Chrome 拡張版を入手](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg)

[Firefox アドオン版を入手](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

[スタンドアロンの Electron アプリケーション版を入手](https://github.com/vuejs/vue-devtools/blob/dev/packages/shell-electron/README.md)

## CDN

プロトタイピングや学習を目的とする場合は、以下のようにして最新バージョンを利用できます:

```html
<script src="https://unpkg.com/vue@next"></script>
```

本番環境では、新しいバージョンによる意図しない不具合を避けるため、特定のバージョン番号とビルド番号にリンクすることをおすすめします。

## 自分でホストする

ビルドツールの使用を避けたいが、本番環境で CDN を使用できない場合は、関連する `.js` ファイルをダウンロードして、自分のウェブサーバを使ってホストすることができます。CDN の場合と同じように `<script>` タグを使って導入することができます。

ファイルは [unpkg](https://unpkg.com/browse/vue@next/dist/) や [jsDelivr](https://cdn.jsdelivr.net/npm/vue@next/dist/) などの CDN から閲覧、ダウンロードすることができます。様々な異なるファイルは [後で説明しますが](#さまざまなビルドについて) 、通常は開発用のビルドと本番用のビルドの両方をダウンロードすることになります。

## npm

Vue による大規模アプリケーションを構築するときには、npm を利用したインストールを推奨します。[webpack](https://webpack.js.org/) または [Rollup](https://rollupjs.org/) のようなモジュールバンドラーとうまく組み合わせることができます。

```bash
# 最新安定版
$ npm install vue@next
```

Vue は [単一ファイルコンポーネント](../guide/single-file-component.html)（SFCs）を作成するための、付随するツールも提供しています。単一ファイルコンポーネントを使いたい場合は、`@vue/compiler-sfc` もインストールする必要があります:

```bash
$ npm install -D @vue/compiler-sfc
```

Vue 2 を使っている場合は、`@vue/compiler-sfc` が `vue-template-compiler` を置き換えることに注意してください。

また、`@vue/compiler-sfc` に加えて、選択したバンドラに適した単一ファイルコンポーネントローダーやプラグインも必要です。詳しくは [単一ファイルコンポーネントドキュメント](../guide/single-file-component.html) を参照してください。

ほとんどの場合、最小限の設定で webpack のビルドを作成するには、 Vue CLI を利用するのがよいでしょう。

## CLI

大規模なシングルページアプリケーション開発の足場を素早く組むために、Vue は [公式 CLI](https://cli.vuejs.org/) を提供します。この CLI にはモダンなフロントエンドワークフローのための、すぐに使えるビルド設定を用意しています。ホットリロード、保存時のリント、本番リリースのビルドができるようになるまでには、ほんの数分しかかかりません。

::: tip
CLI は Node.js と関連するビルドツールに関する予備知識を前提としています。もし、Vue またはフロントエンドビルドツールを初めて使用する場合は、CLI を使用する前に、ビルドツールなしで [ガイド](./introduction.html) を参照することを強くおすすめします。
:::

`npm` 上で `@vue/cli` として、Vue 3 向けの Vue CLI v4.5 が利用可能です。以前のバージョンからアップグレードする場合は、以下のように `@vue/cli` をグローバルに再インストールしてください:

```bash
yarn global add @vue/cli
# または
npm install -g @vue/cli
```

その後、Vue プロジェクト内で以下を実行します

```bash
vue upgrade --next
```

## Vite

[Vite](https://vitejs.dev/) はネイティブ ES Module の import の仕組みを利用して、超高速なコード配信を可能としたウェブ開発ビルドツールです。

次のコマンドをターミナルで実行すると Vite ですぐに Vue プロジェクトをセットアップできます。

npm の場合:

```bash
# npm 6.x
$ npm init vite@latest <プロジェクト名> --template vue

# npm 7+, extra double-dash is needed:
$ npm init vite@latest <プロジェクト名> -- --template vue

$ cd <プロジェクト名>
$ npm install
$ npm run dev
```

または Yarn の場合:

```bash
$ yarn create vite <プロジェクト名> --template vue
$ cd <プロジェクト名>
$ yarn
$ yarn dev
```

## さまざまなビルドについて

[npm パッケージの `dist/` ディレクトリ](https://cdn.jsdelivr.net/npm/vue@3.0.2/dist/) には、Vue.js の多くのさまざまなビルドが見つかります。利用用途ごとに `dist` ファイルの使い分けの概要を説明します。

### CDN を利用、またはバンドラーを使用しない場合

#### `vue(.runtime).global(.prod).js`:

- ブラウザで直接 `<script src="...">` と読み込むためのビルドです。 Vue がグローバルに公開されます。
- ブラウザによるテンプレートのコンパイルについて:

  - `vue.global.js` は、コンパイラとランタイムの両方が含まれた "完全な" ビルドです。そのまますぐにテンプレートをコンパイルすることができます。
  - `vue.runtime.global.js` はランタイムのみ含まれています。そのため、ビルド時にテンプレートの事前コンパイルが必要です。

- すべての Vue コアの内部パッケージが含まれます - すなわち、他のファイルに依存しない単一のファイルです。つまりコードの同じインスタンスを参照するためには、すべてをこのファイルからインポートしなくてはいけません。
- 本番/開発向けコードがどちらもハードコードされています。本番ビルドは事前に縮小化(minify)されたファイルです。本番環境では `*.prod.js` ファイルを使用してください。

:::tip Note
グローバルビルドは [UMD](https://github.com/umdjs/umd) ビルドではありません。`<script src="...">` で直接使用するため、 [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) にビルドされています。
:::

#### `vue(.runtime).esm-browser(.prod).js`:

- `<script type="module">` のようにして、ブラウザで利用するネイティブ ES modules インポート向けビルドです。
- ランタイムのコンパイルと、依存パッケージのインライン化、ハードコードされた本番/開発向けコードの動作は、グローバルビルドと同様です。

### バンドラーを使う場合

#### `vue(.runtime).esm-bundler.js`:

- `webpack` や `rollup`、 `parcel` のようなバンドラー向けのビルドです。
- 本番/開発向けコードは `process.env.NODE_ENV ガード` で処理されます (バンドラーによって置換されます)
- 縮小化(minified)ビルドではありません (縮小化は、他コードと共にバンドル処理後に行われます)
- 依存パッケージのインポートについて (例えば、 `@vue/runtime-core`、 `@vue/runtime-compiler`)
  - インポートされる依存パッケージは同様に ESM バンドラービルドになっていて、続いて自身の依存パッケージをインポートします(例えば、 `@vue/runtime-core` は `@vue/reactivity` をインポートします)
  - これはつまり、依存パッケージ間で異なるインスタンスを参照することなく、ひとつひとつの依存パッケージをインストールし、インポートすることが可能ということです。ただし、全てのパッケージが同じバージョンに解決されるようにしなくてはいけません。
- ブラウザによるテンプレートのコンパイルについて:
  - `vue.runtime.esm-bundler.js` **(デフォルト)** はランタイムのみで、すべてのテンプレートの事前コンパイルが必要です。一般に、バンドラー使用時にはテンプレートは事前コンパイルされるため(例えば、`*.vue` ファイル内のテンプレート)、 このファイルはバンドラーにとってデフォルトのエントリになります(`package.json` の module フィールド経由)
  - `vue.esm-bundler.js`: ランタイムのコンパイラを含みます。もし、バンドラーを使用しながらも、ランタイムによるテンプレートのコンパイルが必要な場合(例えば、DOM 内テンプレート、またはインライン化された JavaScript 文字列としてのテンプレート)に使用します。vue をこのファイルにエイリアスするよう、バンドラーを設定する必要があります。

### サーバーサイドレンダリング

#### `vue.cjs(.prod).js`:

- `require()` を使って、Node.js でサーバサイドレンダリングするためのビルドです。
- もし `target: 'node'` 設定で webpack を使ってアプリケーションをバンドルして、`vue` を適切に外部化しているなら、このビルドが読み込まれるでしょう。
- 開発/本番向けのファイルは事前ビルドされていますが、`process.env.NODE_ENV` に基づいて適切なファイルが require されます。

## ランタイム + コンパイラとランタイム限定の違い

もし、クライアントでテンプレートをコンパイルする必要がある(例えば、template オプションに文字列を渡す、または DOM 内の HTML をテンプレートとして要素にマウントする)場合は、コンパイラ、すなわち完全ビルドが必要です:

```js
// これはコンパイラが必要です
Vue.createApp({
  template: '<div>{{ hi }}</div>'
})

// これはコンパイラ不要です
Vue.createApp({
  render() {
    return Vue.h('div', {}, this.hi)
  }
})
```

`vue-loader` を利用する場合、`*.vue` ファイル内部のテンプレートはビルド時に JavaScript に事前コンパイルされます。最終成果物の中にコンパイラが明らかに不要なるため、ランタイム限定ビルドを利用することができます。
