# プロパティでない属性

> このページは [コンポーネントの基本](component-basics.md) が読まれていることが前提となっています。 コンポーネントを扱った事のない場合はこちらのページを先に読んでください。

プロパティでない属性とは、コンポーネントに渡される属性やイベントリスナのうち、[props](component-props.html) や [emits](component-custom-events.html#カスタムイベントの定義) で定義されたものを除いたものをいいます。よくある例としては、コンポーネント要素タグに付与する `class` 、`style` 、`id` などの属性があります。これらの属性には `$attrs` プロパティでアクセスできます。

## 属性の継承

ただ一つのルート要素をもつコンポーネントの場合、プロパティでない属性はルート要素にそのまま追加されます。例えば date-picker コンポーネントの場合は次のような形になります。

```js
app.component('date-picker', {
  template: `
    <div class="date-picker">
      <input type="datetime-local" />
    </div>
  `
})
```

`data-status` 属性を用いて date-picker コンポーネントの状態を定義するような場合には、この属性はルート要素 (すなわち `div.date-picker`) に適用されます。

```html
<!-- プロパティでない属性とともに用いられる Date-picker コンポーネント -->
<date-picker data-status="activated"></date-picker>

<!-- 実際には以下のような形でレンダリングされます -->
<div class="date-picker" data-status="activated">
  <input type="datetime-local" />
</div>
```

イベントリスナについても同様のことが言えます。

```html
<date-picker @change="submitChange"></date-picker>
```

```js
app.component('date-picker', {
  created() {
    console.log(this.$attrs) // { onChange: () => {}  }
  }
})
```

このような実装は、`date-picker` のルート要素で `change` イベントを扱うケースなどで役に立つでしょう。

```js
app.component('date-picker', {
  template: `
    <select>
      <option value="1">Yesterday</option>
      <option value="2">Today</option>
      <option value="3">Tomorrow</option>
    </select>
  `
})
```

この場合、 `change` イベントリスナは、親から子へ渡され、`<select>` 要素本来の `change` イベントにより発火されます。特段、`date-picker` からの明示的なイベント処理を記述する必要はありません。

```html
<div id="date-picker" class="demo">
  <date-picker @change="showChange"></date-picker>
</div>
```

```js
const app = Vue.createApp({
  methods: {
    showChange(event) {
      console.log(event.target.value) // 選択された option の値が表示される
    }
  }
})
```

## 属性の継承の無効化

コンポーネントのオプション内で、`inheritAttrs: false` を指定することで、属性の継承を **無効化** することも可能です。

一般的に属性の継承の無効化は、ルート要素ではない別の要素に属性を適用したいようなケースで利用される場面が考えられるでしょう。

`inheritAttrs` を `false` にセットした場合属性の継承は無効化されますが、`inheritAttrs` の設定に関わらずコンポーネントの `$attrs` プロパティを使って、`props` や `emits` といったコンポーネントのプロパティを除く全ての属性（例えば `class` や `style` 、`v-on` といったものも）を他の要素の属性への適用することを制御できます。

[前のセクション](#属性の継承) で利用した date-picker のコンポーネント例を用いて、プロパティでない属性の全てをルートの `div` 要素ではなく `input` 要素に適用する場合、`v-bind` を用いて簡略的に記述することも可能です。

```js{5}
app.component('date-picker', {
  inheritAttrs: false,
  template: `
    <div class="date-picker">
      <input type="datetime-local" v-bind="$attrs" />
    </div>
  `
})
```

このように記述することで、`data-status` 属性は、 `input` 要素に適用されるようになります。

```html
<!-- プロパティでない属性とともに用いられる Date-picker コンポーネント -->
<date-picker data-status="activated"></date-picker>

<!-- 実際には以下のような形でレンダリングされます -->
<div class="date-picker">
  <input type="datetime-local" data-status="activated" />
</div>
```

## ルート要素が複数の場合の属性の継承

コンポーネントのルート要素が 1 つでなく複数のルート要素からなる場合には、暗黙の属性の継承は行われません。`$attrs` を用いた明示的なアサインを行わない場合、ランタイム上で warning が発行されます。

```html
<custom-layout id="custom-layout" @click="changeValue"></custom-layout>
```

```js
// これは warning を発行します
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  `
})

// <main> 要素に $attrs で属性を渡しているため、 warnings は発行されません
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main v-bind="$attrs">...</main>
    <footer>...</footer>
  `
})
```
