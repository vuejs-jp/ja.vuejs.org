---
title: プロパティのデフォルト値ファクトリ関数の `this` アクセス
badges:
  - breaking
---

# プロパティのデフォルト値ファクトリ関数の `this` アクセス <MigrationBadges :badges="$frontmatter.badges" />

プロパティのデフォルト値ファクトリ関数が `this` にアクセスできなくなりました。

代わりの方法は以下です。

- コンポーネントが受け取った生のプロパティは、引数としてデフォルト関数に渡されます。

- [inject](../composition-api-provide-inject.md) API がデフォルト関数の内部で使用できます。

```js
import { inject } from 'vue'

export default {
  props: {
    theme: {
      default (props) {
        // `props` 引数はコンポーネントに渡される生の値で、
        // 型やデフォルトの強制より前のものです。
        // また、`inject` を使用して注入されたプロパティにアクセスすることもできます。
        return inject('theme', 'default-theme')
      }
    }
  }
}
```

## 移行の戦略

[移行ビルドのフラグ: `PROPS_DEFAULT_THIS`](migration-build.html#compat-の設定)
