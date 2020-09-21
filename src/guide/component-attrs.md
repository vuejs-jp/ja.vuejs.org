# プロパティでない属性

> このページは [コンポーネントの基本](component-basics.md) が読まれていることが前提となっています。 コンポーネントを扱った事のない場合はこちらのページを先に読んでください。

プロパティでない属性とは、コンポーネントに渡される属性やイベントリスナのうち、[props](component-props) や [emits](component-custom-events.html#defining-custom-events) で定義されたものを除いたものをいいます。なお、共通の認識として `class` や `style`, `id` 属性はここに含まれません。

## 属性の継承

ただ一つのルート要素をもつコンポーネントの場合、プロパティでない属性はルート要素にそのまま追加されます。例えば date-picker コンポーネントの場合は次のような形になります。

```js
app.component('date-picker', {
  template: `
    <div class="date-picker">
      <input type="datetime" />
    </div>
  `
})
```

`data-status` プロパティを用いて　date-picker コンポーネントの状態を定義するような場合には、このプロパティはルート要素 (すなわち `div.date-picker`) に適用されます。

```html
<!-- 非プロパティ型の属性 とともに用いられる Date-picker コンポーネント -->
<date-picker data-status="activated"></date-picker>

<!-- 実際には以下のような形で描画されます -->
<div class="date-picker" data-status="activated">
  <input type="datetime" />
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

## Disabling Attribute Inheritance

属性の継承を望まない場合、コンポーネントのオプション内で、`inheritAttrs: false`を指定することができます。

一般的にこの継承を無効化したいケースというのは、ルート要素ではない別の要素に属性を適用したいようなケースでしょう。

`inheritAttrs` を `false` にセットすることで、コンポーネントの `$attrs` プロパティが利用可能になり、`props` や `emits` などのプロパティ(`class` や `style` 、 `v-on` といったもの)を除く全ての属性にアクセスできるようになります。
[previous section]('#属性の継承) で利用した date-picker のコンポーネント例で、全てのプロパティでない属性を ルートの `div` 要素ではなく `input` 要素に適用する場合には、`v-bind` を用いると便利でしょう。

```js{5}
app.component('date-picker', {
  inheritAttrs: false,
  template: `
    <div class="date-picker">
      <input type="datetime" v-bind="$attrs" />
    </div>
  `
})
```

このように記述した場合、`data-status` 属性は、 `input` 要素に適用されます。

```html
<!-- Date-picker component with a non-prop attribute -->
<date-picker data-status="activated"></date-picker>

<!-- Rendered date-picker component -->
<div class="date-picker">
  <input type="datetime" data-status="activated" />
</div>
```

## Attribute Inheritance on Multiple Root Nodes

ルート要素が一つでなく、複数のルート要素からなるコンポーネントには、自動的に属性の継承が行われることはありません。`$attrs` を用いた明示的なアサインを行わない場合、ランタイム上で warning が発行されます。

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
