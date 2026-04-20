# CLAUDE.md — Mori-Mori TOKYO

## プロジェクト概要

**Mori-Mori TOKYO**（モリモリトーキョー）の公式サイト。2022年創設の東京拠点アドベンチャーチームのHP。

- コンセプト: "Mori-Mori makes us DOVA-DOVA." ／ "NO ADVENTURE, NO LIFE."
- 活動: アドベンチャーレース・トレイルラン・ウルトラマラソン・謝謝ラン（月1回皇居）
- サイト: https://mori-mori.tokyo

## テックスタック

| 項目 | 内容 |
|---|---|
| フレームワーク | Astro 4.x（静的サイト生成） |
| スタイリング | Tailwind CSS 3.x |
| 言語 | TypeScript |
| パッケージ管理 | Yarn |
| デプロイ | GitHub Pages（GitHub Actions） |
| データ管理 | Google Spreadsheet → GAS → ビルド時フェッチ |

## 開発コマンド

```bash
yarn install     # 依存関係インストール
yarn dev         # ローカルサーバー起動 (localhost:4321)
yarn build       # 本番ビルド → ./dist/
yarn preview     # ビルド結果のプレビュー
```

## アーキテクチャ

```
src/
├── consts.ts          # 全URL・ID・設定の集約（リンクはここのみ管理）
├── types.ts           # Member / Race / SiteData インターフェース
├── pages/
│   └── index.astro    # サイト全体（SPA）。データフェッチ・全セクションを含む
├── components/
│   ├── AboutPoints.astro  # 活動3本柱（静的）
│   ├── MemberCard.astro   # メンバーカード
│   ├── RaceCard.astro     # 次回レースカード
│   └── LogCard.astro      # 過去レース履歴カード
├── layouts/
│   └── Layout.astro   # メタタグ・フォント・GA設定
└── styles/
    └── global.css     # Tailwind directives + グローバルスタイル
```

### データフロー

```
Google Spreadsheet
    ↓ GAS API (src/consts.ts の API_URL)
    ↓ fetch（ビルド時 index.astro の frontmatter）
    ↓ members[] / races[]
    ↓ コンポーネントへ props として渡す
```

- **データ（レース・メンバー）の追加・変更はスプレッドシートで行う**（コード変更不要）
- `show_in_log: "TRUE"` のレースのみ LOG セクションに表示
- 今日以降のレースは NEXT に、過去は LOG に自動振り分け

### デプロイ

- `main` ブランチへのプッシュで自動デプロイ
- GAS からの `update-data` webhook でもビルドが走る（コード変更なしにデータ更新可能）

## デザインシステム

### カラーパレット（Tailwind クラス名）

| クラス | HEX | 用途 |
|---|---|---|
| `bg-dark` | `#050505` | 基本背景 |
| `bg-surface` | `#111111` | セクション背景 |
| `text-neon` / `bg-neon` | `#ccff00` | ハイライト・アクセント |
| `bg-primary` | `#00ff9d` | サブアクセント |
| `bg-accent` | `#ff0055` | ホットピンク |
| `bg-ivy` | `#1F4D34` | チームカラー（アイビーグリーン・コア） |
| `bg-ivyLight` | `#4E8F5D` | チームカラー（ライト） |

### フォント（Tailwind クラス名）

| クラス | フォント | 用途 |
|---|---|---|
| `font-display` | Outfit | 見出し・ナビ・ボタン |
| `font-body` | Inter | 本文（英語） |
| `font-jp` | Zen Kaku Gothic New | 本文（日本語） |
| `font-wild` | Rubik Dirt | デコラティブ見出し（"NO ADVENTURE, NO LIFE."等） |
| `font-serif` | Noto Serif JP | スポンサー等の格式ある表示 |

### デザイン方針

- **基本は黒背景**。白・ネオン・アイビーグリーンでメリハリをつける
- ガラスモーフィズム: `glass` クラス（backdrop-blur + 半透明ボーダー）
- アニメーション: スクロール時の `reveal`（`IntersectionObserver`）、ホバー時のティルト
- 新規コンポーネントは既存の雰囲気（ダーク・ネオン・ボールドタイポ）に合わせる

## 重要な規約

### URL・リンクの管理

**すべてのURLは `src/consts.ts` で一元管理する。** ハードコードしない。

```ts
// 良い例
import { SNS_LINKS } from "../consts";
<a href={SNS_LINKS.INSTAGRAM}>

// 悪い例
<a href="https://www.instagram.com/morimori.tokyo/">
```

### スタイリング

- **Tailwind ユーティリティクラスのみ使用**。インラインスタイルや追加CSSは最終手段
- `global.css` にはグローバルなベーススタイルのみ追加
- コンポーネント内の `<style>` タグはアニメーション等 Tailwind で表現困難な場合のみ

### TypeScript

- データ構造の変更は `src/types.ts` のインターフェースから始める
- `as SiteData` の型アサーションはAPIレスポンスに限定

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

## SNS・外部リンク（参照用）

- Instagram: https://www.instagram.com/morimori.tokyo/
- YouTube: https://www.youtube.com/@morimori_tokyo
- Strava: https://www.strava.com/clubs/1859103
- Shop: https://shop.mori-mori.tokyo/
- スポンサー（中野法律事務所）: consts.ts の `EXTERNAL_LINKS.SPONSOR_NAKANO`

## チームのトーン＆ボイス

サイトのコピー・テキストを変更・追加する際は以下を意識する:

- **エネルギッシュで前向き**（"NO ADVENTURE, NO LIFE"）
- **仲間感・コミュニティ感**（「みんなで分かち合う」）
- **ハードルを下げる**（「まずはお気軽に」「随時メンバー募集」）
- 英語と日本語のミックスは意図的なデザイン選択（変えない）
- 大文字英語（"NEXT", "LOG", "MEMBER"）のセクション名はそのまま維持
