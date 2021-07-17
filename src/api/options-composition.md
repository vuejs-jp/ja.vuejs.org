# Composition

## mixins

- **型:** `Array<Object>`

- **詳細:**

  `mixins` オプションは、ミックスインオブジェクトの配列を受け入れます。これらのミックスインオブジェクトは、通常のインスタンスオブジェクトと同じようにインスタンスオプションを含めることができ、それらは一定のオプションをマージするロジックを使って、最終的なオプションに対してマージされます。例えば、あなたのミックスインが `created` フックを含み、コンポーネントそれ自身にも `created` フックがある場合、両方の関数が呼び出されます。

  ミックスインフックは提供された順番に呼び出され、コンポーネント自身のフックよりも前に呼び出されます。

- **例:**

  ```js
  const mixin = {
    created: function() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

- **参照:** [ミックスイン](../guide/mixins.html)

## extends

- **型:** `Object | Function`

- **詳細:**

  別のコンポーネントを宣言的に拡張できます（純粋なオプションオブジェクトまたはコンストラクタのどちらでも）。これは主に単一ファイルコンポーネント間の拡張を簡単にすることを目的としています。

  これは `mixins` に似ています。

- **例:**

  ```js
  const CompA = { ... }

  // CompA を `Vue.extend` の呼び出しなしで拡張します
  const CompB = {
    extends: CompA,
    ...
  }
  ```

## provide / inject

- **型:**

  - **provide:** `Object | () => Object`
  - **inject:** `Array<string> | { [key: string]: string | Symbol | Object }`

- **詳細:**

  この一組のオプションを一緒に使うことで、コンポーネント階層の深さに関わらず、それらが同じ親チェーンにある限り、祖先のコンポーネントがその子孫コンポーネントすべての依存オブジェクトの注入役として機能することができます。React に慣れている方には、これは React の `context` の機能と非常によく似ています。

  `provide` オプションは、オブジェクトまたはオブジェクトを返す関数でなければなりません。このオブジェクトは、その子孫に注入可能なプロパティを含みます。このオブジェクトのキーには ES2015 の Symbol を使うことができますが、ネイティブで `Symbol` と `Reflect.ownKeys` をサポートしている環境でのみ有効です。

  `inject` オプションは、次のいずれかでなければなりません:

  - 文字列の配列、もしくは
  - キーがローカルのバインディング名で、値が次のいずれかであるオブジェクト:
    - 利用可能な注入オブジェクトを検索するためのキー（文字列または Symbol）、または
    - オブジェクトが:
      - `from` プロパティは利用可能な注入オブジェクトを検索するためのキー（文字列または Symbol）、そして
      - `default` プロパティはフォールバック値として使われます

  > 注意: `provide` と `inject` のバインディングはリアクティブではありません。これは意図的なものです。ただし、あなたがリアクティブなオブジェクトを渡した場合、そのオブジェクトのプロパティはリアクティブなままです。

- **例:**

  ```js
  // 'foo' を提供している親コンポーネント
  const Provider = {
    provide: {
      foo: 'bar'
    }
    // ...
  }

  // 'foo' を注入している子コンポーネント
  const Child = {
    inject: ['foo'],
    created() {
      console.log(this.foo) // => "bar"
    }
    // ...
  }
  ```

  ES2015 の Symbol で、`provide` 関数と `inject` オブジェクトを使います:

  ```js
  const s = Symbol()

  const Provider = {
    provide() {
      return {
        [s]: 'foo'
      }
    }
  }

  const Child = {
    inject: { s }
    // ...
  }
  ```

  注入された値をプロパティのデフォルトとして使います:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  注入された値をデータプロパティの登録に使います:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  注入はデフォルト値で任意にできます:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  別の名前のプロパティから注入する必要がある場合は、`from` を使って元のプロパティを指定します:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  プロパティのデフォルトと同じように、プリミティブ値以外はファクトリ関数を使う必要があります:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **参照:** [Provide / Inject](../guide/component-provide-inject.html)

## setup

- **型:** `Function`

`setup` 関数は、新しいコンポーネントオプションです。この関数は、コンポーネント内で Composition API を使うためのエントリポイントになります。

- **呼び出しのタイミング**

  `setup` は、コンポーネントインスタンスが作成されたとき、初期プロパティの解決の直後に呼び出されます。ライフサイクル的には、[beforeCreate](./options-lifecycle-hooks.html#beforecreate) フックの前に呼び出されます。

- **テンプレートでの利用**

  `setup` がオブジェクトを返す場合、そのオブジェクトのプロパティはコンポーネントのテンプレートのレンダリングコンテキストにマージされます:

  ```html
  <template>
    <div>{{ count }} {{ object.foo }}</div>
  </template>

  <script>
    import { ref, reactive } from 'vue'

    export default {
      setup() {
        const count = ref(0)
        const object = reactive({ foo: 'bar' })

        // expose to template
        return {
          count,
          object
        }
      }
    }
  </script>
  ```

  `setup` から返された [refs](refs-api.html#ref) は、テンプレート内でアクセスする時に自動的にアンラップされるので、テンプレートで `.value` を使う必要はありません。

- **Render 関数 / JSX での利用**

  `setup` は、同じスコープで宣言されたリアクティブな状態を直接使える Render 関数を返すこともできます:

  ```js
  import { h, ref, reactive } from 'vue'

  export default {
    setup() {
      const count = ref(0)
      const object = reactive({ foo: 'bar' })

      return () => h('div', [count.value, object.foo])
    }
  }
  ```

- **引数**

  この関数は、その第 1 引数として解決されたプロパティを受け取ります:

  ```js
  export default {
    props: {
      name: String
    },
    setup(props) {
      console.log(props.name)
    }
  }
  ```

  この `props` オブジェクトはリアクティブです。つまり、新しいプロパティが渡されると更新され、`watchEffect` や `watch` を使って監視と反応をすることができます:

  ```js
  export default {
    props: {
      name: String
    },
    setup(props) {
      watchEffect(() => {
        console.log(`name is: ` + props.name)
      })
    }
  }
  ```

  しかし、`props` オブジェクトのリアクティビティが失われるため、そのオブジェクトを分割してはいけません:

  ```js
  export default {
    props: {
      name: String
    },
    setup({ name }) {
      watchEffect(() => {
        console.log(`name is: ` + name) // Will not be reactive!
      })
    }
  }
  ```

  `props` オブジェクトは、開発中のユーザランドのコードにとってはイミュータブルです（ユーザのコードがそれを変更しようとすると警告を表示します）。

  第 2 引数は、`this` で以前に公開されていたプロパティの選択的な一覧を公開するコンテキストオブジェクトを提供します:

  ```js
  const MyComponent = {
    setup(props, context) {
      context.attrs
      context.slots
      context.emit
    }
  }
  ```

  `attrs` と `slots` は内部コンポーネントインスタンスの対応する値へのプロキシです。これは更新後も常に最新の値が公開されることを保証するので、古くなった参照へのアクセスを心配することなく、構造を変更することができます:

  ```js
  const MyComponent = {
    setup(props, { attrs }) {
      // 後の段階で呼び出されるはずの関数
      function onClick() {
        console.log(attrs.foo) // 最新の参照が保証されている
      }
    }
  }
  ```

  `props` がコンテキストに含まれる代わりに、別の第 1 引数として置かれている理由はいくつかあります:

  - コンポーネントが `props` を使うことが、他のプロパティよりもずっと一般的であること、そしてコンポーネントが `props` のみを扱うことがとても頻繁にあることです。

  - `props` を別の引数として持つことで、コンテキストの他のプロパティの型を混乱させることなく、個別に入力することが楽になります。また TSX のサポートで `setup`、`render`、単純な関数コンポーネントを通して、一貫した定義を守ることができます。

- **参照:** [Composition API](composition-api.html)
