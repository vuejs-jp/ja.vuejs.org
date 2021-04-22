# データプロパティとメソッド

## データプロパティ

コンポーネントの `data` オプションは関数です。Vue は新しいコンポーネントのインスタンスを作成する際に、この関数を呼び出します。これはオブジェクトを返すもので、 Vue はオブジェクトをそのリアクティブシステムでラップして、コンポーネントのインスタンスに `$data` として格納します。便宜上、そのオブジェクトのトップレベルのプロパティは、コンポーネントのインスタンスを介して直接公開されます:

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.$data.count) // => 4
console.log(vm.count)       // => 4

// vm.count に値を代入すると、 $data.count も更新
vm.count = 5
console.log(vm.$data.count) // => 5

// ... 逆もまた同様
vm.$data.count = 6
console.log(vm.count) // => 6
```

これらのインスタンスプロパティは、インスタンスの初回作成時にのみ追加されます。そのため、 `data` 関数から返されたオブジェクトに、それらがすべて含まれていることを確認する必要があります。必要に応じて、必要な値がまだ利用できないプロパティには、 `null` や `undefined` 、またはその他のプレースホルダーの値を使ってください。

新しいプロパティを `data` に含めずに、コンポーネントのインスタンスに直接追加することはできます。しかし、このプロパティはリアクティブな `$data` オブジェクトによって支えられていないので、 [Vue のリアクティブシステム](reactivity.html) によって、自動的に追跡されることはありません。

Vue は、コンポーネントのインスタンスを介して自身のビルトイン API を公開する際に、 `$` をプレフィックスとして使います。 また、内部プロパティのために `_` を予約しています。トップレベルの `data` プロパティの名前に、これらの文字からはじまる名前を使うことは避けるべきです。

## メソッド

コンポーネントのインスタンスにメソッドを追加するには、 `methods` オプションを使います。これは必要なメソッドを含むオブジェクトでなければなりません:

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  },
  methods: {
    increment() {
      // `this` はコンポーネントインスタンスを参照
      this.count++
    }
  }
})

const vm = app.mount('#app')

console.log(vm.count) // => 4

vm.increment()

console.log(vm.count) // => 5
```

Vue は、 `methods` の `this` を自動的に束縛して、常にコンポーネントのインスタンスを参照します。これにより、メソッドがイベントリスナやコールバックとして使われる際に、正しい `this` の値を保持することができます。Vue が適切な `this` の値を束縛するのを防ぐため、 `methods` を定義する際にはアロー関数を使うのは避けるべきです。

コンポーネントのインスタンスの他のすべてのプロパティと同様に、 `methods` はコンポーネントのテンプレート内からアクセスできます。テンプレート内からはよくイベントリスナとして使われます:

```html
<button @click="increment">Up vote</button>
```

上の例では、 `<button>` がクリックされると、 `increment` メソッドが呼ばれます。

また、テンプレートから直接メソッドを呼び出すこともできます。後で説明しますが、通常は変わりに [算出プロパティ](computed.html) を使うのがよいです。しかし、メソッドを使うことは算出プロパティが実行可能なオプションではない場合に役に立ちます。テンプレートが JavaScript の式をサポートしていれば、どこでもメソッドを呼び出すことができます:

```html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```

`toTitleDate` や `formatDate` メソッドがどれかリアクティブなデータにアクセスすると、あたかもテンプレートで直接使われていたかのように、それはレンダリングの依存関係として追跡されます。

テンプレートから呼び出されたメソッドは、データの変更や非同期処理の発火などの副作用があってはなりません。もしそのようなことをしたくなったら、代わりに [ライフサイクルフック](instance.html#lifecycle-hooks) を使うべきです。

### Debounce (デバウンス) と Throttle (スロットル)

Vue は、 Debounce や Throttle のサポートが組み込まれていませんが、 [Lodash](https://lodash.com/) などのライブラリを使って実装することができます。

コンポーネントが一度しか使われない場合には、 `methods` の中で直接 Debounce を適用することができます:

```html
<script src="https://unpkg.com/lodash@4.17.20/lodash.min.js"></script>
<script>
  Vue.createApp({
    methods: {
      // Lodash による Debounce
      click: _.debounce(function() {
        // ... クリックに反応 ...
      }, 500)
    }
  }).mount('#app')
</script>
```

しかし、この方法ではコンポーネントが再利用される場合に、すべてのコンポーネントが同じ Debounce 関数を共有するため、問題が起きる可能性があります。コンポーネントのインスタンスをお互いに独立させるために、 `created` ライフサイクルフックに Debounce 関数を追加することができます:

```js
app.component('save-button', {
  created() {
    // Lodash によるDebounce
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // コンポーネントが削除されたらタイマーをキャンセル
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... クリックに反応 ...
    }
  },
  template: `
    <button @click="debouncedClick">
      Save
    </button>
  `
})
```
