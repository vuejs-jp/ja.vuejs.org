---
badges:
  - breaking
---

# イベント API <MigrationBadges :badges="$frontmatter.badges" />

## 概要

インスタンスメソッド`$on`、`$off`、`$once`は削除されました。アプリケーションインスタンスはイベントエミッタインタフェースを実装しなくなりました。

## 2.x での構文

2.x では、Vue インスタンスを使用して、イベントエミッタ API (`$on`、`$off`、`$once`) を介して強制的に接続されたハンドラをトリガすることができました。これは、アプリケーション全体で使用されるグローバルイベントリスナーを作成するための _イベントハブ_ を作るために使用されました。

```js
// eventHub.js

const eventHub = new Vue()

export default eventHub
```

```js
// ChildComponent.vue
import eventHub from './eventHub'

export default {
  mounted() {
    // eventHub リスナーの追加
    eventHub.$on('custom-event', () => {
      console.log('Custom event triggered!')
    })
  },
  beforeDestroy() {
    // eventHub リスナーの削除
    eventHub.$off('custom-event')
  },
}
```

```js
// ParentComponent.vue
import eventHub from './eventHub'

export default {
  methods: {
    callGlobalCustomEvent() {
      eventHub.$emit('custom-event') // ChildComponent がマウントされている場合、コンソールにメッセージが表示されます。
    },
  },
}
```

## 3.x での更新

インスタンスから`$on`、`$off`、`$once`メソッドを完全に削除しました。`$emit`は、親コンポーネントによって宣言的にアタッチされたイベントハンドラをトリガするために使用されるので、まだ既存の API の一部です。

## 移行の戦略

Vue 3 では、これらの API を使用して、コンポーネント内からコンポーネント自身が発行したイベントを購読することはできなくなりました。そのユースケースのための移行パスはありません。

ただし、EventHub (イベントハブ) パターンは、Event Emitter (イベントエミッタ) インタフェースを実装した外部ライブラリを使用することで置き換えることができます。例えば、[mitt](https://github.com/developit/mitt) や [tiny-emitter](https://github.com/scottcorgan/tiny-emitter) などです。

例:

```js
// eventHub.js
import emitter from 'tiny-emitter/instance'

export default {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args),
}
```

これは Vue 2 と同じような Event Emitter API を提供します。

これらのメソッドは、Vue 3 の将来の互換ビルドでもサポートされる可能性があります。
