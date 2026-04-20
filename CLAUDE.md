# CLAUDE.md — Mori-Mori TOKYO

東京を拠点とするアドベンチャーチーム「Mori-Mori TOKYO」の公式ウェブサイト。  
コンセプト: **"Mori-Mori makes us DOVA-DOVA."** / "NO ADVENTURE, NO LIFE."  
活動: アドベンチャーレース・トレイルラン・ウルトラマラソン・謝謝ラン（月1回皇居）  
公開URL: https://mori-mori.tokyo  
技術スタック: Astro 4.16.0 · TypeScript 5.6.3 · Tailwind CSS 3.4.1 · Yarn

---

## 基本コマンド

| コマンド | 用途 |
|----------|------|
| `yarn dev` | 開発サーバー起動（http://localhost:4321） |
| `yarn build` | 本番ビルド（`./dist/` に出力） |
| `yarn preview` | ビルド済み `./dist/` をローカルで確認 |
| `yarn astro check` | TypeScript型チェック（`.astro` ファイル含む） |

**重要：** パッケージマネージャーは `yarn` のみ使用。`npm install` や `npx` は CI の `--frozen-lockfile` を破壊するため禁止。

---

## アーキテクチャ

```
src/
├── pages/
│   └── index.astro         # エントリーポイント。ビルド時にAPIからデータ取得
├── layouts/
│   └── Layout.astro        # HTMLシェル（GTM・OGP・フォント・CSPメタ）
├── components/
│   ├── MemberCard.astro    # メンバー1名分の表示（番号・役割・名前・SNSリンク）
│   ├── RaceCard.astro      # 開催予定レースカード（カテゴリ別カラーコーディング）
│   ├── LogCard.astro       # 過去レースのコンパクトカード（ログ/アーカイブ用）
│   └── AboutPoints.astro   # チーム紹介の固定テキスト（propsなし）
├── consts.ts               # API_URL・GTM_ID・SNS_LINKS・EXTERNAL_LINKS・WIDGETS
├── types.ts                # TypeScript型定義: Member・Race・SiteData
├── styles/global.css       # Tailwindベース + カスタムユーティリティ
└── env.d.ts                # Astro型参照
```

`public/` には静的アセット（ロゴ・ヒーロー画像・ファビコン・CNAME・sitemap・robots.txt）を格納。

---

## データフロー

```
Google スプレッドシート
        │（GASがシートを読み取りJSONを返す）
        ▼
Google Apps Script Webアプリ  ←── src/consts.ts の API_URL
        │（ビルド時に index.astro フロントマターで fetch()）
        ▼
SiteData { members: Member[], races: Race[] }
        │（index.astro でフィルタ・ソート・日付計算）
        ▼
MemberCard / RaceCard / LogCard コンポーネント
        ▼
静的HTML ./dist/  ───────────────── GitHub Pages にデプロイ
```

- データは **ビルド時のみ取得**（クライアントサイドのフェッチなし）
- コードをプッシュせずにデータだけ更新する場合、GASスクリプトが `repository_dispatch`（`update-data`）イベントを GitHub Actions に送信してビルドをトリガーする

---

## TypeScript 型定義

```typescript
// src/types.ts

interface Member {
    number: string;       // 背番号（例: "01"）
    role: string;         // 役割（例: "Captain"）
    name: string;
    instagram?: string;   // 完全URL
    strava?: string;      // 完全URL
    desc: string;         // 短い自己紹介
    background: string;   // 競技経歴
}

interface Race {
    title: string;
    category: string;     // "Adventure Race" | "Trail Running" | "Orienteering" など
    location: string;
    start_date: string;   // "2026/02/21" 形式
    end_date?: string;
    url?: string;
    instagram?: string;
    facebook?: string;
    members?: string;     // カンマ区切りの名前（例: "Takuro, Hiroki"）
    result?: string;
    show_in_log: string;  // "TRUE" | "FALSE"（スプレッドシートから文字列で取得）

    // index.astro で計算・付加するフィールド（APIからは来ない）
    date?: string;        // 表示用日付文字列
    _startDate?: string;
    _endDate?: string;
}

interface SiteData {
    members: Member[];
    races: Race[];
}
```

---

## デザインシステム

### カスタムカラー（tailwind.config.mjs）

| トークン | カラーコード | 用途 |
|---------|-------------|------|
| `neon` | `#ccff00` | ハイライト・スクロールバーホバー |
| `primary` | `#00ff9d` | セカンダリアクセント（ネオングリーン） |
| `accent` | `#ff0055` | ホットピンクアクセント |
| `dark` | `#050505` | ページ背景 |
| `surface` | `#111111` | カード背景 |
| `ivy` | `#1F4D34` | グラデーション起点（チームカラー） |
| `ivyLight` | `#4E8F5D` | ホバー・ボーダー・カテゴリタグ |

### カスタムフォント

| トークン | フォントファミリー | 用途 |
|---------|-----------------|------|
| `display` | Outfit | 見出し・数字・ナビ・ボタン |
| `body` | Inter | 本文（英語） |
| `jp` | Zen Kaku Gothic New | 日本語テキスト |
| `wild` | Rubik Dirt | デコラティブ表示（"NO ADVENTURE, NO LIFE."等） |
| `serif` | Noto Serif JP | 日本語長文・スポンサー等の格式ある表示 |

### カスタムユーティリティ（global.css）

- `.text-stroke` — アウトラインテキスト（白ストローク・透明塗り）
- `.glass` — フロストガラスカード（`rgba(255,255,255,0.05)` 背景 + ぼかし + 半透明ボーダー）

---

## コンポーネントパターン

### Propsの書き方

すべてのコンポーネントはフロントマター内に型付きの `Props` インターフェースを定義します。

```astro
---
interface Props { member: Member; index: number; }
const { member, index } = Astro.props;
---
```

### RaceCard のカテゴリカラー

`RaceCard.astro` は `race.category`（小文字化）を Tailwind クラス文字列にマッピングしています。
新カテゴリを追加する場合は `getClasses()` 関数を更新してください。
**Tailwind は動的クラスを検出できないため、テンプレートリテラルでクラスを構築してはいけません。**

```astro
// NG: Tailwind が認識できない
const cls = `text-${color}-400`

// OK: 完全なクラス文字列を使う
const cls = "text-ivyLight"
```

### スクロール表示アニメーション

コンポーネントは `class="reveal"` と `data-delay={index * 100}` でずれたタイミングで入場アニメーションします。
このロジックは `index.astro` の `<script>` ブロックで実装されています。

### 新規コンポーネント作成チェックリスト

1. `src/components/YourComponent.astro` を作成
2. フロントマターに型付きの `Props` インターフェースを記述
3. `src/pages/index.astro` でインポートして使用
4. `yarn astro check` で型エラーがないことを確認

---

## コンテンツ変更の判断基準

| 変更内容 | 対応場所 |
|---|---|
| レース追加・変更 | Google Spreadsheet |
| メンバー情報更新 | Google Spreadsheet |
| SNS・外部リンク変更 | `src/consts.ts` |
| 活動3本柱のテキスト | `src/components/AboutPoints.astro` |
| Aboutセクションの文章 | `src/pages/index.astro` |
| カラー・フォント変更 | `tailwind.config.mjs` |
| OGP・メタ情報 | `src/layouts/Layout.astro` |
| 新セクション追加 | `src/pages/index.astro` にセクション追加 |

**URLは全て `src/consts.ts` で一元管理する。テンプレート内にハードコードしない。**

---

## チームのトーン＆ボイス

サイトのコピー・テキストを追加・変更する際は以下を意識する：

- **エネルギッシュで前向き**（"NO ADVENTURE, NO LIFE"）
- **仲間感・コミュニティ感**（「みんなで分かち合う」）
- **ハードルを下げる**（「まずはお気軽に」「随時メンバー募集」）
- 英語と日本語のミックスは意図的なデザイン選択（変えない）
- セクション名の大文字英語（"NEXT", "LOG", "MEMBER"）はそのまま維持

---

## SNS・外部リンク（参照用）

| 用途 | 定数キー | URL |
|------|---------|-----|
| Instagram | `SNS_LINKS.INSTAGRAM` | https://www.instagram.com/morimori.tokyo/ |
| YouTube | `SNS_LINKS.YOUTUBE` | https://www.youtube.com/@morimori_tokyo |
| Strava | `SNS_LINKS.STRAVA` | https://www.strava.com/clubs/1859103 |
| Shop | `EXTERNAL_LINKS.SHOP` | https://shop.mori-mori.tokyo/ |
| スポンサー | `EXTERNAL_LINKS.SPONSOR_NAKANO` | consts.ts 参照 |

---

## デプロイ

- `main` ブランチへのプッシュで自動ビルド + GitHub Pages デプロイが実行される
- **`main` への直接プッシュは禁止** — 本番環境への影響があるため、必ずfeatureブランチ + PRを使う
- 依存関係を追加した場合は `yarn.lock` もコミットに含める（CI が `--frozen-lockfile` を使用するため）

---

## 制約事項

1. **シークレットをソースに書かない** — `API_URL`（`consts.ts`）は公開GAS URLなので問題ないが、実際のシークレットは `.env`（gitignore済み）に書く
2. **`main` への直接プッシュ禁止** — featureブランチ + PRのフローを守る
3. **`npm` コマンド禁止** — `npm install` は `package-lock.json` を生成し CI の `yarn install --frozen-lockfile` を壊す
4. **Tailwind の動的クラス禁止** — テンプレートリテラルで動的にクラス名を構築しない
5. **ビルドはSSG** — サーバーランタイムなし。すべてのデータ取得はフロントマター（ビルド時）で行う
6. **`yarn.lock` は必ずコミットする** — `.gitignore` に追加しないこと

---

## マルチエージェント協調

複数のAIエージェントがこのリポジトリで並列・階層的に作業する場合のプロトコルは **[AGENTS.md](./AGENTS.md)** を参照してください。
