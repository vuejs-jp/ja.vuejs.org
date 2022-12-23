---
sidebarDepth: 1
---

# SFC スタイルの機能

## `<style scoped>`

`<style>` タグが `scoped` 属性を持つとき、その CSS は現在のコンポーネントの要素にだけ適用されます。これは Shadow DOM に見られるスタイルのカプセル化に似ています。いくつかの注意点がありますが、ポリフィルは必要ありません。これは PostCSS を使った次のような変換で実現しています:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

次のようになります:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### 子コンポーネントのルート要素

`scoped` を使うと、親コンポーネントのスタイルは子コンポーネントに漏れません。しかし、子コンポーネントのルートノードは、親スコープの CSS と子スコープの CSS の両方の影響を受けます。これは親コンポーネントがレイアウトの目的で子コンポーネントのルート要素をスタイルできるようにするという設計のためです。

### ディープセレクタ

`scoped` スタイルのセレクタを「深く」したい場合、例えば子コンポーネントに影響を与えたい場合は、`:deep()` 擬似クラスを使用できます:

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

上記は次のようにコンパイルされます:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
`v-html` で作られた DOM コンテンツは、スコープ付きスタイルの影響を受けませんが、ディープセレクタを使ってスタイルすることができます。
:::

### スロットセレクタ

デフォルトでは、スコープ付きスタイルは親コンポーネントが所有するコンテンツとみなされ、`<slot/>`でレンダリングされるコンテンツに影響を与えません。スロットのコンテンツを明示的に対象にするには、`:slotted` 擬似クラスを使用できます:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### グローバルセレクタ

グローバルに 1 つのルールだけを適用したい場合、別の `<style>` を作るのではなく、`:global` 擬似クラスを使用できます（後述）:

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### ローカルとグローバルのスタイル併用

スコープ付きとスコープなしのスタイルの両方を同じコンポーネントに含めることもできます:

```vue
<style>
/* グローバルスタイル */
</style>

<style scoped>
/* ローカルスタイル */
</style>
```

### スコープ付きスタイルのヒント

- **スコープ付きスタイルでもクラスが不要になるわけではないです**。ブラウザがさまざまな CSS セレクタをレンダリングする方法のため、`p { color: red }` はスコープ付きの場合（例えば属性セレクタと合わせた場合）に何杯も遅くなります。`.example { color: red }` のようにクラスや ID を代わりに使えば、このパフォーマンスへの影響をほぼ解消することができます。

- **再帰的コンポーネントの子孫セレクタには注意が必要です！** `.a .b` セレクタを使った CSS ルールでは、`.a` に一致する要素に再帰的な子コンポーネントが含まれている場合、その子コンポーネントに含まれるすべての `.b` がルールに一致してしまいます。

## `<style module>`

`<style module>` タグは [CSS Modules](https://github.com/css-modules/css-modules) としてコンパイルされ、結果として得られる CSS クラスを `$style` というキーの下にオブジェクトとしてコンポーネントに公開します:

```vue
<template>
  <p :class="$style.red">
    This should be red
  </p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

この結果として得られるクラスは、衝突を避けるためにハッシュ化され、CSS を現在のコンポーネントだけにスコープするのと同じ効果を実現します。

[Global exceptions](https://github.com/css-modules/css-modules#exceptions) や [Composition](https://github.com/css-modules/css-modules#composition) などの詳細については [CSS Modules の仕様](https://github.com/css-modules/css-modules) を参照してください。

### カスタム注入名

`module` 属性に値を指定することで、注入されたクラスオブジェクトのプロパティキーをカスタマイズできます:

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Composition API での使用

注入されたクラスは、[`useCssModule`](/api/global-api.html#usecssmodule) API を介して `setup()` や `<script setup>` からアクセスできます。カスタム注入名のある `<style module>` ブロックは `useCssModule` が一致する `module` 属性の値を最初の引数として受け取ります:

```js
// デフォルトでは <style module> を返します
useCssModule()

// 名前付きでは <style module="classes"> のクラスを返します
useCssModule('classes')
```

## 状態ドリブンな動的 CSS

SFC の `<style>` タグは `v-bind` CSS 関数を使って、CSS の値を動的コンポーネントの状態にリンクすることをサポートしています:

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

この構文は [`<script setup>`](./sfc-script-setup) で動作して、JavaScript 式（引用符で囲む必要があります）をサポートしています:

```vue
<script setup>
const theme = {
  color: 'red'
}
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

実際の値はハッシュ化された CSS カスタムプロパティにコンパイルされるため、CSS は静的なままです。このカスタムプロパティは、インラインスタイルを介してコンポーネントのルート要素に適用され、ソースの値が変更されるとリアクティブに更新されます。
