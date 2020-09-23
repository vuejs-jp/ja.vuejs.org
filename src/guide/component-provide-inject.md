# Provide / inject

> このページは既に[コンポーネントの基本](component-basics.md)を読んでいる事を前提としています。 コンポーネントを初めて使う方はそちらを先にお読みください。

通常、親コンポーネントから子コンポーネントにデータを渡すとき、[props](component-props.md) を使います。深くネストされたいくつかのコンポーネントがあり、深い階層にあるコンポーネントが浅い階層にあるコンポーネントの何かしらのデータのみを必要としている構造を想像してください。この場合でも、鎖のように繋ったコンポーネント全体にプロパティを渡す必要がありますが、時にそれは面倒になります。

そのような場合は、`provide` と `inject` のペアを利用できます。コンポーネント階層の深さに関係なく、親コンポーネントは、そのすべての子階層へ依存関係を提供するプロバイダとして機能することができます。この機能は2つの機能からなります:
親コンポーネントは、データを提供するためのオプション `provide` を持ち、子コンポーネントはそのデータを利用するためのオプション `inject` を持っています。

![Provide/inject scheme](/images/components_provide.png)

例えば、このような構造があるとします:

```
Root
└─ TodoList
   ├─ TodoItem
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

もし todo-items のサイズを `TodoListStatistics` に渡したい場合、プロパティをこのように渡します: `TodoList` → `TodoListFooter` → `TodoListStatistics`。provide/inject を利用すると、これを直接的に行えます。

```js
const app = Vue.createApp({})

app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    user: 'John Doe'
  },
  template: `
    <div>
      {{ todos.length }}
      <!-- rest of the template -->
    </div>
  `
})

app.component('todo-list-statistics', {
  inject: ['user'],
  created() {
    console.log(`Injected property: ${this.user}`) // > Injected property: John Doe
  }
})
```

ただし、ここでコンポーネントのインスタンスプロパティを提供しようとしても、うまく動作しないでしょう:

```js
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    todoLength: this.todos.length // this will result in error 'Cannot read property 'length' of undefined`
  },
  template: `
    ...
  `
})
```

コンポーネントのインスタンスプロパティにアクセスするためには、`provide` をオブジェクトを返す関数へ変換する必要があります

```js
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide() {
    return {
      todoLength: this.todos.length
    }
  },
  template: `
    ...
  `
})
```

こうすることで、子コンポーネントが依存している何かを変更したり削除したりしてしまうことを恐れることなく、より安全にコンポーネントを開発し続けることができます。これらのコンポーネント間のインターフェースは、props と同じく、明確に定義されています。

実際、依存関係の注入は、いわば「長距離な props 」のように考えることができます。後述の点を除きます:

- 親コンポーネントは、提供したプロパティを子孫コンポーネントのどこで使用しているか知る必要がありません
- 子コンポーネントは、注入されたプロパティがどこから提供されたものなのか知る必要がありません

## リアクティブと連携する

前述の例では、リスト `todos` を変更しても、その変更は注入された `todoLength` には反映されません。これは、`provide/inject` の束縛（ binding ）がデフォルトでリアクティブ _でない_ ことが原因です。プロパティ `ref` やオブジェクト `reactive` を `provide` に渡すことにより、この振る舞いを変更することができます。この場合、祖先コンポーネントの変更に対応するには、提供する `todoLength` に、Composition API のプロパティ `computed` を割り当てる必要があります。

```js
app.component('todo-list', {
  // ...
  provide() {
    return {
      todoLength: Vue.computed(() => this.todos.length)
    }
  }
})
```

こうすると、`todos.length`へのあらゆる変更が、`todoLength` が注入されたコンポーネントに正しく反映されます。`reactive` の provide/inject の詳細については、[Composition API セクション](composition-api-provide-inject.html#injection-reactivity) をご覧ください。
