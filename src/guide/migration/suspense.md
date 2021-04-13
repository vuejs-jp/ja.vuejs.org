---
badges:
  - new
---

# Suspense <MigrationBadges :badges="$frontmatter.badges" />

:::warning 実験的
Suspense は実験的な新機能であり、 API はいつでも変更される可能性があります。コミュニティが現在の実装についてフィードバックできるように、ここにドキュメント化されています。

本番のアプリケーションでは使用しないでください。
:::

## イントロダクション

コンポーネントが正しくレンダリングされる前に、なにか非同期のリクエストを実行する必要があるのはよくあることです。コンポーネントはローカルでよくこの処理をしますが、多くの場合にこれは優れたアプローチです。

`<suspense>` コンポーネントは、個々のコンポーネントではなくコンポーネントツリーのさらに上で待機処理できるように、代替手段を提供します。

よくある使用例は、 [非同期コンポーネント](/guide/component-dynamic-async.html#async-components) があります:

```vue{2-4,6,17}
<template>
  <suspense>
    <template #default>
      <todo-list />
    </template>
    <template #fallback>
      <div>
        Loading...
      </div>
    </template>
  </suspense>
</template>

<script>
export default {
  components: {
    TodoList: defineAsyncComponent(() => import('./TodoList.vue'))
  }
}
</script>
```

`<suspense>` コンポーネントには2つのスロットがあります。どちらのスロットにも1つの直系の子要素しか入れられません。可能であれば、 `default` スロットの要素が表示されます。そうでない場合は、代わりに `fallback` スロットの要素が表示されます。

重要なのは、非同期コンポーネントは `<suspense>` の直系の子要素である必要はないということです。コンポーネントツリー内のどの深さにあってもよく、`<suspense>` 自身と同じテンプレート内にある必要はありません。コンテンツは、すべての子孫要素が準備できたときに初めて解決したとみなされます。

`fallback` スロットを発火するもう一つの方法は、子孫コンポーネントがその `setup` 関数から Promise を返すことです。これは、明示的に Promise を返すのではなく、通常は `async` を使用して実装されます:

```js{2}
export default {
  async setup() {
    // ほとんどの Composition API 関数は、
    // 最初の `await` より前にしか動かないため、
    // `setup` 内で `await` を使用するには十分注意してください。
    const data = await loadData()

    // この関数は `async` なので、
    // 暗黙的に Promise でラップされています。
    return {
      // ...
    }
  }
}
```

## 子要素の更新

一度 `<suspense>` がその `default` スロットのコンテンツを解決すると、 `default` ルート要素が置き換えられた場合にのみ、再び発火されます。

ルート要素が変更されると `pending` イベントが発火します。しかし、デフォルトでは DOM を更新して `fallback` コンテンツを表示することはありません。代わりに、新しいコンポーネントの準備が整うまで、古い DOM を表示し続けます。これは `timeout` プロパティを使って制御できます。このミリ秒単位で表される値は `<suspense>` コンポーネントに `fallback` を表示するまでの待ち時間を伝えます。 値を `0` にすると、 `<suspense>` が pending 状態になったときにすぐ表示されます。

## イベント

`<suspense>` コンポーネントは、 `pending` イベントに加えて、 `resolve` イベントと `fallback` イベントも持っています。 `resolve` イベントは、新しいコンテンツが `default` スロットで解決を終えたときに発行されます。 `fallback` イベントは、 `fallback` スロットの内容が表示されたときに発火します。

このイベントは、例えば、新しいコンポーネントを読み込んでいる間、古い DOM の前にローディングインジケータを表示するのに使用することができます。

## 他のコンポーネントとの組み合わせ

`<suspense>` は [`<transition>`](/api/built-in-components.html#transition) や [`<keep-alive>`](/api/built-in-components.html#keep-alive) コンポーネントと組み合わせて使いたいことがよくあります。これらのコンポーネントを正しく動作させるためには、その入れ子の順序が重要です。

また、これらのコンポーネントは、 [Vue Router](https://next.router.vuejs.org/) の `<router-view>` コンポーネントと組み合わせて使われることが多いです。

次の例では、これらのコンポーネントを入れ子にして、すべてのコンポーネントが期待通りの動作をするようにしています。よりシンプルな組み合わせの場合は、必要のない部品を取り除くことができます:

```html
<router-view v-slot="{ Component }">
  <template v-if="Component">
    <transition mode="out-in">
      <keep-alive>
        <suspense>
          <component :is="Component"></component>
          <template #fallback>
            <div>
              Loading...
            </div>
          </template>
        </suspense>
      </keep-alive>
    </transition>
  </template>
</router-view>
```

Vue Router には、 Dynamic imports (動的インポート) を使った [遅延ローディングルート](https://next.router.vuejs.org/guide/advanced/lazy-loading.html) のサポートが組み込まれています。これらは非同期コンポーネントとは異なり、現在のところ `<suspense>` を発火させることはありません。しかし、それらは子孫要素として非同期コンポーネントを持つことができ、通常の方法で `<suspense>` を発火することができます。
