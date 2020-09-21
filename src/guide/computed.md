# 算出プロパティとウォッチャ

## 算出プロパティ

テンプレート内の式は非常に便利ですが、シンプルな操作のためのものです。テンプレートにたくさんロジックを入れすぎると、テンプレートが肥大化してメンテナンスしづらくなる可能性があります。たとえば、配列が入っているオブジェクトがあり:

```js
Vue.createApp({
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  }
})
```

`author` が本を持っているかどうかによって違うメッセージを表示しようとしています。

```html
<div id="computed-basics">
  <p>Has published books:</p>
  <span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
</div>
```

これだと、テンプレートはもうシンプルでも宣言的でもありません。`author.books` を元に計算していると分かるまで少し時間がかかります。この計算を何回もテンプレートに含めたい場合、問題はさらに悪化します。

そのため、リアクティブなデータを含む複雑なロジックには**算出プロパティ**を使いましょう。

### 基本的な例

```html
<div id="computed-basics">
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  },
  computed: {
    // 算出 getter 関数
    publishedBooksMessage() {
      // `this` は vm インスタンスを指す
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}).mount('#computed-basics')
```

結果:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="js,result" data-user="Vue" data-slug-hash="NWqzrjr" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Computed basic example">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/NWqzrjr">
  Computed basic example</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

ここでは `publishedBooksMessage` という算出プロパティを宣言しています。

このアプリケーションの `data` にある `books` 配列の値を変更してみると、それに応じて `publishedBooksMessage` がどのように変わるか分かるでしょう。

通常のプロパティと同じように、テンプレート内で算出プロパティにデータバインドできます。Vue は `vm.publishedBooksMessage` が `vm.author.books` に依存していると分かっているので、`vm.author.books` が変更されると `vm.publishedBooksMessage` に依存するバインディングを更新します。また、この依存関係を宣言的に作成しているのが最高です: 算出 getter 関数には副作用がないので、テストや理解するのが容易になります。

### 算出プロパティ vs メソッド

式の中でメソッドを呼び出せば同じことができると気づいたかもしれません:

```html
<p>{{ calculateBooksMessage() }}</p>
```

```js
// コンポーネントの中
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Yes' : 'No'
  }
}
```

同じ関数を算出プロパティではなくメソッドとして定義することもできます。結果だけ見れば、この2つのアプローチはまったく同じになりますが、**算出プロパティはリアクティブな依存関係に基づいてキャッシュされる**という違いがあります。算出プロパティはリアクティブな依存関係の一部が変更された場合にのみ再評価されるのです。つまり、`author.books`が変更されなければ、算出プロパティの `publishedBooksMessage` に複数回アクセスしても関数は再実行されず、前回計算した結果がすぐに返されます。

下の算出プロパティは `Date.now()` がリアクティブな依存関係ではないので、一度も更新されないことになります:

```js
computed: {
  now() {
    return Date.now()
  }
}
```

それに対してメソッドは、再レンダリングが起こるたびに**常に**関数を実行します。

どうしてキャッシングが必要なのでしょうか？　巨大な配列をループして、たくさんの計算を必要とする算出プロパティ `list` があるとします。また、`list` に依存している別の算出プロパティがあるかも知れません。キャッシングがなければ、`list` の getter 関数を必要以上に何度も実行することになってしまいます。キャッシングをしたくない場合は、代わりに `method` を使用してください。

### 算出 Setter 関数

算出プロパティはデフォルトでは getter 関数のみですが、必要に応じて setter 関数を設定することもできます:

```js
// ...
computed: {
  fullName: {
    // getter 関数
    get() {
      return this.firstName + ' ' + this.lastName
    },
    // setter 関数
    set(newValue) {
      const names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

この状態で `vm.fullName = 'John Doe'` を実行すると setter 関数が呼び出され、その結果 `vm.firstName` と `vm.lastName` が更新されます。

## ウォッチャ

ほとんどの場合、算出プロパティの方が適切ですが、カスタムウォッチャが必要な場合もあります。そのため Vue は、データの変更に反応するためのより汎用的な方法を、`watch` オプションによって提供しています。これはデータを変更するのに応じて非同期処理や重い処理を実行したい場合に最も便利です。

例:

```html
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</div>
```

```html
<!-- ajax ライブラリや汎用ユーティリティメソッドのコレクションなどの      -->
<!-- 豊富なエコシステムがすでに存在するため、それらを再発明しないことで -->
<!-- Vue のコアは小規模なまま保たれています。これは、使い慣れたものを  -->
<!-- 自由に使うことができる、ということでもあります。                  -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script>
  const watchExampleVM = Vue.createApp({
    data() {
      return {
        question: '',
        answer: 'Questions usually contain a question mark. ;-)'
      }
    },
    watch: {
      // question が変わるたびに、この関数が実行される
      question(newQuestion, oldQuestion) {
        if (newQuestion.indexOf('?') > -1) {
          this.getAnswer()
        }
      }
    },
    methods: {
      getAnswer() {
        this.answer = 'Thinking...'
        axios
          .get('https://yesno.wtf/api')
          .then(response => {
            this.answer = response.data.answer
          })
          .catch(error => {
            this.answer = 'Error! Could not reach the API. ' + error
          })
      }
    }
  }).mount('#watch-example')
</script>
```

結果:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="GRJGqXp" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Watch basic example">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/GRJGqXp">
  Watch basic example</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

このケースでは `watch` オプションを使用することで、非同期処理（API へのアクセス）の実行と、その処理を実行する条件を設定できています。このようなことは算出プロパティではできません。

`watch` オプションに加え、命令的な [vm.\$watch API](../api/instance-methods.html#watch) を使うこともできます。

### 算出プロパティ vs 監視プロパティ

Vue は現在のアクティブなインスタンスでのデータの変更を観察して反応するための、より汎用的な方法: **監視プロパティ(watched property)** を提供します。他のデータに基づいて変更しなければならないデータがある場合（AngularJS をやっていた人だとなおさら）、`watch` を使いすぎてしまいがちです。しかし、たいていの場合は命令的な `watch` のコールバックよりも算出プロパティを使うのがベターです。次の例を考えてみましょう:

```html
<div id="demo">{{ fullName }}</div>
```

```js
const vm = Vue.createApp({
  data() {
    return {
      firstName: 'Foo',
      lastName: 'Bar',
      fullName: 'Foo Bar'
    }
  },
  watch: {
    firstName(val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName(val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
}).mount('#demo')
```

上記のコードは命令的だし冗長ですね。算出プロパティで書き換えたものと比べてみましょう:

```js
const vm = Vue.createApp({
  data() {
    return {
      firstName: 'Foo',
      lastName: 'Bar'
    }
  },
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    }
  }
}).mount('#demo')
```

ずっといいですよね？
