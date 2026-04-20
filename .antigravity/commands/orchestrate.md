# オーケストレーション実行テンプレート

このテンプレートを使い、複雑なタスクをマルチエージェントで実行します。

---

## STEP 1: タスク受領・ヒアリング

```
受領した要件:
- [ ] 何を作る / 変更するか明確か？
- [ ] 影響範囲（ファイル・コンポーネント）は把握済みか？
- [ ] デザインの方針は決まっているか？
- [ ] 完了条件（Definition of Done）は何か？
```

不明点がある場合はユーザーに確認してから次のステップへ進む。

---

## STEP 2: タスク分解

以下の観点でサブタスクに分解する:

```
タスク名: [タスク名]
タスクID: [YYYYMMDD-スラッグ]

サブタスク:
1. [コード実装] → Claude Code（ワーカー）へ委任
2. [スタイル調整] → Claude Code（ワーカー）へ委任  
3. [表示確認] → Antigravity（自分）が担当
4. [型チェック] → Claude Code（ベリファイア）へ委任
5. [ドキュメント更新] → Antigravity（自分）が担当

高影響ファイルの変更:
- [ ] src/consts.ts → ドラフトPR先に作成
- [ ] src/types.ts → ドラフトPR先に作成
- [ ] tailwind.config.mjs → ドラフトPR先に作成
- [ ] astro.config.mjs → ドラフトPR先に作成
```

---

## STEP 3: 依存関係の整理

```
実行順序:
[タスク1] → [タスク2] → [タスク3（タスク1,2完了後）]
[タスク4] ← 独立（並列実行可）
```

並列実行できるタスクは同時に委任する。
依存関係があるタスクは順番を守る。

---

## STEP 4: ブランチ作成（オーケストレーター分）

```bash
# オーケストレーターブランチ（私のブランチ）
git checkout -b agent/orchestrator/[タスクスラッグ]
```

委任先のブランチ命名:
- Claude Codeワーカー: `agent/worker/[タスクスラッグ]`
- Claude Codeベリファイア: `agent/verifier/[タスクスラッグ]`

---

## STEP 5: 委任実行

各サブタスクを `.antigravity/commands/delegate.md` のフォーマットで委任。

委任ログを残す（どのサブタスクをいつ誰に委任したか）:
```
委任ログ:
- [YYYY-MM-DD HH:mm] タスク1 → Claude Code / ブランチ: agent/worker/[スラッグ]
- [YYYY-MM-DD HH:mm] タスク4 → Claude Code / ブランチ: agent/worker/[スラッグ]-verify
```

---

## STEP 6: 結果統合

各ワーカーの完了後:
1. PRを確認（`review.md` テンプレート使用）
2. 表示確認（`visual-check.md` テンプレート使用）
3. 問題なければPRをユーザーに提示してマージ依頼
4. マージ後、オーケストレーターブランチで完了コミット

```
feat([scope]): [タスク名]を実装 [agent:orchestrator]

## 変更概要
- [変更点1]
- [変更点2]

## 委任したサブタスク
- worker: [PR URL or ブランチ名]

## ハンドオフノート
- 完了エージェント: orchestrator (Antigravity)
- 完了内容: [やったこと]
- 残タスク: なし
- 注意事項: [あれば]
```
