# SFC ツール

## オンラインプレイグラウンド

Vue SFC を試すため、あなたのマシンに何かをインストールする必要はありません。ブラウザ上で操作できるオンラインプレイグラウンドがたくさんあります:

- [Vue SFC Playground](https://sfc.vuejs.org)（公式、最新のコミットからデプロイ）
- [VueUse Playground](https://play.vueuse.org)
- [Vue on CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue on Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue on Codepen](https://codepen.io/pen/editor/vue)
- [Vue on StackBlitz](https://stackblitz.com/fork/vue)
- [Vue on Components.studio](https://components.studio/create/vue3)
- [Vue on WebComponents.dev](https://webcomponents.dev/create/cevue)

また、バグを報告する際には、これらのオンラインプレイグラウンドを使って、再現したものを提供することをおすすめします。

## プロジェクトの足場

### Vite

[Vite](https://vitejs.dev/) はファーストクラスの Vue SFC サポートをする軽量で高速なビルドツールです。Vue 自体の作成者でもある Evan You によって作成されました！　Vite + Vue を使い始めるには、単に次のコマンドを実行するだけです:

```sh
npm init vite@latest
```

その後、Vue テンプレートを選択して、指示に従います。

- Vite についての詳細は [Vite ドキュメント（日本語）](https://ja.vitejs.dev/guide/) を確認してください
- 例えば Vue コンパイラにオプションを渡すなど、Vite プロジェクトに Vue 固有の動作を設定するには、[@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#readme) のドキュメントを確認してください。

[SFC Playground](https://sfc.vuejs.org/) は Vite プロジェクトとしてファイルダウンロードすることもサポートします。

### Vue CLI

[Vue CLI](https://cli.vuejs.org/) は Vue プロジェクト用の webpack をベースとした公式のビルドツールです。Vue CLI ではじめるには:

```sh
npm install -g @vue/cli
vue create hello-vue
```

- Vue CLI についての詳細は [Vue CLI ドキュメント](https://cli.vuejs.org/guide/installation.html) を確認してください。

### Vite それとも Vue CLI？

開発サーバの起動や HMR の更新パフォーマンスの点で、開発体験が大幅に向上するため、Vite で新しいプロジェクトを開始することをおすすめします（[詳細](https://vitejs.dev/guide/why.html)）。特定の webpack の機能（Module Federation など）に依存する場合にのみ、Vue CLI を使用してください。

[Rollup](https://rollupjs.org/) のユーザならば、本番向けビルドに Rollup を使用して、Rollup 互換のプラグインシステムをサポートしているため、Vite を安全に採用できます。[Rollup のメンテナでさえ、Vite を Rollup のウェブ開発用のラッパーとして推奨しています](https://twitter.com/lukastaegert/status/1412119729431584774)。

## IDE サポート

推奨される IDE のセットアップは [VSCode](https://code.visualstudio.com/) と [Volar](https://github.com/johnsoncodehk/volar) 拡張機能です。Volar は、テンプレート式、コンポーネントの props、スロットの検証のために、シンタックスハイライトと高度なインテリセンスを提供します。Vue SFC を可能な限り最高に活用したい場合、特に TypeScript も利用している場合、このセットアップを強くおすすめします。

[WebStorm](https://www.jetbrains.com/webstorm/) も Vue SFC に適切なサポートを提供しています。ただし現時点では `<script setup>` のサポートが [進行中](https://youtrack.jetbrains.com/issue/WEB-49000) であることには注意してください。

他のほとんどのエディタには、コミュニティが作成した Vue のシンタックスハイライトのサポートがありますが、同じレベルのコードインテリセンスはありません。長期的には、Volar のコアロジックが標準言語サーバとして実装されているため、[Language Service Protocol](https://microsoft.github.io/language-server-protocol/) を活用することでエディタのサポート範囲を広げることができればと考えています。

## テストサポート

- Vite を使用する場合は、[Cypress](https://www.cypress.io/) をユニットテストと E2E テストの両方のテストランナーとしておすすめします。Vue SFC のユニットテストは [Cypress Component Test Runner](https://www.cypress.io/blog/2021/04/06/introducing-the-cypress-component-test-runner/) で実行できます。

- Vue CLI には、[Jest](https://jestjs.io/) と [Mocha](https://mochajs.org/) のインテグレーションが付属しています。

- Vue SFC で動作するように Jest を手動で設定する場合は、Vue SFC 向け公式 Jest トランスフォームの [vue-jest](https://github.com/vuejs/vue-jest) を確認してください。

## カスタムブロックの統合

カスタムブロックは、異なるリクエストクエリを同じ Vue ファイルへのインポートにコンパイルされます。これらのインポートリクエストを処理するのは、基盤となるビルドツールに任されています。

- Vite を使用する場合、カスタム Vite プラグインを使用して、一致したカスタムブロックを実行可能な JavaScript に変換する必要があります。[[例](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)]

- Vue CLI やプレーンな Webpack を使用する場合、一致したブロックを変換するように Webpack loader を構成する必要があります。[[例](https://vue-loader.vuejs.org/guide/custom-blocks.html#custom-blocks)]

## 下位レベルのツール

### `@vue/compiler-sfc`

- [ドキュメント](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc)

このパッケージは Vue コアのモノレポの一部で、メインの `vue` パッケージと常に同じバージョンで公開されます。通常、プロジェクト内で `vue` の Peer Dependency としてリストアップされます。正しい動作を保証するため、そのバージョンは常に `vue` と同期している必要があります。つまり、`vue` のバージョンをアップグレードするときはいつも、それに合わせて `@vue/compiler-sfc` もアップグレードする必要があります。

このパッケージ自体は、Vue SFC を処理するための低レベルなユーティリティを提供して、カスタムツールで Vue SFC をサポートする必要があるツールの作成者のためのものです。

### `@vitejs/plugin-vue`

- [ドキュメント](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

Vite で Vue SFC サポートを提供する公式プラグインです。

### `vue-loader`

- [ドキュメント](https://vue-loader.vuejs.org/)

Webpack で Vue SFC のサポートを提供する公式の Loader です。Vue CLI を使用している場合は、[`vue-loader` オプション変更についての Vue CLI ドキュメント](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader) も参照してください。
