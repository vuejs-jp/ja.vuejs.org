---
badges:
  - breaking
---

# 属性強制の振る舞い <MigrationBadges :badges="$frontmatter.badges" />

::: info Info
これはローレベルな内部 API の変更であり、ほとんどの開発者には影響しません。
:::

## 概要

以下に変更点の概要を示します:

- 列挙された属性の内部概念を削除し、それらの属性を通常の非ブール属性と同じように扱う。
- **破壊的変更**: 値がブール値 `false` の場合に属性を削除しないようになりました。代わりに attr="false" として設定されます。属性を削除するには、`null` か `undefined` を使ってください。

詳しくは、以下をお読みください！

## 2.x での構文

2.x では、`v-bind` の値を強制するために以下のような戦略がありました:

- いくつかの属性/要素のペアでは、Vue は常に対応する IDL 属性（プロパティ）を使用します。: [`<input>`、`<select>`、`<progress>` における `value` など](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L11-L18)

- 「[ブール属性](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L33-L40)」と [xlinks](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L44-L46) については、Vue はそれらが "falsy" ([`undefined`、`null`、`false`](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L52-L54)) の場合には削除し、それ以外の場合には追加します ([ここ](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L66-L77)や[こちら](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L81-L85)を見てください)。

- 「[列挙された属性](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L20)」(現在は `contenteditable`、`draggable`、`spellcheck`)については、Vue はそれらを[強制的に](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L24-L31)文字列にしようとします ([vuejs/vue#9397](https://github.com/vuejs/vue/issues/9397)を修正するために、`contenteditable` については今のところ特別な扱いをしています)。

- 他の属性については、"falsy" な値(`undefined`, `null`, or `false`)は削除し、他の値はそのまま設定します([こちら](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L92-L113)を見てください)。

次の表では、Vue が「列挙された属性」を通常の非ブール属性とは異なる方法で強制する方法を説明しています:

| バインディング式    | `foo` <sup>通常の属性</sup> | `draggable` <sup>列挙された属性</sup> |
| ------------------- | --------------------------- | ------------------------------------- |
| `:attr="null"`      | -                           | `draggable="false"`                   |
| `:attr="undefined"` | -                           | -                                     |
| `:attr="true"`      | `foo="true"`                | `draggable="true"`                    |
| `:attr="false"`     | -                           | `draggable="false"`                   |
| `:attr="0"`         | `foo="0"`                   | `draggable="true"`                    |
| `attr=""`           | `foo=""`                    | `draggable="true"`                    |
| `attr="foo"`        | `foo="foo"`                 | `draggable="true"`                    |
| `attr`              | `foo=""`                    | `draggable="true"`                    |

上の表からわかるように、現在の実装では `true` を `'true'` に強制していますが、`false` の場合は属性を削除しています。これはまた、`aria-selected` や `aria-hidden` といった `aria-*` 属性のような非常に一般的なユースケースでも、ユーザーが手動でブール値を文字列に強制する必要があるなど、一貫性に欠けていました。

## 3.x での構文

この「列挙された属性」という内部概念を捨てて、通常の非ブール HTML 属性として扱うつもりです。

- これは、通常の非ブール属性と「列挙された属性」の間の矛盾を解決します。
- また、`'true'` や `'false'` 以外の値や、`contenteditable` のような属性には、これから定義されるキーワードを使用することも可能になります。

非ブール属性については、Vue は `false` であれば削除はせず、代わりに `'false'` に強制します。

- これにより、`true` と `false` の間の矛盾が解消され、`aria-*` 属性の出力が容易になります。

新しい振る舞いについては、以下の表を参照してください:

| バインディング式    | `foo` <sup>通常の属性</sup> | `draggable` <sup>列挙された属性</sup> |
| ------------------- | --------------------------- | ------------------------------------- |
| `:attr="null"`      | -                           | - <sup>*</sup>                        |
| `:attr="undefined"` | -                           | -                                     |
| `:attr="true"`      | `foo="true"`                | `draggable="true"`                    |
| `:attr="false"`     | `foo="false"` <sup>*</sup>  | `draggable="false"`                   |
| `:attr="0"`         | `foo="0"`                   | `draggable="0"` <sup>*</sup>          |
| `attr=""`           | `foo=""`                    | `draggable=""` <sup>*</sup>           |
| `attr="foo"`        | `foo="foo"`                 | `draggable="foo"` <sup>*</sup>        |
| `attr`              | `foo=""`                    | `draggable=""` <sup>*</sup>           |

<small>*: 変更点</small>

ブール属性への強制はそのままです。

## 移行の戦略

### 列挙された属性

列挙された属性が存在しない場合や `attr="false"` が存在しない場合に、以下のように異なる IDL 属性値(実際の状態を反映した値)が生成されることがあります:

| 列挙された属性の不在 | IDL 属性と値                         |
| -------------------- | ------------------------------------ |
| `contenteditable`    | `contentEditable` &rarr; `'inherit'` |
| `draggable`          | `draggable` &rarr; `false`           |
| `spellcheck`         | `spellcheck` &rarr; `true`           |

3.x では「列挙されたプロパティ」のために `null` を `'false'` に強制しなくなったため、`contenteditable` や `spellcheck` のような場合、2.x と同じ振る舞いを維持するために、開発者は `null` に解決していた `v-bind` 式を `false` に解決するか、`'false'` に変更する必要があります。

2.x では、列挙された属性に対して無効な値を `'true'` に強制的に設定していました。これは通常意図していなかったもので、大規模に利用される可能性は低いと思われます。3.x では、`true` または `'true'` を明示的に指定する必要があります。

### 属性を削除する代わりに `false` を `'false'` に強制する

3.x では、明示的に属性を削除するには `null` または `undefined` を使用しなければなりません。

### 2.x と 3.x 間の振る舞いの比較

<table>
  <thead>
    <tr>
      <th>属性</th>
      <th><code>v-bind</code> 値 <sup>2.x</sup></th>
      <th><code>v-bind</code> 値 <sup>3.x</sup></th>
      <th>HTML 出力</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">2.x “列挙された属性”<br><small>つまり<code>contenteditable</code>、<code>draggable</code>、<code>spellcheck</code></small></td>
      <td><code>undefined</code></td>
      <td><code>undefined</code>, <code>null</code></td>
      <td><i>削除されます</i></td>
    </tr>
    <tr>
      <td>
        <code>true</code>, <code>'true'</code>, <code>''</code>, <code>1</code>,
        <code>'foo'</code>
      </td>
      <td><code>true</code>, <code>'true'</code></td>
      <td><code>"true"</code></td>
    </tr>
    <tr>
      <td><code>null</code>, <code>false</code>, <code>'false'</code></td>
      <td><code>false</code>, <code>'false'</code></td>
      <td><code>"false"</code></td>
    </tr>
    <tr>
      <td rowspan="2">その他の非ブール属性<br><small>例えば
      <code>aria-checked</code>、<code>tabindex</code>、<code>alt</code>など</small></td>
      <td><code>undefined</code>, <code>null</code>, <code>false</code></td>
      <td><code>undefined</code>, <code>null</code></td>
      <td><i>削除されます</i></td>
    </tr>
    <tr>
      <td><code>'false'</code></td>
      <td><code>false</code>, <code>'false'</code></td>
      <td><code>"false"</code></td>
    </tr>
  </tbody>
</table>

[移行ビルドのフラグ:](migration-build.html#compat-の設定)

- `ATTR_FALSE_VALUE`
- `ATTR_ENUMERATED_COERSION`
