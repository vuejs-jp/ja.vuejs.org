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

既存のイベントハブは、イベントエミッタインタフェースを実装した外部ライブラリ、例えば [mitt](https://github.com/developit/mitt) を使用して置き換えることができます。

これらのメソッドは互換性のあるビルドでもサポートされています。
