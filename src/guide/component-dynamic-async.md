# 動的 & 非同期コンポーネント

> このページはすでに [コンポーネントの基本](component-basics.md) を読んでいる事を前提としています。コンポーネントをよく知らない方はそちらを先にお読みください。

## 動的コンポーネントにおける `keep-alive` の利用

まず、タブインタフェースにおいてコンポーネントを切り替える `is` 属性を使ったとします:

```vue-html
<component :is="currentTabComponent"></component>
```

しかし、コンポーネントを切り替える時、コンポーネントの状態を保持したり、パフォーマンスの理由から再レンダリングを避けたいときもあるでしょう。例えば、タブインターフェースを少し拡張した場合:

<common-codepen-snippet title="Dynamic components: without keep-alive" slug="jOPjZOe" tab="html,result" />

Posts タブの投稿を選択し、 _Archive_ タブに切り替えてから _Posts_ に戻ると、選択していた投稿が表示されないことに気づくでしょう。これは、新しいタブに切り替えるたびに、Vue が `currentTabComponent` の新しいインスタンスを作成するからです。

動的コンポーネントの再生成は通常は便利な挙動です。しかし、このケースでは最初に生成されたタブコンポーネントのインスタンスがキャッシュされるのが好ましいでしょう。この問題を解決するためには、動的コンポーネントを `<keep-alive>` 要素で囲みます:

```vue-html
<!-- アクティブでないコンポーネントはキャッシュされます！ -->
<keep-alive>
  <component :is="currentTabComponent"></component>
</keep-alive>
```

以下の結果を確認してみてください:

<common-codepen-snippet title="Dynamic components: with keep-alive" slug="VwLJQvP" tab="html,result" />

このように _Posts_ タブがレンダリングされていなくても、自身の状態（選択された投稿）を保持するようになります。

`<keep-alive>` の詳細な情報については [API リファレンス](../api/built-in-components.html#keep-alive) を参照してください。

## 非同期コンポーネント

大規模なアプリケーションでは、アプリケーションを小さなまとまりに分割し、必要なときにだけコンポーネントをサーバーから読み込みたい場合があるでしょう。これを可能にするために、 Vue には `defineAsyncComponent` メソッドがあります:

```js
const { createApp, defineAsyncComponent } = Vue

const app = createApp({})

const AsyncComp = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      resolve({
        template: '<div>I am async!</div>'
      })
    })
)

app.component('async-example', AsyncComp)
```

見て分かるとおり、このメソッドは `Promise` を返すファクトリ関数を受けます。サーバーからコンポーネント定義を取得したら Promise の `resolve` コールバックが呼ばれるべきです。また、読み込みが失敗したことを示すために `reject(reason)` を呼ぶこともできます。

ファクトリ関数の中で `Promise` を返すことができるので、 Webpack 2 以降と ES2015 の構文では以下のように書くこともできます:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

[コンポーネントのローカル登録](component-registration.html#ローカル登録) でも、 `defineAsyncComponent` を利用できます。

```js
import { createApp, defineAsyncComponent } from 'vue'

createApp({
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
})
```

### Suspense との併用

非同期コンポーネントはデフォルトで _suspensible_ です。これは非同期コンポーネントが `<Suspense>` を親に持ったとき、 `<Suspense>` の非同期の依存として取り扱われることを意味しています。このケースでは、読み込みの状態は `<Suspense>` から制御され、コンポーネント自身が持つ loading や error, delay, timeout といったオプションは無視されます。

非同期コンポーネントのオプションに `suspensible: false` を指定することで、 `Suspense` の制御から外すことができ、常にコンポーネントが自身の読み込み状態を制御することができます。

[API リファレンス](../api/global-api.html#引数-4) で利用可能なオプションのリストを確認できます。
