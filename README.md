# v3.ja.vuejs.org

このサイトは [VuePress](https://vuepress.vuejs.org/) で構築されています。サイトのコンテンツは `src` ディレクトリにあるマークダウンフォーマットで書かれています。

## 執筆する

ドキュメントの執筆とメンテナンスに関するルールや推奨事項について、 [Vue Docs Writing Guide](https://v3.ja.vuejs.org/guide/writing-guide.html) を参照してください。

## 開発する

1. リポジトリをクローンします

```bash
git clone git@github.com:vuejs/docs-next.git
```

2. 依存ファイルをインストールします

```bash
yarn # or npm install
```

3. ローカル開発環境を起動します

```bash
yarn serve # or npm run serve
```

## デプロイする

サイトは `lang-ja` にコミットがあると [Netlify](https://www.netlify.com/) によって自動的にデプロイされます。
