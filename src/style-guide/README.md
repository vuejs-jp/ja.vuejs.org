---
sidebar: auto
---

# スタイルガイド

このドキュメントは、 Vue 固有の記法についての公式なスタイルガイドです。もしあなたがプロジェクトにおいて Vue を使用する場合は、エラーや有益でない議論、アンチパターンを避けるための参考となります。しかし、スタイルガイドはすべてのチームやプロジェクトで理想とは限らないと考えていますので、過去の経験や、周囲の技術スタック、個人の価値観に基づいた上で必要に応じて慎重に逸脱することが推奨されます。

ほとんどのパートにおいて、基本的に JavaScript や HTML に対する提案は避けています。セミコロンやカンマの使用の是非はどちらでも良いです。 HTML の属性に対してシングルクォートかダブルクォートどちらかを利用するかもどちらでも良いです。しかし、 Vue のコンテキストにおいて特定のパターンが役立つと判明した場合については、その限りではありません。

最後に、私たちはルール群を 4 つのカテゴリに分割しました:

## ルールカテゴリ

### 優先度 A: 必須

これらのルールはエラー防止に役立ちます。ですので、学び、遵守してください。例外は存在するかもしれませんが、それらは極めて稀で、かつ JavaScript と Vue の両方の専門知識を持った人によってのみ作られるべきです。

### 優先度 B: 強く推奨

これらのルールは、ほとんどのプロジェクトで読みやすさや開発者の体験をよりよくするために見いだされました。これらに違反してもあなたのコードは動きますが、ごくまれなケースで、かつちゃんと正当を示した上でのみ違反するようにすべきです。

### 優先度 C: 推奨

同じくらい良いオプションが複数ある場合、一貫性を確保するために任意の選択をすることができます。これらのルールでは、それぞれ許容可能なオプションを説明し、既定の選択を提案します。つまり、一貫性があり、正当な理由を持ち続ける限り、独自のコードベースで自由に異なる選択肢を作ることができます。ですが、正当な理由を必ず持つようにしてください！コミュニティの標準に合わせることで、あなたは:

1. 直面するコミュニティのコードを容易に理解できるように脳を慣れさせます。
2. ほとんどのコミュニティのコードサンプルを変更なしにコピーして貼り付ける事ができます。
3. 少なくとも Vue に関しては、ほとんどの場合、新たな人材はあなたのコーディングスタイルよりも既に慣れ親しんだものを好みます。

### 優先度 D: 使用注意

Vue のいくつかの機能は、レアケースまたは従来のコードベースからスムーズな移行に対応するために存在します。しかしながらこれを使いすぎると、コードを保守することが難しくなり、またバグの原因になることさえあります。これらのルールは潜在的な危険な機能を照らし、いつ、なぜ避けなかればならないのかを説明しています。

## 優先度 A ルール: 必須 <span class="hide-from-sidebar">(エラー防止)</span>

### 複数単語のコンポーネント名 <sup data-p="a">必須</sup>

**ルートの `App` コンポーネントや、Vue が提供する `<transition>` や `<component>` のようなビルトインコンポーネントを除き、コンポーネント名は常に複数単語とするべきです。**

全ての HTML 要素は 1 単語なので、このルールを守ることで既に存在する HTML 要素や将来定義される HTML 要素との [衝突を防止することができます](http://w3c.github.io/webcomponents/spec/custom/#valid-custom-element-name)。

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` js
app.component('todo', {
  // ...
})
```

``` js
export default {
  name: 'Todo',
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` js
app.component('todo-item', {
  // ...
})
```

``` js
export default {
  name: 'TodoItem',
  // ...
}
```
</div>

### Prop の定義 <sup data-p="a">必須</sup>

**Prop の定義は可能な限り詳細にするべきです。**

コミットされたコードでは、prop の定義は常に可能な限り詳細にすべきで、少なくともタイプの指定をする必要があります。

::: details 詳細な説明
詳細な [プロパティの定義](/guide/component-props.html#prop-validation) には 2 つの利点があります:

- コンポーネントの API が明文化されるため、そのコンポーネントの使用方法が簡単に確認できます。
- 開発中、コンポーネントに対して誤った形式のプロパティが提供されると Vue は警告を通知するため、潜在的なエラー原因の検知に役立ちます。
:::

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` js
// プロトタイピングの時に限り OK
props: ['status']
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` js
props: {
  status: String
}
```

``` js
// さらに良いです!
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```
</div>

### キー付き `v-for` <sup data-p="a">必須</sup>

**`v-for` に対しては常に `key` を使用してください。**

サブツリーの内部コンポーネントの状態を維持するために、コンポーネントでの `v-for` には _常に_ `key` を付ける必要があります。ただし要素の場合であっても、アニメーションでの [オブジェクトの一貫性](https://bost.ocks.org/mike/constancy/) のように、予測可能な振る舞いを維持することをお勧めします。

::: details 詳細な説明
TODO リストを持っているとしましょう:

``` js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Learn to use v-for'
      },
      {
        id: 2,
        text: 'Learn to use key'
      }
    ]
  }
}
```

次に、それらをアルファベット順に並べ替えます。 DOM を更新するとき、可能な限り安価な DOM の変更を行うために Vue はレンダリングを最適化します。 これは、最初の todo 要素を削除して、再度リストの最後に追加することを意味するかもしれません。

問題は、DOM に残る要素を削除しないことが重要となる場合があることです。 例えば、 `<transition-group>` を使用してリストの並べ替えをアニメーション化する場合だったり、レンダリングされた要素が `<input>` の時はフォーカスを維持したいといった場合があります。 このような場合、アイテムごとに一意のキー (`:key="todo.id"` など) を追加することで、 Vue に対してどうしたらより予期した通りの動作ができるかを伝えることができます。

これまでの経験から、あなたとあなたのチームがこれらのエッジケースについて心配する必要がないように、 _常に_ 一意のキーを追加することをお勧めします。 その上で、オブジェクトの一貫性が必要なくてパフォーマンスが重要な稀なシナリオにおいては、意識的な例外を作成すると良いでしょう。
:::

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```
</div>

### `v-for` と一緒に `v-if` を使うのを避ける <sup data-p="a">必須</sup>

**`v-for` と同じ要素に `v-if` を決して使わないでください。**

こうしたくなる一般的なケースが 2 通りほどあります:

- リストのアイテムをフィルタリングする時 (`v-for="user in users" v-if="user.isActive"` のように)。このような場合、 `users` をフィルタリングをされたリストを返す新しい算出プロパティ (例えば `activeUsers`) に置き換えます。

- リストを非表示にする必要がある場合に、リストがレンダリングされるのを避ける時 (`v-for="user in users" v-if="shouldShowUsers"` のように)。このような場合、 `v-if` をコンテナ要素 (例えば `ul`, `ol`)に移動します。

::: details 詳細な説明
Vue がディレクティブを処理する場合、`v-if` は `v-for` よりも優先度が高いため、次のようなテンプレートは:

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

`v-if` ディレクティブが最初に評価され、反復変数の `user` がこの時点では存在しないためエラーが投げられます。

これは、代わりに算出プロパティを元に反復処理をすることで修正できます。次のようになります:

``` js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

または、 `v-for` と一緒に `<template>` タグを使用して、 `<li>` 要素をラップすることもできます:

``` html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

``` html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```
</div>

### コンポーネントスタイルのスコープ <sup data-p="a">必須</sup>

**アプリケーションにとって、トップレベルの `App` コンポーネントとレイアウトコンポーネントのスタイルはグローバルである可能性がありますが、他のすべてのコンポーネントは常にスコープ化されているべきです。**

これは、[単一ファイルコンポーネント](../guide/single-file-component.html) のみに関連します。[`scoped` 属性](https://vue-loader.vuejs.org/en/features/scoped-css.html) の使用は必須_ではありません_。 スコープは [CSS modules](https://vue-loader.vuejs.org/en/features/css-modules.html) や [BEM](http://getbem.com/) のようなクラスに基づいた戦略、または他のライブラリ/慣例を介して行うことができます。

**ただしコンポーネントライブラリでは、 `scoped` 属性を使用するのではなく、クラスに基づいた戦略を優先すべきです**

これにより、人間が読み取りやすいクラス名を使って、内部のスタイルを上書きすることが容易になります。またそのクラス名は、高い特定性を持たないけれど、依然として競合が発生する可能性が低いままのものになります。

::: details 詳細な説明
大規模なプロジェクトを開発している場合や他の開発者と一緒に開発している場合、またはサードパーティの HTML/CSS (Auth0 など) を含んでいる場合は、一貫したスコープによってスタイルが対象のコンポーネントのみに適用されることが保証されます。

`scoped` 属性以外にも、一意のクラス名を使用することでサードパーティの CSS が独自の HTML に適用されないことを保証しやすくできます。例えば、多くのプロジェクトでは `button` や `btn` 、または `icon` といったクラス名を使用しているため、BEM などの戦略を使用していない場合でも、アプリ固有かつ/またはコンポーネント固有(例： `ButtonClose-icon`)のプレフィックスを追加することで、ある程度の保護を提供できます。
:::

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` html
<template>
  <button class="button button-close">×</button>
</template>

<!-- `scoped` を使用 -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

``` html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- Using CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

``` html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- BEM の慣例を使用 -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```
</div>

### プライベートなプロパティ名 <sup data-p="a">必須</sup>

**モジュールスコープを使用して、外部からプライベート関数にアクセスできないようにします。それが不可能な場合は、パブリック API と見なすべきではないプラグインやミックスインなどのカスタムプライベートプロパティに、常に `$_` のプレフィックスを使用してください。 その上で、他の作成者によるコードとの競合を避けるために、名前付きスコープも含めるようにしてください (例： `$_yourPluginName_`)**

::: details 詳細な説明
Vue は `_` のプレフィックスを使用して独自のプライベートプロパティを定義するため、同じプレフィックス (`_update` など) を使用すると、インスタンスプロパティが上書きされるリスクがあります。 Vue が現在特定のプロパティ名を使用していないことを確認したとしても、それ以降のバージョンで競合が発生しないという保証はありません。

`$` のプレフィックスに関しては、Vue エコシステム内でのそのプレフィックスの目的は、ユーザーに公開される特別なインスタンスプロパティであるため、_独自_プロパティに使用することは適切ではありません。

代わりに、Vue との競合がないことを保証するユーザー定義のプライベートプロパティの規則として、2 つのプレフィックスを `$_` に結合することをお勧めしています。
:::

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` js
const myGreatMixin = {
  // ...
  methods: {
    update() {
      // ...
    }
  }
}
```

``` js
const myGreatMixin = {
  // ...
  methods: {
    _update() {
      // ...
    }
  }
}
```

``` js
const myGreatMixin = {
  // ...
  methods: {
    $update() {
      // ...
    }
  }
}
```

``` js
const myGreatMixin = {
  // ...
  methods: {
    $_update() {
      // ...
    }
  }
}
```

</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` js
const myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update() {
      // ...
    }
  }
}
```

``` js
// さらに良いです!
const myGreatMixin = {
  // ...
  methods: {
    publicMethod() {
      // ...
      myPrivateFunction()
    }
  }
}

function myPrivateFunction() {
  // ...
}

export default myGreatMixin
```
</div>

## 優先度B のルール: 強く推奨 <span class="hide-from-sidebar">(読みやすさの向上)</span>

### コンポーネントのファイル <sup data-p="b">強く推奨</sup>

**ファイルを結合してくれるビルドシステムがあるときは必ず、各コンポーネントはそれぞれ別のファイルに書くべきです。**

そうすれば、コンポーネントを編集したり使い方を確認するときにより素早く見つけることができます。

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```
</div>

### 単一ファイルコンポーネントのファイル名の形式 <sup data-p="b">強く推奨</sup>

**[単一ファイルコンポーネント](../guide/single-file-component.html) のファイル名は、すべてパスカルケース (PascalCase) にするか、すべてケバブケース (kebab-case) にするべきです。**

パスカルケースは、JS(X) やテンプレートの中でコンポーネントを参照する方法と一致しているので、コードエディタ上でオートコンプリートが可能な場合はとてもうまく働きます。しかし、大文字と小文字が混ざったファイル名は、大文字と小文字を区別しないファイルシステム上で時々問題を起こす可能性があります。そのため、ケバブケースもまた完全に受け入れられています。

<div class="style-example style-example-bad">
<h4>悪い例</h4>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
</div>

### 基底コンポーネントの名前 <sup data-p="b">強く推奨</sup>

**アプリケーション特有のスタイルやルールを適用する基底コンポーネント (またはプレゼンテーションコンポーネント: Presentation Components、ダムコンポーネント: Dumb Components、純粋コンポーネント: Pure Components とも) は、すべて `Base`、`App`、`V` などの固有のプレフィックスで始まるべきです。**

::: details 詳細な説明
これらのコンポーネントは、あなたのアプリケーションに一貫したスタイルやふるまいをもたせる基礎として位置づけられます。これらは、おそらく以下のもの**だけ**を含むでしょう:

- HTML 要素、
- 別の基底コンポーネント、そして
- サードパーティ製の UI コンポーネント

しかし、それらにはグローバルな状態(例:Vuex ストアからのもの)は含まれ**ません**。

これらのコンポーネントの名前は、しばしばラップしている要素の名前を含みます(例えば `BaseButton`、`BaseTable`)。それ特有の目的のための要素がない場合は別ですが(例えば `BaseIcon`)。もっと特定の用途に向けた同じようなコンポーネントを作る時は、ほとんどすべての場合にこれらのコンポーネントを使うことになるでしょう。(例えば `BaseButton` を `ButtonSubmit` で使うなど)

このルールの長所:

- エディタ上でアルファベット順に並べられた時に、アプリケーションの基底コンポーネントはすべて一緒にリストされ、識別しやすくなります。

- コンポーネントの名前は常に複数単語にするべきなので、このルールによってシンプルなコンポーネントラッパーに勝手なプレフィックスを選ばなければならない(例えば `MyButton`、`VueButton`)ということがなくなります。

- これらのコンポーネントはとても頻繁に使われるので、あらゆる場所で import するよりも単純にグローバルにしてしまいたいと思うかもしれません。プレフィックスを利用して、それを Webpack でできるようになります。

  ``` js
  const requireComponent = require.context("./src", true, /Base[A-Z]\w+\.(vue|js)$/)
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    const baseComponentName = baseComponentConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    app.component(baseComponentName, baseComponentConfig)
  })
  ```
:::

<div class="style-example style-example-bad">
<h4>悪い例</h4>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```
</div>

### 単一インスタンスのコンポーネント名 <sup data-p="b">強く推奨</sup>

**常に 1 つのアクティブなインスタンスしか持たないコンポーネントは、1 つしか存在しえないことを示すために `The` というプレフィックスで始めるべきです。**

これはそのコンポーネントが 1 つのページでしか使われないということを意味するのではなく、_ページごとに_ 1 回しか使われないという意味です。これらのコンポーネントは、アプリケーション内のコンテキストではなく、アプリケーションに対して固有のため、決してプロパティを受け入れることはありません。もしプロパティを追加する必要があることに気づいたのなら、それは _現時点で_ ページごとに 1 回しか使われていないだけで、実際には再利用可能なコンポーネントだということを示すよい目印です。

<div class="style-example style-example-bad">
<h4>悪い例</h4>

```
components/
|- Heading.vue
|- MySidebar.vue
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
</div>

### 密結合コンポーネントの名前 <sup data-p="b">強く推奨</sup>

**親コンポーネントと密結合した子コンポーネントには、親コンポーネントの名前をプレフィックスとして含むべきです。**

もし、コンポーネントが単一の親コンポーネントの中でだけ意味をもつものなら、その関連性は名前からはっきりわかるようにするべきです。一般的にエディタはファイルをアルファベット順に並べるので、関連をもつものどうしが常に隣り合って並ぶことにもなります。

::: details 詳細な説明
この問題を、子コンポーネントを親コンポーネントの名前を元に命名したディレクトリの中に入れることで解決したいと思うかもしれません。例えば:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

もしくは:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

これは推奨されません。以下のような結果を生むからです:

- 同じような名前のファイルがたくさんできてしまい、コードエディタ上で素早くファイルを切り替えるのが難しくなります。
- ネストしたサブディレクトリがたくさんできてしまい、エディタのサイドバーでコンポーネントを参照するのに時間がかかるようになります。
:::

<div class="style-example style-example-bad">
<h4>悪い例</h4>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```
</div>

### コンポーネント名における単語の順番 <sup data-p="b">強く推奨</sup>

**コンポーネント名は、最高レベルの(たいていは最も一般的な)単語から始めて、説明的な修飾語で終わるべきです。**

::: details 詳細な説明
あなたは疑問に思うかもしれません:

> “なぜコンポーネント名に自然な言語でないものを使うように強制するのですか？”

自然な英語では、形容詞やその他の記述子は一般的に名詞の前に置かれ、そうでない場合には接続詞が必要になります。例えば:

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

もちろん、あなたがそうしたいのならば、これらの接続詞をコンポーネント名に含めても構いませんが、それでも順番は重要です。

また、 **何を「最高レベル」として尊重するかがアプリケーションの文脈になる** ことに注意してください。例えば、検索フォームを持ったアプリケーションを想像してください。こんなコンポーネントがあるかもしれません:


```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

あなたも気づいたと思いますが、これではどのコンポーネントが検索に特有のものなのかとても分かりづらいです。では、このルールに従ってコンポーネントの名前を変えてみましょう。

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

一般的にエディタではファイルはアルファベット順に並ぶので、コンポーネント間のあらゆる重要な関連性はひと目ではっきりと分かります。

あなたは、これを別の方法で解決したいと思うかもしれません。つまり、すべての検索コンポーネントは search ディレクトリの下に、すべての設定コンポーネントは settings ディレクトリの下にネストするという方法です。以下の理由から、とても大規模なアプリケーション(例えば 100 以上のコンポーネントがあるような)の場合に限ってこのアプローチを考慮することを推奨します:

- 一般的に、入れ子のサブディレクトリの中を移動するのは、単一の `components` ディレクトリをスクロールするのと比べて余分に時間がかかります。
- 名前の競合（複数の `ButtonDelete.vue` コンポーネントなど）により、コードエディタで特定のコンポーネントに素早く移動しづらくなります。
- 移動したコンポーネントへの相対参照を更新するには、検索と置換だけでは不十分な場合が多いため、リファクタリングはより困難になります。
:::

<div class="style-example style-example-bad">
<h4>悪い例</h4>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
</div>

### 自己終了形式のコンポーネント <sup data-p="b">強く推奨</sup>

**[単一ファイルコンポーネント](../guide/single-file-component.html)、文字列テンプレート、および [JSX](../guide/render-function.html#jsx) の中にある、中身を持たないコンポーネントは自己終了形式で書くべきです。ただし、DOM テンプレート内ではそうしてはいけません。**

自己終了形式のコンポーネントは、単に中身を持たないだけでなく、中身を持たないことを **意図した** ことだとはっきりと表現します。本の中にある白紙のページと、「このページは意図的に白紙のままにしています」と書かれたページとは違うということです。また、不要な閉じタグがなくなることであなたのコードはより読みやすくなります。

残念ながら、HTML はカスタム要素の自己終了形式を許していません。[公式の「空」要素](https://www.w3.org/TR/html/syntax.html#void-elements) だけです。これが、Vue のテンプレートコンパイラが DOM よりも先にテンプレートにアクセスして、その後 DOM の仕様に準拠した HTML を出力することができる場合にだけこの方策を使うことができる理由です。

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` html
<!-- 単一ファイルコンポーネント、文字列テンプレート、JSX の中 -->
<MyComponent></MyComponent>
```

``` html
<!-- DOM テンプレートの中 -->
<my-component/>
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` html
<!-- 単一ファイルコンポーネント、文字列テンプレート、JSX の中 -->
<MyComponent/>
```

``` html
<!-- DOM テンプレートの中 -->
<my-component></my-component>
```
</div>

### テンプレート内でのコンポーネント名の形式 <sup data-p="b">強く推奨</sup>

**ほとんどのプロジェクトにおいて、[単一ファイルコンポーネント](../guide/single-file-component.html) と文字列テンプレートの中では、コンポーネント名は常にパスカルケース(PascalCase)になるべきです。 - しかし、 DOM テンプレートの中ではケバブケース(kebab-case)です。**

パスカルケースには、ケバブケースよりも優れた点がいくつかあります:

- パスカルケースは JavaScript でも使われるので、エディタがテンプレート内のコンポーネント名を自動補完できます。
- `<MyComponent>` は `<my-component>` よりも一単語の HTML 要素との見分けがつきやすいです。なぜなら、ハイフン 1 文字だけの違いではなく 2 文字(2 つの大文字) の違いがあるからです。
- もし、テンプレート内で、Vue 以外のカスタム要素(例: Web コンポーネントなど)を使っていたとしても、パスカルケースは Vue コンポーネントがはっきりと目立つことを保証します。

残念ですが、HTML は大文字と小文字を区別しないので、DOM テンプレートの中ではまだケバブケースを使う必要があります。

ただし、もしあなたが既にケバブケースを大量に使っているのなら、HTML の慣習との一貫性を保ちすべてのあなたのプロジェクトで同じ型式を使えるようにすることはおそらく上にあげた利点よりも重要です。このような状況では、 **どこでもケバブケースを使うのもアリです。**

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` html
<!-- 単一ファイルコンポーネント、文字列テンプレートの中 -->
<mycomponent/>
```

``` html
<!-- 単一ファイルコンポーネント、文字列テンプレートの中 -->
<myComponent/>
```

``` html
<!-- DOM テンプレートの中 -->
<MyComponent></MyComponent>
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` html
<!-- 単一ファイルコンポーネント、文字列テンプレートの中 -->
<MyComponent/>
```

``` html
<!-- DOM テンプレートの中 -->
<my-component></my-component>
```

または

``` html
<!-- どこでも -->
<my-component></my-component>
```
</div>

### JS/JSX 内でのコンポーネント名の形式 <sup data-p="b">強く推奨</sup>

**JS/[JSX](../guide/render-function.html#jsx) 内でのコンポーネント名は常にパスカルケース(PascalCase)にするべきです。ただし、`app.component` で登録したグローバルコンポーネントしか使わないような単純なアプリケーションでは、ケバブケース(kebab-case)を含む文字列になるかもしれません。**

::: details 詳細な説明
JavaScript では、クラスやプロトタイプのコンストラクタは - 原則として異なるインスタンスを持ちうるものはすべて- パスカルケースにするのがしきたりです。Vue コンポーネントもインスタンスをもつので、同じようにパスカルケースにするのが理にかなっています。さらなる利点として、JSX(とテンプレート)の中でパスカルケースを使うことによって、コードを読む人がコンポーネントと HTML 要素をより簡単に見分けられるようになります。

しかし、`app.component` によるグローバルコンポーネント定義**だけ**を使うアプリケーションでは、代わりにケバブケースを使うことを推奨します。理由は以下の通りです:

- グローバルコンポーネントを JavaScript から参照することはほとんどないので、 JavaScript の原則に従う意味もほとんどありません。
- そのようなアプリケーションはたくさんの DOM 内テンプレートをもつのが常ですが、 そこでは [ケバブケースを **必ず** 使う必要があります](#テンプレート内でのコンポーネント名の形式-強く推奨)
:::

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` js
app.component('myComponent', {
  // ...
})
```

``` js
import myComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'myComponent',
  // ...
}
```

``` js
export default {
  name: 'my-component',
  // ...
}
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` js
app.component('MyComponent', {
  // ...
})
```

``` js
app.component('my-component', {
  // ...
})
```

``` js
import MyComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'MyComponent',
  // ...
}
```
</div>

### 完全な単語によるコンポーネント名 <sup data-p="b">強く推奨</sup>

**コンポーネント名には、略語よりも完全な単語を使うべきです。**

長い名前によってもたらされる明快さは非常に貴重ですが、それをタイプする労力はエディタの自動補完によってとても小さくなります。特に、一般的でない略語は常に避けるべきです。

<div class="style-example style-example-bad">
<h4>悪い例</h4>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
</div>

### プロパティ名の型式 <sup data-p="b">強く推奨</sup>

**プロパティ名は、定義の時は常にキャメルケース(camelCase)にするべきですが、テンプレートや [JSX](../guide/render-function.html#JSX) ではケバブケース(kebab-case)にするべきです。**

私たちは単純にこの慣習に従っています。JavaScript の中ではキャメルケースがより自然で、HTML の中ではケバブケースが自然です。

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` js
props: {
  'greeting-text': String
}
```

``` html
<WelcomeMessage greetingText="hi"/>
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` js
props: {
  greetingText: String
}
```

``` html
<WelcomeMessage greeting-text="hi"/>
```
</div>

### 複数の属性をもつ要素 <sup data-p="b">強く推奨</sup>

**複数の属性をもつ要素は、1 行に 1 要素ずつ、複数の行にわたって書くべきです。**

JavaScript では、複数のプロパティをもつ要素を複数の行に分けて書くことはよい慣習だと広く考えられています。なぜなら、その方がより読みやすいからです。Vue のテンプレートや [JSX](../guide/render-function.html#JSX) も同じように考えることがふさわしいです。

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

``` html
<MyComponent foo="a" bar="b" baz="c"/>
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

``` html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```
</div>

### テンプレート内での単純な式 <sup data-p="b">強く推奨</sup>

**複雑な式は算出プロパティかメソッドにリファクタリングして、コンポーネントのテンプレートには単純な式だけを含むようにするべきです。**

テンプレート内に複雑な式があると、テンプレートが宣言的ではなくなります。私たちは、_どのように_ その値を算出するかではなく、_何が_ 表示されるべきかを記述するように努力するべきです。また、算出プロパティやメソッドによってコードが再利用できるようになります。

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` html
<!-- テンプレート内 -->
{{ normalizedFullName }}
```

``` js
// 複雑な式を算出プロパティに移動
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```
</div>

### 単純な算出プロパティ <sup data-p="b">強く推奨</sup>

**複雑な算出プロパティは、できる限りたくさんの単純なプロパティに分割するべきです。**

::: details 詳細な説明
単純な、よい名前を持つ算出プロパティは:

- テストしやすい

  それぞれの算出プロパティが、依存がとても少ないごく単純な式だけを含む場合、それが正しく動くことを確認するテストを書くのがより簡単になります。

- 読みやすい

  算出プロパティを単純にするということは、たとえそれが再利用可能ではなかったとしても、それぞれに分かりやすい名前をつけることになります。それによって、他の開発者(そして未来のあなた)が、注意を払うべきコードに集中し、何が起きているかを把握することがより簡単になります。

- 要求の変更を受け入れやすい

  名前をつけることができる値は何でも、ビューでも役に立つ可能性があります。例えば、いくら割引になっているかをユーザに知らせるメッセージを表示することに決めたとします。 また、消費税も計算して、最終的な価格の一部としてではなく、別々に表示することにします。

  小さく焦点が当てられた算出プロパティは、どのように情報が使われるかの決めつけをより少なくし、少しのリファクタリングで要求の変更を受け入れられます。
:::

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```
</div>

### 引用符付きの属性値 <sup data-p="b">強く推奨</sup>

**空ではない HTML 属性の値は常に引用符(シングルコーテーションかダブルコーテーション、 JS の中で使われていない方)でくくるべきです。**

HTML では、空白を含まない属性値は引用符でくくらなくてもよいことになっていますが、そのせいで空白の使用を _避けてしまい_ 属性値が読みづらくなりがちです。

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` html
<input type=text>
```

``` html
<AppSidebar :style={width:sidebarWidth+'px'}>
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` html
<input type="text">
```

``` html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```
</div>

### ディレクティブの短縮記法 <sup data-p="b">強く推奨</sup>

**ディレクティブの短縮記法 (`v-bind:` に対する `:`、`v-on:` に対する `@`、`v-slot:` に対する `#`)は、常に使うか、まったく使わないかのどちらかにするべきです。**

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

``` html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

``` html
<input
  @input="onInput"
  @focus="onFocus"
>
```

``` html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

``` html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template v-slot:footer>
  <p>Here's some contact info</p>
</template>
```

``` html
<template #header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```
</div>


## 優先度 C のルール: 推奨 (任意の選択肢と認知上のオーバーヘッドの最小化)

### コンポーネント/インスタンス オプション順序 <sup data-p="c">推奨</sup>

**コンポーネント/インスタンス オプションは、一貫した順序になるべきです。**

これは推奨するコンポーネントオプションの既定の順序です。それらは種類分けされており、プラグインからどこに新たなプロパティを追加するか知ることができます。

1. **グローバルな認識** (コンポーネントを超えた知識が必要)
    - `name`

2. **テンプレート修飾子** (テンプレートのコンパイル方法の変更)
    - `delimiters`

3. **テンプレートの依存関係** (テンプレートで使用されるアセット)
    - `components`
    - `directives`

4. **合成** (プロパティをオプションにマージ)
    - `extends`
    - `mixins`
    - `provide`/`inject`

5. **インタフェース** (コンポーネントへのインタフェース)
    - `inheritAttrs`
    - `props`
    - `emits`

6. **コンポジション API** (コンポジション API を使用するためのエントリポイント)
    - `setup`

7. **ローカルの状態** (ローカル リアクティブ プロパティ)
    - `data`
    - `computed`

8. **イベント** (リアクティブなイベントによって引き起こされたコールバック)
    - `watch`
    - ライフサイクルイベント (呼び出される順)
        - `beforeCreate`
        - `created`
        - `beforeMount`
        - `mounted`
        - `beforeUpdate`
        - `updated`
        - `activated`
        - `deactivated`
        - `beforeUnmount`
        - `unmounted`
        - `errorCaptured`
        - `renderTracked`
        - `renderTriggered`

9. **リアクティブではないプロパティ** (リアクティブシステムから独立したインスタンス プロパティ)
    - `methods`

10. **レンダリング** (コンポーネント出力の宣言的な記述)
    - `template`/`render`

### 要素の属性の順序 <sup data-p="c">推奨</sup>

**要素の属性 (コンポーネントを含む) は、一貫した順序になるべきです。**

これは推奨するコンポーネントオプションの既定の順序です。それらは種類分けされており、カスタム属性とディレクティブをどこに追加するか知ることができます。

1. **定義** (コンポーネントオプションを提供)
    - `is`

2. **テンプレートの修飾子** (テンプレートのコンパイル方法を変更)
  - `delimiters`
  
3. **リスト描画** (同じ要素の複数のバリエーションを作成する)
    - `v-for`

4. **条件** (要素が描画/表示されているかどうか)
    - `v-if`
    - `v-else-if`
    - `v-else`
    - `v-show`
    - `v-cloak`

5. **描画修飾子** (要素の描画方法を変更)
    - `v-pre`
    - `v-once`

6. **グローバルな認識** (コンポーネントを超えた知識が必要)
    - `id`

7. **一意の属性** (一意の値を必要とする属性)
    - `ref`
    - `key`

8. **双方向バインディング** (バインディングとイベントの結合)
    - `v-model`

9. **その他の属性** (すべての指定されていないバインドされた属性とバインドされていない属性)

10. **イベント** (コンポーネントのイベントリスナ)
    - `v-on`

10. **コンテンツ** (要素のコンテンツを上書きする)
    - `v-html`
    - `v-text`

### コンポーネント/インスタンス オプションの空行 <sup data-p="c">推奨</sup>

**特にオプションがスクロールなしでは画面に収まらなくなった場合、複数行に渡るプロパティの間に空行を追加してみてください。**

コンポーネントに窮屈さや読みづらさを感じたら、複数行に渡るプロパティの間に空行を追加する事でそれらを簡単に読み流すことができるようになります。Vim など、一部のエディタでは、このような書式を使用するとキーボードで簡単に移動することができます。

<div class="style-example style-example-good">
<h4>良い例</h4>

``` js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

``` js
// コンポーネントの読み取りや移動が容易であれば、
// 空行がなくても大丈夫です。
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```
</div>

### 単一ファイルコンポーネントのトップレベルの属性の順序 <sup data-p="c">推奨</sup>

**[単一ファイルコンポーネント](../guide/single-file-component.html) では、`<script>`、`<template>`、`<style>` タグを一貫した順序にし、 `<style>` は他の2つのうち少なくとも1つで常に必要となるため、順序を最後にするべきです。**

<div class="style-example style-example-bad">
<h4>悪い例</h4>

``` html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
</div>

<div class="style-example style-example-good">
<h4>良い例</h4>

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

``` html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
</div>

## Priority D Rules: Use with Caution <span class="hide-from-sidebar">(Potentially Dangerous Patterns)</span>

### Element selectors with `scoped` <sup data-p="d">use with caution</sup>

**Element selectors should be avoided with `scoped`.**

Prefer class selectors over element selectors in `scoped` styles, because large numbers of element selectors are slow.

::: details Detailed Explanation
To scope styles, Vue adds a unique attribute to component elements, such as `data-v-f3f3eg9`. Then selectors are modified so that only matching elements with this attribute are selected (e.g. `button[data-v-f3f3eg9]`).

The problem is that large numbers of [element-attribute selectors](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=a%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (e.g. `button[data-v-f3f3eg9]`) will be considerably slower than [class-attribute selectors](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=.class%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (e.g. `.btn-close[data-v-f3f3eg9]`), so class selectors should be preferred whenever possible.
:::

<div class="style-example style-example-bad">
<h4>Bad</h4>

``` html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

``` html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```
</div>

### Implicit parent-child communication <sup data-p="d">use with caution</sup>

**Props and events should be preferred for parent-child component communication, instead of `this.$parent` or mutating props.**

An ideal Vue application is props down, events up. Sticking to this convention makes your components much easier to understand. However, there are edge cases where prop mutation or `this.$parent` can simplify two components that are already deeply coupled.

The problem is, there are also many _simple_ cases where these patterns may offer convenience. Beware: do not be seduced into trading simplicity (being able to understand the flow of your state) for short-term convenience (writing less code).

<div class="style-example style-example-bad">
<h4>Bad</h4>

``` js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

``` js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(todo => todo.id !== vm.todo.id)
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

``` js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

``` js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```
</div>

### Non-flux state management <sup data-p="d">use with caution</sup>

**[Vuex](https://github.com/vuejs/vuex) should be preferred for global state management, instead of `this.$root` or a global event bus.**

Managing state on `this.$root` and/or using a [global event bus](https://vuejs.org/v2/guide/migration.html#dispatch-and-broadcast-replaced) can be convenient for very simple cases, but it is not appropriate for most applications.

Vuex is the [official flux-like implementation](https://vuejs.org/v2/guide/state-management.html#Official-Flux-Like-Implementation) for Vue, and offers not only a central place to manage state, but also tools for organizing, tracking, and debugging state changes. It integrates well in the Vue ecosystem (including full [Vue DevTools](https://vuejs.org/v2/guide/installation.html#Vue-Devtools) support).

<div class="style-example style-example-bad">
<h4>Bad</h4>

``` js
// main.js
import { createApp } from 'vue'
import mitt from 'mitt'
const app = createApp({
  data() {
    return {
      todos: [],
      emitter: mitt()
    }
  },

  created() {
    this.emitter.on('remove-todo', this.removeTodo)
  },

  methods: {
    removeTodo(todo) {
      const todoIdToRemove = todo.id
      this.todos = this.todos.filter(todo => todo.id !== todoIdToRemove)
    }
  }
})
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

``` js
// store/modules/todos.js
export default {
  state: {
    list: []
  },

  mutations: {
    REMOVE_TODO (state, todoId) {
      state.list = state.list.filter(todo => todo.id !== todoId)
    }
  },

  actions: {
    removeTodo ({ commit, state }, todo) {
      commit('REMOVE_TODO', todo.id)
    }
  }
}
```

``` html
<!-- TodoItem.vue -->
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo(todo)">
      X
    </button>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: mapActions(['removeTodo'])
}
</script>
```
</div>

<style lang="scss" scoped>
$color-bgr-good: #d7efd7;
$color-bgr-bad: #f7e8e8;
$color-priority-a: #6b2a2a;
$color-priority-b: #8c480a;
$color-priority-c: #2b5a99;
$color-priority-d: #3f536d;

.style-example {
  border-radius: 7px;
  margin: 1.6em 0;
  padding: 1.6em 1.6em 1em;
  position: relative;
  border: 1px solid transparent;
  border-top-width: 5px;

  h4 {
    margin-top: 0;

    &::before {
      font-family: 'FontAwesome';
      margin-right: .4em;
    }
  }

  &-bad {
    background: $color-bgr-bad;
    border-color: darken($color-bgr-bad, 20%);

    h4 {
      color: darken($color-bgr-bad, 50%);
    }

    h4::before {
      content: '\f057';
    }
  }

  &-good {
    background: $color-bgr-good;
    border-color: darken($color-bgr-good, 20%);

    h4 {
      color: darken($color-bgr-good, 50%);
    }

    h4::before {
      content: '\f058';
    }
  }
}

.details summary {
  font-weight: bold !important;
}

h3 {
  a.header-anchor {
    // as we have too many h3 elements on this page, set the anchor to be always visible
    // to make them stand out more from paragraph texts.
    opacity: 1;
  }

  sup {
    text-transform: uppercase;
    font-size: 0.5em;
    padding: 2px 4px;
    border-radius: 3px;
    margin-left: 0.5em;

    &[data-p=a] {
      color: $color-priority-a;
      border: 1px solid $color-priority-a;
    }

    &[data-p=b] {
      color: $color-priority-b;
      border: 1px solid $color-priority-b;
    }

    &[data-p=c] {
      color: $color-priority-c;
      border: 1px solid $color-priority-c;
    }

    &[data-p=d] {
      color: $color-priority-d;
      border: 1px solid $color-priority-d;
    }
  }
}
</style>
