# ドキュメントスタイルガイド

このガイドでは、ドキュメントの作成に使用できるさまざまな設計要素の概要を説明します。

## アラート

VuePress は、アラートボックスを作成するためのカスタムコンテナプラグインを提供します。 4つのタイプがあります:

- **Info**: 中立的な情報を提供する
- **Tip**: ポジティブで奨励する情報を提供する
- **Warning**: 低から中程度、ユーザが知っておくべき情報を提供する
- **Danger**: ネガティブで、ユーザにリスクの高い情報を提供する

**マークダウンの例**

```
::: info
あなたはこのサイトでより多くの情報を見つけることができます。
:::

::: tip
これは覚えておくべき素晴らしいヒントです！
:::

::: warning
これは注意が必要なことです。
:::

::: danger DANGER
これはお勧めしません。自己責任で使用してください。
:::
```

**レンダリングされたマークダウン**

::: info
あなたはこのサイトでより多くの情報を見つけることができます。
:::

::: tip
これは覚えておくべき素晴らしいヒントです!
:::

::: warning
これは注意が必要なことです。
:::

::: danger DANGER
これはお勧めしません。自己責任で使用してください。
:::

## コードブロック

VuePress は、Prism を使用して、コードブロックの最初のバッククォートに言語を追加することにより、言語構文の強調表示を提供します:

**マークダウンの例**

````
```js
export default {
  name: 'MyComponent'
}
```
````

**レンダリングされた出力**
```js
export default {
  name: 'MyComponent'
}
```

### 行の強調表示

コードブロックに行の強調表示を追加するには、中括弧で行番号を追加する必要があります。

#### 一行

**マークダウンの例**

````
```js{2}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
````

**レンダリングされたマークダウン**

```js{2}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```

#### 行のグループ

````
```js{4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
````

```js{4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```

#### 複数のセクション

````
```js{2,4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
````

```js{2,4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
