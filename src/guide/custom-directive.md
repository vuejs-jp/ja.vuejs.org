# カスタムディレクティブ

## 基本

Vue.js 本体で提供されているデフォルトのディレクティブ (`v-model` や `v-show`) に加えて、独自のカスタムディレクティブ (custom directives) を登録することも可能です。Vue ではコードの再利用や抽象化の基本形はコンポーネントです。しかしながら、単純な要素への低レベルな DOM のアクセスが必要なケースがあるかもしれません。こういったケースにカスタムディレクティブが役に立つことでしょう。以下のような input 要素へのフォーカスが１つの例として挙げられます。

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="JjdxaJW" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Custom directives: basic example">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/JjdxaJW">
  Custom directives: basic example</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

ページを読み込むと、この要素にフォーカスが当たります (注意：`autofucus` はモバイルの Safari で動きません)。実際、このページに訪れてから他に何もクリックしなければ、上記の input 要素にフォーカスが当たります。また、`Rerun` ボタンをクリックしても、input 要素はフォーカスされます。

ここからこれを実現するディレクティブを実装しましょう。

```js
const app = Vue.createApp({})
// `v-focus` と呼ばれるグローバルカスタムディレクティブを登録します
app.directive('focus', {
  // バインドされている要素が DOM にマウントされると...
  mounted(el) {
    // その要素にフォーカスを当てる
    el.focus()
  }
})
```

ディレクティブを代わりにローカルに登録したい場合、コンポーネントの `directives` オプションで登録できます。

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

そしてテンプレートでは、新規登録した `v-focus` 属性をどの要素に対しても以下のように利用できます。

```html
<input v-focus />
```

## フック関数

ディレクティブの定義オブジェクトは、いくつかのフック関数を提供しています (全てオプション):

- `beforeMount`: ディレクティブが初めて要素にバインドされた時、そして親コンポーネントがマウントされる前に呼ばれます。ここは1度だけ実行するセットアップ処理を行える場所です。

- `mounted`: バインドされた要素の親コンポーネントがマウントされた時に呼ばれます。

- `beforeUpdate`: バインドされた要素を含むコンポーネントの VNode が更新される前に呼ばれます。

:::tip 注意
VNodes は[後で](render-function.html#the-virtual-dom-tree)詳細に扱います。描画関数を説明する時です。
:::

- `updated`: バインドされた要素を含むコンポーネントの VNode **とその子コンポーネントの VNode** が更新された後に呼ばれます。

- `beforeUnmount`: バインドされた要素の親コンポーネントがアンマウントされる前に呼ばれます。

- `unmounted`: ディレクティブが要素からバインドを解かれた時、また親コンポーネントがアンマウントされた時に1度だけ呼ばれます。

これらのフック関数に渡される引数 (すなわち、`el`, `binding`, `vnode`, `prevVnode`) は、[カスタムディレクティブ API](../api/application-api.html#directive) にて確認できます。

### 動的なディレクティブ引数

ディレクティブの引数は動的にできます。例えば、`v-mydirective:[argument]="value"` において、`argument` はコンポーネントインスタンスの data プロパティに基づいて更新されます! これにより、私たちのアプリケーション全体を通した利用に対して、カスタムディレクティブは柔軟になります。

ページの固定位置に要素をピン留めするカスタムディレクティブを考えてみましょう。引数の値が縦方向のピクセル位置を更新するカスタムディレクティブを以下のように作成することができます:。

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

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="YzXgGmv" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Custom directives: dynamic arguments">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/YzXgGmv">
  Custom directives: dynamic arguments</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

このカスタムディレクティブは、いくつかの違うユースケースをサポートできるほど柔軟になりました。さらに動的にするには、バインドした値を修正できるようにすれば良いでしょう。`pinPadding` という追加のプロパティを作成して、`<input type="range">` にバインドしてみましょう。

```vue-html{4}
<div id="dynamicexample">
  <h2>Scroll down the page</h2>
  <input type="range" min="0" max="500" v-model="pinPadding">
  <p v-pin:[direction]="pinPadding">Stick me 200px from the {{ direction }} of the page</p>
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

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="rNOaZpj" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Custom directives: dynamic arguments + dynamic binding">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/rNOaZpj">
  Custom directives: dynamic arguments + dynamic binding</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 関数による省略記法

前回の例では、`mounted` と `updated` に同じ振る舞いを欲しかったでしょう。しかし、その他のフック関数を気にしてはいけません。ディレクティブにコールバックを渡すことで実現できます:

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

## コンポーネントにおける使用法

3.0 ではフラグメントがサポートされているため、コンポーネントは潜在的に１つ以上のルートノードを持つことができます。これは複数のルートノードを持つ１つのコンポーネントにカスタムディレクティブが使用された時に、問題を引き起こします。

3.0 のコンポーネント上でどのようにカスタムディレクティブが動作するかを詳細に説明するために、3.0 においてカスタムディレクティブがどのようにコンパイルされるのかをまずは理解する必要があります。以下のようなディレクティブは:

```vue-html
<div v-demo="test"></div>
```

おおよそ以下のようにコンパイルされます:

```js
const vDemo = resolveDirective('demo')

return withDirectives(h('div'), [[vDemo, test]])
```

ここで `vDemo` はユーザによって記述されたディレクティブオブジェクトで、それは `mounted` や `updated` のフック関数を含みます。

`withDirectives` は複製した VNode を返します。複製された VNode は VNode のライフサイクルフック (詳細は[描画関数](render-function.html)を参照) としてラップ、注入されたユーザのフック関数を持ちます。

```js
{
  onVnodeMounted(vnode) {
    // vDemo.mounted(...) を呼びます
  }
}
```

**結果として、VNode のデータの一部としてカスタムディレクティブは全て含まれます。カスタムディレクティブがコンポーネントで利用される場合、これらの `onVnodeXXX` フック関数は無関係な props としてコンポーネントに渡され、最終的に `this.$attrs` になります。**

これは以下のようなテンプレートのように、要素のライフサイクルに直接フックできることを意味しています。これはカスタムディレクティブが複雑すぎる場合に便利です:

```vue-html
<div @vnodeMounted="myHook" />
```

これは [属性のフォールスロー](component-attrs.html) と一貫性があります。つまり、コンポーネントにおけるカスタムディレクティブのルールは、その他の異質な属性と同じです: それをどこにまた適用するかどうかを決めるのは、子コンポーネント次第です。子コンポーネントが内部の要素に `v-bind="$attrs"` を利用している場合、あらゆるカスタムディレクティブもその要素に適用されます。
