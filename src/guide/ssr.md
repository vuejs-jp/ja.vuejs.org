# サーバサイドレンダリング

## 完全な SSR ガイド

私たちは、サーバーでレンダリングされた Vue アプリケーションを作成するためのスタンドアロンのガイドを作成しました。これは、すでにクライアント側の Vue 開発、サーバー側の Node.js 開発そして Webpack に精通している方にとって非常に詳細なガイドです。[こちら](/guide/ssr/introduction.html) を確認してください。

## Nuxt.js

これまでに議論されたすべての側面を適切に構成するプロダクション向けのサーバーレンダリングに対応したアプリケーションの開発は難しい作業です。幸いにも、これをもっと簡単にすることを目指す優れたコミュニティプロジェクト [Nuxt.js](https://nuxtjs.org/) があります。Nuxt.js は、Vue エコシステムの上に構築された高レベルのフレームワークで、ユニバーサル Vue アプリケーションを作成するための非常に合理的な開発エクスペリエンスを提供します。さらに、静的なサイトジェネレータ (単一ファイルの Vue コンポーネントとして作成されたページ) としても使用できます！試してみることを強くお勧めします。

## Quasar Framework SSR + PWA

[Quasar Framework](https://quasar.dev) は、SSR アプリケーション (PWA ハンドオフオプションあり) を生成するフレームワークで、最高クラスのビルドシステム、実用的な環境設定、そして開発者の拡張性を活用して、あなたのアイデアを設計し構築することを簡単にします。100 を超える "Material Design 2.0" に準拠したコンポーネントがあり、どれかひとつをサーバ上で実行できます。これはブラウザでも使用でき、サイト内の `<meta>` タグで管理もできます。 Quasar は Node.js と webpack ベースの開発環境で、SPA、PWA、SSR、Electron、Capacitor、そして Cordova アプリケーション、全て 1 つのコードベースからの迅速な開発を合理化し、加速させます。

## Vite SSR

[Vite](https://vitejs.dev/) is a new breed of frontend build tool that significantly improves the frontend development experience. It consists of two major parts:

- A dev server that serves your source files over native ES modules, with rich built-in features and astonishingly fast Hot Module Replacement (HMR).

- A build command that bundles your code with [Rollup](https://rollupjs.org/), pre-configured to output highly optimized static assets for production.

Vite also provides built-in [support for server-side rendering](https://vitejs.dev/guide/ssr.html). You can find an example project with Vue [here](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue)
