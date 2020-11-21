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

同じくらい良いオプションが複数ある場合､一貫性を確保するために任意の選択をすることができます｡これらのルールでは､それぞれ許容可能なオプションを説明し､既定の選択を提案します｡つまり､一貫性があり､正当な理由を持ち続ける限り､独自のコードベースで自由に異なる選択肢を作ることができます｡ですが､正当な理由を必ず持つようにしてください！コミュニティの標準に合わせることで､あなたは:

1. 直面するコミュニティのコードを容易に理解できるように脳を慣れさせます｡
2. ほとんどのコミュニティのコードサンプルを変更なしにコピーして貼り付ける事ができます｡
3. 少なくとも Vue に関しては､ほとんどの場合､新たな人材はあなたのコーディングスタイルよりも既に慣れ親しんだものを好みます｡

### 優先度 D: 使用注意

Vue のいくつかの機能は、レアケースまたは従来のコードベースからスムーズな移行に対応するために存在します。しかしながらこれを使いすぎると、コードを保守することが難しくなり、またバグの原因になることさえあります。これらのルールは潜在的な危険な機能を照らし、いつ、なぜ避けなかればならないのかを説明しています。

## 優先度 A ルール: 必須 <span class="hide-from-sidebar">(エラー防止)</span>

### 複数単語のコンポーネント名 <sup data-p="a">必須</sup>

**ルートの `App` コンポーネントや、Vue が提供する `<transition>` や `<component>` のようなビルトインコンポーネントを除き、コンポーネント名は常に複数単語とするべきです。**

全ての HTML 要素は 1 単語なので、このルールを守ることで既に存在する HTML 要素や将来定義される HTML 要素との[衝突を防止することができます](http://w3c.github.io/webcomponents/spec/custom/#valid-custom-element-name)。

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
詳細な[プロパティの定義](/guide/component-props.html#prop-validation) には 2 つの利点があります:

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

サブツリーの内部コンポーネントの状態を維持するために、コンポーネントでの `v-for` には _常に_ `key` を付ける必要があります。ただし要素の場合であっても、アニメーションでの[オブジェクトの一貫性](https://bost.ocks.org/mike/constancy/)のように、予測可能な振る舞いを維持することをお勧めします。

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
Vue がディレクティブを処理する場合、`v-for` は `v-if` よりも優先度が高いため、次のようなテンプレートは:

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

これは、[単一ファイルコンポーネント](../guide/single-file-component.html)のみに関連します。[`scoped` 属性](https://vue-loader.vuejs.org/en/features/scoped-css.html)の使用は必須_ではありません_。 スコープは [CSS modules](https://vue-loader.vuejs.org/en/features/css-modules.html) や [BEM](http://getbem.com/) のようなクラスに基づいた戦略、または他の ライブラリ/慣例 を介して行うことができます。

**ただしコンポーネントライブラリでは、 `scoped` 属性を使用するのではなく、クラスに基づいた戦略を優先すべきです**

これにより、人間が読み取りやすいクラス名を使って、内部のスタイルを上書きすることが容易になります。またそのクラス名は、高い特定性を持たないけれど、依然として競合が発生する可能性が低いままのものになります。

::: details 詳細な説明
大規模なプロジェクトを開発している場合や他の開発者と一緒に開発している場合、またはサードパーティの HTML/CSS (Auth0 など) を含んでいる場合は、一貫したスコープによってスタイルが対象のコンポーネントのみに適用されることが保証されます。

`scoped` 属性以外にも、一意のクラス名を使用することでサードパーティの CSS が独自の HTML に適用されないことを保証しやすくできます。例えば、多くのプロジェクトでは `button` や `btn` 、または `icon` といったクラス名を使用しているため、BEM などの戦略を使用していない場合でも、アプリ固有 かつ/または コンポーネント固有(例： `ButtonClose-icon`)のプレフィックスを追加することで、ある程度の保護を提供できます。
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

## Priority B Rules: Strongly Recommended <span class="hide-from-sidebar">(Improving Readability)</span>

### Component files <sup data-p="b">strongly recommended</sup>

**Whenever a build system is available to concatenate files, each component should be in its own file.**

This helps you to more quickly find a component when you need to edit it or review how to use it.

<div class="style-example style-example-bad">
<h4>Bad</h4>

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
<h4>Good</h4>

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

### Single-file component filename casing <sup data-p="b">strongly recommended</sup>

**Filenames of [single-file components](../guide/single-file-components.html) should either be always PascalCase or always kebab-case.**

PascalCase works best with autocompletion in code editors, as it's consistent with how we reference components in JS(X) and templates, wherever possible. However, mixed case filenames can sometimes create issues on case-insensitive file systems, which is why kebab-case is also perfectly acceptable.

<div class="style-example style-example-bad">
<h4>Bad</h4>

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
<h4>Good</h4>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
</div>

### Base component names <sup data-p="b">strongly recommended</sup>

**Base components (a.k.a. presentational, dumb, or pure components) that apply app-specific styling and conventions should all begin with a specific prefix, such as `Base`, `App`, or `V`.**

::: details Detailed Explanation
These components lay the foundation for consistent styling and behavior in your application. They may **only** contain:

- HTML elements,
- other base components, and
- 3rd-party UI components.

But they'll **never** contain global state (e.g. from a Vuex store).

Their names often include the name of an element they wrap (e.g. `BaseButton`, `BaseTable`), unless no element exists for their specific purpose (e.g. `BaseIcon`). If you build similar components for a more specific context, they will almost always consume these components (e.g. `BaseButton` may be used in `ButtonSubmit`).

Some advantages of this convention:

- When organized alphabetically in editors, your app's base components are all listed together, making them easier to identify.

- Since component names should always be multi-word, this convention prevents you from having to choose an arbitrary prefix for simple component wrappers (e.g. `MyButton`, `VueButton`).

- Since these components are so frequently used, you may want to simply make them global instead of importing them everywhere. A prefix makes this possible with Webpack:

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
<h4>Bad</h4>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

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

### Single-instance component names <sup data-p="b">strongly recommended</sup>

**Components that should only ever have a single active instance should begin with the `The` prefix, to denote that there can be only one.**

This does not mean the component is only used in a single page, but it will only be used once _per page_. These components never accept any props, since they are specific to your app, not their context within your app. If you find the need to add props, it's a good indication that this is actually a reusable component that is only used once per page _for now_.

<div class="style-example style-example-bad">
<h4>Bad</h4>

```
components/
|- Heading.vue
|- MySidebar.vue
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
</div>

### Tightly coupled component names <sup data-p="b">strongly recommended</sup>

**Child components that are tightly coupled with their parent should include the parent component name as a prefix.**

If a component only makes sense in the context of a single parent component, that relationship should be evident in its name. Since editors typically organize files alphabetically, this also keeps these related files next to each other.

::: details Detailed Explanation
You might be tempted to solve this problem by nesting child components in directories named after their parent. For example:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

or:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

This isn't recommended, as it results in:

- Many files with similar names, making rapid file switching in code editors more difficult.
- Many nested sub-directories, which increases the time it takes to browse components in an editor's sidebar.
:::

<div class="style-example style-example-bad">
<h4>Bad</h4>

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
<h4>Good</h4>

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

### Order of words in component names <sup data-p="b">strongly recommended</sup>

**Component names should start with the highest-level (often most general) words and end with descriptive modifying words.**

::: details Detailed Explanation
You may be wondering:

> "Why would we force component names to use less natural language?"

In natural English, adjectives and other descriptors do typically appear before the nouns, while exceptions require connector words. For example:

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

You can definitely include these connector words in component names if you'd like, but the order is still important.

Also note that **what's considered "highest-level" will be contextual to your app**. For example, imagine an app with a search form. It may include components like this one:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

As you might notice, it's quite difficult to see which components are specific to the search. Now let's rename the components according to the rule:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Since editors typically organize files alphabetically, all the important relationships between components are now evident at a glance.

You might be tempted to solve this problem differently, nesting all the search components under a "search" directory, then all the settings components under a "settings" directory. We only recommend considering this approach in very large apps (e.g. 100+ components), for these reasons:

- It generally takes more time to navigate through nested sub-directories, than scrolling through a single `components` directory.
- Name conflicts (e.g. multiple `ButtonDelete.vue` components) make it more difficult to quickly navigate to a specific component in a code editor.
- Refactoring becomes more difficult, because find-and-replace often isn't sufficient to update relative references to a moved component.
:::

<div class="style-example style-example-bad">
<h4>Bad</h4>

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
<h4>Good</h4>

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

### Self-closing components <sup data-p="b">strongly recommended</sup>

**Components with no content should be self-closing in [single-file components](../guide/single-file-components.html), string templates, and [JSX](../guide/render-function.html#JSX) - but never in DOM templates.**

Components that self-close communicate that they not only have no content, but are **meant** to have no content. It's the difference between a blank page in a book and one labeled "This page intentionally left blank." Your code is also cleaner without the unnecessary closing tag.

Unfortunately, HTML doesn't allow custom elements to be self-closing - only [official "void" elements](https://www.w3.org/TR/html/syntax.html#void-elements). That's why the strategy is only possible when Vue's template compiler can reach the template before the DOM, then serve the DOM spec-compliant HTML.

<div class="style-example style-example-bad">
<h4>Bad</h4>

``` html
<!-- In single-file components, string templates, and JSX -->
<MyComponent></MyComponent>
```

``` html
<!-- In DOM templates -->
<my-component/>
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

``` html
<!-- In single-file components, string templates, and JSX -->
<MyComponent/>
```

``` html
<!-- In DOM templates -->
<my-component></my-component>
```
</div>

### Component name casing in templates <sup data-p="b">strongly recommended</sup>

**In most projects, component names should always be PascalCase in [single-file components](../guide/single-file-components.html) and string templates - but kebab-case in DOM templates.**

PascalCase has a few advantages over kebab-case:

- Editors can autocomplete component names in templates, because PascalCase is also used in JavaScript.
- `<MyComponent>` is more visually distinct from a single-word HTML element than `<my-component>`, because there are two character differences (the two capitals), rather than just one (a hyphen).
- If you use any non-Vue custom elements in your templates, such as a web component, PascalCase ensures that your Vue components remain distinctly visible.

Unfortunately, due to HTML's case insensitivity, DOM templates must still use kebab-case.

Also note that if you've already invested heavily in kebab-case, consistency with HTML conventions and being able to use the same casing across all your projects may be more important than the advantages listed above. In those cases, **using kebab-case everywhere is also acceptable.**

<div class="style-example style-example-bad">
<h4>Bad</h4>

``` html
<!-- In single-file components and string templates -->
<mycomponent/>
```

``` html
<!-- In single-file components and string templates -->
<myComponent/>
```

``` html
<!-- In DOM templates -->
<MyComponent></MyComponent>
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

``` html
<!-- In single-file components and string templates -->
<MyComponent/>
```

``` html
<!-- In DOM templates -->
<my-component></my-component>
```

OR

``` html
<!-- Everywhere -->
<my-component></my-component>
```
</div>

### Component name casing in JS/JSX <sup data-p="b">strongly recommended</sup>

**Component names in JS/[JSX](../guide/render-function.html#JSX) should always be PascalCase, though they may be kebab-case inside strings for simpler applications that only use global component registration through `app.component`.**

::: details Detailed Explanation
In JavaScript, PascalCase is the convention for classes and prototype constructors - essentially, anything that can have distinct instances. Vue components also have instances, so it makes sense to also use PascalCase. As an added benefit, using PascalCase within JSX (and templates) allows readers of the code to more easily distinguish between components and HTML elements.

However, for applications that use **only** global component definitions via `app.component`, we recommend kebab-case instead. The reasons are:

- It's rare that global components are ever referenced in JavaScript, so following a convention for JavaScript makes less sense.
- These applications always include many in-DOM templates, where [kebab-case **must** be used](#Component-name-casing-in-templates-strongly-recommended).
:::

<div class="style-example style-example-bad">
<h4>Bad</h4>

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
<h4>Good</h4>

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

### Full-word component names <sup data-p="b">strongly recommended</sup>

**Component names should prefer full words over abbreviations.**

The autocompletion in editors make the cost of writing longer names very low, while the clarity they provide is invaluable. Uncommon abbreviations, in particular, should always be avoided.

<div class="style-example style-example-bad">
<h4>Bad</h4>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
</div>

### Prop name casing <sup data-p="b">strongly recommended</sup>

**Prop names should always use camelCase during declaration, but kebab-case in templates and [JSX](../guide/render-function.html#JSX).**

We're simply following the conventions of each language. Within JavaScript, camelCase is more natural. Within HTML, kebab-case is.

<div class="style-example style-example-bad">
<h4>Bad</h4>

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
<h4>Good</h4>

``` js
props: {
  greetingText: String
}
```

``` html
<WelcomeMessage greeting-text="hi"/>
```
</div>

### Multi-attribute elements <sup data-p="b">strongly recommended</sup>

**Elements with multiple attributes should span multiple lines, with one attribute per line.**

In JavaScript, splitting objects with multiple properties over multiple lines is widely considered a good convention, because it's much easier to read. Our templates and [JSX](../guide/render-function.html#JSX) deserve the same consideration.

<div class="style-example style-example-bad">
<h4>Bad</h4>

``` html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

``` html
<MyComponent foo="a" bar="b" baz="c"/>
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

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

### Simple expressions in templates <sup data-p="b">strongly recommended</sup>

**Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.**

Complex expressions in your templates make them less declarative. We should strive to describe _what_ should appear, not _how_ we're computing that value. Computed properties and methods also allow the code to be reused.

<div class="style-example style-example-bad">
<h4>Bad</h4>

``` html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

``` html
<!-- In a template -->
{{ normalizedFullName }}
```

``` js
// The complex expression has been moved to a computed property
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```
</div>

### Simple computed properties <sup data-p="b">strongly recommended</sup>

**Complex computed properties should be split into as many simpler properties as possible.**

::: details Detailed Explanation
Simpler, well-named computed properties are:

- __Easier to test__

  When each computed property contains only a very simple expression, with very few dependencies, it's much easier to write tests confirming that it works correctly.

- __Easier to read__

  Simplifying computed properties forces you to give each value a descriptive name, even if it's not reused. This makes it much easier for other developers (and future you) to focus in on the code they care about and figure out what's going on.

- __More adaptable to changing requirements__

  Any value that can be named might be useful to the view. For example, we might decide to display a message telling the user how much money they saved. We might also decide to calculate sales tax, but perhaps display it separately, rather than as part of the final price.

  Small, focused computed properties make fewer assumptions about how information will be used, so require less refactoring as requirements change.
:::

<div class="style-example style-example-bad">
<h4>Bad</h4>

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
<h4>Good</h4>

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

### Quoted attribute values <sup data-p="b">strongly recommended</sup>

**Non-empty HTML attribute values should always be inside quotes (single or double, whichever is not used in JS).**

While attribute values without any spaces are not required to have quotes in HTML, this practice often leads to _avoiding_ spaces, making attribute values less readable.

<div class="style-example style-example-bad">
<h4>Bad</h4>

``` html
<input type=text>
```

``` html
<AppSidebar :style={width:sidebarWidth+'px'}>
```
</div>

<div class="style-example style-example-good">
<h4>Good</h4>

``` html
<input type="text">
```

``` html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```
</div>

### Directive shorthands <sup data-p="b">strongly recommended</sup>

**Directive shorthands (`:` for `v-bind:`, `@` for `v-on:` and `#` for `v-slot`) should be used always or never.**

<div class="style-example style-example-bad">
<h4>Bad</h4>

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
<h4>Good</h4>

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


## Priority C Rules: Recommended <span class="hide-from-sidebar">(Minimizing Arbitrary Choices and Cognitive Overhead)</span>

### Component/instance options order <sup data-p="c">recommended</sup>

**Component/instance options should be ordered consistently.**

This is the default order we recommend for component options. They're split into categories, so you'll know where to add new properties from plugins.

1. **Global Awareness** (requires knowledge beyond the component)
    - `name`

2. **Template Dependencies** (assets used in the template)
    - `components`
    - `directives`

3. **Composition** (merges properties into the options)
    - `extends`
    - `mixins`
    - `provide`/`inject`

4. **Interface** (the interface to the component)
    - `inheritAttrs`
    - `props`
    - `emits`

5. **Composition API** (the entry point for using the Composition API)
    - `setup`

6. **Local State** (local reactive properties)
    - `data`
    - `computed`

7. **Events** (callbacks triggered by reactive events)
    - `watch`
    - Lifecycle Events (in the order they are called)
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

8.  **Non-Reactive Properties** (instance properties independent of the reactivity system)
    - `methods`

9. **Rendering** (the declarative description of the component output)
    - `template`/`render`

### Element attribute order <sup data-p="c">recommended</sup>

**The attributes of elements (including components) should be ordered consistently.**

This is the default order we recommend for component options. They're split into categories, so you'll know where to add custom attributes and directives.

1. **Definition** (provides the component options)
    - `is`

2. **List Rendering** (creates multiple variations of the same element)
    - `v-for`

3. **Conditionals** (whether the element is rendered/shown)
    - `v-if`
    - `v-else-if`
    - `v-else`
    - `v-show`
    - `v-cloak`

4. **Render Modifiers** (changes the way the element renders)
    - `v-pre`
    - `v-once`

5. **Global Awareness** (requires knowledge beyond the component)
    - `id`

6. **Unique Attributes** (attributes that require unique values)
    - `ref`
    - `key`

7. **Two-Way Binding** (combining binding and events)
    - `v-model`

8. **Other Attributes** (all unspecified bound & unbound attributes)

9. **Events** (component event listeners)
    - `v-on`

10. **Content** (overrides the content of the element)
    - `v-html`
    - `v-text`

### Empty lines in component/instance options <sup data-p="c">recommended</sup>

**You may want to add one empty line between multi-line properties, particularly if the options can no longer fit on your screen without scrolling.**

When components begin to feel cramped or difficult to read, adding spaces between multi-line properties can make them easier to skim again. In some editors, such as Vim, formatting options like this can also make them easier to navigate with the keyboard.

<div class="style-example style-example-good">
<h4>Good</h4>

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
// No spaces are also fine, as long as the component
// is still easy to read and navigate.
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

### Single-file component top-level element order <sup data-p="c">recommended</sup>

**[Single-file components](../guide/single-file-components.html) should always order `<script>`, `<template>`, and `<style>` tags consistently, with `<style>` last, because at least one of the other two is always necessary.**

<div class="style-example style-example-bad">
<h4>Bad</h4>

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
<h4>Good</h4>

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
