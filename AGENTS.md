# マルチエージェント協調プロトコル

このリポジトリは複数のAIエージェントによる **並列実行** および **階層型オーケストレーション** をサポートします。
作業を開始するすべてのエージェントはこのプロトコルに従ってください。

---

## エージェントロール定義

| ロール | 責務 | 入力 | 出力 |
|--------|------|------|------|
| オーケストレーター | タスク分解・委任・結果統合 | 要件定義 | サブタスク仕様 + 統合PR |
| ワーカー | 機能実装・コード変更 | サブタスク仕様 | コード変更 + PR |
| レビュアー | 品質確認・フィードバック | PR / diff | レビューコメント |
| ベリファイア | 型チェック・ビルド確認 | 変更ファイル一覧 | 合否レポート |

ロールは固定ではありません。1つのエージェントが複数のロールを担うこともあります。

---

## 作業パターン

### パターン1：並列実行

複数のエージェントが独立したタスクを同時に処理します。

```
要件
├── エージェントA（ワーカー）── agent/worker/task-a ブランチ
├── エージェントB（ワーカー）── agent/worker/task-b ブランチ
└── エージェントC（ベリファイア）── agent/verifier/check-run ブランチ
```

ルール：
- 各エージェントは必ず独立したブランチを使用する
- 異なるエージェントが同じブランチにコミットしない
- 各エージェントのPRは独立してマージできる粒度に保つ

### パターン2：階層型オーケストレーション

親エージェント（オーケストレーター）がタスクを分解し、子エージェント（ワーカー等）に委任します。
子エージェントは別LLMのAPIを呼び出すことも、同一LLMのサブエージェントでも構いません。

```
オーケストレーター
├── サブタスク1 → ワーカーエージェント（LLM-A）
├── サブタスク2 → ワーカーエージェント（LLM-B）
└── 検証 → ベリファイアエージェント（LLM-C）
```

---

## タスク委任フォーマット

オーケストレーターが子エージェントにタスクを渡す際は以下のJSONを使用します。

```json
{
  "task_id": "一意なID（例: 20260415-add-member-card）",
  "role": "worker | reviewer | verifier",
  "input": {
    "description": "タスクの説明（日本語可）",
    "target_files": ["src/components/MemberCard.astro"],
    "constraints": [
      "yarn astro check を通すこと",
      "型定義（src/types.ts）を変更しないこと"
    ],
    "context_files": ["CLAUDE.md", "src/types.ts", "src/consts.ts"]
  },
  "output_format": {
    "type": "git_branch | json_report | pr_url",
    "branch": "agent/worker/20260415-add-member-card"
  }
}
```

## 結果返却フォーマット

子エージェントが結果をオーケストレーターに返す際は以下のJSONを使用します。

```json
{
  "task_id": "委任時のIDと同一",
  "status": "success | failure | partial",
  "output": {
    "branch": "agent/worker/20260415-add-member-card",
    "pr_url": "https://github.com/ta96sse/mori-mori-tokyo/pull/XX",
    "summary": "変更内容の要約",
    "issues": ["未解決の問題があれば記載"]
  }
}
```

---

## ブランチ命名規則

```
agent/<ロール>/<タスクスラッグ>
```

| ロール | ブランチ例 |
|--------|-----------|
| orchestrator | `agent/orchestrator/release-2026-q2` |
| worker | `agent/worker/add-member-card` |
| reviewer | `agent/reviewer/pr-45` |
| verifier | `agent/verifier/type-check` |

---

## コミットメッセージ規則

```
<type>(<scope>): <説明> [agent:<ロール>]
```

| 項目 | 値の例 |
|------|--------|
| type | `feat` `fix` `refactor` `docs` `chore` |
| scope | `member` `race` `api` `styles` `agents` |
| ロール | `orchestrator` `worker` `reviewer` `verifier` |

例：
```
feat(member): メンバーカードにSNSリンクを追加 [agent:worker]
fix(api): APIフェッチのエラーハンドリングを改善 [agent:worker]
docs(agents): マルチエージェントプロトコルを追加 [agent:orchestrator]
```

---

## 高影響ファイル（排他制御が必要）

以下のファイルは全コンポーネントに影響するため、**複数エージェントによる同時編集を禁止**します。

| ファイル | 影響範囲 |
|---------|----------|
| `src/consts.ts` | API URL・SNSリンク・GTM ID |
| `src/types.ts` | 全コンポーネントで使うTypeScript型定義 |
| `tailwind.config.mjs` | 全スタイルに使うデザイントークン |
| `astro.config.mjs` | ビルド設定全体 |

**プロトコル：** 高影響ファイルを変更する前に、ドラフトPRを作成して他のエージェントに周知する。
他のエージェントが同ファイルを含むPRを開いている間は編集しない。

---

## 禁止事項

- `main` ブランチへの直接プッシュ
- `--force` / `-f` オプションを使ったプッシュ
- `npm install` / `npx` の使用（パッケージマネージャーは `yarn` のみ）
- `yarn dev` の並列起動（ポート4321が競合する）
- 他エージェントが担当するブランチへのコミット
- `.env` ファイルのコミット（シークレット漏洩防止）

---

## PRハンドオフノート

エージェント間で作業を引き継ぐ場合、PRの説明文に以下のセクションを追記します。

```markdown
## ハンドオフノート
- 完了エージェント: [ロール]
- 完了内容: [やったこと]
- 残タスク: [次のエージェントがやること]
- 注意事項: [引き継ぎ時の注意点]
- 次のエージェントへ: [具体的な次のアクション]
```
