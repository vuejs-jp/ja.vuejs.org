# プラグイン

大抵の場合、プラグインは Vue にグローバルレベルでの機能を追加するコードで、`install()` メソッドを公開する `object` または `function` です。

プラグインを厳密に定義するスコープはありませんが、プラグインが役立つ一般的なシナリオは以下の通りです。

1. グローバルメソッドまたはグローパルプロパティの追加　例）[vue-custom-element](https://github.com/karol-f/vue-custom-element).

2. ディレクティブ / フィルタ / トランジション のような 1 つ以上のグローバルアセットの追加　例) [vue-touch](https://github.com/vuejs/vue-touch)).

3. グローバル mixin によるコンポーネントオプションの追加　例)  [vue-router](https://github.com/vuejs/vue-router)).

4. `config.globalProperties` にグローバルインスタンスメソッドを追加する

5. 自身の API を提供すると同時に、上記のいくつかの組み合わせを導入するライブラリ 例） [vue-router](https://github.com/vuejs/vue-router)).

## プラグインを書く

独自の Vue.js プラグインの作り方をより理解しやすくするために、`i18n` に対応した文字列を表示するシンプルなバージョンのプラグインを用意しました。

このプラグインがアプリケーションに導入されると、プラグインがオブジェクトの場合、`install` メソッドが呼ばれます。もし `function` のときは `function` そのものが呼ばれます。
いずれの場合においても、Vue の `createapp` から生じる `app` オブジェクトとユーザーから受け取るオプションの2つのパラメータを受け取るでしょう。

それではプラグインオブジェクトの設定を始めましょう。プラグインオブジェクトは別のファイルに作成し、エクスポートすることを推奨します。下記のように、ロジックを含めたまま分離します。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // プラグインのコードをここに書く
  }
}
```

キーを変換する機能をアプリケーション全体で利用可能にするため、`app.config.globalProperties` を使って公開します。

この機能は `key` 文字列を受け取り、ユーザーから与えられたオプションに従って翻訳された文字列を引き当てます。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = key => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, i18n)
    }
  }
}
```

ユーザーがプラグインを利用するとき、`options` パラメーターに翻訳されたキーを含むオブジェクトを渡すと想定します。`$translate` 関数 は `grettings.hello` のような文字列を受け取り、ユーザーから与えられた設定を探し、翻訳された値を返します。- この場合は、`Bonjour!`


Ex:

```js
greetings: {
  hello: 'Bonjour!',
}
```

また、プラグインのユーザーに関数や属性を提供するために、`inject` を使用することもできます。例えば、アプリケーションが翻訳オブジェクトを使用できるようにするための `options` パラメータへのアクセスを許可することができます。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = key => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, i18n)
    }

    app.provide('i18n', options)
  }
}
```

プラグインの利用者は `[‘i18n’]` をコンポーネントに注入し、オブジェクトにアクセスすることができます。

さらに、`app` オブジェクトにアクセスできるため、`mixin` や `directive` など、他のすべての機能をプラグインで利用できます。`createApp` とアプリケーションインスタンスについて更に詳しく学ぶには、[アプリケーション API ドキュメント](/api/application-api.html) をチェックしてください。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.')
        .reduce((o, i) => { if (o) return o[i] }, i18n)
    }

    app.provide('i18n', options)

    app.directive('my-directive', {
      mounted (el, binding, vnode, oldVnode) {
        // 何らかのロジック ...
      }
      ...
    })

    app.mixin({
      created() {
        // 何らかのロジック ...
      }
      ...
    })
  }
}
```

## プラグインを使う

Vue のアプリが `createApp()` で初期化されたあと、`use()` メソッドを使うことであなたのアプリケーションにプラグインを追加することができます。

ここでは[プラグインを書く](#writing-a-plugin)のセクションでデモ用に作成した `i18nPlugin` を使います。

`use()` メソッドは2つのパラメータを引数に取ります。まず、第1引数はインストールするプラグインですが、この場合は `i18nPlugin` です。

また、同じプラグインを複数回使用することを自動的に防止してくれるため、同じプラグインのインストールを複数回実行した場合でも一度だけインストールされます。

第2引数はオプションで、それぞれのプラグインに依存します。デモの `i18nPlugin` の場合は、翻訳された文字列を持つオブジェクトです。

:::info
`Vuex` や `Vue Router` などのサードパーティ製プラグインを使用している場合は、そのプラグインが2番目のパラメータとして何を受け取ることを期待しているのか、必ずドキュメントを確認してください。
:::

```js
import { createApp } from 'vue'
import Root from './App.vue'
import i18nPlugin from './plugins/i18n'

const app = createApp(Root)
const i18nStrings = {
  greetings: {
    hi: 'Hallo!'
  }
}

app.use(i18nPlugin, i18nStrings)
app.mount('#app')
```

コミュニティが貢献したプラグインやライブラリの膨大なコレクションについては [awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) をご覧ください。

