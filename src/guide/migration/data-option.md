---
badges:
  - breaking
---

# Data オプション <MigrationBadges :badges="$frontmatter.badges" />

## 概要

`data` コンポーネントオプション宣言はプレーンな JavaScript `object` を受け入れず、`function` 宣言を期待します。

## 2.x での構文

2.x では、`data` オプションは `object` か `function` のどちらか一方で定義できました。

例:

```html
<!-- オブジェクト宣言 -->
<script>
  const app = new Vue({
    data: {
      apiKey: 'a1b2c3'
    }
  })
</script>

<!-- 関数宣言 -->
<script>
  const app = new Vue({
    data() {
      return {
        apiKey: 'a1b2c3'
      }
    }
  })
</script>
```

これは共有状態を持っているルートインスタンスに関してはある程度の利便性をもたらしましたが、ルートインスタンスでのみ可能であるという事実のため混乱を招きました。

## 3.x での更新

3.x では、 `data` オプションは `object` を返す `function` 宣言のみ受け入れるよう標準化されました。

上記を例にすると、コードの可能な実装は1つだけです:

```html
<script>
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        apiKey: 'a1b2c3'
      }
    }
  }).mount('#app')
</script>
```

## 移行の戦略

オブジェクト宣言を利用しているユーザーには以下を推奨します:

- 共有データを外部オブジェクトとして抽出し、それを `data` のプロパティとして使う
- 共有データへの参照、新しい共有オブジェクトを指すようにを書き換える
