# 特別な属性

## key

- **受け入れ型:** `number | string | symbol `

  特別な属性 `key` は、Vue の仮想 DOM アルゴリズムのため、ノードの新しいリストを古いリストに対して差分を取るときに、VNodes を識別するヒントとして主に使われます。キーがない場合、Vue は要素の移動を最小限にするアルゴリズムを使い、できる限り同じ種類の要素をその場でパッチや再利用しようとします。キーがある場合、キーの変更順序に基づいて要素の順番を変更して、存在しなくなったキーを持つ要素は常に削除や破棄されます。

  同じ共通の親を持つ子どもは、**ユニークなキー** をもつ必要があります。重複したキーはレンダリングエラーを発生します。

  最も一般的な使用例は、`v-for` との組み合わせです:

  ```html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  これは要素やコンポーネントを再利用するのではなく、強制的に置換するときにも使えます。これは次のようなことをしたいときに便利です:

  - コンポーネントのライフサイクルフックを適切に引き起こす
  - トランジションを引き起こす

  例えば:

  ```html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  `text` が変更されたとき、`<span>` は常にパッチではなく置換され、トランジションが引き起こされます。

## ref

- **受け入れ型:** `string | Function`

  `ref` は要素や子コンポーネントの参照を登録するのに使います。参照は親コンポーネントの `$refs` オブジェクトの下に登録されます。単純に DOM 要素で使った場合、参照はその要素になります。子コンポーネントで使った場合、参照はコンポーネントインスタンスになります:

  ```html
  <!-- vm.$refs.p は DOM ノードになります -->
  <p ref="p">hello</p>

  <!-- vm.$refs.child はコンポーネントインスタンスになります -->
  <child-component ref="child"></child-component>

  <!-- 動的にバインドした場合、コールバック関数として ref を定義でき、要素やコンポーネントインスタンスを明示的に渡すことができます -->
  <child-component :ref="(el) => child = el"></child-component>
  ```

  ref 登録のタイミングについての重要な注意点は、ref 自体が Render 関数の結果として作成されるため、初期レンダリングではアクセスできません。まだ存在しないからです。また `$refs` はリアクティブではないため、データバインディング用のテンプレートでは使おうとしないでください。

- **参照:** [子コンポーネントの参照](../guide/component-template-refs.html)

## is

- **受け入れ型:** `string | Object （コンポーネントのオプションオブジェクト）`

  [動的コンポーネント](../guide/component-dynamic-async.html) に使います。

  例えば:

  ```html
  <!-- currentView が変わるとコンポーネントが変わります -->
  <component :is="currentView"></component>
  ```

- **ネイティブ要素での使用方法** <Badge text="3.1+" />

  ネイティブ HTML 要素に `is` 属性が使われると、それはウェブプラットフォームのネイティブ機能の [カスタマイズされた組み込み要素の作成](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example) として解釈されます。

  しかし、[DOM テンプレートパース時の注意](/guide/component-basics.html#dom-テンプレートパース時の注意) で説明されているように、Vue がネイティブ要素を Vue コンポーネントに置き換える必要があるユースケースもあります。`is` 属性の値の前に `vue:` を付けることで、Vue がその要素を Vue コンポーネントとしてレンダリングします:

  ```html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **参照:**
  - [動的コンポーネント](../guide/component-dynamic-async.html)
  - [Vue 2 からの変更点を説明する RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0027-custom-elements-interop.md#customized-built-in-elements)
