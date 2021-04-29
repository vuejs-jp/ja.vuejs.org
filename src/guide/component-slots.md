# スロット

> このページはすでに [コンポーネントの基本](component-basics.md) を読んでいる事を前提としています。コンポーネントをよく知らない方はそちらを先にお読みください。

## スロットコンテンツ

Vue には [Web Components spec draft](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) にヒントを得たコンテンツ配信 API が実装されており、 `<slot>` 要素をコンテンツ配信の受け渡し口として利用します。

これを使うことで次のようなコンポーネントを作成することが出来ます:

```html
<todo-button>
  Add todo
</todo-button>
```

そして、 `<todo-button>` のテンプレートはこうなります:

```html
<!-- todo-button コンポーネントのテンプレート -->
<button class="btn-primary">
  <slot></slot>
</button>
```

コンポーネントを描画する時、 `<slot></slot>` は「Add Todo」に置換されるでしょう:

```html
<!-- 描画された HTML -->
<button class="btn-primary">
  Add todo
</button>
```

文字列はあくまで序の口です！スロットには、 HTML を含む任意のテンプレートコードを含めることも出来ます:

```html
<todo-button>
  <!-- Font Awesome のアイコンを追加 -->
  <i class="fas fa-plus"></i>
  Add todo
</todo-button>
```

あるいは他のコンポーネントを入れることも出来ます:

```html
<todo-button>
  <!-- コンポーネントを使ってアイコンを追加 -->
  <font-awesome-icon name="plus"></font-awesome-icon>
  Add todo
</todo-button>
```

もしも `<todo-button>` のテンプレートが `<slot>` **要素を含まない** 場合、開始タグと終了タグの間にある任意のコンテンツは破棄されます。

```html
<!-- todo-button コンポーネントのテンプレート -->

<button class="btn-primary">
  Create a new item
</button>
```

```html
<todo-button>
  <!-- 次の行のテキストは描画されません -->
  Add todo
</todo-button>
```

## 描画スコープ

スロットの中でデータを扱いたい場合はこうします:

```html
<todo-button>
  Delete a {{ item.name }}
</todo-button>
```

このスロットは、テンプレートの残りの部分と同じインスタンスのプロパティ (つまり、同じ “スコープ”) にアクセスできます。

<img src="/images/slot.png" width="447" height="auto" style="display: block; margin: 0 auto; max-width: 100%" loading="lazy" alt="スロットの説明図">

`<todo-button>` のスコープにアクセスすることは **できません**。例えば、`action` へのアクセスは動作しないでしょう:

```html
<todo-button action="delete">
  Clicking here will {{ action }} an item
  <!--
  `action` は undefined になります。なぜなら、このコンテンツは
  <todo-button> コンポーネント _の中で_ 定義されるのではなく、
  <todo-button> コンポーネント _に_ 渡されるからです
  -->
</todo-button>
```

ルールとしては、以下を覚えておいてください:

> 親のテンプレート内の全てのものは親のスコープでコンパイルされ、子のテンプレート内の全てのものは子のスコープでコンパイルされる。

## フォールバックコンテンツ

スロットに対して、コンテンツがない場合にだけ描画されるフォールバック (つまり、デフォルトの) コンテンツを指定すると便利な場合があります。例えば、`<submit-button>` コンポーネントにおいて:

```html
<button type="submit">
  <slot></slot>
</button>
```

ほとんどの場合には `<button>` の中に「Submit」という文字を描画したいかもしれません。「Submit」をフォールバックコンテンツにするには、 `<slot>` タグの中に記述します。

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

そして、親コンポーネントからスロットのコンテンツを指定せずに `<submit-button>` を使うと:

```html
<submit-button></submit-button>
```

フォールバックコンテンツの「Submit」が描画されます:

```html
<button type="submit">
  Submit
</button>
```

しかし、もしコンテンツを指定すると:

```html
<submit-button>
  Save
</submit-button>
```

指定されたコンテンツが代わりに描画されます:

```html
<button type="submit">
  Save
</button>
```

## 名前付きスロット

複数のスロットがあると便利なときもあります。例えば、 `<base-layout>` コンポーネントが下記のようなテンプレートだとしましょう:

```html
<div class="container">
  <header>
    <!-- ここにヘッダコンテンツ -->
  </header>
  <main>
    <!-- ここにメインコンテンツ -->
  </main>
  <footer>
    <!-- ここにフッターコンテンツ -->
  </footer>
</div>
```

こういった場合のために、 `<slot>` 要素は `name` という特別な属性を持っていて、それぞれのスロットにユニークな ID を割り当てることによってコンテンツがどこに描画されるべきかを決定することができます:

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

`name` のない `<slot>` 要素は、暗黙的に「default」という名前を持ちます。

名前付きスロットにコンテンツを渡すには、`<template>` に対して `v-slot` ディレクティブを使い、スロット名をその引数として与える必要があります:

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

これにより、`<template>` 要素の中身はすべて対応するスロットに渡されます。

描画される HTML は以下のようになります:

```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

**`v-slot` は（[一つの例外](#デフォルトスロットしかない場合の省略記法) を除き） `<template>` にしか指定できないことに注意してください。

## スコープ付きスロット

スロットコンテンツから、子コンポーネントの中だけで利用可能なデータにアクセスできると便利なことがあります。コンポーネントがアイテムの配列を描画するためにつかわれていて、レンダリングされた各アイテムをカスタマイズできるようにしたい、などは典型的な例です。

例えば、以下のようなコンポーネントがあり、 todo アイテムのリストを内部に持ってます。

```js
app.component('todo-list', {
  data() {
    return {
      items: ['Feed a cat', 'Buy milk']
    }
  },
  template: `
    <ul>
      <li v-for="(item, index) in items">
        {{ item }}
      </li>
    </ul>
  `
})
```

親コンポーネントでこれをカスタマイズするために、<span v-pre>`{{ item }}`</span> を `<slot>` に置き換えたい場合があります:

```html
<todo-list>
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}<span>
</todo-list>
```

しかし、これは動作しません。というのも、 `item` にアクセスすることができるのは `<todo-list>` コンポーネントだけですが、ここで指定しているコンテンツは親コンポーネントで描画されるからです。

親コンポーネント内でスロットコンテンツとして `item` を使えるようにするためには、これを `<slot>` 要素の属性としてバインドします:

```html
<ul>
  <li v-for="( item, index ) in items">
    <slot :item="item"></slot>
  </li>
</ul>
```

You can bind as many attributes to the `slot` as you need:

```html
<ul>
  <li v-for="( item, index ) in items">
    <slot :item="item" :index="index" :another-attribute="anotherAttribute"></slot>
  </li>
</ul>
```

`<slot>` 要素にバインドされた属性は、 **スロットプロパティ** と呼ばれます。これで、親スコープ内で `v-slot` に値を指定して、渡されたスロットプロパティの名前を定義できます:

```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>
</todo-list>
```

<img src="/images/scoped-slot.png" width="611" height="auto" style="display: block; margin: 0 auto; max-width: 100%;" loading="lazy" alt="スコープ付きスロットの説明図">

この例では、すべてのスロットプロパティを持つオブジェクトの名前を `slotProps` にしましたが、あなたの好きな名前を使うことができます。

### デフォルトスロットしかない場合の省略記法

上の例のようにデフォルトスロット _だけの_ 場合は、コンポーネントのタグをスロットのテンプレートとして使うことができます。つまり、コンポーネントに対して `v-slot` を直接使えます:

```html
<todo-list v-slot:default="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

さらに短くすることもできます。未指定のコンテンツがデフォルトスロットのものとみなされるのと同様に、引数のない `v-slot` もデフォルトコンテンツを参照しているとみなされます:

```html
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

デフォルトスロットに対する省略記法は、名前付きスロットと混在させることが **できない** 点に注意してください。スコープの曖昧さにつながるためです:

```html
<!-- 不正。警告が出ます -->
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>

  <template v-slot:other="otherSlotProps">
    slotProps is NOT available here
  </template>
</todo-list>
```

複数のスロットがある場合は常に _すべての_ スロットに対して `<template>` ベースの構文を使用してください:

```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</todo-list>
```

### スロットプロパティの分割代入

内部的には、スコープ付きスロットはスロットコンテンツを単一引数の関数で囲むことで動作させています:

```js
function (slotProps) {
  // ... スロットコンテンツ ...
}
```

これは、`v-slot` の値が関数定義の引数部分で有効な任意の JavaScript 式を受け付けることを意味します。そのため、特定のスロットプロパティを取得するために [ES2015 の分割代入](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) を使うこともできます:

```html
<todo-list v-slot="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}<span>
</todo-list>
```

こうするとテンプレートはよりきれいになります。特に、スロットが多くのプロパティを提供している場合はそうです。また、プロパティをリネームする (例えば、`item` から `todo`) など別の可能性も開けます:

```html
<todo-list v-slot="{ item: todo }">
  <i class="fas fa-check"></i>
  <span class="green">{{ todo }}</span>
</todo-list>
```

スロットプロパティが未定義だった場合のフォールバックを定義することもできます:

```html
<todo-list v-slot="{ item = 'Placeholder' }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}<span>
</todo-list>
```

## 動的なスロット名

 [ディレクティブの動的引数](template-syntax.md#動的引数) は `v-slot` でも動作し、動的なスロット名の定義が可能です:

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

## 名前付きスロットの省略記法

`v-on` や `v-bind` と同様に `v-slot` にも省略記法があり、引数の前のすべての部分 (`v-slot:`) を特別な記号 `#` で置き換えます。例えば、`v-slot:header` は `#header` に書き換えることができます:

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

しかし、ほかのディレクティブと同様に、省略記法は引数がある場合にのみ利用できます。これは、次のような構文が不正ということを意味します:

```html
<!-- 警告が出ます -->

<todo-list #="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}<span>
</todo-list>
```

代わりに、省略記法を使いたい場合には、常にスロット名を指定する必要があります:

```html
<todo-list #default="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}<span>
</todo-list>
```
