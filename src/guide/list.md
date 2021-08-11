# リストレンダリング

<VideoLesson href="https://vueschool.io/lessons/list-rendering-in-vue-3?friend=vuejs" title="Learn how to render lists on Vue School">Learn how to render list with a free Vue School lesson</VideoLesson>

## v-for で配列に要素をマッピングする

配列に基づいて、アイテムのリストを描画するために、`v-for` ディレクティブを使用することができます。 `v-for` ディレクティブには、 `item in items` の形式の特別な構文が必要で、 `items` はソースデータの配列、 `item` は繰り返される配列要素の**エイリアス**です:

```html
<ul id="array-rendering">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
```

```js
Vue.createApp({
  data() {
    return {
      items: [{ message: 'Foo' }, { message: 'Bar' }]
    }
  }
}).mount('#array-rendering')
```

結果:

<common-codepen-snippet title="v-for with Array" slug="VwLGbwa" tab="js,result" :preview="false" />

`v-for` ブロック内では、親スコープのプロパティへの完全なアクセスを持っています。また `v-for` は現在のアイテムに対する配列のインデックスを、任意の 2 つ目の引数としてサポートしています。

```html
<ul id="array-with-index">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

```js
Vue.createApp({
  data() {
    return {
      parentMessage: 'Parent',
      items: [{ message: 'Foo' }, { message: 'Bar' }]
    }
  }
}).mount('#array-with-index')
```

結果:

<common-codepen-snippet title="v-for with Array and index" slug="wvaEdBP" tab="js,result" :preview="false" />

また、区切り文字として `in` の代わりに `of` を使用することができます。これは JavaScript のイテレータ構文に近いものです:

```html
<div v-for="item of items"></div>
```

## オブジェクトの `v-for`

オブジェクトのプロパティに対して、`v-for` を使って反復処理することもできます。

```html
<ul id="v-for-object" class="demo">
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

```js
Vue.createApp({
  data() {
    return {
      myObject: {
        title: 'How to do lists in Vue',
        author: 'Jane Doe',
        publishedAt: '2016-04-10'
      }
    }
  }
}).mount('#v-for-object')
```

結果:

<common-codepen-snippet title="v-for with Object" slug="NWqLjqy" tab="js,result" :preview="false" />

2 つ目の引数としてプロパティ名（すなわちキー）も提供できます:

```html
<li v-for="(value, name) in myObject">
  {{ name }}: {{ value }}
</li>
```

<common-codepen-snippet title="v-for with Object and key" slug="poJOPjx" tab="js,result" :preview="false" />

index も提供できます:

```html
<li v-for="(value, name, index) in myObject">
  {{ index }}. {{ name }}: {{ value }}
</li>
```

<common-codepen-snippet title="v-for with Object key and index" slug="abOaWdo" tab="js,result" :preview="false" />

:::tip Note
オブジェクトを反復処理するとき、順序は `Object.keys()` の列挙順のキーに基づいており、全ての JavaScript エンジンの実装で一貫性が保証されて**いません**。
:::

## 状態の維持

Vue が `v-for` で描画された要素のリストを更新する際、デフォルトでは “その場でパッチを適用する” (in-place patch) 戦略が用いられます。データのアイテムの順序が変更された場合、アイテムの順序に合わせて DOM 要素を移動する代わりに、 Vue は各要素にその場でパッチを適用して、その特定のインデックスに何を描画するべきかを確実に反映します。

このデフォルトのモードは効率がいいです。しかしこれは、**描画されたリストが子コンポーネントの状態や、一時的な DOM の状態に依存していないときにだけ適しています (例: フォームのインプットの値)**。

Vue が各ノードの識別情報を追跡できるヒントを与えるために、また、先ほど説明したような既存の要素の再利用と並び替えができるように、一意な `key` 属性を全てのアイテムに与える必要があります:

```html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

繰り返される DOM の内容が単純な場合や、性能向上のためにデフォルトの動作を意図的に頼る場合を除いて、可能なときはいつでも `v-for` に `key` 属性を与えることが[推奨されます](/style-guide/#keyed-v-for-essential)。

これは Vue がノードを識別する汎用的な仕組みなので、`key` はガイドの後半でわかるように `v-for` に縛られない他の用途もあります。

:::tip Note
オブジェクトや配列のような非プリミティブ値を `v-for` のキーとして使わないでください。代わりに、文字列や数値を使ってください。
:::

`key` 属性の詳細な使い方は、[`key` API ドキュメント](../api/special-attributes.html#key)を参照してください。

## 配列の変化を検出

### 変更メソッド

Vue は画面の更新もトリガするために、監視された配列の変更メソッドをラップします。ラップされたメソッドは次のとおりです:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

コンソールを開いて前の `items` 配列の例で変更メソッドを呼び出して試してみてください。例えば `example1.items.push({ message: 'Baz' })` のようにしてみましょう。

### 配列の置き換え

変更メソッドは、名前が示唆するように、それらが呼ばれると元の配列を変更します。一方で、変更しないメソッドもあります。例えば、`filter()`、`concat()`、`slice()` は、元の配列を変更せず、**常に新しい配列**を返します。これらのメソッドを使用する場合は、新しいもので古い配列を置き換えることで変更できます:

```js
example1.items = example1.items.filter(item => item.message.match(/Foo/))
```

これにより、Vue が既存の DOM を破棄し、リスト全体を再描画すると思われるかもしれませんが、幸いなことにそうではありません。Vue は DOM 要素の再利用を最大化するためにいくつかのスマートなヒューリスティックを実装しているので、重複するオブジェクトを含んでいる別の配列で元の配列を置き換えることは、とても効率的な操作です。

## フィルタ/ソートされた結果の表示

元のデータを実際に変更またはリセットせずに、フィルタリングやソートされたバージョンの配列を表示したいことがあります。このケースでは、フィルタリングやソートされた配列を返す算出プロパティを作ることができます。

例えば:

```html
<li v-for="n in evenNumbers" :key="n">{{ n }}</li>
```

```js
data() {
  return {
    numbers: [ 1, 2, 3, 4, 5 ]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(number => number % 2 === 0)
  }
}
```

算出プロパティが使えない状況ではメソッドを使うこともできます。(例: 入れ子になった v-for のループの中):

```html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)" :key="n">{{ n }}</li>
</ul>
```

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

## 範囲付き `v-for`

`v-for` は整数値を取ることもできます。このケースでは、指定された数だけテンプレートが繰り返されます。

```html
<div id="range" class="demo">
  <span v-for="n in 10" :key="n">{{ n }} </span>
</div>
```

結果:

<common-codepen-snippet title="v-for with a range" slug="NWqLjNY" tab="html,result" />

## `<template>` での `v-for`

テンプレート `v-if` と同様に、複数の要素のブロックをレンダリングするために、 `v-for` で `<template>` タグを使うこともできます。例:

```html
<ul>
  <template v-for="item in items" :key="item.msg">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` と `v-if`

:::tip
`v-if` と `v-for` を同時に利用することは**推奨されません**。 詳細については [スタイルガイド](../style-guide/#avoid-v-if-with-v-for-essential) を参照ください。
:::

それらが同じノードに存在するとき、 `v-if` は `v-for` よりも高い優先度を持ちます。つまり `v-if` の条件は、 `v-for` のスコープの変数にはアクセスできないということです:

```html
<!-- インスタンスに "todo" プロパティが定義されていないため、エラーが発生します。 -->

<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

これは `v-for` を `<template>` タグで囲み、移動させることで修正できます:

```html
<template v-for="todo in todos" :key="todo.name">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## コンポーネントと `v-for`

> このセクションでは、[コンポーネント](component-basics.md)についての知識を前提としています。もし分からなければ、このセクションを遠慮なく飛ばして、理解した後に戻ってきてください。

通常の要素のように、カスタムコンポーネントで直接 `v-for` を使うことができます:

```html
<my-component v-for="item in items" :key="item.id"></my-component>
```

ただし、コンポーネントは自身の隔離されたスコープを持っているため、これによってコンポーネントにデータが自動的に渡されることはありません。繰り返されたデータをコンポーネントに渡すには、プロパティも使用する必要があります:

```html
<my-component
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
></my-component>
```

自動的に `item` をコンポーネントに渡さない理由は、それが `v-for` の動作と密結合になってしまうからです。どこからデータが来たのかを明確にすることで、他の場面でコンポーネントを再利用できるようになります。

これは、単純な ToDo リストの完全な例です:

```html
<div id="todo-list-example">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-todo">Add a todo</label>
    <input
      v-model="newTodoText"
      id="new-todo"
      placeholder="E.g. Feed the cat"
    />
    <button>Add</button>
  </form>
  <ul>
    <todo-item
      v-for="(todo, index) in todos"
      :key="todo.id"
      :title="todo.title"
      @remove="todos.splice(index, 1)"
    ></todo-item>
  </ul>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      newTodoText: '',
      todos: [
        {
          id: 1,
          title: 'Do the dishes'
        },
        {
          id: 2,
          title: 'Take out the trash'
        },
        {
          id: 3,
          title: 'Mow the lawn'
        }
      ],
      nextTodoId: 4
    }
  },
  methods: {
    addNewTodo() {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})

app.component('todo-item', {
  template: `
    <li>
      {{ title }}
      <button @click="$emit('remove')">Remove</button>
    </li>
  `,
  props: ['title'],
  emits: ['remove']
})

app.mount('#todo-list-example')
```

<common-codepen-snippet title="v-for with components" slug="abOaWpz" tab="js,result" :preview="false" />
