# VS Code でのデバッグ

あらゆるアプリケーションは、小さなものから大きなものまでエラーを理解する必要がある段階に到達します。このレシピでは、 VS Code ユーザがブラウザでアプリケーションをデバッグするためのワークフローをいくつか紹介します。

このレシピでは、 [Vue CLI](https://github.com/vuejs/vue-cli) アプリケーションをブラウザで実行しながら、 VS Code でデバッグする方法を紹介します。

## 必要なもの

VS Code と好みのブラウザがインストールされていて、対応するデバッガー拡張機能の最新バージョンがインストールされ、有効化されていることを確認してください:

- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
- [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug)

[Vue CLI ガイド](https://cli.vuejs.org/) の説明にしたがって、 [vue-cli](https://github.com/vuejs/vue-cli) をインストールしてプロジェクトを作成します。新しく作成したアプリケーションのディレクトリに移動して、 VS Code を開きます。

### ブラウザにソースコードを表示

VS Code で Vue コンポーネントをデバッグできるようにする前に、生成された Webpack の設定を更新してソースマップをビルドする必要があります。これはデバッガが圧縮ファイルの中のコードを、元のファイルの位置に一致させる方法を持つためです。これにより、アセットが Webpack で最適化された後でも、アプリケーションのデバッグが可能になります。

Vue CLI 2 を使っているならば、`config/index.js` 内の `devtool` プロパティを設定、または更新してください:

```json
devtool: 'source-map',
```

使っているのが Vue CLI 3 ならば、`vue.config.js` 内の `devtool` プロパティを設定、または更新してください:

```js
module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
}
```

### VS Code からアプリケーションを起動

::: info
ここではポートを `8080` と仮定します。そうでない場合（例えば `8080` が使われていて、Vue CLI が自動的に別のポートを選択したとき）は、適宜設定を変更してください。
:::

アクティビティバーのデバッグアイコンをクリックして、デバッグ表示に切り替え、歯車アイコンをクリックして launch.json ファイルを設定したら、環境として **Chrome/Firefox: Launch** を選択します。生成された launch.json の内容を対応する設定に置き換えます:

![Add Chrome Configuration](/images/config_add.png)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "type": "firefox",
      "request": "launch",
      "name": "vuejs: firefox",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "pathMappings": [{ "url": "webpack:///src/", "path": "${webRoot}/" }]
    }
  ]
}
```

## ブレークポイントの設定

1.  **src/components/HelloWorld.vue** の `line 90` にある `data` 関数が文字列を返す部分にブレークポイントを設定します。.

![Breakpoint Renderer](/images/breakpoint_set.png)

2.  ルートフォルダでお気に入りのターミナルを開き、Vue CLI を使ってアプリケーションを配信します:

```
npm run serve
```

3.  デバッグ表示に移動して、**'vuejs: chrome/firefox'** の設定を選択したら、F5 キーを押すか、緑色の再生ボタンをクリックします。

4.  ブレークポイントに到達すると、新しいブラウザのインスタンスが `http://localhost:8080` を開きます。

![Breakpoint Hit](/images/breakpoint_hit.png)

## 代替パターン

  ### Vue Devtools

もっと複雑なデバッグの方法もあります。最も一般的で単純な方法は、優れた Vue.js devtools [Chrome 向け](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) と [Firefox 向け](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/) を使うことです。Devtools を使うことのいくつかの利点は、データのプロパティを Live Edit（ライブエディット）して、その変更がすぐに反映されることです。その他の主な利点は、Vuex のタイムトラベルデバッグが可能になることです。

![Devtools Timetravel Debugger](/images/devtools-timetravel.gif)

Vue.js の本番向け・縮小化ビルド（CDN からの標準的なリンクなど）を使っているページでは、Devtools の検知がデフォルトで無効になっているため、Vue ペインが表示されないことに注意してください。縮小されていないバージョンに切り替えた場合は、それを表示するためにページのハード再読み込みが必要になるかもしれません。

### 単純な Debugger の記述

上記の例はすばらしいワークフローを持っています。しかし、[ネイティブの debugger 文](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/debugger) をコードの中で直接使うという別の方法もあります。この方法を選択した場合には、作業が終わったらこの debugger 文を削除することを忘れないようにするのが重要です。

```vue
<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    const hello = 'Hello World!'
    debugger
    this.message = hello
  }
};
</script>
```

## 謝辞

このレシピは、[Kenneth Auchenberg](https://twitter.com/auchenberg) 氏からの寄稿を元にしています。[元の記事](https://github.com/Microsoft/VSCode-recipes/tree/master/vuejs-cli)。
