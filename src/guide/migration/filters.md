---
badges:
  - removed
---

# フィルタ <MigrationBadges :badges="$frontmatter.badges" />

## 概要

フィルタは Vue 3.0 で削除され、サポートされません。

## 2.x での構文

2.x で開発者は共通のテキストフォーマットを適用するためにフィルタを使うことができました。

例:

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ accountBalance | currencyUSD }}</p>
</template>

<script>
  export default {
    props: {
      accountBalance: {
        type: Number,
        required: true
      }
    },
    filters: {
      currencyUSD(value) {
        return '$' + value
      }
    }
  }
</script>
```

これは便利に見える一方、括弧の中の式は"ただのJavaScript"になるという前提を崩すカスタム構文が必要であり、学習コストと実装コストの両方がかかります。

## 3.x での更新

3.x ではフィルタは削除され、サポートされません。代わりに、関数の呼び出しか算出プロパティに置き換えることを推奨します。

上記の例を用いて、実装する方法の一例です。

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ accountInUSD }}</p>
</template>

<script>
  export default {
    props: {
      accountBalance: {
        type: Number,
        required: true
      }
    },
    computed: {
      accountInUSD() {
        return '$' + this.accountBalance
      }
    }
  }
</script>
```

## 移行方法

フィルタを使う代わりに、算出プロパティか関数に置き換えることを推奨します。
