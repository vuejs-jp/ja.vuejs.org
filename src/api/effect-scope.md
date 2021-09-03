# エフェクトスコープ API <Badge text="3.2+" />

:::info
エフェクトスコープは、主にライブラリの作成者を対象とした高度な API です。この API を活用する方法の詳細は、対応する [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) を参照してください。
:::

## `effectScope`

エフェクトスコープのオブジェクトを生成します。このオブジェクト内で生成されたリアクティブなエフェクト（例：computed や watcher）を補足して、これらのエフェクトを一緒に処理できるようにします。

**タイピング:**

```ts
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
  run<T>(fn: () => T): T | undefined // スコープが非アクティブの場合は undefined
  stop(): void
}
```

**例:**

```js
const scope = effectScope()

scope.run(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(doubled.value))

  watchEffect(() => console.log('Count: ', doubled.value))
})

//　スコープ内のすべてのエフェクトを破棄する
scope.stop()
```

## `getCurrentScope`

現在アクティブな[エフェクトスコープ](#effectscope)を返します。

**タイピング:**

```ts
function getCurrentScope(): EffectScope | undefined
```

## `onScopeDispose`

現在アクティブな[エフェクトスコープ](#effectscope)を破棄するコールバックを登録します。コールバックは関連するエフェクトスコープが停止したときに呼び出されます。

このメソッドは、各 Vue コンポーネントの `setup()` 関数もエフェクトスコープで呼び出すため、再利用可能に構成された関数の `onUnmounted` の非結合コンポーネントの代替として使用できます。

**タイピング:**

```ts
function onScopeDispose(fn: () => void): void
```
