---
badges:
  - new
---

# 非同期コンポーネント <MigrationBadges :badges="$frontmatter.badges" />

## 概要

こちらが大まかな変更の概要です:

- 明示的に非同期コンポーネントを定義する、新しい `defineAsyncComponent` ヘルパーメソッド
- `component` オプションは `loader` に名前が替わりました
- loader 関数は本質的に `resolve` と `reject` を引数にとらず、必ず Promise を返却します

さらに詳しい説明のために読み進めましょう！

## イントロダクション

以前、非同期コンポーネントは Promise を返す関数としてコンポーネントを定義することで、このように簡単に作成されました:

```js
const asyncModal = () => import('./Modal.vue')
```

または、オプション付きのさらに高度なコンポーネント構文として:

```js
const asyncModal = {
  component: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent
}
```

## 3.x での構文

現在、Vue 3 では、関数型コンポーネントは純粋関数として定義されるので、非同期コンポーネントは新しい `defineAsyncComponent` ヘルパーでラップして定義する必要があります:

```js
import { defineAsyncComponent } from 'vue'
import ErrorComponent from './components/ErrorComponent.vue'
import LoadingComponent from './components/LoadingComponent.vue'

// オプションなしの非同期コンポーネント
const asyncModal = defineAsyncComponent(() => import('./Modal.vue'))

// オプション付きの非同期コンポーネント
const asyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

::: tip NOTE
Vue Router は *遅延読み込み* と呼ばれるルートコンポーネントを非同期に読み込む似たような仕組みをサポートしています。似てはいますが、この機能は Vue の非同期コンポーネントのサポートとは異なります。 Vue Router でルートコンポーネントを構成するときは、 `defineAsyncComponent` を **使用しない** 必要があります。これについては、 Vue Router のドキュメントの [ルートの遅延読み込み](https://next.router.vuejs.org/guide/advanced/lazy-loading.html) で詳しく説明されています。
:::

2.x からなされたもう 1 つの変更は、直接コンポーネント定義を提供できないことを正確に伝えるために `component` オプションの名前が `loader` に替わったことです。

```js{4}
import { defineAsyncComponent } from 'vue'

const asyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

加えて、2.x とは異なり、loader 関数はもう `resolve` と `reject` を引数にとらず、常に Promise を返します。

```js
// 2.x version
const oldAsyncComponent = (resolve, reject) => {
  /* ... */
}

// 3.x version
const asyncComponent = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      /* ... */
    })
)
```

非同期コンポーネントの使い方のさらなる情報は、以下を見てください:

- [ガイド: 動的 & 非同期コンポーネント](/guide/component-dynamic-async.html#動的コンポーネントにおける-keep-alive-の利用)
- [移行ビルドのフラグ: `COMPONENT_ASYNC`](migration-build.html#compat-の設定)
