# Data

## data

- **型:** `Function`

- **詳細:**

  コンポーネントインスタンスのデータオブジェクトを返す関数です。 `data` では、ブラウザの API オブジェクトや prototype プロパティのような独自のステートフルな振る舞いをするオブジェクトを監視することはおすすめしません。よい考え方としては、コンポーネントのデータを表すただのプレーンオブジェクトをここで持つべきです。

  一度監視されると、ルートのデータオブジェクトにリアクティブなプロパティを追加することはできなくなります。そのため、インスタンスを作成する前に、すべてのルートレベルのリアクティブプロパティを前もって宣言しておくことをおすすめします。

  インスタンスが作成された後に、`vm.$data` として元のデータオブジェクトアクセスできます。コンポーネントインスタンスは、データオブジェクトのすべてのプロパティをプロキシするため、`vm.a` は `vm.$data.a` と同じになります。

  Vue の内部プロパティや API メソッドと競合する可能性があるため、`_` や `$` からはじまるプロパティはコンポーネントインスタンスで **プロキシされません**。これらは `vm.$data._property` としてアクセスする必要があります。

- **例:**

  ```js
  // 直接インスタンスを生成
  const data = { a: 1 }

  // コンポーネントインスタンスにオブジェクトを追加
  const vm = createApp({
    data() {
      return data
    }
  }).mount('#app')

  console.log(vm.a) // => 1
  ```

  `data` プロパティでアロー関数を使う場合、`this` はコンポーネントのインスタンスになりませんが、関数の第 1 引数としてそのインスタンスにアクセスできるということは忘れないでください。

  ```js
  data: vm => ({ a: vm.myProp })
  ```

- **参照:** [リアクティビティの探求](../guide/reactivity.html)

## props

- **型:** `Array<string> | Object`

- **詳細:**

  親コンポーネントからデータを受け取るために公開されている属性のリストかハッシュです。配列ベースの単純な構文と、型チェックやカスタムバリデーション、デフォルト値などの高度な設定ができるオブジェクトベースの構文があります。

  オブジェクトベースの構文では、以下のオプションを使用できます:

  - `type`: 次のネイティブコンストラクタのいずれかになります: `String`、`Number`、`Boolean`、`Array`、`Object`、`Date`、`Function`、`Symbol`、任意のカスタムコンストラクタ関数、またはそれらの配列。プロパティが与えられた型を持っているか確認して、そうでない場合には警告を出します。プロパティの型について [詳細な情報](../guide/component-props.html#プロパティの型) を参照してください。
  - `default`: `any`
    プロパティのデフォルト値を指定します。プロパティが渡されない場合、この値が変わりに使用されます。オブジェクト、または配列のデフォルト値はファクトリ関数から返さなければなりません。
  - `required`: `Boolean`
    プロパティが必須かどうかを定義します。非本番環境では、この値が true ならプロパティが渡されない場合、コンソールに警告を出します。
  - `validator`: `Function`
    プロパティの値を唯一の引数として受け取るカスタムバリデータ関数です。非本番環境では、この関数が false を返す場合（例えばバリデーションが失敗した場合）、コンソールに警告を出します。プロパティのバリデーションについて、詳しくは [こちら](../guide/component-props.html#プロパティのバリデーション) を参照してください。

- **例:**

  ```js
  const app = createApp({})

  // 単純な構文
  app.component('props-demo-simple', {
    props: ['size', 'myMessage']
  })

  // バリデーションありのオブジェクト構文
  app.component('props-demo-advanced', {
    props: {
      // 型チェック
      height: Number,
      // 型チェックと追加のバリデーション
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: value => {
          return value >= 0
        }
      }
    }
  })
  ```

- **参照:** [プロパティ](../guide/component-props.html)

## computed

- **型:** `{ [key: string]: Function | { get: Function, set: Function } }`

- **詳細:**

  コンポーネントのインスタンスに混入される算出プロパティです。すべてのゲッターとセッターは、そのコンポーネントのインスタンスへ自動的に束縛される `this` コンテキストを持っています。

  算出プロパティでアロー関数を使う場合、`this` はコンポーネントのインスタンスになりませんが、関数の第 1 引数としてそのインスタンスにアクセスできるということは忘れないでください。:

  ```js
  computed: {
    aDouble: vm => vm.a * 2
  }
  ```

  算出プロパティはキャッシュされ、リアクティブな依存の変更でのみ再計算されます。ある依存がインスタンスのスコープ外にある場合（例えばリアクティブでない場合）、算出プロパティは **更新されない** ことに注意してください。

- **例:**

  ```js
  const app = createApp({
    data() {
      return { a: 1 }
    },
    computed: {
      // 取得のみ
      aDouble() {
        return this.a * 2
      },
      // 取得と値の設定の両方
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    }
  })

  const vm = app.mount('#app')
  console.log(vm.aPlus) // => 2
  vm.aPlus = 3
  console.log(vm.a) // => 2
  console.log(vm.aDouble) // => 4
  ```

- **参照:** [算出プロパティ](../guide/computed.html)

## methods

- **型:** `{ [key: string]: Function }`

- **詳細:**

  コンポーネントのインスタンスに混入されるメソッドです。これらのメソッドは、VM インスタンスで直接アクセスすることも、ディレクティブ式で使うこともできます。すべてのメソッドは、コンポーネントインスタンスに自動的に束縛された `this` コンテキストを持ちます。

  :::tip Note
  **メソッドの定義にアロー関数を使ってはいけない** ということに注意してください（例: `plus: () => this.a++`）。その理由は、アロー関数が親のコンテキストを束縛するため、`this` が期待したとおりのコンポーネントインスタンスにならないのと、`this.a` が未定義になるからです。
  :::

- **例:**

  ```js
  const app = createApp({
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    }
  })

  const vm = app.mount('#app')

  vm.plus()
  console.log(vm.a) // => 2
  ```

- **参照:** [イベントハンドリング](../guide/events.html)

## watch

- **型:** `{ [key: string]: string | Function | Object | Array}`

- **詳細:**

  キーが監視するリアクティブなプロパティで、例えば [data](/api/options-data.html#data-2) または [computed](/api/options-data.html#computed) プロパティを含み、値が対応するコールバックとなるオブジェクトです。値はメソッド名の文字列や、追加のオプションを含むオブジェクトを指定することもできます。コンポーネントインスタンスはインスタンス化の際に、オブジェクトの各エントリに対して `$watch()` を呼び出します。`deep`、`immediate`、または `flush` オプションの詳細については [$watch](instance-methods.html#watch) を参照してください。

- **例:**

  ```js
  const app = createApp({
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // トップレベルのプロパティを監視
      a(val, oldVal) {
        console.log(`new: ${val}, old: ${oldVal}`)
      },
      // メソッド名の文字列
      b: 'someMethod',
      // 監視しているオブジェクトのプロパティが変更されると入れ子の深さに関わらずコールバックが呼び出されます
      c: {
        handler(val, oldVal) {
          console.log('c changed')
        },
        deep: true
      },
      // 入れ子になった 1 つのプロパティを監視
      'c.d': function (val, oldVal) {
        // do something
      },
      // 監視が開始した直後にコールバックが呼び出されます
      e: {
        handler(val, oldVal) {
          console.log('e changed')
        },
        immediate: true
      },
      // コールバックの配列を渡せて、それらは 1 つずつ呼び出されます
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 triggered')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 triggered')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b changed')
      },
      handle1() {
        console.log('handle 1 triggered')
      }
    }
  })

  const vm = app.mount('#app')

  vm.a = 3 // => new: 3, old: 1
  ```

  ::: tip Note
  _ウォッチャの定義にアロー関数を使ってはいけない_ ということに注意してください（例: `searchQuery: newValue => this.updateAutocomplete(newValue)`）。その理由は、アロー関数が親のコンテキストを束縛するため、`this` は期待したとおりのコンポーネントインスタンスにはならないのと、`this.updateAutocomplete` が未定義になるからです。
  :::

- **参照:** [ウォッチャ](../guide/computed.html#ウォッチャ)

## emits

- **型:** `Array<string> | Object`

- **詳細:**

  コンポーネントから発行されるカスタムイベントのリストやハッシュです。配列ベースの単純な構文と、イベントのバリデーションを設定できるオブジェクトベースの構文があります。

  オブジェクトベースの構文では、各プロパティの値は `null` か、バリデーション関数のどちらかです。バリデーション関数は `$emit` の呼び出しに渡された追加の引数を受け取ります。例えば、`this.$emit('foo', 1)` が呼び出された場合、`foo` に対応するバリデータは、引数 `1` を受け取ります。バリデーション関数は、イベントの引数が妥当かどうかを示すブール値を返す必要があります。

- **使用方法:**

  ```js
  const app = createApp({})

  // 配列の構文
  app.component('todo-item', {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  })

  // オブジェクトの構文
  app.component('reply-form', {
    emits: {
      // バリデーションなし
      click: null,

      // バリデーションあり
      submit: payload => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Invalid submit event payload!`)
          return false
        }
      }
    }
  })
  ```

  ::: tip Note
  `emits` オプションにリスト化されたイベントは、コンポーネントのルート要素には **継承されません**。また、`$attrs` プロパティからも除外されます。
  :::

* **参照:** [属性の継承](../guide/component-attrs.html#属性の継承)

## expose <Badge text="3.2+" />

- **型:** `Array<string>`

- **詳細:**

  パブリックなコンポーネントインスタンスで公開するプロパティのリストです。

  デフォルトでは、[`$refs`](/api/instance-properties.html#refs) や [`$parent`](/api/instance-properties.html#parent) や [`$root`](/api/instance-properties.html#root) からアクセスされるパブリックなインスタンスは、テンプレートで使われる内部コンポーネントのインスタンスと同じです。`expose` オプションは、パブリックなインスタンスからアクセス可能なプロパティを制限します。

  Vue 自身が定義した `$el` や `$parent` などのプロパティは、常にパブリックなインスタンスで利用可能で、このリストに加える必要はありません。

- **使用方法:**

  ```js
  export default {
    // increment は公開されますが、
    // count は内部的にしかアクセスできません
    expose: ['increment'],

    data() {
      return {
        count: 0
      }
    },

    methods: {
      increment() {
        this.count++
      }
    }
  }
  ```

- **参照:** [defineExpose](/api/sfc-script-setup.html#defineexpose)
