---
badges:
  - breaking
---

# カスタムディレクティブ <MigrationBadges :badges="$frontmatter.badges" />

## 概要

コンポーネントのライフサイクルに合わせて、ディレクティブのフック関数の名称が変更されました。

## 2.x での構文

Vue 2 では、以下のフックを使用して要素のライフサイクルをターゲットにしたカスタムディレクティブが作成していました。これらはすべてオプションです。

- **bind** - ディレクティブが要素にバインドされると発生します。これは一度だけ発生します。
- **inserted** - 要素が親 DOM に挿入された後に発生します。
- **update** - 要素が更新されたときに呼び出されますが、子はまだ更新されていません。
- **componentUpdated** - コンポーネントと子が更新されると呼び出されます。
- **unbind** - ディレクティブが削除されると呼び出されます。 また、これは一度だけ呼び出されます。

この例を次に示します。

```html
<p v-highlight="'yellow'">このテキストを明るい黄色で強調表示します</p>
```

```js
Vue.directive('highlight', {
  bind(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

この要素の初期設定では、ディレクティブは値を渡してスタイルをバインドします。値は、アプリケーションにてさまざまな値に更新できます。

## 3.x での構文

ただし、Vue 3 では、カスタムディレクティブ用のよりまとまりのある API を作成しました。Vue 2 では、似たようなイベントにフックしているにもかかわらず、コンポーネントのライフサイクルメソッドとは大きく異なります。これらを次のように統合しました。

- **created** - 追加されました！これは、要素の属性やイベントリスナーが適用される前に呼び出されます。
- bind → **beforeMount**
- inserted → **mounted**
- **beforeUpdate**: 追加されました！これは、コンポーネントのライフサイクルフックのように、要素自体が更新される前に呼び出されます。
- update → 削除されました！updated と似たようなものが多すぎて冗長です。代わりに updated を使ってください。
- componentUpdated → **updated**
- **beforeUnmount**: 追加されました！コンポーネントのライフサイクルフックと同様に、要素がマウント解除される直前に呼び出されます。
- unbind -> **unmounted**

最終的な API は次のとおりです。

```js
const MyDirective = {
  created(el, binding, vnode, prevVnode) {}, // new
  beforeMount() {},
  mounted() {},
  beforeUpdate() {}, // 追加
  updated() {},
  beforeUnmount() {}, // 追加
  unmounted() {}
}
```

Vue 3 の API は、先ほどの例を用いてこのように使用できます。

```html
<p v-highlight="'yellow'">このテキストを明るい黄色で強調表示します</p>
```

```js
const app = Vue.createApp({})

app.directive('highlight', {
  beforeMount(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

カスタムディレクティブのライフサイクルフックがコンポーネントと同じになったことで、理由を説明したり、覚えるのがより簡単になりました。

### 特別な問題への対処: コンポーネントのインスタンスへのアクセス

一般的には、ディレクティブをコンポーネントのインスタンスから独立させることが推奨されています。カスタムディレクティブ内からインスタンスにアクセスする状況は、本来はディレクティブがコンポーネント自体であるべきことが多いです。しかし、まれにこれが有効なこともあります。

Vue 2 では、コンポーネントインスタンスは `vnode` 引数を使ってアクセスする必要がありました。

```js
bind(el, binding, vnode) {
  const vm = vnode.context
}
```

Vue 3 では、インスタンスは `binding` の一部になりました。

```js
mounted(el, binding, vnode) {
  const vm = binding.instance
}
```

:::warning
[fragments](/guide/migration/fragments.html#overview) のサポートにより、コンポーネントは複数のルートノードを持つ可能性があります。マルチルートコンポーネントに適用すると、カスタムディレクティブは無視され、警告がログ出力されます。
:::

## 移行の戦略

[移行ビルドのフラグ: `CUSTOM_DIR`](migration-build.html#compat-の設定)
