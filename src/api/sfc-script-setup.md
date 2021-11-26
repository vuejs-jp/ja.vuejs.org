---
sidebarDepth: 1
---

# SFC `<script setup>`

`<script setup>` は単一ファイルコンポーネント（SFC）内で [Composition API](/api/composition-api.html) を使用するコンパイル時のシンタックスシュガー（糖衣構文）です。SFC と Composition API の両方を使うならば、おすすめの構文です。これは通常の `<script>` 構文よりも、多くの利点があります:

- ボイラープレートが少なくて、より簡潔なコード
- 純粋な TypeScript を使ってプロパティと発行されたイベントを宣言する機能
- 実行時のパフォーマンスの向上（テンプレートは中間プロキシなしに同じスコープ内のレンダリング関数にコンパイルされます）
- IDE で型推論のパフォーマンス向上（言語サーバがコードから型を抽出する作業が減ります）

## 基本の構文

この構文を導入するには、`setup` 属性を `<script>` ブロックに追加します:

```vue
<script setup>
console.log('hello script setup')
</script>
```

内部のコードは、コンポーネントの `setup()` 関数の内容としてコンパイルされます。これはつまり、通常の `<script>` とは違って、コンポーネントが最初にインポートされたときに一度だけ実行されるのではなく、`<script setup>` 内のコードは **コンポーネントのインスタンスが作成されるたびに実行される** ということです。

### トップレベルのバインディングはテンプレートに公開

`<script setup>` を使用する場合、`<script setup>` 内で宣言されたトップレベルのバインディング（変数、関数宣言、インポートを含む）は、テンプレートで直接使用できます:

```vue
<script setup>
// 変数
const msg = 'Hello!'

// 関数
function log() {
  console.log(msg)
}
</script>

<template>
  <div @click="log">{{ msg }}</div>
</template>
```

インポートも同じように公開されます。これはつまり、インポートされたヘルパー関数を `methods` オプションで公開することなくテンプレート式で直接使用できます:

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## リアクティビティ

リアクティブな状態は [リアクティビティ API](/api/basic-reactivity.html) を使って明示的に作成する必要があります。`setup()` 関数から返された値と同じように、テンプレート内で参照されるときに ref は自動的にアンラップされます:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## コンポーネントの使用

`<script setup>` のスコープ内の値は、カスタムコンポーネントのタグ名としても直接使用できます:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

`MyComponent` を変数として参照していると考えてください。JSX を使ったことがあれば、このメンタルモデルは似ています。ケバブケースの `<my-component>` も同じようにテンプレートで動作します。しかし、一貫性を保つために、パスカルケースのコンポーネントタグを強く推奨します。これはネイティブのカスタム要素と区別するのにも役立ちます。

### 動的コンポーネント

コンポーネントは、文字列キーで登録されるのではなく変数として参照されるため、`<script setup>` 内で動的コンポーネントを使う場合は、動的な `:is` バインディングを使う必要があります:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

三項演算子で変数としてコンポーネントをどのように使うことができるかに注意してください。

### 再帰的コンポーネント

SFC はそのファイル名を介して、暗黙的に自身を参照できます。例えば、`FooBar.vue` というファイル名は、そのテンプレート内で `<FooBar/>` として自身を参照できます。

これはインポートされたコンポーネントよりも優先度が低いことに注意してください。コンポーネントの推論された名前と競合する名前付きインポートがある場合、インポートでエイリアスを作成できます:

```js
import { FooBar as FooBarChild } from './components'
```

### 名前空間付きコンポーネント

`<Foo.Bar>` のようにドット付きのコンポーネントタグを使って、オブジェクトプロパティの下にネストしたコンポーネントを参照することができます。これは単一のファイルから複数のコンポーネントをインポートするときに便利です:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## カスタムディレクティブの使用

グローバルに登録されたカスタムディレクティブは期待通りに動作して、ローカルのカスタムディレクティブは前述のコンポーネントで説明したようにテンプレートで直接使用できます。

しかし、注意する制限が 1 つあります: ローカルのカスタムディレクティブ名は、以下のスキーマに従わなければなりません: `vNameOfDirective` はテンプレート内で直接使用できるようにするためのものです。

```html
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // 要素でなにかをします
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```
```html
<script setup>
  // インポートも可能で、必要な命名スキーマに合わせてリネームすることができます
  import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## `defineProps` と `defineEmits`

To declare `props` and `emits` in `<script setup>`, you must use the `defineProps` and `defineEmits` APIs, which provide full type inference support and are automatically available inside `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup code
</script>
```

- `defineProps` and `defineEmits` are **compiler macros** only usable inside `<script setup>`. They do not need to be imported, and are compiled away when `<script setup>` is processed.

- `defineProps` accepts the same value as the [`props` option](/api/options-data.html#props), while `defineEmits` accepts the same value as the [`emits` option](/api/options-data.html#emits).

- `defineProps` and `defineEmits` provide proper type inference based on the options passed.

- The options passed to `defineProps` and `defineEmits` will be hoisted out of setup into module scope. Therefore, the options cannot reference local variables declared in setup scope. Doing so will result in a compile error. However, it _can_ reference imported bindings since they are in the module scope as well.

If you are using TypeScript, it is also possible to [declare props and emits using pure type annotations](#typescript-only-features).

## `defineExpose`

Components using `<script setup>` are **closed by default** - i.e. the public instance of the component, which is retrieved via template refs or `$parent` chains, will **not** expose any of the bindings declared inside `<script setup>`.

To explicitly expose properties in a `<script setup>` component, use the `defineExpose` compiler macro:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

When a parent gets an instance of this component via template refs, the retrieved instance will be of the shape `{ a: number, b: number }` (refs are automatically unwrapped just like on normal instances).

## `useSlots` と `useAttrs`

Usage of `slots` and `attrs` inside `<script setup>` should be relatively rare, since you can access them directly as `$slots` and `$attrs` in the template. In the rare case where you do need them, use the `useSlots` and `useAttrs` helpers respectively:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` and `useAttrs` are actual runtime functions that return the equivalent of `setupContext.slots` and `setupContext.attrs`. They can be used in normal composition API functions as well.

## 通常の `<script>` との併用

`<script setup>` can be used alongside normal `<script>`. A normal `<script>` may be needed in cases where you need to:

- Declare options that cannot be expressed in `<script setup>`, for example `inheritAttrs` or custom options enabled via plugins.
- Declaring named exports.
- Run side effects or create objects that should only execute once.

```vue
<script>
// normal <script>, executed in module scope (only once)
runSideEffectOnce()

// declare additional options
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// executed in setup() scope (for each instance)
</script>
```

:::warning
`render` function is not supported in this scenario. Please use one normal `<script>` with `setup` option instead.
:::

## トップレベルの `await`

Top-level `await` can be used inside `<script setup>`. The resulting code will be compiled as `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>
```

In addition, the awaited expression will be automatically compiled in a format that preserves the current component instance context after the `await`.

:::warning Note
`async setup()` must be used in combination with `Suspense`, which is currently still an experimental feature. We plan to finalize and document it in a future release - but if you are curious now, you can refer to its [tests](https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/__tests__/components/Suspense.spec.ts) to see how it works.
:::

## TypeScript のみの機能

### 型のみの props/emit 宣言

Props and emits can also be declared using pure-type syntax by passing a literal type argument to `defineProps` or `defineEmits`:

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```

- `defineProps` or `defineEmits` can only use either runtime declaration OR type declaration. Using both at the same time will result in a compile error.

- When using type declaration, the equivalent runtime declaration is automatically generated from static analysis to remove the need for double declaration and still ensure correct runtime behavior.

  - In dev mode, the compiler will try to infer corresponding runtime validation from the types. For example here `foo: String` is inferred from the `foo: string` type. If the type is a reference to an imported type, the inferred result will be `foo: null` (equal to `any` type) since the compiler does not have information of external files.

  - In prod mode, the compiler will generate the array format declaration to reduce bundle size (the props here will be compiled into `['foo', 'bar']`)

  - The emitted code is still TypeScript with valid typing, which can be further processed by other tools.

- As of now, the type declaration argument must be one of the following to ensure correct static analysis:

  - A type literal
  - A reference to an interface or a type literal in the same file

  Currently complex types and type imports from other files are not supported. It is theoretically possible to support type imports in the future.

### 型宣言を使用時のデフォルトの props 値

One drawback of the type-only `defineProps` declaration is that it doesn't have a way to provide default values for the props. To resolve this problem, a `withDefaults` compiler macro is also provided:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

This will be compiled to equivalent runtime props `default` options. In addition, the `withDefaults` helper provides type checks for the default values, and ensures the returned `props` type has the optional flags removed for properties that do have default values declared.

## 制限: src インポートの禁止

Due to the difference in module execution semantics, code inside `<script setup>` relies on the context of an SFC. When moved into external `.js` or `.ts` files, it may lead to confusion for both developers and tools. Therefore, **`<script setup>`** cannot be used with the `src` attribute.
