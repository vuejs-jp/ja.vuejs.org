# カスタムディレクティブ

## 基本

Vue.js 本体で提供されているデフォルトのディレクティブ (`v-model` や `v-show`) に加えて、独自のカスタムディレクティブ (custom directives) を登録することも可能です。Vue ではコードの再利用や抽象化の基本形はコンポーネントです。しかしながら、単純な要素への低レベルな DOM のアクセスが必要なケースがあるかもしれません。こういったケースにカスタムディレクティブが役に立つことでしょう。以下のような input 要素へのフォーカスが１つの例として挙げられます:

<common-codepen-snippet title="Custom directives: basic example" slug="JjdxaJW" :preview="false" />

ページを読み込むと、この要素にフォーカスが当たります (注意：`autofocus` はモバイルの Safari で動きません)。実際、このページに訪れてから他に何もクリックしなければ、上記の input 要素にフォーカスが当たります。また、`Rerun` ボタンをクリックしても、input 要素はフォーカスされます。

ここからこれを実現するディレクティブを実装しましょう:

```js
const app = Vue.createApp({})
// `v-focus` と呼ばれるグローバルカスタムディレクティブを登録します
app.directive('focus', {
  // 束縛されている要素が DOM にマウントされると...
  mounted(el) {
    // その要素にフォーカスを当てる
    el.focus()
  }
})
```

ディレクティブを代わりにローカルに登録したい場合、コンポーネントの `directives` オプションで登録できます:

```js
directives: {
  focus: {
    // ディレクティブの定義
    mounted(el) {
      el.focus()
    }
  }
}
```

そしてテンプレートでは、新規登録した `v-focus` 属性をどの要素に対しても以下のように利用できます:

```html
<input v-focus />
```

## フック関数

ディレクティブの定義オブジェクトは、いくつかのフック関数を提供しています (全てオプション):

- `created`: 束縛された要素の属性や、イベントリスナが適用される前に呼ばれます。これは通常の `v-on` イベントリスナの前に呼ばれなければならないイベントリスナをつける必要がある場合に便利です。

- `beforeMount`: ディレクティブが最初に要素に束縛されたとき、親コンポーネントがマウントされる前に呼ばれます。

- `mounted`: 束縛された要素の親コンポーネントがマウントされた時に呼ばれます。

- `beforeUpdate`: 束縛された要素を含むコンポーネントの VNode が更新される前に呼ばれます。

:::tip Note
VNodes は[後で](render-function.html#the-virtual-dom-tree)詳細に扱います。Render 関数を説明する時です。
:::

- `updated`: 束縛された要素を含むコンポーネントの VNode **とその子コンポーネントの VNode** が更新された後に呼ばれます。

- `beforeUnmount`: 束縛された要素の親コンポーネントがアンマウントされる前に呼ばれます。

- `unmounted`: ディレクティブが要素から束縛を解かれた時、また親コンポーネントがアンマウントされた時に1度だけ呼ばれます。

これらのフック関数に渡される引数 (すなわち、`el`, `binding`, `vnode`, `prevVnode`) は、[カスタムディレクティブ API](../api/application-api.html#directive) にて確認できます。

### 動的なディレクティブ引数

ディレクティブの引数は動的にできます。例えば、`v-mydirective:[argument]="value"` において、`argument` はコンポーネントインスタンスの data プロパティに基づいて更新されます! これにより、私たちのアプリケーション全体を通した利用に対して、カスタムディレクティブは柔軟になります。

ページの固定位置に要素をピン留めするカスタムディレクティブを考えてみましょう。引数の値が縦方向のピクセル位置を更新するカスタムディレクティブを以下のように作成することができます:

```vue-html
<div id="dynamic-arguments-example" class="demo">
  <p>Scroll down the page</p>
  <p v-pin="200">Stick me 200px from the top of the page</p>
</div>
```

```js
const app = Vue.createApp({})

app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    // binding.value はディレクティブに渡した値です - このケースの場合、200 です
    el.style.top = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')
```

これにより、ページの上端から 200px の位置に要素を固定できます。しかし、上端からではなく左端から要素をピン留めする必要があるシナリオが出てきたらどうでしょうか？ここでコンポーネントインスタンスごとに更新できる動的引数がとても便利です:

```vue-html
<div id="dynamicexample">
  <h3>Scroll down inside this section ↓</h3>
  <p v-pin:[direction]="200">I am pinned onto the page at 200px to the left.</p>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      direction: 'right'
    }
  }
})

app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    // binding.arg がディレクティブに渡した引数です
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')
```

結果:

<common-codepen-snippet title="Custom directives: dynamic arguments" slug="YzXgGmv" :preview="false" />

このカスタムディレクティブは、いくつかの違うユースケースをサポートできるほど柔軟になりました。さらに動的にするには、束縛した値を修正できるようにすれば良いでしょう。`pinPadding` という追加のプロパティを作成して、`<input type="range">` に束縛してみましょう。

```vue-html{4}
<div id="dynamicexample">
  <h2>Scroll down the page</h2>
  <input type="range" min="0" max="500" v-model="pinPadding">
  <p v-pin:[direction]="pinPadding">Stick me {{ pinPadding + 'px' }} from the {{ direction }} of the page</p>
</div>
```

```js{5}
const app = Vue.createApp({
  data() {
    return {
      direction: 'right',
      pinPadding: 200
    }
  }
})
```

さらにコンポーネントの更新に従ってピンとの距離を再計算できるようにディレクティブのロジックを拡張しましょう:

```js{7-10}
app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  },
  updated(el, binding) {
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
})
```

結果:

<common-codepen-snippet title="Custom directives: dynamic arguments + dynamic binding" slug="rNOaZpj" :preview="false" />

## 関数による省略記法

前の例では、`mounted` と `updated` に同じ振る舞いをさせたいが、その他のフックは気にしない、という場合があります。そのような場合は、ディレクティブにコールバックを渡すことで実現できます:

```js
app.directive('pin', (el, binding) => {
  el.style.position = 'fixed'
  const s = binding.arg || 'top'
  el.style[s] = binding.value + 'px'
})
```

## オブジェクトリテラル

ディレクティブに複数の値が必要な場合、JavaScript のオブジェクトリテラルを渡すこともできます。覚えておいてください、ディレクティブはあらゆる妥当な JavaScript 式を取ることができます。

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## コンポーネントでの使い方

コンポーネントに使われた場合、カスタムディレクティブは [プロパティでない属性](component-attrs.html) と同じように、常にコンポーネントのルートノードに適用されます

```vue-html
<my-component v-demo="test"></my-component>
```

```js
app.component('my-component', {
  template: `
    <div> // v-demo ディレクティブはここで適用される
      <span>My component content</span>
    </div>
  `
})
```

属性とは異なり、ディレクティブは `v-bind="$attrs"` で別の要素に渡すことはできません。

[Fragments](/guide/migration/fragments.html#overview) のサポートによって、コンポーネントは複数のルートノードを持つことができます。マルチルートコンポーネントに適用された場合、ディレクティブは無視され、警告が投げられます。
