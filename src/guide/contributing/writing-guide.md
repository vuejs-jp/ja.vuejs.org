# Vue ドキュメントライティングガイド

ドキュメントを書くことは共感の練習です。私たちは客観的な現実を記述しているわけではありません - それは既にソースコードがやってくれています。私たちの仕事は、ユーザと Vue エコシステムとの関係を形成するための手助けをすることです。この進化し続けるガイドでは、Vue エコシステム内で一貫してドキュメントを作成する方法について、いくつかのルールと推奨事項を紹介しています。

## 原則

- **機能は十分に文書化されていないと存在しません。**
- **ユーザの認知能力（例えば、頭脳）を尊重する。** ユーザが読書を始めるときには、ある程度の限られた頭脳で始めます、そして彼らがそれを使い果たした時、学ぶのをやめます、
  - 認知能力は、複雑な文章、一度に複数の概念を学ばなければならないこと、そしてユーザの仕事に直接関係のない抽象的な例によって、**より早く枯渇します**。
  - 認知能力は、ユーザが一貫して賢く、力強く、好奇心旺盛であると感じさせるように支援すると、**よりゆっくりと枯渇していきます**。物事を消化しやすい断片に分解し、文書の流れに注意を払うことは、この状態を維持するのに役立ちます。
- **常にユーザの立場に立って見ることを心がけましょう。** 私たちは何かを徹底的に理解すると、それが当たり前になってきます。これは _知識の呪い_（_the curse of knowledge_）と呼ばれています。良いドキュメントを書くためには、「この概念を学ぶときに最初に何を知る必要があったか？」を思い出すよう努力しましょう。どんな専門用語を学ぶ必要がありましたか？何を誤解していたでしょうか？理解するのに時間がかかったものは何ですか？優れたドキュメントは、ユーザが読んでいる部分で概念を理解することができます。事前にその概念を実際に人に説明する練習をしておくと良いでしょう、
- **最初に _問題_ を説明し、次に解決策を説明します。** 機能がどのように動作するかを示す前に、なぜその機能が存在するのかを説明することが重要です。そうしないと、その情報がユーザにとって重要なものなのか（自分が経験した問題なのか）、あるいは、それをどのような予備知識、経験と結びつけるのかを知るためのコンテキストを把握することができません。
- **書いている間は、質問することを恐れないようにしましょう。** 相手が "間抜け" であるかもしれないと怖がっている場合は特に、弱みがあるのは辛いことですが、質問することが説明する必要があることを完璧に理解するための唯一方法です、
- **機能の議論に参加しましょう。** 最高の API は、後で説明する方法を考えようとするのではなく、説明しやすい機能を構築するという、ドキュメントドリブンの開発から生まれます。質問（特に、「間抜けな」質問）を早い段階ですることで、互換性のない修正を行う必要が出てくる前に、混乱や矛盾、問題のある動作を明らかにすることができます。

## ドキュメントの構成

- **インストール / 統合**：必要な分だけ異なる種類のプロジェクトにソフトウェアを統合する方法の完全な概要を提供します。
- **イントロダクション / Getting Started**：
  - プロジェクトが解決する問題と存在理由について、概要を 10 分以内に説明してください。
  - プロジェクトが解決する問題とその方法について、いつ、なぜプロジェクトを使用するのか、簡単なコード例を含めて、概要を 30 分以内に説明してください。最後に、"Installation" と "Essentials Guide" の冒頭の両方にリンクしてください。
- **ガイド**：ユーザに賢く、力強く、好奇心を感じさせ、その状態を維持することで、ユーザがさらに学び続けるためのモチベーションと認知能力を維持できるようにします。ガイドページは順番に読まれることを意図しているため、一般的には、必要な労力の比率が高いものから低いものへと順番に進むように並べられるべきです。
  - **Essentials**："Essentials" を読むのに 5 時間はかかりませんが、より短い方が良いでしょう。目標は、ユーザが 80 % のユースケースを処理するのに役立つ 20%の知識を提供することです。Essentials では、より高度なガイドや API にリンクすることはできますが、ほとんどの場合、そのようなリンクは避けるべきです。リンクが提供されている場合、ユーザが初めてドキュメントを読む際にこのリンクに従うべきかを認識できるよう、コンテキストを提供する必要があります。そうしないと、多くのユーザは、リンクを次から次へと飛び、先に進む前に機能のあらゆる側面を完璧に学ぼうとして、認知能力を疲れ果てさせ、結果的に Essentials の最初の一読を終えることができなくなってしまいます。徹底していることよりも、スムーズに読めることが重要であることを忘れないでください。ユーザがイライラするような経験を避けるため、彼らが必要としてる情報を提供したいと考えていますが、ユーザはいつでも戻ってきてさらに読み進めることができますし、一般的ではない問題に遭遇したときにはグーグルで検索することもできます。
  - **Advanced**："Essentials" では全体の 80% までのユースケースに対応できるようになっていますが、その後のガイドでは 95% のユースケースに対応できるようになり、さらに非必須機能（例：トランジション、アニメーション）、より複雑な便利機能（例：mixin、カスタムディレクティブ）、開発者のエクスペリエンス向上（例：JSX、プラグイン）に関するより詳細な情報を提供します。ニッチで複雑なユースケースや濫用されやすいユースケースの最後の 5%は、クックブックと API リファレンスに委ねられます。これらは、Advanced ガイドからリンクされています。
- **リファレンス / API**：Vue の機能の完全なリストを提供します。リストは型情報、それぞれが解決する問題の説明、オプションのすべての組み合わせの例、ガイド、クックブックのレシピ、より詳細な情報を提供する他の内部リソースへのリンクですが含まれます。他のページとは異なり、このページは上から下へ読むことを目的としていないので、多くの詳細情報を提供することができます。また、これらの参考文献は、ガイドよりも簡単に必要な情報をすぐ取得できなければならないので、ガイドのストーリーテリング形式よりも辞書の項目に近い形式になっているはずです。
- **移行**：
  - **バージョン**：重要な変更が行われた場合は、変更の完全なリストを含めると便利です。変更が行われた理由やプロジェクトの移行方法についての詳細な説明を含みます。
  - **他のプロジェクトから**：このソフトウェアは、類似のソフトウェアと比較してどうでしょうか？これは、ユーザが、我々がどのような問題を解決したり作成したりする可能性があるのか、また、すでに持っている知識をどの程度まで移行できるのかを理解するために重要です。
- **スタイルガイド**：開発には、決定を必要とするいくつかの重要な部分がありますが、API のコアではありません。スタイルガイドでは、これらの決定の指針となるよう、教育的で強固な推奨事項を提供しています。やみくもに従うべきではありませんが、細かな部分の調整を行うことで、チームの時間を節約できます。
- **クックブック**：クックブックのレシピは、Vue とそのエコシステムに精通していることを前提に書かれています。それぞれのレシピは、Vue の開発者が遭遇する可能性のある共通の実装の詳細を説明するための、高度に構造化されたドキュメントです。

## ライティング & 文法

### スタイル

- **Headings should describe problems**, not solutions. For example, a less effective heading might be "Using props", because it describes a solution. A better heading might be "Passing Data to Child Components with Props", because it provides the context of the problem props solve. Users won't really start paying attention to the explanation of a feature until they have some idea of why/when they'd use it.
- **When you assume knowledge, declare it** at the beginning and link to resources for less common knowledge that you're expecting.
- **Introduce only one new concept at a time whenever possible** (including both text and code examples). Even if many people are able to understand when you introduce more than one, there are also many who will become lost - and even those who don't become lost will have depleted more of their cognitive capacity.
- **Avoid special content blocks for tips and caveats when possible.** It's generally preferable to blend these more naturally into the main content, e.g. by building on examples to demonstrate an edge case.
- **Don't include more than two interwoven tips and caveats per page.** If you find that more than two tips are needed in a page, consider adding a caveats section to address these issues. The guide is meant to be read straight through, and tips and caveats can be overwhelming or distracting to someone trying to understand the base concepts.
- **Avoid appeals to authority** (e.g. "you should do X, because that's a best practice" or "X is best because it gives you full separation of concerns"). Instead, demonstrate with examples the specific human problems caused and/or solved by a pattern.
- **When deciding what to teach first, think of what knowledge will provide the best power/effort ratio.** That means teaching whatever will help users solve the greatest pains or greatest number of problems, with the relatively least effort to learn. This helps learners feel smart, powerful, and curious, so their cognitive capacity will drain more slowly.
- **Unless the context assumes a string template or build system, only write code that works in any environment by the software (e.g. Vue, Vuex, etc).**
- **Show, don't tell.** For example, "To use Vue on a page, you can add this to your HTML" (then show the script tag), instead of "To use Vue on a page, you can add a script element with a src attribute, the value of which should be a link to Vue's compiled source".
- **Almost always avoid humor (for English docs)**, especially sarcasm and pop culture references, as it doesn't translate well across cultures.
- **Never assume a more advanced context than you have to.**
- **In most cases, prefer links between sections of the docs over repeating the same content in multiple sections.** Some repetition in content is unavoidable and even essential for learning. However, too much repetition also makes the docs more difficult to maintain, because a change in the API will require changes in many places and it's easy to miss something. This is a difficult balance to strike.
- **Specific is better than generic.** For example, a `<BlogPost>` component example is better than `<ComponentA>`.
- **Relatable is better than obscure.** For example, a `<BlogPost>` component example is better than `<CurrencyExchangeSettings>`.
- **Be emotionally relevant.** Explanations and examples that relate to something people have experience with and care about will always be more effective.
- **Always prefer simpler, plainer language over complex or jargony language.** For example:
  - "you can use Vue with a script element" instead of "in order to initiate the usage of Vue, one possible option is to actually inject it via a script HTML element"
  - "function that returns a function" instead of "higher order function"
- **Avoid language that invalidate struggle**, such as "easy", "just", "obviously", etc. For reference, see [Words To Avoid in Educational Writing](https://css-tricks.com/words-avoid-educational-writing/).

### 文法

- **Avoid abbreviations** in writing and code examples (e.g. `attribute` is better than `attr`, `message` is better than `msg`), unless you are specifically referencing an abbreviation in an API (e.g. `$attrs`). Abbreviation symbols included on standard keyboards (e.g. `@`, `#`, `&`) are OK.
- **When referencing a directly following example, use a colon (`:`) to end a sentence**, rather than a period (`.`).
- **Use the Oxford comma** (e.g. "a, b, and c" instead of "a, b and c"). ![Why the Oxford comma is important](https://raw.githubusercontent.com/vuejs/vuejs.org/master/src/images/oxford-comma.jpg)
  - Source: [The Serial (Oxford) Comma: When and Why To Use It](https://www.inkonhand.com/2015/10/the-serial-oxford-comma-when-and-why-to-use-it/)
- **When referencing the name of a project, use the name that project refers to itself as.** For example, "webpack" and "npm" should both use lowercase as that's how their documentation refers to them.
- **Use Title Case for headings** - at least for now, since it's what we use through the rest of the docs. There's research suggesting that sentence case (only first word of the heading starts with a capital) is actually superior for legibility and also reduces the cognitive overhead for documentation writers, since they don't have to try to remember whether to capitalize words like "and", "with", and "about".
- **Don't use emojis (except in discussions).** Emojis are cute and friendly, but they can be a distraction in documentation and some emoji even convey different meanings in different cultures.

## イテレーション & コミュニケーション

- **Excellence comes from iteration.** First drafts are always bad, but writing them is a vital part of the process. It's extremely difficult to avoid the slow progression of Bad -> OK -> Good -> Great -> Inspiring -> Transcendent.
- **Only wait until something is "Good" before publishing.** The community will help you push it further down the chain.
- **Try not to get defensive when receiving feedback.** Our writing can be very personal to us, but if we get upset with the people who help us make it better, they will either stop giving feedback or start limiting the kind of feedback they give.
- **Proof-read your own work before showing it to others.** If you show someone work with a lot of spelling/grammar mistakes, you'll get feedback about spelling grammar/mistakes instead of more valuable notes about whether the writing is achieving your goals.
- **When you ask people for feedback, tell reviewers what:**
  - **you're trying to do**
  - **your fears are**
  - **balances you're trying to strike**
- **When someone reports a problem, there is almost always a problem**, even if the solution they proposed isn't quite right. Keep asking follow-up questions to learn more.
- People need to feel safe asking questions when contributing/reviewing content. Here's how you can do that:
  - **Thank people for their contributions/reviews, even if you're feeling grumpy.** For example:
    - "Great question!"
    - "Thanks for taking the time to explain. 🙂"
    - "This is actually intentional, but thanks for taking the time to contribute. 😊"
  - **Listen to what people are saying and mirror if you're not sure you're understanding correctly.** This can help validate people's feelings and experiences, while also understanding if _you're_ understanding _them_ correctly.
  - **Use a lot of positive and empathetic emojis.** It's always better to seem a little strange than mean or impatient.
  - **Kindly communicate rules/boundaries.** If someone behaves in a way that's abusive/inappropriate, respond only with kindness and maturity, but also make it clear that this behavior is not acceptable and what will happen (according to the code of conduct) if they continue behaving poorly.

### Tips, Callouts, Alerts, and Line Highlights

We have some dedicated styles to denote something that's worth highlighting in a particular way. These are captured [on this page](https://v3.vuejs.org/guide/doc-style-guide.html#alerts). **They are to be used sparingly.**

There is a certain temptation to abuse these styles, as one can simply add a change inside a callout. However, this breaks up the flow of reading for the user, and thus, should only be used in special circumstances. Wherever possible, we should attempt to create a narrative and flow within the page to respect the readers cognitive load.

Under no circumstances should 2 alerts be used next to one another, it's a sign that we're not able to explain context well enough.

### コントリビュート

We appreciate small, focused PRs. If you'd like to make an extremely large change, please communicate with team members prior to a pull request. Here's a [writeup that details why this is so critical](https://www.netlify.com/blog/2020/03/31/how-to-scope-down-prs/) for us to work well on this team. Please understand that though we always appreciate contributions, ultimately we have to prioritize what works best for the project as a whole.

## リソース

### ソフトウェア

- [Grammarly](https://www.grammarly.com/): スペルと文法をチェックするためのデスクトップアプリとブラウザ拡張機能（ただし、文法チェックは全てをキャッチできるわけではなく、たまに誤検出が出ることがあります）。
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker): マークダウンやサンプルコードのスペルチェックに役立つ VS Code の拡張機能。

### 本

- [On Writing Well](https://www.amazon.com/Writing-Well-30th-Anniversary-Nonfiction-ebook/dp/B0090RVGW0)（[人気の名言](https://www.goodreads.com/work/quotes/1139032-on-writing-well-the-classic-guide-to-writing-nonfiction)を見る）
- [Bird by Bird](https://www.amazon.com/Bird-Some-Instructions-Writing-Life/dp/0385480016)（[人気の名言](https://www.goodreads.com/work/quotes/841198-bird-by-bird-some-instructions-on-writing-and-life)見る）
- [Cognitive Load Theory](https://www.amazon.com/Cognitive-Explorations-Instructional-Performance-Technologies/dp/144198125X/)
