---
badges:
  - breaking
---

# イベント API <MigrationBadges :badges="$frontmatter.badges" />

## 概要

インスタンスメソッド `$on`、`$off`、`$once` は削除されました。コンポーネントインスタンスはイベントエミッタインタフェースを実装しなくなりました。

## 2.x での構文

2.x では、Vue インスタンスを使用して、イベントエミッタ API (`$on`、`$off`、`$once`) を介して強制的に接続されたハンドラをトリガすることができました。これは、アプリケーション全体で使用されるグローバルイベントリスナを作成するための _イベントバス_ を作るために使用できました。

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

[移行ビルドのフラグ: `INSTANCE_EVENT_EMITTER`](migration-build.html#compat-の設定)

Vue 3 では、これらの API を使用して、コンポーネント内からコンポーネント自身が発行したイベントを購読することはできなくなりました。そのユースケースのための移行パスはありません。

### ルートコンポーネントのイベント

静的なイベントリスナは `createApp` にプロパティとして渡すことで、ルートコンポーネントに追加することができます:

```js
createApp(App, {
  // 'expand' イベントを待機する
  onExpand() {
    console.log('expand')
  }
})
```

### Event Bus

Event Bus (イベントバス) パターンは、Event Emitter (イベントエミッタ) インタフェースを実装した外部ライブラリを使用することで置き換えることができます。例えば、[mitt](https://github.com/developit/mitt) や [tiny-emitter](https://github.com/scottcorgan/tiny-emitter) などです。

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

ほとんどの場合、コンポーネント同士の通信にグローバル Event Bus を使うことには反対します。短期的にはもっとも単純な解決策であることが多いですが、長期的にはいつもメンテナンスの頭痛の種になることが証明されています。状況に応じて、Event Bus を使う以外のいろいろな方法があります。:

* [プロパティ](/guide/component-basics.html#プロパティを用いた子コンポーネントへのデータの受け渡し) と [イベント](/guide/component-basics.html#子コンポーネントのイベントを購読する) は、親子間の通信をする最初の選択肢です。兄弟は親を介して通信できます。
* [Provide と Inject](/guide/component-provide-inject.html) はコンポーネントと、そのスロットのコンテンツとの通信を可能にします。これはいつも一緒に使われる緊密に結合されたコンポーネントに有効です。
* `provide`/`inject` はコンポーネント間の距離が離れている通信にも使えます。プロパティを必要としないコンポーネントを何階層にもわたって、プロパティを渡す必要のある「Prop Drilling（プロパティのバケツリレーのこと）」を回避するのに役立ちます。
* Prop Drilling はスロットを使うようにリファクタリングして回避することもできます。中間のコンポーネントがプロパティを必要としない場合、それは関心の分離に問題があることを示しているかもしれません。そのコンポーネントにスロットを導入することで、親はコンテンツを直接作成することができて、中間のコンポーネントが関与することなくプロパティを渡すことができます。
* [Vuex](https://next.vuex.vuejs.org/) のような [グローバルな状態管理](/guide/state-management.html) もあります。
