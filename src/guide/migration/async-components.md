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
const asyncPage = () => import('./NextPage.vue')
```

または、オプション付きのさらに高度なコンポーネント構文として:

```js
const asyncPage = {
  component: () => import('./NextPage.vue'),
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
const asyncPage = defineAsyncComponent(() => import('./NextPage.vue'))

// オプション付きの非同期コンポーネント
const asyncPageWithOptions = defineAsyncComponent({
  loader: () => import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

2.x からなされたもう一つの変更は、直接コンポーネント定義を提供できないことを正確に伝えるために `component` オプションの名前が `loader` に替わったことです。

```js{4}
import { defineAsyncComponent } from 'vue'

const asyncPageWithOptions = defineAsyncComponent({
  loader: () => import('./NextPage.vue'),
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
