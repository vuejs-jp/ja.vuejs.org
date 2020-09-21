# コンポーネントの基本

## 基本例

Vue コンポーネントの例を次に示します:

```js
// Vue アプリケーションを作成します
const app = Vue.createApp({})

// global な button-counter というコンポーネントを定義します
app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
})
```

::: info
ここでは単純な例を示していますが, 典型的な Vue アプリケーションでは文字列テンプレートではなく単一ファイルコンポーネントを使用します。 詳しくは[こちら](single-file-component.html)で解説されています。
:::

コンポーネントは名前付きの再利用可能なインスタンスです。この例の場合は`<button-counter>`です。このコンポーネントをルートインスタンスの中でカスタム要素として使用することができます。

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
app.mount('#components-demo')
```

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="js,result" data-user="Vue" data-slug-hash="abORVEJ" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/abORVEJ">
  Component basics</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

コンポーネントは再利用可能なインスタンスなので、`data`、 `computed`、 `watch`、 `methods`、そしてライフサイクルフック のようなルートインスタンスと同様のオプションが利用可能です。唯一の例外は `el` のようなルート固有のオプションです。

## コンポーネントの再利用

Components can be reused as many times as you want:
コンポーネントは必要なだけ何度でも再利用できます:

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="rNVqYvM" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics: reusing components">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/rNVqYvM">
  Component basics: reusing components</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

ボタンをクリックすると、それぞれが独自の `count` を保持することに注意してください。 これはコンポーネントを使用する度に新しいコンポーネントの**インスタンス**が作成されるためです。

## コンポーネントの構成

一般的にアプリケーションはネストされたコンポーネントのツリーに編成されます:

![コンポーネントツリー](/images/components.png)

例えば、 ヘッダー、サイドバー、コンテンツエリアなどのコンポーネントがあり、それぞれには一般的にナビゲーションリンクやブログ投稿などのコンポーネントが含まれています。

これらのコンポーネントをテンプレートで使用するためには、 Vue がそれらを認識できるように登録する必要があります。 コンポーネントの登録には **グローバル** と **ローカル** の 2 種類があります。これまでは、アプリケーションの `component` メソッドを利用してグローバルに登録してきただけです:

```js
const app = Vue.createApp({})

app.component('my-component-name', {
  // ... オプション ...
})
```

グローバルに登録されたコンポーネントはその後作成された `app` インスタンスのテンプレートで使用することができます。さらに、ルートインスタンスのコンポーネントツリーの全てのサブコンポーネント内でも使用することが出来ます。

とりあえずコンポーネント登録についてはこれで以上ですが、このページを読み終えて十分に理解できたら、後から戻ってきて [コンポーネント登録](component-registration.md)の完全なガイドを読むことをお勧めします。

## プロパティを用いた子コンポーネントへのデータの受け渡し

先ほど、 ブログ投稿用のコンポーネントの作成について触れました。問題は、 表示する特定の投稿のタイトルや内容のようなデータを作成したコンポーネントに渡せなければそのコンポーネントは役に立たないということです。プロパティはここで役立ちます。

プロパティはコンポーネントに登録できるカスタム属性です。値がプロパティ属性に渡されると、そのコンポーネントインスタンスのプロパティになります。先ほどのブログ投稿用のコンポーネントにタイトルを渡すためには、`props`オプションを用いてこのコンポーネントが受け取るプロパティのリストの中に含めることができます:

```js
const app = Vue.createApp({})

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-post-demo')
```

コンポーネントは必要に応じて多くのプロパティを持つことができ、デフォルトでは任意のプロパティに任意の値を渡すことができます。上記のテンプレートでは、`data` と同様に、コンポーネントインスタンスでこの値にアクセスできることが分かります。

プロパティが登録されたら、 次のようにカスタム属性としてデータをプロパティに渡すことができます:

```html
<div id="blog-post-demo" class="demo">
  <blog-post title="My journey with Vue"></blog-post>
  <blog-post title="Blogging with Vue"></blog-post>
  <blog-post title="Why Vue is so fun"></blog-post>
</div>
```

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="PoqyOaX" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics: passing props">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/PoqyOaX">
  Component basics: passing props</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

しかしながら、一般的なアプリケーションではおそらく `data` に投稿の配列を持っています:

```js
const App = {
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
      ]
    }
  }
}

const app = Vue.createApp(App)

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-posts-demo')
```

そしてコンポーネントをそれぞれ描画します:

```html
<div id="blog-posts-demo">
  <blog-post
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
  ></blog-post>
</div>
```

上記では、 `v-bind` を用いて動的にプロパティを渡すことができると分かります。これは描画する内容が事前に分からない場合に特に便利です。

とりあえずプロパティについてはこれで以上ですが、 このページを読み終えて十分に理解できたら、後から戻ってきて [プロパティ](component-props.html) の完全なガイドを読むことをお勧めします。

## Listening to Child Components Events

As we develop our `<blog-post>` component, some features may require communicating back up to the parent. For example, we may decide to include an accessibility feature to enlarge the text of blog posts, while leaving the rest of the page its default size.

In the parent, we can support this feature by adding a `postFontSize` data property:

```js
const App = {
  data() {
    return {
      posts: [
        /* ... */
      ],
      postFontSize: 1
    }
  }
}
```

Which can be used in the template to control the font size of all blog posts:

```html
<div id="blog-posts-events-demo">
  <div v-bind:style="{ fontSize: postFontSize + 'em' }">
    <blog-post v-for="post in posts" :key="post.id" :title="title"></blog-post>
  </div>
</div>
```

Now let's add a button to enlarge the text right before the content of every post:

```js
app.component('blog-post', {
  props: ['title'],
  template: `
    <div class="blog-post">
      <h4>{{ title }}</h4>
      <button>
        Enlarge text
      </button>
    </div>
  `
})
```

The problem is, this button doesn't do anything:

```html
<button>Enlarge text</button>
```

When we click on the button, we need to communicate to the parent that it should enlarge the text of all posts. Fortunately, component instances provide a custom events system to solve this problem. The parent can choose to listen to any event on the child component instance with `v-on` or `@`, just as we would with a native DOM event:

```html
<blog-post ... @enlarge-text="postFontSize += 0.1"></blog-post>
```

Then the child component can emit an event on itself by calling the built-in [**`$emit`** method](../api/instance-methods.html#emit), passing the name of the event:

```html
<button @click="$emit('enlarge-text')">Enlarge text</button>
```

Thanks to the `v-on:enlarge-text="postFontSize += 0.1"` listener, the parent will receive the event and update `postFontSize` value.

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="KKpGyrp" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics: emitting events">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/KKpGyrp">
  Component basics: emitting events</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

We can list emitted events in the component's `emits` option.

```js
app.component('blog-post', {
  props: ['title'],
  emits: ['enlarge-text']
})
```

This will allow you to check all the events component emits and optionally [validate them](component-custom-events.html#validate-emitted-events)

### Emitting a Value With an Event

It's sometimes useful to emit a specific value with an event. For example, we may want the `<blog-post>` component to be in charge of how much to enlarge the text by. In those cases, we can use `$emit`'s 2nd parameter to provide this value:

```html
<button @click="$emit('enlarge-text', 0.1)">Enlarge text</button>
```

Then when we listen to the event in the parent, we can access the emitted event's value with `$event`:

```html
<blog-post ... @enlarge-text="postFontSize += $event"></blog-post>
```

Or, if the event handler is a method:

```html
<blog-post ... @enlarge-text="onEnlargeText"></blog-post>
```

Then the value will be passed as the first parameter of that method:

```js
methods: {
  onEnlargeText(enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### Using `v-model` on Components

Custom events can also be used to create custom inputs that work with `v-model`. Remember that:

```html
<input v-model="searchText" />
```

does the same thing as:

```html
<input :value="searchText" @input="searchText = $event.target.value" />
```

When used on a component, `v-model` instead does this:

```html
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>
```

::: warning
Please note we used `model-value` with kebab-case here because we are working with in-DOM template. You can find a detailed explanation on kebab-cased vs camelCased attributes in the [DOM Template Parsing Caveats](#dom-template-parsing-caveats) section
:::

For this to actually work though, the `<input>` inside the component must:

- Bind the `value` attribute to a `modelValue` prop
- On `input`, emit an `update:modelValue` event with the new value

Here's that in action:

```js
app.component('custom-input', {
  props: ['modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
```

Now `v-model` should work perfectly with this component:

```html
<custom-input v-model="searchText"></custom-input>
```

Another way of creating the `v-model` capability within a custom component is to use the ability of `computed` properties' to define a getter and setter.

In the following example, we refactor the `custom-input` component using a computed property.

Keep in mind, the `get` method should return the `modelValue` property, or whichever property is being using for binding, and the `set` method should fire off the corresponding `$emit` for that property.

```js
app.component('custom-input', {
  props: ['modelValue'],
  template: `
    <input v-model="value">
  `,
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
})
```

That's all you need to know about custom component events for now, but once you've finished reading this page and feel comfortable with its content, we recommend coming back later to read the full guide on [Custom Events](component-custom-events.md).

## Content Distribution with Slots

Just like with HTML elements, it's often useful to be able to pass content to a component, like this:

```html
<alert-box> Something bad happened. </alert-box>
```

Which might render something like:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="jOPeaob" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics: slots">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/jOPeaob">
  Component basics: slots</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Fortunately, this task is made very simple by Vue's custom `<slot>` element:

```js
app.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```

As you'll see above, we just add the slot where we want it to go -- and that's it. We're done!

That's all you need to know about slots for now, but once you've finished reading this page and feel comfortable with its content, we recommend coming back later to read the full guide on [Slots](component-slots.md).

## Dynamic Components

Sometimes, it's useful to dynamically switch between components, like in a tabbed interface:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="oNXaoKy" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Component basics: dynamic components">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/oNXaoKy">
  Component basics: dynamic components</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

The above is made possible by Vue's `<component>` element with the `is` special attribute:

```html
<!-- Component changes when currentTabComponent changes -->
<component :is="currentTabComponent"></component>
```

In the example above, `currentTabComponent` can contain either:

- the name of a registered component, or
- a component's options object

See [this sandbox](https://codepen.io/team/Vue/pen/oNXaoKy) to experiment with the full code, or [this version](https://codepen.io/team/Vue/pen/oNXapXM) for an example binding to a component's options object, instead of its registered name.

Keep in mind that this attribute can be used with regular HTML elements, however they will be treated as components, which means all attributes **will be bound as DOM attributes**. For some properties such as `value` to work as you would expect, you will need to bind them using the [`.prop` modifier](../api/directives.html#v-bind).

That's all you need to know about dynamic components for now, but once you've finished reading this page and feel comfortable with its content, we recommend coming back later to read the full guide on [Dynamic & Async Components](./component-dynamic-async.html).

## DOM Template Parsing Caveats

Some HTML elements, such as `<ul>`, `<ol>`, `<table>` and `<select>` have restrictions on what elements can appear inside them, and some elements such as `<li>`, `<tr>`, and `<option>` can only appear inside certain other elements.

This will lead to issues when using components with elements that have such restrictions. For example:

```html
<table>
  <blog-post-row></blog-post-row>
</table>
```

The custom component `<blog-post-row>` will be hoisted out as invalid content, causing errors in the eventual rendered output. Fortunately, we can use `v-is` special directive as a workaround:

```html
<table>
  <tr v-is="'blog-post-row'"></tr>
</table>
```

:::warning
`v-is` value should be a JavaScript string literal:

```html
<!-- Incorrect, nothing will be rendered -->
<tr v-is="blog-post-row"></tr>

<!-- Correct -->
<tr v-is="'blog-post-row'"></tr>
```

:::

Also, HTML attribute names are case-insensitive, so browsers will interpret any uppercase characters as lowercase. That means when you’re using in-DOM templates, camelCased prop names and event handler parameters need to use their kebab-cased (hyphen-delimited) equivalents:

```js
// camelCase in JavaScript

app.component('blog-post', {
  props: ['postTitle'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
})
```

```html
<!-- kebab-case in HTML -->

<blog-post post-title="hello!"></blog-post>
```

It should be noted that **these limitations does _not_ apply if you are using string templates from one of the following sources**:

- String templates (e.g. `template: '...'`)
- [Single-file (`.vue`) components](single-file-component.html)
- `<script type="text/x-template">`

That's all you need to know about DOM template parsing caveats for now - and actually, the end of Vue's _Essentials_. Congratulations! There's still more to learn, but first, we recommend taking a break to play with Vue yourself and build something fun.

Once you feel comfortable with the knowledge you've just digested, we recommend coming back to read the full guide on [Dynamic & Async Components](component-dynamic-async.html), as well as the other pages in the Components In-Depth section of the sidebar.
