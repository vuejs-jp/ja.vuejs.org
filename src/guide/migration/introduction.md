# はじめに

::: info
Vue.js を使うのは初めてですか？ [エッセンシャルガイド](/guide/introduction.html) を参考に使い始めてみてください。
:::

このガイドは主に、Vue 3 の新機能と変更点について学びたい Vue 2 の経験があるユーザーを対象としています。 **Vue 3 を試す前にこのガイドを上から下まで読む必要はありません。** 多くの変更があったように見えますが、Vue についてあなたが知っていて愛していることの多くは同じままです。 しかし、私たちは可能な限り徹底し、文書化されたすべての変更について詳細な説明と例を提供したいと考えました。

- [クイックスタート](#クイックスタート)
- [移行ビルド](#移行ビルド)
- [注目すべき新機能](#注目すべき新機能)
- [破壊的変更](#破壊的変更)
- [サポートライブラリ](#サポートライブラリ)

## 概要

<br>
<iframe src="https://player.vimeo.com/video/440868720" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

[Vue Mastery](https://www.vuemastery.com/courses-path/vue3) で Vue 3 を学び始める。

## クイックスタート

新しいプロジェクトで Vue 3 をすぐに試してみたい場合:

- CDN 経由: `<script src="https://unpkg.com/vue@next"></script>`
- [Codepen](https://codepen.io/yyx990803/pen/OJNoaZL) 上のブラウザ内プレイグラウンド
- [CodeSandbox](https://v3.vue.new) 上のブラウザ内サンドボックス
- [Vite](https://github.com/vitejs/vite) を使った Scaffold:

  ```bash
  npm init vite hello-vue3 -- --template vue # OR yarn create vite hello-vue3 --template vue
  ```

- [vue-cli](https://cli.vuejs.org/) を使った Scaffold:

  ```bash
  npm install -g @vue/cli # OR yarn global add @vue/cli
  vue create hello-vue3
  # select vue 3 preset
  ```

## 移行ビルド

既存の Vue 2 プロジェクトやライブラリを Vue 3 にアップグレードする場合は、Vue 2 と互換性のある API を提供する Vue 3 のビルドを提供しています。詳しくは[移行ビルド](./migration-build.html)のページをご覧ください。

## 注目すべき新機能

Vue 3 で注目すべきいくつかの新機能の次のとおりです。

- [Composition API](/guide/composition-api-introduction.html)
- [Teleport](/guide/teleport.html)
- [Fragments](/guide/migration/fragments.html)
- [Emits Component Option](/guide/component-custom-events.html)
- カスタムレンダラを作るための [`@vue/runtime-core` の `createRenderer` API](https://github.com/vuejs/vue-next/tree/master/packages/runtime-core)
- [SFC での Composition API の Syntax Sugar (`<script setup>`)](/api/sfc-script-setup.html)
- [SFC でのステートドリブンな CSS Variables (`<style>` の `v-bind`)](/api/sfc-style.html#state-driven-dynamic-css)
- [SFC での `<style scoped>` は、グローバルルールまたはスロットされたコンテンツのみを対象とするルールを含めることができるようになりました](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md)
- [Suspense](/guide/migration/suspense.html) <Badge text="experimental" type="warning" />

## 破壊的変更

以下は、2.x からの破壊的変更の一覧です。:

### グローバル API

- [グローバルな Vue API は、アプリケーションインスタンスを使用するように変更されました](/guide/migration/global-api.html)
- [グローバル API と内部 API は、ツリーシェイキングが可能になるように再構築されました](/guide/migration/global-api-treeshaking.html)

### テンプレートディレクティブ

- [コンポーネントでの `v-model` の使用方法が作り直され、 `v-bind.sync` が置き換えられました](/guide/migration/v-model.html)
- [`<templatev-for>` ノードと非 `v-for` ノードでの `key` の使用法が変更されました](/guide/migration/key-attribute.html)
- [同じ要素で使用した場合の `v-if` と `v-for` の優先順位が変更されました](/guide/migration/v-if-v-for.html)
- [`v-bind="object"` は順序依存(order-sensitive)になりました](/guide/migration/v-bind.html)
- [`v-on:event.native` 修飾子は削除されました](./v-on-native-modifier-removed.md)
- [`v-for` 内の `ref` は refs の配列を登録しなくなりました](/guide/migration/array-refs.html)

### コンポーネント

- [関数コンポーネントは、単純な関数を使用してのみ作成可能になりました](/guide/migration/functional-components.html)
- [単一ファイルコンポーネント (SFC) における `functional` 属性の `<template>` および `functional` コンポーネントオプションは非推奨になりました](/guide/migration/functional-components.html)
- [非同期コンポーネントは、 `defineAsyncComponent` メソッドを使って作成することが必要になりました](/guide/migration/async-components.html)
- [コンポーネントのイベントは、 `emits` で宣言できるようになりました](./emits-option.md)

### Render 関数

- [Render 関数の API が変更されました](/guide/migration/render-function-api.html)
- [`$scopedSlots` プロパティが削除され、すべてのスロットが `$slots` を介して関数として公開されるようになりました](/guide/migration/slots-unification.html)
- [`$listeners` は削除され、 `$attrs` にマージされました](./listeners-removed)
- [`$attrs` に `class` と `style` 属性が追加されました](./attrs-includes-class-style.md)

### カスタム要素

- [テンプレートのコンパイル中にカスタム要素のチェックが実行されるようになりました](/guide/migration/custom-elements-interop.html)
- [特別な `is` 属性 の使用は、予約済みの `<component>` タグのみに制限されるようになりました](/guide/migration/custom-elements-interop.html#customized-built-in-elements)

### その他の細かな変更

- `destroyed` ライフサイクルオプションの名前が `unmounted` に変更されました
- `beforeDestroy` ライフサイクルオプションの名前が `beforeUnmount` に変更されました
- [Props の `default` ファクトリ関数は `this` コンテキストにアクセスできなくなりました](/guide/migration/props-default-this.html)
- [コンポーネントライフサイクルに合わせてカスタムディレクティブ API が変更され、`binding.expression` が削除されました](/guide/migration/custom-directives.html)
- [`data` オプションは常に関数として宣言されることが必要になりました](/guide/migration/data-option.html)
- [ミックスインの `data` オプションは浅くマージされるようになりました](/guide/migration/data-option.html#mixin-merge-behavior-change)
- [属性強制の戦略が変更されました](/guide/migration/attribute-coercion.html)
- [一部のトランジションクラスの名前が変更されました](/guide/migration/transition.html)
- [`<TransitionGroup>` はデフォルトでラッパー要素をレンダリングしなくなりました](/guide/migration/transition-group.html)
- [配列を監視している場合、コールバックは配列が置き換えられたときにのみ発火されるようになりました。 ミューテーションで発火する必要がある場合は、 `deep` オプションを指定する必要があります。](/guide/migration/watch.html)
- 特別なディレクティブ(`v-if/else-if/else` 、 `v-for` 、または `v-slot`）が使われていない `<template>` タグはプレーンな要素として扱われ、内部コンテンツをレンダリングする代わりにネイティブの `<template>` 要素となります。
- [マウントされたアプリケーションは、マウント先の要素を置き換えなくなりました](/guide/migration/mount-changes.html)
- [ライフサイクルの `hook:` イベントのプレフィックスは `vnode-` に変更されました](/guide/migration/vnode-lifecycle-events.html)

### 削除された API

- [`v-on` の修飾子としての `keyCode` のサポート](/guide/migration/keycode-modifiers.html)
- [$on, $off そして $once のインスタンスメソッド](/guide/migration/events-api.html)
- [Filters](/guide/migration/filters.html)
- [インラインテンプレート属性](/guide/migration/inline-template-attribute.html)
- [`$children` インスタンスプロパティ](/guide/migration/children.html)
- [`propsData` オプション](/guide/migration/props-data.html)
- `$destroy` インスタンスメソッド。 ユーザーは、個々の Vue コンポーネントのライフサイクルを手動で管理べきではなくなりました。
- グローバル関数の `set` と `delete`、およびインスタンスメソッドの `$set` と `$delete`。これらはプロキシベースの変更検出では必要なくなりました。

## サポートライブラリ

現在、すべての公式ライブラリとツールが Vue 3 をサポートしていますが、中にはまだベータ版やリリース候補版のものもあります。それぞれのライブラリの詳細は以下のとおりです。ほとんどのライブラリは現在、 npm の `next` 配布 (dist) タグで配布されています。すべての公式ライブラリが互換性のある安定したバージョンになったら、 `latest` に変更する予定です。

### Vue CLI

<a href="https://www.npmjs.com/package/@vue/cli" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/@vue/cli"></a>

v4.5.0 以降、 `vue-cli` は新しいプロジェクトを作成するときに、Vue 3 を選択するための組み込みオプションを提供するようになりました。 `vue-cli` をアップグレードし、 `vue create` を実行して、Vue3 プロジェクトを今すぐ作成できます。

- [Documentation](https://cli.vuejs.org/)
- [GitHub](https://github.com/vuejs/vue-cli)

### Vue Router

<a href="https://www.npmjs.com/package/vue-router/v/next" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/vue-router/next.svg"></a>

Vue Router 4.0 は Vue 3 のサポートを提供し、独自の破壊的変更がいくつかあります。 詳細については、[移行ガイド](https://next.router.vuejs.org/guide/migration/) を確認してください。

- [Documentation](https://next.router.vuejs.org/)
- [GitHub](https://github.com/vuejs/vue-router-next)
- [RFCs](https://github.com/vuejs/rfcs/pulls?q=is%3Apr+is%3Amerged+label%3Arouter)

### Vuex

<a href="https://www.npmjs.com/package/vuex/v/next" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/vuex/next.svg"></a>

Vuex 4.0 は、3.x と大部分は同じ API で Vue3 のサポートを提供します。 唯一の破壊的変更は、[プラグインのインストール方法](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html#breaking-changes)です。

- [Documentation](https://next.vuex.vuejs.org/)
- [GitHub](https://github.com/vuejs/vuex/tree/4.0)

### Devtools Extension

新しい UI を備え、複数の Vue のバージョンをサポートするために、内部処理にリファクタリングを施した新しいバージョンの Devtools を開発中です。 新しいバージョンは現在ベータ版であり、Vue 3 のみをサポートしています(現時点では)。 Vuex と Router の統合も進行中です。

- Chrome の場合: [Chrome ウェブストアからインストール](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg?hl=ja)

  - 注：ベータチャネルは devtools の安定バージョンと競合する可能性があるため、ベータチャネルが正しく機能するには、安定バージョンを一時的に無効にする必要があるかもしれません。

- Firefox の場合: [署名された拡張機能をダウンロード](https://github.com/vuejs/vue-devtools/releases/tag/v6.0.0-beta.2) (Assets の下の `.xpi` ファイル)

### IDE のサポート

[VSCode](https://code.visualstudio.com/) を公式の拡張機能である [Volar](https://github.com/johnsoncodehk/volar) とともに使用することをお勧めします。それにより Vue3 の包括的な IDE のサポートを得ることができます。

## その他のプロジェクト

| Project               | npm                           | Repo                 |
| --------------------- | ----------------------------- | -------------------- |
| @vue/babel-plugin-jsx | [![rc][jsx-badge]][jsx-npm]   | [[GitHub][jsx-code]] |
| eslint-plugin-vue     | [![ga][epv-badge]][epv-npm]   | [[GitHub][epv-code]] |
| @vue/test-utils       | [![beta][vtu-badge]][vtu-npm] | [[GitHub][vtu-code]] |
| vue-class-component   | [![beta][vcc-badge]][vcc-npm] | [[GitHub][vcc-code]] |
| vue-loader            | [![rc][vl-badge]][vl-npm]     | [[GitHub][vl-code]]  |
| rollup-plugin-vue     | [![beta][rpv-badge]][rpv-npm] | [[GitHub][rpv-code]] |

[jsx-badge]: https://img.shields.io/npm/v/@vue/babel-plugin-jsx.svg
[jsx-npm]: https://www.npmjs.com/package/@vue/babel-plugin-jsx
[jsx-code]: https://github.com/vuejs/jsx-next
[vd-badge]: https://img.shields.io/npm/v/@vue/devtools/beta.svg
[vd-npm]: https://www.npmjs.com/package/@vue/devtools/v/beta
[vd-code]: https://github.com/vuejs/vue-devtools/tree/next
[epv-badge]: https://img.shields.io/npm/v/eslint-plugin-vue.svg
[epv-npm]: https://www.npmjs.com/package/eslint-plugin-vue
[epv-code]: https://github.com/vuejs/eslint-plugin-vue
[vtu-badge]: https://img.shields.io/npm/v/@vue/test-utils/next.svg
[vtu-npm]: https://www.npmjs.com/package/@vue/test-utils/v/next
[vtu-code]: https://github.com/vuejs/vue-test-utils-next
[jsx-badge]: https://img.shields.io/npm/v/@ant-design-vue/babel-plugin-jsx.svg
[jsx-npm]: https://www.npmjs.com/package/@ant-design-vue/babel-plugin-jsx
[jsx-code]: https://github.com/vueComponent/jsx
[vcc-badge]: https://img.shields.io/npm/v/vue-class-component/next.svg
[vcc-npm]: https://www.npmjs.com/package/vue-class-component/v/next
[vcc-code]: https://github.com/vuejs/vue-class-component/tree/next
[vl-badge]: https://img.shields.io/npm/v/vue-loader/next.svg
[vl-npm]: https://www.npmjs.com/package/vue-loader/v/next
[vl-code]: https://github.com/vuejs/vue-loader/tree/next
[rpv-badge]: https://img.shields.io/npm/v/rollup-plugin-vue/next.svg
[rpv-npm]: https://www.npmjs.com/package/rollup-plugin-vue/v/next
[rpv-code]: https://github.com/vuejs/rollup-plugin-vue/tree/next

::: info
Vue 3 のライブラリとの互換性については、 [awesome-vue のこの Issue](https://github.com/vuejs/awesome-vue/issues/3544) を見てください。
:::
