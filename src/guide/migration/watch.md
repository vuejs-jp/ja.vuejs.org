---
title: 配列の監視
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## 概要

- **破壊的変更**: 配列を監視している場合、コールバックは配列が置き換えられたときにのみ実行します。配列の変更で実行する必要がある場合は、 `deep` オプションを指定する必要があります。

## 3.x での構文

[`watch` オプション](/api/options-data.html#watch) を使って配列を監視する場合、コールバックは配列が置き換えられたときにのみ実行します。言い換えれば、 watch コールバックは配列の変更では実行されなくなります。配列の変更で実行するには、 `deep` オプションを指定する必要があります。

```js
watch: {
  bookList: {
    handler(val, oldVal) {
      console.log('book list changed')
    },
    deep: true
  },
}
```

## 移行の戦略

配列の変更を監視することに依存している場合は、`deep` オプションを追加して、コールバックが正しく実行されるようにします。

[移行ビルドのフラグ: `WATCH_ARRAY`](migration-build.html#compat-の設定)
