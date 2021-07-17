# インスタンスプロパティ

## $data

- **型:** `Object`

- **詳細:**

  コンポーネントインスタンスが監視しているデータオブジェクトです。コンポーネントインスタンスは、この data オブジェクトのプロパティへのアクセスをプロキシします。

- **参照:** [オプション / Data - data](./options-data.html#data-2)

## $props

- **型:** `Object`

- **詳細:**

  コンポーネントが受け取った現在のプロパティを表すオブジェクトです。コンポーネントインスタンスは、この props オブジェクトのプロパティへのアクセスをプロキシします。

## $el

- **型:** `any`

- **読み込みのみ**

- **詳細:**

  コンポーネントインスタンスが管理しているルート DOM 要素です。

  [Fragments](../guide/migration/fragments) を使っているコンポーネントでは、`$el` は DOM 内で Vue がコンポーネントの位置を追跡するために使う DOM ノードのプレースホルダになります。DOM 要素に直接アクセスするためには、`$el` に頼る代わりに [テンプレート参照](../guide/component-template-refs.html) を使うことをお勧めします。

## $options

- **型:** `Object`

- **読み込みのみ**

- **詳細:**

  現在のコンポーネントインスタンスに使われるインスタンス化オプションです。これはオプションにカスタムプロパティを含めたいときに便利です:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

## $parent

- **型:** `Component instance`

- **読み込みのみ**

- **詳細:**

  現在のインスタンスに親インスタンスがある場合は、その親インスタンスです。

## $root

- **型:** `Component instance`

- **読み込みのみ**

- **詳細:**

  現在のコンポーネントツリーのルートコンポーネントインスタンスです。現在のインスタンスが親を持たない場合、この値は自分自身になります。

## $slots

- **型:** `{ [name: string]: (...args: any[]) => Array<VNode> | undefined }`

- **読み込みのみ**

- **詳細:**

  [スロットにより配信された](../guide/component-basics.html#スロットによるコンテンツ配信) コンテンツにプログラム的にアクセスするために使われます。それぞれの [名前付きスロット](../guide/component-slots.html#名前付きスロット) は自身に対応するプロパティを持ちます（例えば、`v-slot:foo` のコンテンツは `this.$slots.foo()` にあります）。`default` プロパティは、名前付きスロットに含まれないノードか、`v-slot:default` のコンテンツを含みます。

  `this.$slots` へのアクセスは、[render function](../guide/render-function.html) でコンポーネントを書くときにもっとも便利です。

- **例:**

  ```html
  <blog-post>
    <template v-slot:header>
      <h1>About Me</h1>
    </template>

    <template v-slot:default>
      <p>
        Here's some page content, which will be included in $slots.default.
      </p>
    </template>

    <template v-slot:footer>
      <p>Copyright 2020 Evan You</p>
    </template>
  </blog-post>
  ```

  ```js
  const { createApp, h } = Vue
  const app = createApp({})

  app.component('blog-post', {
    render() {
      return h('div', [
        h('header', this.$slots.header()),
        h('main', this.$slots.default()),
        h('footer', this.$slots.footer())
      ])
    }
  })
  ```

- **参照:**
  - [`<slot>` コンポーネント](built-in-components.html#slot)
  - [スロットによるコンテンツ配信](../guide/component-basics.html#スロットによるコンテンツ配信)
  - [Render 関数 - スロット](../guide/render-function.html#スロット)

## $refs

- **型:** `Object`

- **読み込みのみ**

- **詳細:**

  [`ref` 属性](../guide/component-template-refs.html) で登録された DOM 要素のオブジェクトとコンポーネントインスタンスです。

- **参照:**
  - [テンプレート参照](../guide/component-template-refs.html)
  - [特別な属性 - ref](./special-attributes.md#ref)

## $attrs

- **型:** `Object`

- **読み込みのみ**

- **詳細:**

  コンポーネントの [プロパティ](./options-data.html#props) や [カスタムイベント](./options-data.html#emits) として認識されない（抽出されない）親スコープの属性バインディングやイベントを含みます。コンポーネントが宣言されたプロパティやカスタムイベントを持たない場合、これは基本的にすべての親スコープのバインディングを含み、`v-bind="$attrs"` を介して内部のコンポーネントに渡すことができます。これは高階（higher-order）コンポーネントを作成するときに便利です。

- **参照:**
  - [プロパティでない属性](../guide/component-attrs.html)
  - [オプション / その他 - inheritAttrs](./options-misc.html#inheritattrs)
