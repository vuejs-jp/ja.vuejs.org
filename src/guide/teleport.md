# Teleport

Vue は私たちに、UI やそれに関連する挙動をコンポーネントにして、カプセル化することで UI を作り上げることを勧めています。私たちはそれらを互いに入れ子にして、アプリケーションを構成するツリーを作ることができます。

しかしながら、コンポーネントのテンプレートの一部が、論理的にこのコンポーネントに属している場合もありますが、技術的な観点では、テンプレートのこの部分を Vue アプリの外や、DOM 内の別の場所に移動させることが望ましいこともあります。

これの一般的なシナリオは、フルスクリーンのモーダルを含むコンポーネントです。多くの場合、モーダルのロジックはコンポーネント内に残したいと思うでしょうが、モーダルの配置はすぐに CSS で解決するのが難しくなったり、コンポーネントの構成を変更する必要が出てくるでしょう。

以下のような HTML 構造を考えてみましょう。

```html
<body>
  <div style="position: relative;">
    <h3>Tooltips with Vue 3 Teleport</h3>
    <div>
      <modal-button></modal-button>
    </div>
  </div>
</body>
```

`modal-button` について見てみましょう。

コンポーネントはモーダルを開くための `button` 要素を持っており、さらに `.modal` クラスを持った `div` 要素があります。これはモーダルのコンテンツを表示して、自身を閉じるためのボタンを持っている要素です。

```js
const app = Vue.createApp({});

app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        Open full screen modal!
    </button>

    <div v-if="modalOpen" class="modal">
      <div>
        I'm a modal! 
        <button @click="modalOpen = false">
          Close
        </button>
      </div>
    </div>
  `,
  data() {
    return { 
      modalOpen: false
    }
  }
})
```

このコンポーネントを最初の HTML 構造の中で使うときに、問題が見えてきます。モーダルは深く入れ子になった `div` の中にレンダリングされており、モーダルの `position: absolute` は、相対的に位置する親の `div` を参照として使用します。

Teleport は、グローバルステートに頼ったり、2つのコンポーネントに分割しなくても、HTML の一部を DOM のどの親の下でレンダリングするかを制御するための、きれいな方法を提供します。

`<teleport>` を使って、Vue にこの HTML を "**body**" タグに "**teleport**" させるよう、`modal-button` を変更しましょう。 

```js
app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        Open full screen modal! (With teleport!)
    </button>

    <teleport to="body">
      <div v-if="modalOpen" class="modal">
        <div>
          I'm a teleported modal! 
          (My parent is "body")
          <button @click="modalOpen = false">
            Close
          </button>
        </div>
      </div>
    </teleport>
  `,
  data() {
    return { 
      modalOpen: false
    }
  }
})
```

その結果、ボタンをクリックしてモーダルを開くと、Vue はモーダルのコンテンツを `body` タグの子として正しくレンダリングします。

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="js,result" data-user="Vue" data-slug-hash="gOPNvjR" data-preview="true" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue 3 Teleport">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/gOPNvjR">
  Vue 3 Teleport</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Vue コンポーネントと使う

もし `<teleport>` が Vue コンポーネントを含む場合、それは`<teleport>` の親の、論理的な子コンポーネントのままになります。

```js
const app = Vue.createApp({
  template: `
    <h1>Root instance</h1>
    <parent-component />
  `
})

app.component('parent-component', {
  template: `
    <h2>This is a parent component</h2>
    <teleport to="#endofbody">
      <child-component name="John" />
    </teleport>
  `
})

app.component('child-component', {
  props: ['name'],
  template: `
    <div>Hello, {{ name }}</div>
  `
})
```

この場合、 `child-component` が別の場所にレンダリングされたとしても、`parent-component` の子のままとなるため、`name` prop を受け取ります。

これは、親コンポーネントからの注入が期待通りに動作し、Vue Devtools 上では実際のコンテンツが移動した場所に配置されるのではなく、親コンポーネントの下に配置されることを意味します。

## 複数の teleport のターゲットを同じにして使う

一般的なユースケースのシナリオは、再利用可能な `<Modal>` コンポーネントで、同時に複数のインスタンスがアクティブになっている状態かもしれません。このようなシナリオの場合、複数の `<teleport>` は、同じターゲット要素に対してそれぞれのコンテンツをマウントすることができます。

```html
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>

<!-- result-->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

`<teleport>` コンポーネントのオプションは [API リファレンス](../api/built-in-components.html#teleport) で確認できます。
