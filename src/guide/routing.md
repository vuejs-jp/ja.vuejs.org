# ルーティング

## 公式ルータ

ほとんどのシングルページアプリケーションでは、公式にサポートされている [vue-router ライブラリ](https://github.com/vuejs/vue-router)を使うことをオススメします。詳細は vue-router の[ドキュメント](https://next.router.vuejs.org/)を参照してください。

## スクラッチからのシンプルなルーティング

とてもシンプルなルーティングだけが必要で、フル機能のルータライブラリを使用したくない場合は、以下のようにページレベルのコンポーネントで動的にレンダリングができます。

```js
const NotFoundComponent = { template: '<p>Page not found</p>' }
const HomeComponent = { template: '<p>Home page</p>' }
const AboutComponent = { template: '<p>About page</p>' }

const routes = {
  '/': HomeComponent,
  '/about': AboutComponent
}

const SimpleRouter = {
  data: () => ({
    currentRoute: window.location.pathname
  }),

  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || NotFoundComponent
    }
  },

  render() {
    return Vue.h(this.CurrentComponent)
  }
}

Vue.createApp(SimpleRouter).mount('#app')
```

[History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API) と組み合わせることで、とても基本的ですが完全に機能するクライアント側のルータを構築できます。実際に確認するには、[このサンプルアプリ](https://github.com/phanan/vue-3.0-simple-routing-example)をチェックしてみてください。

## サードパーティ製ルータとの統合

[Page.js](https://github.com/visionmedia/page.js) や [Director](https://github.com/flatiron/director) のようなサードパーティ製のルータを使いたい場合は、統合は[同様に簡単](https://github.com/phanan/vue-3.0-simple-routing-example/compare/master...pagejs)です。ここに、Page.js を使った[サンプル](https://github.com/phanan/vue-3.0-simple-routing-example/tree/pagejs)があります。
