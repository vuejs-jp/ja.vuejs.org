---
badges:
  - breaking
---

# イベント API <MigrationBadges :badges="$frontmatter.badges" />

## 概要

インスタンスメソッド `$on`、`$off`、`$once` は削除されました。コンポーネントインスタンスはイベントエミッタインタフェースを実装しなくなりました。

## 2.x での構文

2.x では、Vue インスタンスを使用して、イベントエミッタ API (`$on`、`$off`、`$once`) を介して強制的に接続されたハンドラをトリガすることができました。これは、アプリケーション全体で使用されるグローバルイベントリスナーを作成するための _イベントバス_ を作るために使用できました。

```js
// eventBus.js

const eventBus = new Vue()

export default eventBus
```

```js
// ChildComponent.vue
import eventBus from './eventBus'

export default {
  mounted() {
    // eventBus リスナーの追加
    eventBus.$on('custom-event', () => {
      console.log('Custom event triggered!')
    })
  },
  beforeDestroy() {
    // eventBus リスナーの削除
    eventBus.$off('custom-event')
  },
}
```

```js
// ParentComponent.vue
import eventBus from './eventBus'

export default {
  methods: {
    callGlobalCustomEvent() {
      eventBus.$emit('custom-event') // ChildComponent がマウントされている場合、コンソールにメッセージが表示されます。
    },
  },
}
```

## 3.x での更新

インスタンスから `$on`、`$off`、`$once` メソッドを完全に削除しました。`$emit` は、親コンポーネントによって宣言的にアタッチされたイベントハンドラをトリガするために使用されるので、まだ既存の API の一部です。

## 移行の戦略

[Migration build flag: `INSTANCE_EVENT_EMITTER`](migration-build.html#compat-configuration)

Vue 3 では、これらの API を使用して、コンポーネント内からコンポーネント自身が発行したイベントを購読することはできなくなりました。そのユースケースのための移行パスはありません。

### Root Component Events

Static event listeners can be added to the root component by passing them as props to `createApp`:

```js
createApp(App, {
  // Listen for the 'expand' event
  onExpand() {
    console.log('expand')
  }
})
```

### Event Bus

EventBus (イベントバス) パターンは、Event Emitter (イベントエミッタ) インタフェースを実装した外部ライブラリを使用することで置き換えることができます。例えば、[mitt](https://github.com/developit/mitt) や [tiny-emitter](https://github.com/scottcorgan/tiny-emitter) などです。

例:

```js
// eventBus.js
import emitter from 'tiny-emitter/instance'

export default {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args)
}
```

これは Vue 2 と同じような Event Emitter API を提供します。

In most circumstances, using a global event bus for communicating between components is discouraged. While it is often the simplest solution in the short term, it almost invariably proves to be a maintenance headache in the long term. Depending on the circumstances, there are various alternatives to using an event bus:

* [Props](/guide/component-basics.html#passing-data-to-child-components-with-props) and [events](/guide/component-basics.html#listening-to-child-components-events) should be your first choice for parent-child communication. Siblings can communicate via their parent.
* [Provide and inject](/guide/component-provide-inject.html) allow a component to communicate with its slot contents. This is useful for tightly-coupled components that are always used together.
* `provide`/`inject` can also be used for long-distance communication between components. It can help to avoid 'prop drilling', where props need to be passed down through many levels of components that don't need those props themselves.
* Prop drilling can also be avoided by refactoring to use slots. If an interim component doesn't need the props then it might indicate a problem with separation of concerns. Introducing a slot in that component allows the parent to create the content directly, so that props can be passed without the interim component needing to get involved.
* [Global state management](/guide/state-management.html), such as [Vuex](https://next.vuex.vuejs.org/).
