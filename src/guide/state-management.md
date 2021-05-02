# 状態管理

## 公式の Flux ライクな実装

大規模なアプリケーションは、たくさんのコンポーネント上に複数の状態が散らばっていることや、それらのコンポーネント間の相互作用が原因となって、複雑になりがちです。この問題を解消するために、Vue は Elm に触発された状態管理ライブラリの [Vuex](https://next.vuex.vuejs.org/) を提供しています。これは [vue-devtools](https://github.com/vuejs/vue-devtools) とも連携し、特別なセットアップなしで[タイムトラベルデバッグ](https://raw.githubusercontent.com/vuejs/vue-devtools/master/media/demo.gif)を提供します。

### React 開発者向けの情報

もしあなたが React エコシステムから来たのであれば、最も人気のある Flux 実装の [redux](https://github.com/reactjs/redux) と vuex がどのように比較されるか気になっているかもしれません。Redux は実際には view レイヤについての知識を持たないので、[シンプルなバインディング](https://classic.yarnpkg.com/en/packages?q=redux%20vue&p=1)を通して簡単に Vue と一緒に利用することができます。Vuex は、自らが Vue アプリケーションの内部にいることを _知っている_ という点で異なります。これによって Vue とのさらに優れた連携が可能になり、より直感的な API や向上した開発体験を提供することができます。

## ゼロから作るシンプルな状態管理

Vue アプリケーションの情報源となっているのがリアクティブな `data` オブジェクト、すなわち、`data` オブジェクトへのアクセスのみをプロキシするコンポーネントインスタンスであることは見過ごされがちです。それゆえに、複数のインスタンスで共有されるべき状態がある場合、オブジェクトをリアクティブにするために [reactive](/guide/reactivity-fundamentals.html#declaring-reactive-state) 関数を利用できます:

```js
const sourceOfTruth = Vue.reactive({
  message: 'Hello'
})

const appA = Vue.createApp({
  data() {
    return sourceOfTruth
  }
}).mount('#app-a')

const appB = Vue.createApp({
  data() {
    return sourceOfTruth
  }
}).mount('#app-b')
```

```html
<div id="app-a">App A: {{ message }}</div>

<div id="app-b">App B: {{ message }}</div>
```

このようにすることで `sourceOfTruth` が変化するたびに、`appA` と `appB` の両方がそれぞれの view を自動的に更新します。いま、唯一の情報源を持っていることにはなりますが、デバッグは悪夢になるでしょう。あらゆるデータが、アプリケーションのどこからでも、そしていつでも、トレースを残すことなく変更できてしまうのです。

```js
const appB = Vue.createApp({
  data() {
    return sourceOfTruth
  },
  mounted() {
    sourceOfTruth.message = 'Goodbye' // appA と appB の両方が 'Goodbye' メッセージをレンダリングします
  }
}).mount('#app-b')
```

この問題を解決するには、**store パターン** を適用することができます:

```js
const store = {
  debug: true,

  state: Vue.reactive({
    message: 'Hello!'
  }),

  setMessageAction(newValue) {
    if (this.debug) {
      console.log('setMessageAction triggered with', newValue)
    }

    this.state.message = newValue
  },

  clearMessageAction() {
    if (this.debug) {
      console.log('clearMessageAction triggered')
    }

    this.state.message = ''
  }
}
```

Store の状態を変化させる action がすべて store 自身の中にあることに注目してください。このような中央集権的な状態管理によって、どのような種類の状態変化が起こりうるのか、またそれらがどのようにトリガーされるのか、といったことの理解が容易になります。

さらに、それぞれのインスタンスやコンポーネントにプライベートな状態を持たせ、管理することも可能です:

```html
<div id="app-a">{{sharedState.message}}</div>

<div id="app-b">{{sharedState.message}}</div>
```

```js
const appA = Vue.createApp({
  data() {
    return {
      privateState: {},
      sharedState: store.state
    }
  },
  mounted() {
    store.setMessageAction('Goodbye!')
  }
}).mount('#app-a')

const appB = Vue.createApp({
  data() {
    return {
      privateState: {},
      sharedState: store.state
    }
  }
}).mount('#app-b')
```

![State Management](/images/state.png)

::: tip
action によって、元の状態を保持するオブジェクトを置き換えてはいけないことに注意してください。なぜなら、状態変化が監視され続けるためには、コンポーネントと store が同じオブジェクトへの参照を共有している必要があるためです。
:::

store が保持する状態をコンポーネントが直接的に変更することを禁止し、代わりにコンポーネントが store に通知するイベントを送ることによってアクションを実行する、という規約を発展させていくに従って、最終的に [Flux](https://facebook.github.io/flux/) アーキテクチャに辿り着きました。この規約による利点としては、store に起こるすべての状態変化を記録することができたり、変更ログやスナップショット、履歴や時間の巻き戻しといった高度なデバッギングヘルパーを実装できることが挙げられます。

ここまで来ると一周まわって [Vuex](https://next.vuex.vuejs.org/) に戻ってきました。ここまで読み進めてきたのなら、vuex を試してみるとよいでしょう！
