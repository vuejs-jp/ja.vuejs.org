# ディレクティブ

## v-text

- **受け入れ型:** `string`

- **詳細:**

  要素の [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) を更新します。`textContent` の一部を更新する必要がある場合、代わりに [Mustache 展開](/guide/template-syntax.html#text) を使う必要があります。

- **例:**

  ```html
  <span v-text="msg"></span>
  <!-- 次と同じです -->
  <span>{{msg}}</span>
  ```

- **参照:** [データバインディング構文 - 展開](../guide/template-syntax.html#テキスト)

## v-html

- **受け入れ型:** `string`

- **詳細:**

  要素の [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) を更新します。**この内容はふつうの HTML として挿入され、Vue テンプレートとしてコンパイルされないことに注意してください**。もし `v-html` を使ってテンプレートを構成しようとしている場合、代わりにコンポーネントを使って解決できないか考え直してみてください。

  ::: warning
  あなたのウェブサイトで任意の HTML を動的にレンダリングすることは、[XSS 攻撃](https://en.wikipedia.org/wiki/Cross-site_scripting) に簡単につながるため、非常に危険です。`v-html` は信用できるコンテンツのみに使い、ユーザが提供するコンテンツには **決して** 使わないでください。
  :::

  [単一ファイルコンポーネント](../guide/single-file-component.html) では、Vue のテンプレートコンパイラによって処理されないため、`scoped` スタイルが `v-html` 内のコンテンツには適用されません。`v-html` のコンテンツをスコープ付き CSS の対象にしたい場合、代わりに [CSS modules](https://vue-loader.vuejs.org/en/features/css-modules.html) を使うか、追加で、BEM のようなマニュアルのスコープ戦略を持ったグローバルな `<style>` 要素を使うことができます。

- **例:**

  ```html
  <div v-html="html"></div>
  ```

- **参照:** [データバインディング構文 - 展開](../guide/template-syntax.html#生の-html)

## v-show

- **受け入れ型:** `any`

- **使用方法:**

  式の値の真偽に基づいて、要素の `display` CSS プロパティをトグルします。

  このディレクティブは条件が変わったときにトランジションを引き起こします。

- **参照:** [条件付きレンダリングg - v-show](../guide/conditional.html#v-show)

## v-if

- **受け入れ型:** `any`

- **使用方法:**

  式の値の真偽に基づいて、条件付きで要素をレンダリングします。要素とそれに含まれるディレクティブやコンポーネントは、トグルしている間に破棄され、再構築されます。要素が `<template>` 要素の場合、その内容が条件ブロックとして抽出されます。

  このディレクティブは条件が変わったときにトランジションを引き起こします。

  一緒に使ったとき、`v-if` は `v-for` よりも優先度が高くなります。これら 2 つのディレクティブを 1 つの要素で同時に使うことはお勧めしません。詳しくは [リストレンダリングのガイド](../guide/list.html#v-for-と-v-if) を参照してください。

- **参照:** [条件付きレンダリング - v-if](../guide/conditional.html#v-if)

## v-else

- **式を受け入れません**

- **制限:** 前の兄弟要素に `v-if` または `v-else-if` を持たなければなりません。

- **使用方法:**

  `v-if` または `v-if`/`v-else-if` チェーンの「else ブロック」を表します。 

  ```html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **参照:** [条件付きレンダリング - v-else](../guide/conditional.html#v-else)

## v-else-if

- **受け入れ型:** `any`

- **制限:** 前の兄弟要素に `v-if` または `v-else-if` を持たなければなりません。

- **使用方法:**

  `v-if` の「else if ブロック」を表します。チェーンすることができます。

  ```html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

- **参照:** [条件付きレンダリング - v-else-if](../guide/conditional.html#v-else-if)

## v-for

- **受け入れ型:** `Array | Object | number | string | Iterable`

- **使用方法:**

  ソースデータに基づいて要素またはテンプレートブロックを複数回レンダリングします。ディレクティブの値は、特別な構文 `alias in expression` を使って、繰り返し処理されている現在の要素のエイリアスを提供しなければなりません:

  ```html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  または、インデックス（オブジェクトを使う場合はキー）のエイリアスを指定することもできます:

  ```html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  `v-for` のデフォルトの振る舞いは、要素を移動させずにその場でパッチを当てようとします。要素を並べ替えるように強制するには、特別な属性 `key` で順序のヒントを与える必要があります:

  ```html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` は、ネイティブの `Map` と `Set` を含む、[反復処理プロトコル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) を実装した値でも動作します。

  `v-for` の詳細な使用方法は、以下にリンクしたガイドセクションで説明しています。

- **参照:**
  - [リストレンダリング](../guide/list.html)

## v-on

- **省略記法:** `@`

- **受け入れ型:** `Function | Inline Statement | Object`

- **引数:** `event`

- **修飾子:**

  - `.stop` - `event.stopPropagation()` を呼び出します。
  - `.prevent` - `event.preventDefault()` を呼び出します。
  - `.capture` - キャプチャモードでイベントリスナを追加します。
  - `.self` - この要素からイベントがディスパッチされた場合のみ、ハンドラを処理します。
  - `.{keyAlias}` - 特定のキーでのみハンドラを処理します。
  - `.once` - 最大で 1 回だけハンドラを処理します。
  - `.left` - マウスの左ボタンイベントだけハンドラを処理します。
  - `.right` - マウスの右ボタンイベントだけハンドラを処理します。
  - `.middle` - マウスの中ボタンだけハンドラを処理します。
  - `.passive` - DOM イベントを `{ passive: true }` でアタッチします。

- **使用方法:**

  要素にイベントリスナをアタッチします。イベントタイプは引数で示されます。式は、メソッド名、インラインステートメント、または修飾子が存在する場合は省略されます。

  通常の要素に使うと、[**ネイティブ DOM イベント**](https://developer.mozilla.org/en-US/docs/Web/Events) のみを購読します。カスタム要素コンポーネントに使うと、その子コンポーネントで発生する **カスタムイベント** を購読します。

  ネイティブ DOM イベントを購読すると、このメソッドはネイティブイベントを唯一の引数として受け取ります。インラインステートメントを使う場合、ステートメントは特別な `$event` プロパティにアクセスすることができます: `v-on:click="handle('ok', $event)"`。

  また、`v-on` はイベントとリスナをペアにしたオブジェクトに引数なしでバインドすることもサポートしています。オブジェクト構文を使う場合、修飾子をサポートしていないことに注意してください。

- **例:**

  ```html
  <!-- method handler -->
  <button v-on:click="doThis"></button>

  <!-- dynamic event -->
  <button v-on:[event]="doThis"></button>

  <!-- inline statement -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- shorthand -->
  <button @click="doThis"></button>

  <!-- shorthand dynamic event -->
  <button @[event]="doThis"></button>

  <!-- stop propagation -->
  <button @click.stop="doThis"></button>

  <!-- prevent default -->
  <button @click.prevent="doThis"></button>

  <!-- prevent default without expression -->
  <form @submit.prevent></form>

  <!-- chain modifiers -->
  <button @click.stop.prevent="doThis"></button>

  <!-- key modifier using keyAlias -->
  <input @keyup.enter="onEnter" />

  <!-- the click event will be triggered at most once -->
  <button v-on:click.once="doThis"></button>

  <!-- object syntax -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  子コンポーネントでカスタムイベントを購読します（子で「my-event」が発生したときにハンドラが呼ばれます）:

  ```html
  <my-component @my-event="handleThis"></my-component>

  <!-- inline statement -->
  <my-component @my-event="handleThis(123, $event)"></my-component>
  ```

- **参照:**
  - [イベントハンドリング](../guide/events.html)
  - [コンポーネント - カスタムイベント](../guide/component-basics.html#子コンポーネントのイベントを購読する)

## v-bind

- **省略記法:** `:` or `.`（`.prop` 修飾子を使っている場合）

- **受け入れ型:** `any (with argument) | Object (without argument)`

- **引数:** `attrOrProp (optional)`

- **修飾子:**

  - `.camel` - ケバブケースの属性名をキャメルケースに変換します。
  - `.prop` - バインドを強制的に DOM プロパティとして設定します。 <Badge text="3.2+"/>
  - `.attr` - バインドを強制的に DOM 属性として設定します。 <Badge text="3.2+"/>

- **使用方法:**

  1 つか、複数の属性、またはコンポーネントのプロパティを式へ動的にバインドします。

  `class` や `style` 属性のバインドに使う場合、配列やオブジェクトといった追加の値の型をサポートします。詳しくは下記のリンク先のガイドセクションを参照してください。

  プロパティのバインドに使う場合、子コンポーネントでプロパティが適切に宣言されている必要があります。

  引数なしに使う場合、属性の名前と値のペアを含むオブジェクトをバインドに使うことができます。このモードでは `class` と `style` は、配列やオブジェクトをサポートしないことに注意してください。

- **例:**

  ```html
  <!-- bind an attribute -->
  <img v-bind:src="imageSrc" />

  <!-- dynamic attribute name -->
  <button v-bind:[key]="value"></button>

  <!-- shorthand -->
  <img :src="imageSrc" />

  <!-- shorthand dynamic attribute name -->
  <button :[key]="value"></button>

  <!-- with inline string concatenation -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- class binding -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- style binding -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- binding an object of attributes -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- prop binding. "prop" must be declared in my-component. -->
  <my-component :prop="someThing"></my-component>

  <!-- pass down parent props in common with a child component -->
  <child-component v-bind="$props"></child-component>

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  要素にバインディングを設定する際、Vue はデフォルトで、`in` オペレータチェックを使って、要素にプロパティとして定義されたキーがあるかどうかをチェックします。プロパティが定義されている場合、Vue はその値を属性としてではなく DOM プロパティとして設定します。これはほとんどのケースで動作しますが、`.prop` や `.attr` 修飾子を明示的に使うことで、この振る舞いを上書きすることができます。これは特に [カスタム要素を使っている場合](/guide/web-components.html#passing-dom-properties) に必要なときがあります。

  この `.prop` 修飾子には `.` という省略記法もあります:

  ```html
  <div :someProperty.prop="someObject"></div>

  <!-- 次と同じです -->
  <div .someProperty="someObject"></div>
  ```

  `.camel` 修飾子は、例えば SVG の `viewBox` 属性のように、DOM 内テンプレートを使うときに `v-bind` 属性名をキャメルケース化することができます:

  ```html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` は文字列テンプレートを使っている場合や、`vue-loader`/`vueify` でコンパイルしている場合には必要ありません。

- **参照:**
  - [クラスとスタイルのバインディング](../guide/class-and-style.html)
  - [コンポーネント - プロパティ](../guide/component-basics.html#プロパティを用いた子コンポーネントへのデータの受け渡し)

## v-model

- **受け入れ型:** コンポーネントのフォーム入力要素または出力に基づいて変化します。

- **対象の制限:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **修飾子:**

  - [`.lazy`](../guide/forms.html#lazy) - `input` イベントの代わりに `change` イベントを購読します。
  - [`.number`](../guide/forms.html#number) - 有効な入力文字列を数字にキャストします。
  - [`.trim`](../guide/forms.html#trim) - 入力をトリムします。

- **使用方法:**

  フォーム入力要素やコンポーネントに双方向バインディングを作成します。詳しい使い方と他の注意点は、下記リンクのガイドセクションを参照してください。

- **参照:**
  - [フォーム入力バインディング](../guide/forms.html)
  - [コンポーネント - カスタムイベントを使ったフォーム入力コンポーネント](../guide/component-custom-events.html#v-model-の引数)

## v-slot

- **省略記法:** `#`

- **受け入れ型:** 関数の引数で有効な JavaScript 式（[サポートされている環境](../guide/component-slots.html#スロットプロパティの分割代入) で分割代入をサポートしています）。省略可能でスロットにプロパティを渡したい場合にのみ必要です。

- **引数:** スロット名（省略可能でデフォルトは `default` です）

- **対象の制限:**

  - `<template>`
  - [components](../guide/component-slots.html#デフォルトスロットしかない場合の省略記法)（プロパティを持つデフォルトのスロットだけの場合）

- **使用方法:**

  名前付きのスロットやプロパティの受け取りを期待するスロットを表示します。

- **例:**

  ```html
  <!-- 名前付きスロット -->
  <base-layout>
    <template v-slot:header>
      Header content
    </template>

    <template v-slot:default>
      Default slot content
    </template>

    <template v-slot:footer>
      Footer content
    </template>
  </base-layout>

  <!-- プロパティを受け取る名前付きスロット -->
  <infinite-scroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </infinite-scroll>

  <!-- プロパティを分割代入で受け取るデフォルトスロット -->
  <mouse-position v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </mouse-position>
  ```

  詳細は下記のリンクを参照してください。

- **参照:**
  - [コンポーネント - スロット](../guide/component-slots.html)

## v-pre

- **式を要求しません**

- **使用方法:**

  この要素とそのすべての子要素のコンパイルを省略します。これは Mustache タグそのものを表示するときに使えます。ディレクティブのない大量のノードを省略することで、コンパイル速度も向上します。

- **例:**

  ```html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

## v-cloak

- **式を要求しません**

- **使用方法:**

  このディレクティブは関連するコンポーネントインスタンスのコンパイル完了まで、要素に残ります。`[v-cloak] { display: none }` のような CSS のルールと組み合わせることで、このディレクティブはコンポーネントインスタンスの準備ができるまで、未コンパイルの Mustache バインディングを隠すのに使うことができます。

- **例:**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  この `<div>` はコンパイルが終わるまで表示されません。

## v-once

- **式を要求しません**

- **詳細:**

  要素やコンポーネントを **一度** だけレンダリングします。それ以降の再レンダリングでは、要素やコンポーネントとそのすべての子は、静的コンテンツとして扱われて省略されます。これは更新パフォーマンスの最適化に使うことができます。

  ```html
  <!-- 単一要素 -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- 子を持つ要素 -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- コンポーネント -->
  <my-component v-once :comment="msg"></my-component>
  <!-- `v-for` ディレクティブ -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  3.2 以降では、[`v-memo`](#v-memo) を使って無効な条件のテンプレートの一部をメモ化することもできます。

- **参照:**
  - [データバインディング構文 - 展開](../guide/template-syntax.html#テキスト)
  - [v-memo](#v-memo)

## v-memo <Badge text="3.2+" />

- **受け入れ型:** `Array`

- **詳細:**

  テンプレートのサブツリーをメモ化します。要素とコンポーネントのどちらでも使えます。このディレクティブは、メモ化のために比較する依存関係にある値の固定長配列を受け取ります。配列のすべての値が最後のレンダリングと同じならば、サブツリー全体の更新は省略されます。例えば:

  ```html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  コンポーネントが再レンダリングされるとき、`valueA` と `valueB` の両方が同じであれば、この `<div>` とその子のすべての更新は省略されます。実際には、サブツリーのメモ化されたコピーを再利用できるため、仮想 DOM の VNode の作成も省略されます。

  メモ化した配列を正しく指定することは重要で、そうでなければ実際に適用する必要がある更新を省略してしまう可能性があります。空の依存配列を持つ `v-memo` つまり (`v-memo="[]"`) は、機能的に `v-once` と同じです。

  **`v-for` との使用方法**

  `v-memo` は、パフォーマンスが重要視される場面での極々小さな最適化のためだけに提供されていて、ほとんど必要とされないはずです。これが役立つ最も一般的なケースは、巨大な `v-for` リスト（`length > 1000` の場合）をレンダリングするときです:

  ```html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  このコンポーネントの `selected` 状態が変更されると、ほとんどのアイテムが完全に同じにも関わらず、大量の VNode が作成されます。ここでの `v-memo` の使い方は、基本的に「このアイテムが非選択状態から選択状態になった場合、またはその逆の場合にのみ更新する」というものです。これは影響を受けていないすべてのアイテムが以前の VNode を再利用し、差分を完全に省略することができます。Vue はアイテムの `:key` から自動的に推測するため、メモ化の依存配列に `item.id` を含める必要はありません。

  :::warning
  `v-memo` を `v-for` と一緒に使うとき、同じ要素に使われていることを確認してください。 **`v-memo` は `v-for` の中では動作しません。**
  :::

  `v-memo` はコンポーネントに使って、その子コンポーネントの更新チェックが最適化されていないような特定のエッジケースで、不要な更新を手動で防ぐこともできます。しかし繰り返しますが、正しい依存配列を指定して、必要な更新を省略しないようにすることは、開発者の責任です。

- **参照:**
  - [v-once](#v-once)

## v-is <Badge text="deprecated" type="warning" />

3.1.0 では非推奨です。代わりに [`vue:` プレフィックス付きの `is` 属性](/api/special-attributes.html#is) を使ってください。
