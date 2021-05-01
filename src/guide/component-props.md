# プロパティ

> このページは、すでに[コンポーネントの基本](component-basics.md)を読んだことを前提としています。コンポーネントに慣れていない場合は、まずはそちらをお読みください。

## プロパティの型

ここまでは、プロパティを文字列の配列として列挙してきました。

```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```

しかし、通常はすべてのプロパティを特定の型の値にしたいと思うでしょう。このような場合には、プロパティをオブジェクトとして列挙し、プロパティのキーと値にそれぞれプロパティの名前と型を設定します:

```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // またはその他のコンストラクタ
}
```

こうすることでコンポーネントがドキュメント化されるだけでなく、間違った型を渡した場合に、ブラウザの JavaScript コンソールで警告の表示もされます。詳しくはこのページの下にある[プロパティのバリデーション](#プロパティのバリデーション) にて説明します。

## 静的あるいは動的なプロパティの受け渡し

これまでは、このような形でプロパティが静的な値を渡しているところを見てきましたが:

```html
<blog-post title="My journey with Vue"></blog-post>
```

次のような、`v-bind`やそのショートカットである `:` 文字を使って動的に割り当てられたプロパティも見たことがあるでしょう:

```html
<!-- 変数の値を動的に割り当てます -->
<blog-post :title="post.title"></blog-post>

<!-- 複数の変数を合成した値を動的に割り当てます -->
<blog-post :title="post.title + ' by ' + post.author.name"></blog-post>
```

上の 2 つの例では、たまたま文字列の値を渡していますが、実際には __任意の__ 型の値をプロパティに渡すことができます。

### 数値の受け渡し

```html
<!-- `42` は静的な値ですが、これが文字列ではなく JavaScript の式だと -->
<!-- Vue に伝えるためには v-bind を使う必要があります。 -->
<blog-post :likes="42"></blog-post>

<!-- 変数の値を動的に割り当てています。 -->
<blog-post :likes="post.likes"></blog-post>
```

### 真偽値の受け渡し

```html
<!-- 値のないプロパティは、 `true` を意味します。 -->
<blog-post is-published></blog-post>

<!-- `false` は静的な値ですが、これが文字列ではなく JavaScript の式だと -->
<!-- Vue に伝えるには、 v-bind を使う必要があります。 -->
<blog-post :is-published="false"></blog-post>

<!-- 変数の値を動的に割り当てています。 -->
<blog-post :is-published="post.isPublished"></blog-post>
```

### 配列の受け渡し

```html
<!-- この配列は静的ですが、これが文字列ではなく JavaScript の式だと -->
<!-- Vue に伝えるには、 v-bind を使う必要があります。 -->
<blog-post :comment-ids="[234, 266, 273]"></blog-post>

<!-- 変数の値を動的に割り当てています。 -->
<blog-post :comment-ids="post.commentIds"></blog-post>
```

### オブジェクトの受け渡し

```html
<!-- このオブジェクトは静的ですが、これが文字列ではなく JavaScript の式だと -->
<!-- Vue に伝えるには、 v-bind を使う必要があります。 -->
<blog-post
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>

<!-- 変数の値を動的に割り当てています。 -->
<blog-post :author="post.author"></blog-post>
```

### オブジェクトのプロパティの受け渡し

オブジェクトのすべてのプロパティをコンポーネントのプロパティ(props)として渡したい場合は、引数なしで `v-bind` を使うことができます (`:prop-name` の代わりに `v-bind`を使用)。例えば、`post` オブジェクトが与えられたとします。

```js
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```

次のテンプレートは:

```html
<blog-post v-bind="post"></blog-post>
```

以下と同等となります:

```html
<blog-post v-bind:id="post.id" v-bind:title="post.title"></blog-post>
```

## 単方向データフロー

すべてのプロパティは、子プロパティと親プロパティの間に **単方向のバインディング** を形成します: 親のプロパティが更新される場合は子へと流れ落ちますが、その逆はありません。これにより、子コンポーネントが誤って親の状態を変更すること(アプリのデータフローを理解しづらくすることがあります)を防ぎます。

さらに、親コンポーネントが更新されるたびに、子コンポーネントのすべてのプロパティは最新の値に更新されます。つまり、子コンポーネント内でプロパティの値を変化させては **いけません** 。変化させた場合、Vue はコンソールで警告を表示します。

プロパティの値を変化させたい場合は主に 2 つあります:

1. **プロパティを初期値として受け渡し、子コンポーネントにてローカルのデータとして後で利用したいと考える場合。** この場合は、プロパティの値を初期値として使うローカルの data プロパティを定義するのがベストです:

```js
props: ['initialCounter'],
data() {
  return {
    counter: this.initialCounter
  }
}
```

2. **プロパティを変換が必要な未加工の値として受け渡す。** この場合、プロパティの値を使用した算出プロパティを別途定義するのがベストです:

```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

::: tip Note
JavaScript のオブジェクトと配列は、参照として渡されるため、子コンポーネント内で配列やオブジェクトを変更すると、 **親の状態に影響を与える** ことに注意してください。
:::

## プロパティのバリデーション

コンポーネントはプロパティに対して、すでに見たように型などの要件を指定することができます。要件が満たされていない場合、Vue はブラウザの JavaScript コンソールで警告を表示します。これは、他の人が使用することを意図したコンポーネントを開発する場合に特に便利です。

プロパティのバリデーションを指定するには、文字列の配列の代わりに、 `props` の値についてのバリデーション要件をもったオブジェクトを渡します。例えば以下のようなものです:

```js
app.component('my-component', {
  props: {
    // 基本的な型チェック (`null` と `undefined` は全てのバリデーションをパスします)
    propA: Number,
    // 複数の型の許容
    propB: [String, Number],
    // 文字列型を必須で要求する
    propC: {
      type: String,
      required: true
    },
    // デフォルト値つきの数値型
    propD: {
      type: Number,
      default: 100
    },
    // デフォルト値つきのオブジェクト型
    propE: {
      type: Object,
      // オブジェクトもしくは配列のデフォルト値は
      // 必ずファクトリ関数（それを生み出すための関数）を返す必要があります。
      default: function() {
        return { message: 'hello' }
      }
    },
    // カスタムバリデーション関数
    propF: {
      validator: function(value) {
        // プロパティの値は、必ずいずれかの文字列でなければならない
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    },
    // デフォルト値つきの関数型
    propG: {
      type: Function,
      // オブジェクトや配列のデフォルトとは異なり、これはファクトリ関数ではありません。これは、デフォルト値としての関数を取り扱います。
      default: function() {
        return 'Default function'
      }
    }
  }
})
```

プロパティのバリデーションが失敗した場合、 Vue はコンソールに警告を表示します (開発用ビルドを利用しているとき)。

::: tip Note
プロパティのバリデーションはコンポーネントのインスタンスが生成される **前** に行われるため、インスタンスのプロパティ (例えば `data`, `computed` など) を `dafault` および `validator` 関数の中で利用することはできません。
:::

### 型の検査

`type` は、次のネイティブコンストラクタのいずれかです:

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

さらに、`type` はカスタムコンストラクタ関数であってもよく、アサーションは `instanceof` チェックにより行われます。例えば、以下のようなコンストラクタ関数が存在するとします:

```js
function Person(firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```

このように利用することができます:

```js
app.component('blog-post', {
  props: {
    author: Person
  }
})
```

上の例では、 `author` プロパティの値が `new Person` によって作成されたものかどうか検証されます。

## プロパティの形式 (キャメルケース vs ケバブケース)

HTML の属性名は大文字小文字を区別しないので、ブラウザは全ての大文字を小文字として解釈します。つまり、 DOM(HTML) テンプレート内においては、キャメルケースのプロパティ名はケバブケース(ハイフンで区切ったもの)を使う必要があります。

```js
const app = Vue.createApp({})

app.component('blog-post', {
  // JavaScript 内ではキャメルケース
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

```html
<!-- HTML 内ではケバブケース -->
<blog-post post-title="hello!"></blog-post>
```

繰り返しになりますが、文字列テンプレートを使用している場合は、この制限は適用されません。
