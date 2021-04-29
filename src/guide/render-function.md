# Render 関数

Vue では、大多数のケースにおいてテンプレートを使ってアプリケーションを構築することを推奨していますが、完全な JavaScript プログラミングの力が必要になる状況もあります。そこでは私たちは **render 関数** を使うことができます。

さあ、 `render()` 関数が実用的になる例に取りかかりましょう。例えば、アンカーつきの見出しを生成したいとします:

```html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

アンカーつきの見出しはとても頻繁に使われますので、コンポーネントにするべきです:

```vue-html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

コンポーネントは、`level` の値に応じた見出しを生成する必要があります。手っ取り早くこれで実現しましょう:

```js
const app = Vue.createApp({})

app.component('anchored-heading', {
  template: `
    <h1 v-if="level === 1">
      <slot></slot>
    </h1>
    <h2 v-else-if="level === 2">
      <slot></slot>
    </h2>
    <h3 v-else-if="level === 3">
      <slot></slot>
    </h3>
    <h4 v-else-if="level === 4">
      <slot></slot>
    </h4>
    <h5 v-else-if="level === 5">
      <slot></slot>
    </h5>
    <h6 v-else-if="level === 6">
      <slot></slot>
    </h6>
  `,
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

このテンプレートは良いものには思えません。冗長なだけでなく、 `<slot></slot>` がすべての見出しのレベルにコピーされています。そして、アンカー要素を追加する時にはすべての `v-if/v-else-if` の分岐にまたコピーしなければなりません。

ほとんどのコンポーネントでテンプレートがうまく働くとはいえ、明らかにこれはそうではないものの一つです。そこで、 `render()` 関数を使ってこれを書き直してみましょう。

```js
const app = Vue.createApp({})

app.component('anchored-heading', {
  render() {
    const { h } = Vue

    return h(
      'h' + this.level, // タグ名
      {}, // props/属性
      this.$slots.default() // 子供の配列
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

`render()` 関数の実装はとても単純ですが、コンポーネントインスタンスのプロパティについてよく理解している必要があります。この場合では、 `anchored-heading` の内側の `Hello world!` のように `v-slot` ディレクティブなしで子供を渡した時には、その子供は `$slots.default()` のコンポーネントインスタンスに保持されるということを知っている必要があります。もしまだ知らないのであれば、 **render 関数に取り掛かる前に [インスタンスプロパティ API](../api/instance-properties.html) を通読することをお勧めします。**

## DOM ツリー

render 関数に取り掛かる前に、ブラウザがどのように動くのかについて少し知っておくことが重要です。この HTML を例にしましょう:

```html
<div>
  <h1>My title</h1>
  Some text content
  <!-- TODO: Add tagline -->
</div>
```

ブラウザはこのコードを読み込むと、血縁関係を追跡するために家系図を構築するのと同じように、全てを追跡する [「DOM ノード」のツリー](https://javascript.info/dom-nodes)を構築します。

<!-- NOTE:
原文が分かりづらいため、v2の記述を元に翻訳
When a browser reads this code, it builds a tree of “DOM nodes” to help it keep track of everything, just as you might build a family tree to keep track of your extended family.
-->

上の HTML の DOM ノードツリーはこんな感じになります。

![DOM ツリーの可視化](/images/dom-tree.png)

すべての要素はノードです。テキストのすべてのピースはノードです。コメントですらノードです！それぞれのノードは子供を持つことができます。 (つまり、それぞれのノードは他のノードを含むことができます)

これらすべてのノードを効率的に更新することは難しくなり得ますが、ありがたいことに、それを手動で行う必要はありません。代わりに、テンプレートや render 関数で、ページ上にどのような HTML が欲しいかを Vue に伝えるのです。

テンプレート:

```html
<h1>{{ blogTitle }}</h1>
```

または render 関数:

```js
render() {
  return Vue.h('h1', {}, this.blogTitle)
}
```

そしてどちらの場合でも、 `blogTitle` が変更されたとしても Vue が自動的にページを最新の状態に保ちます。

## 仮想 DOM ツリー

Vue は、実際の DOM に反映する必要のある変更を追跡するために **仮想 DOM** を構築して、ページを最新の状態に保ちます。この行をよく見てみましょう:

```js
return Vue.h('h1', {}, this.blogTitle)
```

`h()` 関数が返すものはなんでしょうか？これは、 _正確には_ 実際の DOM 要素ではありません。それが返すのは、ページ上にどんな種類のノードをレンダリングするのかを Vue に伝えるための情報をもったプレーンなオブジェクトです。この情報には子供のノードの記述も含まれます。私たちは、このノードの記述を *仮想ノード* と呼び、通常 **VNode** と省略します。「仮想 DOM」というのは、Vue コンポーネントのツリーから構成される VNode のツリー全体のことなのです。

## `h()` の引数

`h()` 関数は VNode を作るためのユーティリティです。もっと正確に `createVNode()` と名づけられることもあるかもしれませんが、頻繁に使用されるので、簡潔さのために `h()` と呼ばれます。

```js
// @returns {VNode}
h(
  // {String | Object | Function } tag
  // HTMLタグ名、コンポーネントまたは非同期コンポーネント
  // nullを返す関数を使用した場合、コメントがレンダリングされます。
  //
  // 必須
  'div',

  // {Object} props
  // テンプレート内で使うであろう属性、プロパティ、イベントに対応するオブジェクト
  //
  // 省略可能
  {},

  // {String | Array | Object} children
  // `h()` で作られた子供のVNode、または文字列(テキストVNodeになる)、
  // またはスロットをもつオブジェクト
  //
  // 省略可能
  [
    'Some text comes first.',
    h('h1', 'A headline'),
    h(MyComponent, {
      someProp: 'foobar'
    })
  ]
)
```

## 完全な例

この知識によって、書き始めたコンポーネントを今では完成させることができます:

```js
const app = Vue.createApp({})

/** 子供のノードから再帰的にテキストを取得する */
function getChildrenTextContent(children) {
  return children
    .map(node => {
      return typeof node.children === 'string'
        ? node.children
        : Array.isArray(node.children)
        ? getChildrenTextContent(node.children)
        : ''
    })
    .join('')
}

app.component('anchored-heading', {
  render() {
    // 子供のテキストからケバブケース(kebab-case)のIDを作成する
    const headingId = getChildrenTextContent(this.$slots.default())
      .toLowerCase()
      .replace(/\W+/g, '-') // 英数字とアンダースコア以外の文字を-に置換する
      .replace(/(^-|-$)/g, '') // 頭と末尾の-を取り除く

    return Vue.h('h' + this.level, [
      Vue.h(
        'a',
        {
          name: headingId,
          href: '#' + headingId
        },
        this.$slots.default()
      )
    ])
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

## 制約

### VNode は一意でなければならない

コンポーネント内のすべての VNode は一意でなければなりません。つまり、下のような render 関数は無効だということです:

```js
render() {
  const myParagraphVNode = Vue.h('p', 'hi')
  return Vue.h('div', [
    // おっと - VNode が重複しています!
    myParagraphVNode, myParagraphVNode
  ])
}
```

もしあなたが本当に同じ要素、コンポーネントを何回もコピーしたいなら、ファクトリー関数を使えばできます。例えば、次の render 関数は 20 個の同じ段落をレンダリングする完全に正しい方法です。

```js
render() {
  return Vue.h('div',
    Array.apply(null, { length: 20 }).map(() => {
      return Vue.h('p', 'hi')
    })
  )
}
```

## テンプレートの機能をプレーンな JavaScript で置き換える

### `v-if` と `v-for`

何であれ、プレーンな JavaScript で簡単に実現できることについては、Vue の render 関数は固有の代替手段を提供していません。例えば、テンプレートでの `v-if` や `v-for` の使用:

```html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

これは、render 関数では JavaScript の `if`/`else` と `map()` で書き換えることができます。

```js
props: ['items'],
render() {
  if (this.items.length) {
    return Vue.h('ul', this.items.map((item) => {
      return Vue.h('li', item.name)
    }))
  } else {
    return Vue.h('p', 'No items found.')
  }
}
```

### `v-model`

`v-model` ディレクティブは、テンプレートのコンパイル中に `modelValue` と `onUpdate:modelValue` プロパティに展開されます - 私たちはそれらのプロパティを自分自身で提供する必要があります:

```js
props: ['modelValue'],
render() {
  return Vue.h(SomeComponent, {
    modelValue: this.modelValue,
    'onUpdate:modelValue': value => this.$emit('update:modelValue', value)
  })
}
```

### `v-on`

私たちは適切なプロパティ名をイベントハンドラに与える必要があります。例えば、 `click` イベントをハンドルする場合は、プロパティ名は `onClick` になります。

```js
render() {
  return Vue.h('div', {
    onClick: $event => console.log('clicked', $event.target)
  })
}
```

#### イベント修飾子

For the `.passive`, `.capture`, and `.once` event modifiers, they can be concatenated after event name using camel case.

例えば:

```javascript
render() {
  return Vue.h('input', {
    onClickCapture: this.doThisInCapturingMode,
    onKeyupOnce: this.doThisOnce,
    onMouseoverOnceCapture: this.doThisOnceInCapturingMode,
  })
}
```

その他すべてのイベントおよびキー修飾子については、特別な API は必要ありません。
なぜなら、ハンドラーの中でイベントのメソッドを使用することができるからです:

| 修飾子                                                | ハンドラーでの同等の記述                                                                                              |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `.stop`                                               | `event.stopPropagation()`                                                                                            |
| `.prevent`                                            | `event.preventDefault()`                                                                                             |
| `.self`                                               | `if (event.target !== event.currentTarget) return`                                                                   |
| Keys:<br>`.enter`, `.13`                              | `if (event.keyCode !== 13) return` (他のキー修飾子については、 `13` を [別のキーコード](http://keycode.info/) に変更する) |
| Modifiers Keys:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (`ctrlKey` をそれぞれ `altKey`、 `shiftKey`、 `metaKey` に変更する)                      |

これらすべての修飾子を一緒に使った例がこちらです:

```js
render() {
  return Vue.h('input', {
    onKeyUp: event => {
      // イベントを発行した要素がイベントが紐づけられた要素ではない場合は
      // 中断する
      if (event.target !== event.currentTarget) return
      // 押されたキーが Enter(13) ではない場合、Shift キーが同時に押されて
      // いなかった場合は中断する
      if (!event.shiftKey || event.keyCode !== 13) return
      // イベントの伝播(propagation)を止める
      event.stopPropagation()
      // この要素のデフォルトの keyup ハンドラが実行されないようにする
      event.preventDefault()
      // ...
    }
  })
}
```

### スロット

[`this.$slots`](../api/instance-properties.html#slots) から取得した VNode の配列でスロットの中身にアクセスすることができます:

```js
render() {
  // `<div><slot></slot></div>`
  return Vue.h('div', {}, this.$slots.default())
}
```

```js
props: ['message'],
render() {
  // `<div><slot :text="message"></slot></div>`
  return Vue.h('div', {}, this.$slots.default({
    text: this.message
  }))
}
```

render 関数で子コンポーネントにスロットを渡す方法:

```js
render() {
  // `<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
  return Vue.h('div', [
    Vue.h(
      Vue.resolveComponent('child'),
      {},
      // { name: props => VNode | Array<VNode> } の形で
      // 子供のオブジェクトを `slots` として渡す
      {
        default: (props) => Vue.h('span', props.text)
      }
    )
  ])
}
```

## JSX

たくさんの `render` 関数を書いていると、こういう感じのものを書くのがつらく感じるかもしれません:

```js
Vue.h(
  Vue.resolveComponent('anchored-heading'),
  {
    level: 1
  },
  {
    default: () => [Vue.h('span', 'Hello'), ' world!']
  }
)
```

特に、テンプレート版がそれにくらべて簡潔な場合は:

```vue-html
<anchored-heading :level="1"> <span>Hello</span> world! </anchored-heading>
```

これが、Vue で JSX を使い、テンプレートに近い構文に戻す [Babel プラグイン](https://github.com/vuejs/jsx-next) が存在する理由です。

```jsx
import AnchoredHeading from './AnchoredHeading.vue'

const app = createApp({
  render() {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})

app.mount('#demo')
```

JSX がどのように JavaScript に変換されるのか、より詳細な情報は、 [使用方法](https://github.com/vuejs/jsx-next#installation) を見てください。

## テンプレートのコンパイル

あなたは Vue のテンプレートが実際に render 関数にコンパイルされることに興味があるかもしれません。これは通常知っておく必要のない実装の詳細ですが、もし特定のテンプレートの機能がどのようにコンパイルされるか知りたいのなら、これが面白いかもしれません。これは、 `Vue.compile` を使用してテンプレートの文字列をライブコンパイルする小さなデモです:

<iframe src="https://vue-next-template-explorer.netlify.app/" width="100%" height="420"></iframe>
