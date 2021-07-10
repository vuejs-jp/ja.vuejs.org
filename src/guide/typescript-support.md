# TypeScript のサポート

> [Vue CLI](https://cli.vuejs.org) は、ビルトインの TypeScript ツールサポートを提供します。

## NPM パッケージ内の公式型宣言

静的型システムは、特にアプリケーションが成長するに伴い、多くの潜在的なランタイムエラーを防止するのに役立ち、これが Vue 3 が TypeScript で書かれている理由です。このことは、あなたが Vue 3 とともに TypeScript を使うために追加のツールを必要としないことを意味します - それは第一級市民 (first-class citizen) としてサポートを受けられます。

## 推奨される構成

```js
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    // これは `this` のデータプロパティに対してより厳密な推論を可能にします
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node"
  }
}
```

コンポーネントメソッドにおける `this` の型チェックを活用するために `strict: true` (もしくは少なくとも `strict` フラグの一部である `noImplicitThis: true`) を含める必要があることに注意してください。そうでないと、`this` は常に `any` 型として扱われます。

より詳細を知るためには、[TypeScript compiler options docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html) を参照してください。

## Webpack の設定

カスタムの Webpack の設定を使っている場合、 `.vue` ファイルの `<script lang="ts">` ブロックをパースするように `ts-loader` を設定する必要があります:

```js{10}
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }
      ...
```

## 開発ツール

### プロジェクトの作成

[Vue CLI](https://github.com/vuejs/vue-cli) は、TypeSript を使った新しいプロジェクトを作成できます。はじめるためには:

```bash
# 1. Vue CLI をまだインストールしていなければ、インストールします
npm install --global @vue/cli

# 2. 新しいプロジェクトを作成し、"Manually select features" を選択してください
vue create my-project-name

# もしすでに TypeScript をもたない Vue CLI で作成したプロジェクトがある場合、適切な Vue CLI プラグインを追加してください:
vue add typescript
```

コンポーネントの `script` の部分に言語として TypeScript が設定されていることを確認してください:

```html
<script lang="ts">
  ...
</script>
```

また、TypeScript と [JSX `render` 関数](/guide/render-function.html#jsx) を組み合わせたい場合:

```html
<script lang="tsx">
  ...
</script>
```

### エディタによるサポート

TypeScript による Vue アプリケーションの開発のために、すぐに利用できる TypeScript サポートを提供している [Visual Studio Code](https://code.visualstudio.com/) を強く推奨します。[単一ファイルコンポーネント](./single-file-component.html) (SFCs) を使用している場合、SFC 内部での TypeScript の推論やその他の優れた機能を提供している、素晴らしい [Vetur エクステンション](https://github.com/vuejs/vetur) を入手してください。

[WebStorm](https://www.jetbrains.com/webstorm/) もすぐに利用できる TypeScript と Vue のサポートを提供しています。

## Vue コンポーネントを定義する

TypeScript に Vue コンポーネントオブションのなかで適切に型を推論させるために、`defineComponent` グローバルメソッドでコンポーネントを定義する必要があります:

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  // 型推論が有効になります
})
```

[単一ファイルコンポーネント](/guide/single-file-component.html) を使っている場合、これは一般的に次のように書かれます:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // type inference enabled
})
</script>
```

## オプション API とともに使用する

TypeScript は明示的に型を定義することなく、ほとんどの型を推論できるようにあるべきです。例えば、数値である `count` プロパティを持つコンポーネントがある場合、文字列に特有のメソッドを呼び出すとエラーになります:

```ts
const Component = defineComponent({
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    const result = this.count.split('') // => 'split' プロパティは 'number' 型に存在しません
  }
})
```

複雑な型や推論の場合、[タイプアサーション (type assertion)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) を使用してキャストすることができます:

```ts
interface Book {
  title: string
  author: string
  year: number
}

const Component = defineComponent({
  data() {
    return {
      book: {
        title: 'Vue 3 Guide',
        author: 'Vue Team',
        year: 2020
      } as Book
    }
  }
})
```

### `globalProperties` のための型の拡張

Vue 3 には [`globalProperties` オブジェクト](../api/application-config.html#globalproperties) が用意されていて、任意のコンポーネントインスタンスからアクセス可能なグローバルプロパティを追加するために使用できます。例えば、 [プラグイン](./plugins.html#プラグインを書く) では共有されたグローバルオブジェクトや関数を注入したい場合があります。

```ts
// ユーザの定義
import axios from 'axios'

const app = Vue.createApp({})
app.config.globalProperties.$http = axios

// あるデータを検証するためのプラグイン
export default {
  install(app, options) {
    app.config.globalProperties.$validate = (data: object, rule: object) => {
      // 対象のデータが特定のルールを満たしているかチェック
    }
  }
}
```

これらの新しいプロパティを TypeScript に伝えるために、[Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) を使うことができます。

上記の例では、次のような型宣言を追加することができます:

```ts
import axios from 'axios'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $http: typeof axios
    $validate: (data: object, rule: object) => boolean
  }
}
```

この型宣言は同じファイル、またはプロジェクト全体の `*.d.ts` ファイル（例えば、 TypeScript で自動的に読み込まれる `src/typings` フォルダの中）に記述することができます。ライブラリやプラグインの作者は、このファイルを `package.json` の `types` プロパティで指定します。

::: warning 宣言ファイルが TypeScript モジュールであることを確認
Module Augmentation を利用するためには、ファイルの中に少なくとも 1 つのトップレベルの `import` か `export` があることを確認する必要があります。それが単に `export {}` であってもです。

[TypeScript](https://www.typescriptlang.org/docs/handbook/modules.html) では、トップレベルの `import` や `export` を含むファイルはすべて「モジュール」とみなされます。モジュールの外で型宣言が行われた場合、元の型を拡張するのではなく、上書きしてしまいます。
:::

`ComponentCustomProperties` 型について詳しくは、[`@vue/runtime-core` での定義](https://github.com/vuejs/vue-next/blob/2587f36fe311359e2e34f40e8e47d2eebfab7f42/packages/runtime-core/src/componentOptions.ts#L64-L80) と、[TypeScript ユニットテスト](https://github.com/vuejs/vue-next/blob/master/test-dts/componentTypeExtensions.test-d.tsx) を参照してください。

### 戻り値の型にアノテーションをつける

Vue の型宣言ファイルの循環的な性質により、TypeScript は算出プロパティの型を推論することが困難な場合があります。この理由により、算出プロパティの戻り値の型にアノテーションをつける必要があります。

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // アノテーションが必要です
    greeting(): string {
      return this.message + '!'
    },

    // セッターを持つ算出プロパティのでは、ゲッターにアノテーションが必要です
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

### Props にアノテーションをつける

Vue は `type` が定義されたプロパティについてランタイムバリデーションを行います。これらの型を TypeScript に提供するため、`PropType` を伴うコンストラクタをキャストする必要があります:

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

const Component = defineComponent({
  props: {
    name: String,
    success: { type: String },
    callback: {
      type: Function as PropType<() => void>
    },
    book: {
      type: Object as PropType<Book>,
      required: true
    }
  }
})
```

::: warning
TypeScript には、関数式の型推論に [設計上の制限](https://github.com/microsoft/TypeScript/issues/38845) があるため、 `validator` と、オブジェクトや配列の `default` 値に注意する必要があります:
:::

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

const Component = defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // 必ずアロー関数を使うこと
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    },
    bookB: {
      type: Object as PropType<Book>,
      // または明示的にこのパラメータを提供する
      default(this: void) {
        return {
          title: 'Function Expression'
        }
      },
      validator(this: void, book: Book) {
        return !!book.title
      }
    }
  }
})
```

### Emit にアノテーションをつける

発行されたイベントのペイロードにアノテーションをつけることができます。また、すべての宣言されていない発行されたイベントは、呼び出されたときに型エラーが発生します:

```ts
const Component = defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // ランタイムバリデーションの実行
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // 型エラー！
      })

      this.$emit('non-declared-event') // 型エラー！
    }
  }
})
```

## コンポジション API とともに使用する

`setup()` 関数においては、`props` 引数に型をつける必要はありません。`setup()` 関数は　`props` コンポーネントオプションから型を推論するからです。

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  props: {
    message: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const result = props.message.split('') // 正しいです, 'message' は文字列 (string) として型づけされます
    const filtered = props.message.filter(p => p.value) // エラーが起こります: Property 'filter' does not exist on type 'string'
  }
})
```

### `ref` を型定義する

Ref は初期値から型を推論します:

```ts
import { defineComponent, ref } from 'vue'

const Component = defineComponent({
  setup() {
    const year = ref(2020)

    const result = year.value.split('') // => Property 'split' does not exist on type 'number'
  }
})
```

ときどき、ref の内部的な値の複雑な型を特定する必要があるかもしれません。デフォルトの推論をオーバーライドするために ref を呼び出すときに、単純にジェネリック引数を渡すことができます:

```ts
const year = ref<string | number>('2020') // year's type: Ref<string | number>
const year = ref<string | number>('2020') // year の型: Ref<string | number>

year.value = 2020 // OKです!
```

::: tip Note
ジェネリックの型が不明の場合、`ref` を `Ref<T>` にキャストすることを推奨します。
:::

### テンプレート参照を型定義する

ときどき、子コンポーネントのパブリックメソッドを呼び出すために、テンプレート参照にアノテーションをつける必要があるかもしれません。例えば、 `MyModal` という子コンポーネントにモーダルを開くメソッドがあるとします:

```ts
import { defineComponent, ref } from 'vue'

const MyModal = defineComponent({
  setup() {
    const isContentShown = ref(false)
    const open = () => (isContentShown.value = true)

    return {
      isContentShown,
      open
    }
  }
})
```

この親コンポーネントからテンプレート参照を介して、このメソッドを呼び出したいです:

```ts
import { defineComponent, ref } from 'vue'

const MyModal = defineComponent({
  setup() {
    const isContentShown = ref(false)
    const open = () => (isContentShown.value = true)

    return {
      isContentShown,
      open
    }
  }
})

const app = defineComponent({
  components: {
    MyModal
  },
  template: `
    <button @click="openModal">Open from parent</button>
    <my-modal ref="modal" />
  `,
  setup() {
    const modal = ref()
    const openModal = () => {
      modal.value.open()
    }

    return { modal, openModal }
  }
})
```

この方法でも動作しますが、 `MyModal` とその利用可能なメソッドについての型情報がありません。これを解決するためには、 ref を作成するときに `InstanceType` を使う必要があります:

```ts
setup() {
  const modal = ref<InstanceType<typeof MyModal>>()
  const openModal = () => {
    modal.value?.open()
  }

  return { modal, openModal }
}
```

[オプショナルチェイニング](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) や他の方法を使って、 `modal.value` が未定義でないことの確認が必要であることに注意してください。

### `reactive` を型定義する

`reactive` プロパティを型定義する場合、推論を使用できます:

```ts
import { defineComponent, reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const book = reactive<Book>({ title: 'Vue 3 Guide' })
    // もしくは
    const book: Book = reactive({ title: 'Vue 3 Guide' })
    // もしくは
    const book = reactive({ title: 'Vue 3 Guide' }) as Book
  }
})
```

### 算出プロパティを型定義する

算出プロパティの値は返り値の型から自動的に推論します:

```ts
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'CounterButton',
  setup() {
    let count = ref(0)

    // 読み取り専用
    const doubleCount = computed(() => count.value * 2)

    const result = doubleCount.value.split('') // Property 'split' does not exist on type 'number'
  }
})
```

### Typing Event Handlers

When dealing with native DOM events, it might be useful to type the argument we pass to the handler correctly. Let's take a look at this example:

```vue
<template>
  <input type="text" @change="handleChange" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    // `evt` will be of type `any`
    const handleChange = evt => {
      console.log(evt.target.value) // TS will throw an error here
    }

    return { handleChange }
  }
})
</script>
```

As you can see, without annotating the `evt` argument correctly, TypeScript will throw an error when we try to access the value of the `<input>` element. The solution is to cast the event target with a correct type:

```ts
const handleChange = (evt: Event) => {
  console.log((evt.target as HTMLInputElement).value)
}
```
