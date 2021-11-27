---
badges:
  - breaking
---

# グローバル API <MigrationBadges :badges="$frontmatter.badges" />

Vue 2.x では、グローバルに Vue の振る舞いを変更するグローバル API や設定が多数ありました。例えば、グローバルコンポーネントを登録するには、 以下のような `Vue.component` API を使用します:

```js
Vue.component('button-counter', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})
```

同様に、以下のようにグローバルなディレクティブを宣言できました:

```js
Vue.directive('focus', {
  inserted: el => el.focus()
})
```

この方法は便利でしたが、いくつか問題がありました。Vue 2 では、内部的には "app" (アプリケーション) の概念がありませんでした。私達がアプリケーションとして定義していたものは、単に `new Vue()` で生成されたルート Vue インスタンスでした。同じ Vue コンストラクタから作成された root インスタンスは、**同じグローバル設定を共有します**。その結果として:

- グローバル設定を使用することで、テスト中に他のテストケースを誤って汚染しやすくなってしまいました。ユーザーは元のグローバル設定を保存し、各テスト後に元に戻すことを注意深くやる必要がありました (例 `Vue.config.errorHandler` のリセット)。`Vue.use` や、`Vue.mixin` のような API は、影響を元に戻す方法もありません。このため、プラグインを含むテストは特に厄介でした。実際、vue-test-utils はそれらに対応するために `createLocalVue` という特別な API を作らなければなりませんでした:

  ```js
  import { createLocalVue, mount } from '@vue/test-utils'

  // 拡張した `Vue` コンストラクタを作成
  const localVue = createLocalVue()

  // "ローカル" Vue コンストラクタに、"グローバル" にプラグインをインストール
  localVue.use(MyPlugin)

  // `localVue` をマウントオプションに渡す
  mount(Component, { localVue })
  ```

- また、グローバル設定では、同じページ上の複数のアプリケーション間でグローバル設定が異なる Vue のコピーを共有することが困難でした。

  ```js
  // 以下は両方のルートインスタンスに影響を及ぼします
  Vue.mixin({
    /* ... */
  })

  const app1 = new Vue({ el: '#app-1' })
  const app2 = new Vue({ el: '#app-2' })
  ```

これらの問題を回避するために、Vue 3 では、以下のような API を導入しました。

## 新しいグローバル API: `createApp`

`createApp` の呼び出しでは、 Vue 3 の新しい概念である _アプリケーションインスタンス_ を返します。

```js
import { createApp } from 'vue'

const app = createApp({})
```

Vue の [CDN](/guide/installation.html#cdn) ビルドを使っている場合、 `createApp` はグローバルな `Vue` オブジェクトを介して公開されます:

```js
const { createApp } = Vue

const app = createApp({})
```

アプリケーションインスタンスは、 Vue 2 のグローバル API のサブセットを公開します。おおまかには、_Vue の振る舞いをグローバルに変更する全ての API は、アプリケーションインスタンスに移されます_ 。こちらは、 Vue 2 のグローバル API とインスタンス API との対応表です:

| 2.x グローバル API         | 3.x インスタンス API (`app`)                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| Vue.config                 | app.config                                                                                       |
| Vue.config.productionTip   | _削除_ ([以下を参照](#config-productiontip-の削除))                                             |
| Vue.config.ignoredElements | app.config.compilerOptions.isCustomElement ([以下を参照](#config-ignoredelements-は-config-compileroptions-iscustomelement-に変更)) |
| Vue.component              | app.component                                                                                    |
| Vue.directive              | app.directive                                                                                    |
| Vue.mixin                  | app.mixin                                                                                        |
| Vue.use                    | app.use ([以下を参照](#プラグイン作者向けの注意点))                                               |
| Vue.prototype              | app.config.globalProperties ([以下を参照](#vue-prototype-は-config-globalproperties-と置換))   |
| Vue.extend                 | _削除_ ([以下を参照](#vue-extend-の削除))                                   |

グローバルに振る舞いを変更しないその他のグローバル API は [グローバル API の Treeshaking](./global-api-treeshaking.html) にあるように、名前付きエクスポートになりました。

### `config.productionTip` の削除

Vue 3.x では "use production build" のヒントは、"dev + full build" (ランタイムコンパイラを含み、警告があるビルド) を使用しているときにのみ表示されます。

ES Modules ビルドでは、モジュールバンドラーと一緒に使用されていることと、ほとんどの場合 CLI やボイラープレートで本番環境が適切に設定されているため、このヒントは表示されなくなりました。

[移行ビルドのフラグ: `CONFIG_PRODUCTION_TIP`](migration-build.html#compat-の設定)

### `config.ignoredElements` は `config.compilerOptions.isCustomElement` に変更

この設定オプションはネイティブのカスタム要素をサポートする意図で導入されたため、それがわかるように名前に変更しました。新しいオプションでは、以前の文字列 / RegExp の方法より、柔軟な方法を提供する関数を期待します。

```js
// before
Vue.config.ignoredElements = ['my-el', /^ion-/]

// after
const app = createApp({})
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
```

::: tip 重要

Vue 3 では、要素がコンポーネントであるかどうかのチェックはコンパイルフェーズに移されたため、この設定はランタイムコンパイラを使用しているときにのみ尊重されます。ランタイム限定のビルドを使用している場合は、代わりにビルド設定で `isCustomElement` を `@vue/compiler-dom` に渡す必要があります - 例えば [`compilerOptions` option in vue-loader](https://vue-loader.vuejs.org/options.html#compileroptions) で。

- ランタイム限定ビルド使用時に、`config.compilerOptions.isCustomElement` が代入された場合、ビルドの設定でこのオプションを設定するように警告が表示されます。
- これは、Vue CLI 設定の新しいトップレベルのオプションになります。
:::

[移行ビルドのフラグ: `CONFIG_IGNORED_ELEMENTS`](migration-build.html#compat-の設定)

### `Vue.prototype` は `config.globalProperties` と置換

Vue 2 では、すべてのコンポーネントでアクセス可能なプロパティを追加するために、 `Vue.prototype` がよく使われていました。

Vue 3 では、 [`config.globalProperties`](/api/application-config.html#globalproperties) が同様のものです。これらのプロパティは、アプリケーション内でコンポーネントをインスタンス化する際にコピーされます:

```js
// before - Vue 2
Vue.prototype.$http = () => {}
```

```js
// after - Vue 3
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

また `globalProperties` の代わりに `provide` ([後述](#provide-inject)) を使うことも考えられます。

[移行ビルドのフラグ: `GLOBAL_PROTOTYPE`](migration-build.html#compat-の設定)

### `Vue.extend` の削除

Vue 2.x では、`Vue.extend` を使って、コンポーネントのオプションを含むオブジェクトを引数に、Vue のベースコンストラクタの「サブクラス」を作成していました。Vue 3.x では、コンポーネントコンストラクタの概念はもうありません。コンポーネントのマウントには、常に `createApp` グローバル API を使用する必要があります。

```js
// 以前 - Vue 2

// コンストラクタの作成
const Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data() {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// Profile のインスタンスを作成し、それを要素にマウントする
new Profile().$mount('#mount-point')
```

```js
// 今後 - Vue 3
const Profile = {
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data() {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
}

Vue.createApp(Profile).mount('#mount-point')
```

#### 型推論

Vue 2 では、`Vue.extend` は、コンポーネントのオプションに TypeScript の型推論を提供するためにも使われていました。Vue 3 では、同じ目的のために、`defineComponent` グローバル API を `Vue.extend` の代わりに使用することができます。

なお、`defineComponent` の戻り値の型はコンストラクタのような型ですが、これは TSX の推論にのみ使用されます。実行時には、`defineComponent` はほとんど何もせず、オプションオブジェクトをそのまま返します。

#### コンポーネントの継承

Vue 3 では継承やミックスインよりも、 [Composition API](/api/composition-api.html) による Composition を強く推奨しています。 何らかの理由でコンポーネントの継承が必要な場合は、`Vue.extend` の代わりに [`extends` オプション](/api/options-composition.html#extends) を使用することができます。

[移行ビルドのフラグ: `GLOBAL_EXTEND`](migration-build.html#compat-の設定)

### プラグイン作者向けの注意点

プラグイン作者の一般的なプラクティスとして、`Vue.use` を使ってプラグインを自動的に UMD ビルドにインストールさせるものがありました。例えば、公式の `vue-router` プラグインのブラウザ環境へのインストールは以下のようになっていました:

```js
var inBrowser = typeof window !== 'undefined'
/* … */
if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
```

`use` グローバル API は、Vue 3 では利用できなくなったので、このメソッドは動作しなくなり、 `Vue.use()` の呼び出しは警告が出るようになりました。その代わりに、エンドユーザーはアプリケーションのインスタンスでプラグインを使用することを明示的に指定する必要があります。

```js
const app = createApp(MyApp)
app.use(VueRouter)
```

## アプリケーションインスタンスのマウント

`createApp(/* オプション */)` で初期化した後、アプリケーションインスタンス `app` は、`app.mount(domTarget)` を使ってルートコンポーネントインスタンスをマウントできます。

```js
import { createApp } from 'vue'
import MyApp from './MyApp.vue'

const app = createApp(MyApp)
app.mount('#app')
```

これらの変更によって、このガイドの初めにあるコンポーネントとディレクティブの例は以下のように書き換えられます:

```js
const app = createApp(MyApp)

app.component('button-counter', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})

app.directive('focus', {
  mounted: el => el.focus()
})

// このようにして、app.mount() でマウントされた全てのアプリケーションインスタンスは、
// グローバル環境を汚染すること無く、同じ "button-counter" コンポーネントと
// "focus" ディレクティブを持つようになりました。
app.mount('#app')
```

[移行ビルドのフラグ: `GLOBAL_MOUNT`](migration-build.html#compat-の設定)

## Provide / Inject

Vue 2.x のルートインスタンスで `provide` オプションを使用するのとどうように、Vue 3 のアプリケーションインスタンスでも、アプリケーション内の任意のコンポーネントに注入できる依存関係を提供できます:

```js
// エントリー
app.provide('guide', 'Vue 3 Guide')

// 子コンポーネント
export default {
  inject: {
    book: {
      from: 'guide'
    }
  },
  template: `<div>{{ book }}</div>`
}
```

`provide` を使うことは、特にプラグインを書くときに、 `globalProperties` の代わりになります。

## アプリケーション間での設定の共有

コンポーネントや、ディレクティブの設定をアプリケーション間で共有する方法の 1 つとして、以下のようなファクトリ関数があります:

```js
import { createApp } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

const createMyApp = options => {
  const app = createApp(options)
  app.directive('focus' /* ... */)

  return app
}

createMyApp(Foo).mount('#foo')
createMyApp(Bar).mount('#bar')
```

このようにして、 `fucus` ディレクティブは `Foo` と `Bar` 両方のインスタンスとその子で有効になります。
