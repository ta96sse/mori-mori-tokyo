# AGENTS.md — Mori-Mori TOKYO

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

**パッケージマネージャーは `yarn` のみ。** `npm install` や `npx` は CI の `--frozen-lockfile` を破壊するため禁止。

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

→ `src/types.ts` を参照。主要なインターフェース:
- **Member** — メンバー情報（番号・名前・SNS・経歴）
- **Race** — レース情報（タイトル・カテゴリ・日付・場所・結果）
- **SiteData** — APIレスポンス全体（members + races）

型定義の変更は高影響。必ず `yarn astro check` で全コンポーネントの整合性を確認すること。

---

## デザインシステム

カラーコード・フォント定義の正は `tailwind.config.mjs` を参照。

### カスタムカラートークン

| トークン | 用途 |
|---------|------|
| `neon` | ハイライト・スクロールバーホバー |
| `primary` | セカンダリアクセント |
| `accent` | ホットピンクアクセント |
| `dark` | ページ背景 |
| `surface` | カード背景 |
| `ivy` | グラデーション起点（チームカラー） |
| `ivyLight` | ホバー・ボーダー・カテゴリタグ |

### カスタムフォントトークン

| トークン | 用途 |
|---------|------|
| `display` | 見出し・数字・ナビ・ボタン |
| `body` | 本文（英語） |
| `jp` | 日本語テキスト |
| `wild` | デコラティブ表示（"NO ADVENTURE, NO LIFE."等） |
| `serif` | 日本語長文・格式ある表示 |

### カスタムユーティリティ（global.css）

- `.text-stroke` — アウトラインテキスト
- `.glass` — フロストガラスカード

---

## コンポーネントパターン

### Propsの書き方

すべてのコンポーネントはフロントマター内に型付きの `Props` インターフェースを定義する。

```astro
---
interface Props { member: Member; index: number; }
const { member, index } = Astro.props;
---
```

### RaceCard のカテゴリカラー

`RaceCard.astro` は `race.category`（小文字化）を Tailwind クラス文字列にマッピングしている。
新カテゴリを追加する場合は `getClasses()` 関数を更新すること。
**Tailwind は動的クラスを検出できないため、テンプレートリテラルでクラスを構築してはいけない。**

```astro
// NG: Tailwind が認識できない
const cls = `text-${color}-400`

// OK: 完全なクラス文字列を使う
const cls = "text-ivyLight"
```

### スクロール表示アニメーション

コンポーネントは `class="reveal"` と `data-delay={index * 100}` でずれたタイミングで入場アニメーションする。
このロジックは `index.astro` の `<script>` ブロックで実装されている。

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

## トーン＆ボイス

サイトのコピー・テキストを追加・変更する際は以下を意識する：

- **エネルギッシュで前向き**（"NO ADVENTURE, NO LIFE"）
- **仲間感・コミュニティ感**（「みんなで分かち合う」）
- **ハードルを下げる**（「まずはお気軽に」「随時メンバー募集」）
- 英語と日本語のミックスは意図的なデザイン選択（変えない）
- セクション名の大文字英語（"NEXT", "LOG", "MEMBER"）はそのまま維持

---

## SNS・外部リンク

→ `src/consts.ts` の `SNS_LINKS` / `EXTERNAL_LINKS` を参照。
URLを追加・変更する場合は必ず `consts.ts` で行う。テンプレート内にハードコードしない。

---

## デプロイ

- `main` ブランチへのプッシュで自動ビルド + GitHub Pages デプロイ
- 依存関係を追加した場合は `yarn.lock` もコミットに含める（CI が `--frozen-lockfile` を使用）

---

## 高影響ファイル（排他制御が必要）

以下のファイルは全コンポーネントに影響するため、**複数エージェントによる同時編集を禁止**する。

| ファイル | 影響範囲 |
|---------|----------|
| `src/consts.ts` | API URL・SNSリンク・GTM ID |
| `src/types.ts` | 全コンポーネントで使うTypeScript型定義 |
| `tailwind.config.mjs` | 全スタイルに使うデザイントークン |
| `astro.config.mjs` | ビルド設定全体 |

変更前にドラフトPRを作成して周知する。他のエージェントが同ファイルを含むPRを開いている間は編集しない。

---

## マルチエージェント協調

### ロール定義

| ロール | 責務 |
|--------|------|
| オーケストレーター | タスク分解・委任・結果統合 |
| ワーカー | 機能実装・コード変更 |
| レビュアー | 品質確認・フィードバック |
| ベリファイア | 型チェック・ビルド確認 |

ロールは固定ではない。1つのエージェントが複数のロールを担うこともある。

### ブランチ命名規則

```
agent/<ロール>/<タスクスラッグ>
```

例: `agent/worker/add-member-card`, `agent/orchestrator/release-2026-q2`

### コミットメッセージ規則

```
<type>(<scope>): <説明（日本語）> [agent:<ロール>]
```

type は英語（`feat` `fix` `refactor` `docs` `chore`）、説明は**日本語**で書く。

例: `feat(member): メンバーカードにSNSリンクを追加 [agent:worker]`

### タスク委任フォーマット

```json
{
  "task_id": "YYYYMMDD-タスクスラッグ",
  "role": "worker | reviewer | verifier",
  "input": {
    "description": "タスクの説明",
    "target_files": ["src/components/Example.astro"],
    "constraints": ["yarn astro check を通すこと"],
    "context_files": ["AGENTS.md", "src/types.ts"]
  },
  "output_format": {
    "type": "git_branch",
    "branch": "agent/worker/YYYYMMDD-タスクスラッグ"
  }
}
```

### PRハンドオフノート

```markdown
## ハンドオフノート
- 完了エージェント: [ロール]
- 完了内容: [やったこと]
- 残タスク: [次のエージェントがやること]
- 注意事項: [引き継ぎ時の注意点]
```

---

## 禁止事項

- `--force` / `-f` オプションを使ったプッシュ
- `npm install` / `npx` の使用（`yarn` のみ）
- `yarn dev` の並列起動（ポート4321が競合する）
- 他エージェントが担当するブランチへのコミット
- `.env` ファイルのコミット
- シークレット・APIキーのソースコードへのハードコード
- Tailwind の動的クラス生成（テンプレートリテラルでクラス名を構築しない）

## 技術的制約

- **ビルドはSSG** — サーバーランタイムなし。すべてのデータ取得はフロントマター（ビルド時）で行う
- **`yarn.lock` は必ずコミットする** — CI が `--frozen-lockfile` を使用
