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

## Webpack Configuration

If you are using a custom Webpack configuration `ts-loader` needs to be configured to parse `<script lang="ts">` blocks in `.vue` files:

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

Or, if you want to combine TypeScript with a [JSX `render` function](/guide/render-function.html#jsx):

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

複雑な型や推論の場合、[タイプアサーション (type assertion)](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) を使用してキャストすることができます:

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
    }

    // セッターを持つ算出プロパティのでは、ゲッターにアノテーションが必要です
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase();
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase();
      },
    },
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
Because of a [design limitation](https://github.com/microsoft/TypeScript/issues/38845) in TypeScript when it comes
to type inference of function expressions, you have to be careful with `validators` and `default` values for objects and arrays:
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
      // Make sure to use arrow functions
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    },
    bookB: {
      type: Object as PropType<Book>,
      // Or provide an explicit this parameter
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

### Annotating emits

We can annotate a payload for the emitted event. Also, all non-declared emitted events will throw a type error when called:

```ts
const Component = defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // perform runtime validation
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // Type error!
      })

      this.$emit('non-declared-event') // Type error!
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

Ref は初期値から肩を推論します:

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
