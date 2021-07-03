# はじめに

::: tip NOTE
すでに Vue 2 について知っていて、 Vue 3 の新機能について知りたいですか？ [移行ガイド](/guide/migration/introduction.html) をご覧ください！
:::

## Vue.js とは？

Vue (発音は /vju:/、**view** と同様) は、ユーザーインターフェイスを構築するための**プログレッシブフレームワーク**です。他のモノリシックなフレームワークとは異なり、Vue は少しずつ適用していけるように設計されています。中核となるライブラリはビュー層だけに焦点を当てており、使い始めるのも、他のライブラリや既存のプロジェクトに統合することも容易です。一方で、Vue を[モダンなツール](../guide/single-file-component.html)や[サポートライブラリ](https://github.com/vuejs/awesome-vue#components--libraries)と組み合わせることで、洗練されたシングルページアプリケーションを開発することもできます。

ここから先に進む前に Vue についてより深く知りたい方のために、基本理念やサンプルプロジェクトについて説明する<a id="modal-player" class="vuemastery-trigger" href="#">ビデオを作成しました</a>。

<VideoLesson href="https://www.vuemastery.com/courses/intro-to-vue-3/intro-to-vue3" title="Vue Mastery の無料ビデオコースを見る">Vue Mastery の無料ビデオコースを見る</VideoLesson>

<common-vuemastery-video-modal/>

## はじめに

<p>
  <ActionLink class="primary" url="installation.html">
    インストール
  </ActionLink>
</p>

::: tip
公式ガイドは、HTML、CSS そして JavaScript に関する中級レベルの知識を前提としています。フロントエンドの開発が初めてであれば、最初のステップとしてフレームワークに飛び込むのは良いアイデアではないかもしれません。基礎を掴んでから戻ってきましょう！他のフレームワークを使用したことのある経験は役に立ちますが、必須ではありません。
:::

Vue.js を試すには、[Hello World の例](https://codepen.io/team/Vue/pen/KKpRVpx) が最も簡単です。気軽に別のタブで開いて、基本的な例を試してみましょう。

Vue の他のインストール方法については、[インストール](installation.md) ページで紹介しています。注意点として、初心者が `vue-cli` で始めることは推奨**しません**（特に Node.js ベースのビルドツールに慣れていない場合）。

## 宣言的レンダリング

Vue.js のコアは、単純なテンプレート構文を使って宣言的にデータを DOM にレンダリングすることを可能にするシステムです:

```html
<div id="counter">
  Counter: {{ counter }}
</div>
```

```js
const Counter = {
  data() {
    return {
      counter: 0
    }
  }
}

Vue.createApp(Counter).mount('#counter')
```

これで、初めての Vue アプリケーションが作成できました！一見するとただ文字列をレンダリングするだけのテンプレートですが、Vue は内部で多くの処理をおこなっています。データと DOM は関連付けられ、すべてが **リアクティブ（反応的）** になっています。どうすればそれが分かるのでしょうか？以下の例で、`counter` プロパティが 1 秒ごとにインクリメントされたとき、レンダリングされた DOM がどのように変化するかを見てみましょう:

```js{8-10}
const Counter = {
  data() {
    return {
      counter: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
}
```

<FirstExample />

文字列の展開に加えて、以下のように要素の属性を束縛（バインディング）することもできます:

```html
<div id="bind-attribute">
  <span v-bind:title="message">
    Hover your mouse over me for a few seconds to see my dynamically bound
    title!
  </span>
</div>
```

```js
const AttributeBinding = {
  data() {
    return {
      message: 'You loaded this page on ' + new Date().toLocaleString()
    }
  }
}

Vue.createApp(AttributeBinding).mount('#bind-attribute')
```

<common-codepen-snippet title="Attribute dynamic binding" slug="KKpRVvJ" />

ここで新しい属性が出てきました。`v-bind` 属性は**ディレクティブ**と呼ばれます。ディレクティブは Vue によって提供された特別な属性であることを示すために `v-` 接頭辞がついています。これはあなたの推測通り、レンダリングされた DOM に特定のリアクティブな振る舞いを与えます。ここで宣言されているのは、「_この要素の `title` 属性を、現在アクティブなインスタンスにおける `message` プロパティの最新状態に維持する_」ということになります。

## ユーザー入力の制御

ユーザがあなたのアプリケーションと対話できるように、`v-on` ディレクティブを使ってイベントリスナをアタッチし、インスタンスのメソッドを呼び出すことができます:

```html
<div id="event-handling">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
```

```js
const EventHandling = {
  data() {
    return {
      message: 'Hello Vue.js!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message
        .split('')
        .reverse()
        .join('')
    }
  }
}

Vue.createApp(EventHandling).mount('#event-handling')
```

<common-codepen-snippet title="Event handling" slug="dyoeGjW" />

この方法では、DOM を触るのではなくアプリケーションの状態を更新することに注意してください。DOM の操作はすべて Vue によって処理されるので、背後にあるロジックを書くことに集中することができます。

Vue はまた、フォームの入力とアプリケーションの状態を双方向にバインディングするための `v-model` ディレクティブも提供します:

```html
<div id="two-way-binding">
  <p>{{ message }}</p>
  <input v-model="message" />
</div>
```

```js
const TwoWayBinding = {
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}

Vue.createApp(TwoWayBinding).mount('#two-way-binding')
```

<common-codepen-snippet title="Two-way binding" slug="poJVgZm" />

## 条件分岐とループ

要素の有無を切り替えることも非常に簡単です:

```html
<div id="conditional-rendering">
  <span v-if="seen">Now you see me</span>
</div>
```

```js
const ConditionalRendering = {
  data() {
    return {
      seen: true
    }
  }
}

Vue.createApp(ConditionalRendering).mount('#conditional-rendering')
```

この例は、テキストや属性だけでなく、DOM の**構造**にもデータを束縛できることを示しています。さらに Vue には、要素が Vue によって挿入/更新/削除されたとき、自動的に[トランジションエフェクト(遷移効果)](transitions-enterleave.md)を適用する強力なトランジションエフェクトシステムも提供します。

以下のサンドボックスで `seen` を `true` から `false` に変更すると、エフェクトを確認することができます:

<common-codepen-snippet title="Conditional rendering" slug="oNXdbpB" tab="js,result" />

Vue.js には他にもかなりの数のディレクティブがあり、それぞれが特定の機能を持っています。例えば、`v-for` ディレクティブを使えばアイテムのリストを配列内のデータを使って表示することができます:

```html
<div id="list-rendering">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```

```js
const ListRendering = {
  data() {
    return {
      todos: [
        { text: 'Learn JavaScript' },
        { text: 'Learn Vue' },
        { text: 'Build something awesome' }
      ]
    }
  }
}

Vue.createApp(ListRendering).mount('#list-rendering')
```

<common-codepen-snippet title="List rendering" slug="mdJLVXq" />

## コンポーネントによる構成

コンポーネントシステムは Vue におけるもうひとつの重要なコンセプトです。それは「小さく、自己完結的で、（多くの場合）再利用可能なコンポーネント」を組み合わせることで、大規模アプリケーションの構築を可能にする概念です。考えてみれば、ほぼすべてのタイプのアプリケーションインターフェイスは、コンポーネントツリーとして抽象化できます。

![コンポーネントツリー](/images/components.png)

Vue において、コンポーネントは本質的にはあらかじめ定義されたオプションを持つインスタンスです。Vue を使ってコンポーネントを登録するのはいたって簡単で、`App` オブジェクトと同様にコンポーネントオブジェクトを作成し、親の `components` オプションで定義します:

```js
// Vue アプリケーションを生成する
const app = Vue.createApp(...)

// todo-item という名前の新しいコンポーネントを定義する
app.component('todo-item', {
  template: `<li>This is a todo</li>`
})

// Vue application をマウントする
app.mount(...)
```

これで他のコンポーネントのテンプレートからこのコンポーネントを利用できるようになります:

```html
<ol>
  <!-- todo-item コンポーネントのインスタンスを生成する -->
  <todo-item></todo-item>
</ol>
```

しかし、これでは全ての todo で同じ文字列がレンダリングされてしまうだけで、あまり面白くありません。親のスコープから子コンポーネントへとデータを渡せるようにすべきです。[プロパティ](component-basics.html#passing-data-to-child-components-with-props)を受け取れるようにコンポーネントの定義を変えてみましょう:

```js
app.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
})
```

こうすることで、繰り返されるコンポーネントそれぞれに `v-bind` を使って todo を渡すことができます:

```html
<div id="todo-list-app">
  <ol>
    <!--
      各 todo-item にその内容を表す todo オブジェクトを指定することで、
      内容が動的に変化します。
      後述する "key" も各コンポーネントに
      指定する必要があります。
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```

```js
const TodoList = {
  data() {
    return {
      groceryList: [
        { id: 0, text: 'Vegetables' },
        { id: 1, text: 'Cheese' },
        { id: 2, text: 'Whatever else humans are supposed to eat' }
      ]
    }
  }
}

const app = Vue.createApp(TodoList)

app.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
})

app.mount('#todo-list-app')
```

<common-codepen-snippet title="Intro-Components-1" slug="VwLxeEz" />

このサンプルは不自然ではありますが、アプリケーションをより小さな単位に分割することに成功し、またプロパティのインターフェイスによって子コンポーネントは適切に疎結合な状態になりました。ここからさらに `<todo-item>` コンポーネントを、より複雑なテンプレートやロジックを使って、親コンポーネントに影響を与えることなく改良することができます。

大規模なアプリケーションでは、開発をおこないやすくするために、アプリケーション全体をコンポーネントに分割することが必要です。コンポーネントについては[ガイドの後半](component-basics.md)でより詳しく述べますが、コンポーネントを使ったアプリケーションのテンプレートがどういうものになるか、(架空の)例をここに載せておきます:

```html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### カスタム要素との関係

Vue のコンポーネントが [Web Components 仕様](https://www.w3.org/wiki/WebComponents/) の一部である **カスタム要素 (Custom Elements)** によく似ていることに気付いたかもしれません。これは Vue のコンポーネント構文はその仕様を手本にしているためです。例えば、Vue コンポーネントは [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) と `is` という特別な属性を実装しています。しかしながら、いくつか重要な違いがあります:

1. Web Components の仕様は確定しましたが、全てのブラウザにネイティブ実装されているわけではありません。Safari 10.1 以上、Chrome 54 以上、Firefox 63 以上が Web Components をネイティブでサポートしています。一方、Vue コンポーネントは、サポートされる全てのブラウザ（Internet Explorer 11 を除く - 詳細は [こちら](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0038-vue3-ie11-support.md) を確認してください）で同じ動作をします。必要があれば、Vue コンポーネントはネイティブなカスタム要素内に含めることもできます。

[//]: # 'TODO: link to compatibility build'

2. Vue コンポーネントは、通常のカスタム要素では利用できない重要な機能、中でもクロスコンポーネントデータフロー、カスタムイベント通信やビルドツールとの統合といったものを提供します。

Vue は内部的にはカスタム要素を使っていませんが、カスタム要素として使用または配布する場合に [優れた相互運用性](https://custom-elements-everywhere.com/#vue) があります。Vue CLI では、それ自身をネイティブのカスタム要素として登録するような Vue コンポーネントの構築もサポートしています。

## 準備ができましたか？

Vue.js コアの基本的な機能について簡単に紹介しました。このガイドの残りの部分では、基本的な機能だけでなく他の高度な機能についてもっと詳しく扱うので、全てに目を通すようにしてください！
