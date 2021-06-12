# ベースコンポーネントの自動グローバル登録

## 基本的な例

多くのコンポーネントは割と一般的なもので、あるいは入力やボタンをラップするだけのものかもしれません。わたしたちは、このようなコンポーネントを [ベースコンポーネント](../style-guide/#base-component-names-strongly-recommended) と呼ぶことがあって、コンポーネント全体に渡ってとても頻繁に使われる傾向があります。


その結果、多くのコンポーネントはベースコンポーネントの長いリストに含まれていることがあります:

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'
export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

テンプレート内の比較的小さなマークアップをサポートするためだけのものです:

```html
<BaseInput v-model="searchText" @keydown.enter="search" />
<BaseButton @click="search">
  <BaseIcon name="search" />
</BaseButton>
```

幸いなことに、webpack（または [Vue CLI](https://github.com/vuejs/vue-cli)、これは内部的に webpack を使っています）を使う場合、これらのとても汎用的なベースコンポーネントだけをグローバルに登録するのに `require.context` を使うことができます。このコード例は、アプリケーションのエントリファイル（例えば `src/main.js`）でベースコンポーネントをグローバルにインポートするのに使えるでしょう:

```js
import { createApp } from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import App from './App.vue'

const app = createApp(App)

const requireComponent = require.context(
  // コンポーネントフォルダの相対パス
  './components',
  // サブフォルダ内を探すかどうか
  false,
  // ベースコンポーネントのファイル名とマッチさせるための正規表現
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // コンポーネント設定の取得
  const componentConfig = requireComponent(fileName)

  // コンポーネントのパスカルケースでの名前を取得
  const componentName = upperFirst(
    camelCase(
      // フォルダの深さに関わらずファイル名を取得
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  app.component(
    componentName,
    // `.default` にあるコンポーネントのオプションを探す。
    // コンポーネントが `export default` でエクスポートされていれば存在して、
    // そうでなければモジュールのルートのフォールバックする。
    componentConfig.default || componentConfig
  )
})

app.mount('#app')
```
