# 移行ビルド

## 概要

`@vue/compat`（別名「移行ビルド」）は、Vue 2 と互換性のある動作を設定できる Vue 3 のビルドです。

移行ビルドは、デフォルトで Vue 2 モードで動作します。ほとんどのパブリック API は、ほんの少しの例外を除いて Vue 2 とまったく同じように動作します。Vue 3 で変更されたり、非推奨となった機能を使用すると実行時に警告が表示されます。機能の互換性は、コンポーネントごとに有効/無効を設定することもできます。

### 想定される使用例

- （[制限事項](#既知の制限事項)ありでの）Vue 2 アプリケーションの Vue 3 へのアップグレード
- ライブラリを Vue 3 に対応させるための移行作業
- また、Vue 3 をまだ試していない Vue 2 の経験豊富な開発者は、移行ビルドを Vue 3 の代わりに使用してバージョン間の違いを学ぶことができます。

### 既知の制限事項

移行ビルドは Vue 2 の動作を可能な限り模倣するようにしていますが、次のようないくつかの制限事項があるため、アプリがアップグレードの対象にならない場合があります。

- Vue 2 の内部 API またはドキュメント化されていない動作に頼った依存関係。最も一般的なケースは、 `VNodes` プライベートプロパティの使用です。[Vuetify](https://vuetifyjs.com/en/)、[Quasar](https://quasar.dev/)、[ElementUI](https://element.eleme.io/#/en-US)などのコンポーネントライブラリに依存している場合は、Vue 3 と互換性のあるバージョンを待つことをお勧めします。

- Internet Explorer 11 のサポート: [Vue 3 は公式に IE11 サポートの計画を中止しました](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0038-vue3-ie11-support.md)。まだ IE11 以下をサポートする必要がある場合は、Vue 2 のままにしておく必要があります。

- サーバーサイドレンダリング: 移行ビルドは SSR にも使用できますが、カスタム SSR セットアップの移行はもっと複雑です。一般的な対処法は、`vue-server-renderer` を[`@vue/server-renderer`](https://github.com/vuejs/vue-next/tree/master/packages/server-renderer)に置き換えることです。Vue 3 ではバンドルレンダラが提供されなくなったため、Vue 3 の SSR を[Vite](https://vitejs.dev/guide/ssr.html)で使用することが推奨されています。また、[Nuxt.js](https://nuxtjs.org/)を使用している場合は、Nuxt 3 を待ったほうがよいでしょう。

### 期待すること

今回の移行ビルドでは、公開されている Vue 2 の API と動作のみをカバーすることを目的としていることに注意してください。ドキュメント化されていない動作に依存しているために移行ビルドでアプリケーションが動作しなかったとしても、そのようなケースへの対応として移行ビルドを調整する可能性は低いでしょう。問題となっている動作への依存を排除するためのリファクタリングを検討してください。

注意点としては、アプリケーションの規模が大きく複雑な場合は、移行ビルドを使用しても移行が困難な場合があります。残念ながらアップグレードできない場合は、Composition API やその他の Vue 3 の機能を 2.7 のリリース（2021 年第 3 四半期後半予定）でバックポートする予定であることを覚えておいてください。

移行用のビルドでアプリを動作させることができた場合、移行が完了する前に本番環境にリリースすることが**可能**です。パフォーマンスや容量に若干のオーバーヘッドが発生しますが、本番環境の UX には目立った影響はありません。Vue 2 の動作に依存している依存関係があり、アップグレードや置き換えができない場合にはそうする必要があるかもしれません。

移行用のビルドは 3.1 から提供され、3.2 のリリースラインと並行して引き続き公開されます。移行ビルドの公開は、将来のマイナーバージョン（2021 年の年末以降）で終了する予定ですので、それまでに標準ビルドへの切り替えを目指してください。

## アップグレードのワークフロー

以下のワークフローは、実際の Vue 2 アプリ（Vue HackerNews 2.0）を Vue 3 に移行する手順を示しています。完全なコミットは[こちら](https://github.com/vuejs/vue-hackernews-2.0/compare/migration)から確認できます。なお、実際に必要な手順はプロジェクトによって異なるため、これらの手順は厳密な指示ではなく一般的なガイダンスとして扱ってください。

### 準備

- まだ [非推奨の named/scoped スロット構文](https://vuejs.org/v2/guide/components-slots.html#Deprecated-Syntax) を使用している場合は、まず最新の構文にアップデートしてください（構文は 2.6 ですでにサポートされています）。

### インストール

1. 必要に応じてツールをアップグレードします。

   - カスタム webpack セットアップを使用している場合: `vue-loader` を `^16.0.0` にアップグレードします。
   - `vue-cli` を使用している場合: `vue upgrade` で最新の `@vue/cli-service` にアップグレードします。
   - （代替手段）[Vite](https://vitejs.dev/) + [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)に移行します。[[コミット例](https://github.com/vuejs/vue-hackernews-2.0/commit/565b948919eb58f22a32afca7e321b490cb3b074)]

2. `package.json` で `vue` を 3.1 にアップデートし、同じバージョンの `@vue/compat` をインストールします。また（もしあれば） `vue-template-compiler`を `@vue/compiler-sfc` に置き換えます。

   ```diff
   "dependencies": {
   - "vue": "^2.6.12",
   + "vue": "^3.1.0",
   + "@vue/compat": "^3.1.0"
      ...
   },
   "devDependencies": {
   - "vue-template-compiler": "^2.6.12"
   + "@vue/compiler-sfc": "^3.1.0"
   }
   ```

   [コミット例](https://github.com/vuejs/vue-hackernews-2.0/commit/14f6f1879b43f8610add60342661bf915f5c4b20)

3. ビルド設定で、`vue` を `@vue/compat` にエイリアスし、Vue のコンパイラオプションで compat モードを有効にします。

   **設定のサンプル**

   <details>
     <summary><b>vue-cli</b></summary>

   ```js
   // vue.config.js
   module.exports = {
     chainWebpack: config => {
       config.resolve.alias.set('vue', '@vue/compat')

       config.module
         .rule('vue')
         .use('vue-loader')
         .tap(options => {
           return {
             ...options,
             compilerOptions: {
               compatConfig: {
                 MODE: 2
               }
             }
           }
         })
     }
   }
   ```

   </details>

   <details>
     <summary><b>Plain webpack</b></summary>

   ```js
   // webpack.config.js
   module.exports = {
     resolve: {
       alias: {
         vue: '@vue/compat'
       }
     },
     module: {
       rules: [
         {
           test: /\.vue$/,
           loader: 'vue-loader',
           options: {
             compilerOptions: {
               compatConfig: {
                 MODE: 2
               }
             }
           }
         }
       ]
     }
   }
   ```

   </details>

   <details>
     <summary><b>Vite</b></summary>

   ```js
   // vite.config.js
   export default {
     resolve: {
       alias: {
         vue: '@vue/compat'
       }
     },
     plugins: [
       vue({
         template: {
           compilerOptions: {
             compatConfig: {
               MODE: 2
             }
           }
         }
       })
     ]
   }
   ```

   </details>

4. TypeScript を使用している場合は、`*.d.ts` ファイルを以下のように追加して、デフォルトのエクスポート（Vue 3 ではなくなりました）を公開するように `vue` の型付けを修正する必要もあります:

   ```ts
   declare module 'vue' {
     import { CompatVue } from '@vue/runtime-dom'
     const Vue: CompatVue
     export default Vue
     export * from '@vue/runtime-dom'
   }
   ```

5. この時点で、あなたのアプリケーションは、いくつかのコンパイル時のエラーや警告に遭遇するかもしれません（例：フィルターの使用）。まずはそれらを修正してください。コンパイラの警告がすべて消えた場合は、コンパイラを Vue 3 モードに設定することもできます。

   [コミット例](https://github.com/vuejs/vue-hackernews-2.0/commit/b05d9555f6e115dea7016d7e5a1a80e8f825be52)

6. エラーを修正した後、前述の[制限事項](#既知の制限事項)の対象になっていなければアプリを実行できるはずです。

   コマンドラインとブラウザのコンソールの両方に、たくさんの警告が表示されると思います。ここでは一般的なヒントをご紹介します。

   - ブラウザのコンソールでは、特定の警告をフィルタリングすることができます。フィルタを使用して、一度に 1 つの項目を修正することに集中することをお勧めします。また、`-GLOBAL_MOUNT` のような否定のフィルタを使うこともできます。

   - [compat の設定](#compat-の設定)で特定の非推奨事項を抑制することができます。

   - 警告の中には、使用している依存関係（例: `vue-router`）が原因となっているものがあります。警告のコンポーネントトレースやスタックトレース（クリックで展開）から確認できます。まず、自分のソースコードに起因する警告の修正に集中してください。

   - `vue-router` を使用している場合は、`vue-router` v4 にアップグレードするまで、`<transition>` と `<keep-alive>` は `<router-view>` で動作しないことに注意してください。

7. [`<transition>` のクラス名](/guide/migration/transition.html) を更新します。これは、実行時の警告が出ない唯一の機能です。プロジェクト全体で `.*-enter` と `.*-leave` の CSS クラス名を検索することができます。

   [コミット例](https://github.com/vuejs/vue-hackernews-2.0/commit/d300103ba622ae26ac26a82cd688e0f70b6c1d8f)

8. [新しいグローバルマウント API](/guide/migration/global-api.html#新しいグローバル-api-createapp)を使用するようにアプリのエントリを更新します。

   [コミット例](https://github.com/vuejs/vue-hackernews-2.0/commit/a6e0c9ac7b1f4131908a4b1e43641f608593f714)

9. [`vuex` を v4 にアップグレード](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html)します。

   [コミット例](https://github.com/vuejs/vue-hackernews-2.0/commit/5bfd4c61ee50f358cd5daebaa584f2c3f91e0205)

10. [`vuex-router` を v4 にアップグレード](https://next.router.vuejs.org/guide/migration/index.html)します。 `vuex-router-sync` も使用している場合は、ストアゲッターで置き換えることができます。

    アップグレード後、`<router-view>` で `<transition>` や `<keep-alive>` を使用するには、新しい [scoped-slot ベースの構文](https://next.router.vuejs.org/guide/migration/index.html#router-view-keep-alive-and-transition) を使用する必要があります。

    [コミット例](https://github.com/vuejs/vue-hackernews-2.0/commit/758961e73ac4089890079d4ce14996741cf9344b)

11. 個々の警告を取り除きます。一部の機能は、Vue 2 と Vue 3 の間で矛盾した動作をすることに注意してください。例えば、Render 関数 API や、関数型コンポーネントと非同期コンポーネントの変更などがあります。アプリケーションの他の部分に影響を与えずに Vue 3 の API に移行するには、[`compatConfig` オプション](#コンポーネントごとの設定)を使用して、コンポーネントごとに Vue 3 の動作をオプトインすることができます。

    [コミット例](https://github.com/vuejs/vue-hackernews-2.0/commit/d0c7d3ae789be71b8fd56ce79cb4cb1f921f893b)

12. すべての警告が修正されたら、移行ビルドを削除して Vue 3 に正しく切り替えることができます。ただし、Vue 2 の動作に頼った依存関係が残っている場合は、切り替えできないことがあります。

    [コミット例](https://github.com/vuejs/vue-hackernews-2.0/commit/9beb45490bc5f938c9e87b4ac1357cfb799565bd)

## compat の設定

### グローバル設定

compat の機能は個別に無効にすることができます:

```js
import { configureCompat } from 'vue'

// 特定の機能のために compat を無効にする
configureCompat({
  FEATURE_ID_A: false,
  FEATURE_ID_B: false
})
```

また、アプリケーション全体をデフォルトで Vue 3 の動作にして、特定の compat 機能だけを有効にすることもできます:

```js
import { configureCompat } from 'vue'

// すべてを Vue 3 の動作にデフォルト化して、
// 特定の機能のみ compat を有効にする
configureCompat({
  MODE: 3,
  FEATURE_ID_A: true,
  FEATURE_ID_B: true
})
```

### コンポーネントごとの設定

コンポーネントは `compatConfig` オプションを使用することができます。このオプションには、グローバルの `configureCompat` メソッドと同じオプションが指定できます:

```js
export default {
  compatConfig: {
    MODE: 3, // このコンポーネントのみ Vue 3 の動作をオプトインする
    FEATURE_ID_A: true // 機能をコンポーネントレベルで切り替えることも可能です
  }
  // ...
}
```

### コンパイラ固有の設定

`COMPILER_` で始まる機能は、コンパイラ固有のものです。完全なビルド（ブラウザ内コンパイラ付き）を使用している場合は、実行時に設定することができます。しかし、ビルドセットアップを使用している場合は、代わりにビルド設定の `compilerOptions` で設定する必要があります（上記の設定例を参照）。

## 機能リファレンス

### 互換性の種類

- ✔ 完全な互換性
- ◐ 注意点付きの部分的な互換性
- ⨂ 互換性なし（警告のみ）
- ⭘ compat のみ（警告なし）

### 互換性なし

> 前もって修正する必要がある、またはエラーになる可能性が高い

| ID                                    | 分類 | 説明                                                                   | ドキュメント                                                                                   |
| ------------------------------------- | ---- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| GLOBAL_MOUNT_CONTAINER                | ⨂    | マウントされたアプリケーションは、マウント先の要素を置き換えません     | [link](/guide/migration/mount-changes.html)                                                    |
| CONFIG_DEVTOOLS                       | ⨂    | production の devtools がビルド時のフラグになりました                  | [link](https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags) |
| COMPILER_V_IF_V_FOR_PRECEDENCE        | ⨂    | `v-if` と `v-for` が同じ要素で使われたときの優先順位が変更されました   | [link](/guide/migration/v-if-v-for.html)                                                       |
| COMPILER_V_IF_SAME_KEY                | ⨂    | `v-if` の分岐では、同じキーを持つことができなくなりました          | [link](/guide/migration/key-attribute.html#条件分岐について)                            |
| COMPILER_V_FOR_TEMPLATE_KEY_PLACEMENT | ⨂    | `<template v-for>` のキーは、`<template>` に置くことが必要になりました | [link](/guide/migration/key-attribute.html#template-v-for-の使用)                                |
| COMPILER_SFC_FUNCTIONAL               | ⨂    | `<template functional>` は SFC でサポートされなくなりました            | [link](/guide/migration/functional-components.html#単一ファイルコンポーネント-sfc)                |

### 注意点付きの部分的な互換性

| ID                       | 分類 | 説明                                                                                                                                                                                                              | ドキュメント                                                                                  |
| ------------------------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| CONFIG_IGNORED_ELEMENTS  | ◐    | `config.ignoredElements` は `config.compilerOptions.isCustomElement` になりました（ブラウザコンパイラビルドでのみ）。ビルドセットアップを使用している場合は、`isCustomElement` をビルド設定で渡さなければなりません | [link](/guide/migration/global-api.html#config-ignoredelements-は-config-iscustomelement-に変更) |
| COMPILER_INLINE_TEMPLATE | ◐    | `inline-template` は削除されました（compat はブラウザのコンパイラビルドでのみサポートされます）                                                                                                                     | [link](/guide/migration/inline-template-attribute.html)                                       |
| PROPS_DEFAULT_THIS       | ◐    | props のデフォルトファクトリは `this` にアクセスできなくなりました（compat モードに置いて `this` は実際のインスタンスではなく、props、`$options` および injections を公開しているだけになります）                   | [link](/guide/migration/props-default-this.html)                                              |
| INSTANCE_DESTROY         | ◐    | `$destroy` インスタンスメソッドは削除されました（compat モードでは、ルートインスタンスでのみサポートされています）                                                                                                  |                                                                                               |
| GLOBAL_PRIVATE_UTIL      | ◐    | `Vue.util` はプライベートとなり、使用できなくなりました                                                                                                                                                           |                                                                                               |
| CONFIG_PRODUCTION_TIP    | ◐    | `config.productionTip` が不要になりました                                                                                                                                                                         | [link](/guide/migration/global-api.html#config-productiontip-の削除)                |
| CONFIG_SILENT            | ◐    | `config.silent` は削除されました                                                                                                                                                                                  |

### compat のみ（警告なし）

| ID                 | 分類 | 説明                                                | ドキュメント                             |
| ------------------ | ---- | --------------------------------------------------- | ---------------------------------------- |
| TRANSITION_CLASSES | ⭘    | トランジションの enter/leave クラスが変更されました | [link](/guide/migration/transition.html) |

### 完全な互換性

| ID                           | 分類 | 説明                                                                                                   | ドキュメント                                                                               |
| ---------------------------- | ---- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| GLOBAL_MOUNT                 | ✔    | new Vue() -> createApp                                                                                 | [link](/guide/migration/global-api.html#アプリケーションインスタンスのマウント)                             |
| GLOBAL_EXTEND                | ✔    | Vue.extend は削除されました（`defineComponent` または `extends` オプションを使用してください）              | [link](/guide/migration/global-api.html#vue-extend-の削除)            |
| GLOBAL_PROTOTYPE             | ✔    | `Vue.prototype` -> `app.config.globalProperties`                                                       | [link](/guide/migration/global-api.html#vue-prototype-は-config-globalproperties-と置換) |
| GLOBAL_SET                   | ✔    | `Vue.set` は削除されました（不要になりました）                                                           |                                                                                            |
| GLOBAL_DELETE                | ✔    | `Vue.delete` は削除されました（不要になりました）                                                        |                                                                                            |
| GLOBAL_OBSERVABLE            | ✔    | `Vue.observable` は削除されました（`reactive` を使用してください）                                      | [link](/api/basic-reactivity.html)                                                         |
| CONFIG_KEY_CODES             | ✔    | config.keyCodes は削除されました                                                                       | [link](/guide/migration/keycode-modifiers.html)                                            |
| CONFIG_WHITESPACE            | ✔    | Vue 3 では、ホワイトスペースのデフォルトは `"condense"` になりました                                   |                                                                                            |
| INSTANCE_SET                 | ✔    | `vm.$set` は削除されました（不要になりました）                                                           |                                                                                            |
| INSTANCE_DELETE              | ✔    | `vm.$delete` は削除されました（不要になりました）                                                        |                                                                                            |
| INSTANCE_EVENT_EMITTER       | ✔    | `vm.$on`、`vm.$off`、`vm.$once` は削除されました                                                       | [link](/guide/migration/events-api.html)                                                   |
| INSTANCE_EVENT_HOOKS         | ✔    | インスタンスが `hook:x` イベントを発行しなくなりました。                                               | [link](/guide/migration/vnode-lifecycle-events.html)                                       |
| INSTANCE_CHILDREN            | ✔    | `vm.$children` は削除されました                                                                        | [link](/guide/migration/children.html)                                                     |
| INSTANCE_LISTENERS           | ✔    | `vm.$listeners` は削除されました                                                                       | [link](/guide/migration/listeners-removed.html)                                            |
| INSTANCE_SCOPED_SLOTS        | ✔    | `vm.$scopedSlots` は削除されました。 `vm.$slots` は関数を公開するようになりました。                    | [link](/guide/migration/slots-unification.html)                                            |
| INSTANCE_ATTRS_CLASS_STYLE   | ✔    | `$attrs` に `class` と `style` が追加されました                                                        | [link](/guide/migration/attrs-includes-class-style.html)                                   |
| OPTIONS_DATA_FN              | ✔    | すべての場合において、`data` は関数であることが必要になりました                                        | [link](/guide/migration/data-option.html)                                                  |
| OPTIONS_DATA_MERGE           | ✔    | mixin や extension からの `data` が浅くマージされるようになりました                                    | [link](/guide/migration/data-option.html)                                                  |
| OPTIONS_BEFORE_DESTROY       | ✔    | `beforeDestroy` -> `beforeUnmount`                                                                     |                                                                                            |
| OPTIONS_DESTROYED            | ✔    | `destroyed` -> `unmounted`                                                                             |                                                                                            |
| WATCH_ARRAY                  | ✔    | 配列の watch ではディープなものでない限り、 mutation を発行しなくなりました                            | [link](/guide/migration/watch.html)                                                        |
| V_FOR_REF                    | ✔    | `v-for` の中の `ref` が refs の配列を登録しなくなりました                                              | [link](/guide/migration/array-refs.html)                                                   |
| V_ON_KEYCODE_MODIFIER        | ✔    | `v-on` が keyCode 修飾子をサポートしなくなりました                                                     | [link](/guide/migration/keycode-modifiers.html)                                            |
| CUSTOM_DIR                   | ✔    | カスタムディレクティブのフック名が変更されました                                                       | [link](/guide/migration/custom-directives.html)                                            |
| ATTR_FALSE_VALUE             | ✔    | バインディングの値が真偽値の `false` の場合、属性を削除しないようになりました                          | [link](/guide/migration/attribute-coercion.html)                                           |
| ATTR_ENUMERATED_COERCION     | ✔    | 特殊なケースの列挙された属性は廃止されました                                                           | [link](/guide/migration/attribute-coercion.html)                                           |
| TRANSITION_GROUP_ROOT        | ✔    | `<transition-group>` は、デフォルトでルート要素をレンダリングしなくなりました                          | [link](/guide/migration/transition-group.html)                                             |
| COMPONENT_ASYNC              | ✔    | 非同期コンポーネントの API が変更されました（`defineAsyncComponent` が必要になりました）                 | [link](/guide/migration/async-components.html)                                             |
| COMPONENT_FUNCTIONAL         | ✔    | 関数型コンポーネントの API が変更されました（プレーンな関数であることが必須になりました）                | [link](/guide/migration/functional-components.html)                                        |
| COMPONENT_V_MODEL            | ✔    | コンポーネントの v-model が再構築されました                                                            | [link](/guide/migration/v-model.html)                                                      |
| RENDER_FUNCTION              | ✔    | Render 関数の API が変更されました                                                                     | [link](/guide/migration/render-function-api.html)                                          |
| FILTERS                      | ✔    | フィルタは削除されました（このオプションは、ランタイムのフィルタ API にのみ影響します）                  | [link](/guide/migration/filters.html)                                                      |
| COMPILER_IS_ON_ELEMENT       | ✔    | `is` の使用は `<component>` のみに制限されるようになりました                                           | [link](/guide/migration/custom-elements-interop.html)                                      |
| COMPILER_V_BIND_SYNC         | ✔    | `v-bind.sync` は `v-model` に置き換えられ、引数を持つようになりました                                   | [link](/guide/migration/v-model.html)                                                      |
| COMPILER_V_BIND_PROP         | ✔    | `v-bind.prop` 修飾子は削除されました                                                                   |                                                                                            |
| COMPILER_V_BIND_OBJECT_ORDER | ✔    | `v-bind="object"` は順番に注意が必要になりました                                                       | [link](/guide/migration/v-bind.html)                                                       |
| COMPILER_V_ON_NATIVE         | ✔    | `v-on.native` 修飾子は削除されました                                                                   | [link](/guide/migration/v-on-native-modifier-removed.html)                                 |
| COMPILER_V_FOR_REF           | ✔    | `v-for` 内の `ref`（コンパイラサポート）                                                                 |                                                                                            |
| COMPILER_NATIVE_TEMPLATE     | ✔    | 特別なディレクティブを持たない `<template>` がネイティブな要素としてレンダリングされるようになりました |                                                                                            |
| COMPILER_FILTERS             | ✔    | フィルタ（コンパイラサポート）                                                                           |                                                                                            |
