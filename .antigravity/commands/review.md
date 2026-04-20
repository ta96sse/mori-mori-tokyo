# コードレビューワークフロー

PRのdiffを確認する際のチェックリスト。ベリファイア / レビュアー役として使用。

---

## 事前準備

```bash
# レビュー対象ブランチに切り替え
git fetch origin
git diff main..agent/worker/[ブランチ名] --stat
git diff main..agent/worker/[ブランチ名]
```

---

## レビューチェックリスト

### 1. TypeScript / 型安全性

- [ ] `src/types.ts` の型定義を変更していないか（変更する場合は必要性を確認）
- [ ] 型アサーション（`as Xxx`）はAPIレスポンスのみか
- [ ] `yarn astro check` の結果に型エラーはないか
- [ ] `any` 型を使っていないか

### 2. アーキテクチャ・設計

- [ ] URLのハードコードがないか（`src/consts.ts` 経由になっているか）
- [ ] 新しいURLや外部リンクは `src/consts.ts` に追加されているか
- [ ] コンポーネントの責務が明確か（単一責任）
- [ ] データフローが正しいか（Spreadsheet → GAS → `index.astro` → `props`）

### 3. スタイリング

- [ ] Tailwindユーティリティクラスのみか（インラインスタイルがないか）
- [ ] `global.css` への追加は最低限か（Tailwindで表現できるものは使っているか）
- [ ] デザインシステムのカラーパレット・フォントを使っているか
  - カラー: `bg-dark`, `text-neon`, `bg-primary`, `bg-accent`, `bg-ivy`, `bg-ivyLight`
  - フォント: `font-display`, `font-body`, `font-jp`, `font-wild`, `font-serif`

### 4. コーディング規約

- [ ] コンポーネントは既存の雰囲気に合っているか（ダーク・ネオン・ボールドタイポ）
- [ ] セクション名の大文字英語（NEXT, LOG, MEMBER等）を変更していないか
- [ ] コメントアウトされたコードが残っていないか

### 5. マルチエージェントプロトコル

- [ ] ブランチ命名規則を守っているか（`agent/<ロール>/<スラッグ>`）
- [ ] コミットメッセージに `[agent:worker]` が付いているか
- [ ] mainへの直接コミットがないか
- [ ] 高影響ファイル（consts.ts等）の変更がある場合、ドラフトPRを事前に作成したか

### 6. セキュリティ

- [ ] `.env` ファイルがコミットに含まれていないか
- [ ] シークレット・APIキーがハードコードされていないか
- [ ] 外部へのリクエスト先が想定通りか

---

## レビュー結果フォーマット

```markdown
## コードレビュー結果

**PR**: [PR URL]
**レビュアー**: Antigravity [agent:reviewer]
**ステータス**: ✅ Approved / 🔶 Changes Requested / ❌ Rejected

### 問題なし
- [良かった点]

### 要修正
- [ ] [修正が必要な点1]
- [ ] [修正が必要な点2]

### 提案（任意）
- [より良くできる点]
```

---

## よくある問題パターン

| 問題 | 確認箇所 |
|------|----------|
| ハードコードURL | `grep -r "https://" src/` で検索 |
| インラインスタイル | `grep -r "style=" src/` で検索 |
| npm使用 | `grep -r "npm " .` で検索 |
| any型 | `grep -r ": any" src/` で検索 |
| console.log残り | `grep -r "console.log" src/` で検索 |
