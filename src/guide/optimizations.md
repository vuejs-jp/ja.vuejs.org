# レンダリングのメカニズムと最適化

> このページは Vue の使い方を学ぶために読む必要はありませんが、内部でレンダリングがどのように機能するか興味がある方のために、より多くの情報を提供しています。

## 仮想 DOM

ウォッチャがコンポーネントを更新する方法がわかったので、その変更が最終的に DOM にどのように反映されるのか気になるかもしれません。 もしかすると以前に仮想 DOM について聞いたことがあるかもしれませんが、Vue を含む多くのフレームワークはこのパラダイムを使用して、JavaScript で更新している変更を効果的にインターフェイスに反映させるようにしています。

<div class="reactivecontent">
  <iframe height="500" style="width: 100%;" scrolling="no" title="How does the Virtual DOM work?" src="https://codepen.io/sdras/embed/RwwQapa?height=500&theme-id=light&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/sdras/pen/RwwQapa'>How does the Virtual DOM work?</a> by Sarah Drasner
    (<a href='https://codepen.io/sdras'>@sdras</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>
</div>

仮想 DOM と呼ばれる DOM のコピーを JavaScript で作成しています。これは、JavaScript で DOM を操作すると計算コストがかかるためです。JavaScript で更新を行うコストはあまりかかりませんが、必要な DOM ノードを見つけて更新するのはコストがかかります。そこで呼び出しをバッチ処理し、DOM を一度に変更します。

仮想 DOM は、描画 (render) 関数によって作成される軽量な JavaScript オブジェクトです。この関数は要素、データ・props・attrs などを含むオブジェクト、そして配列の 3 つの引数をとります。配列にはこれらすべての引数を持つ子要素が渡され、完全なツリーを構築するまで子要素を持つことができます。

リストの項目を更新する必要がある場合は、先ほど説明したリアクティブを使用して JavaScript で更新します。次に JavaScript によるコピーである仮想 DOM にすべての変更を加え、これと実際の DOM と比較します。そして、変更された部分だけを更新します。仮想 DOM を使うことで、UI を効率的に更新できます！
