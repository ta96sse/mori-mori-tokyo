# Claude Codeへの委任テンプレート

Claude Code（ワーカー / ベリファイア）へタスクを委任する際のフォーマット。

---

## 委任JSON（AGENTS.md 準拠）

以下のJSONを生成してClaude Codeのセッションに渡す:

```json
{
  "task_id": "[YYYYMMDD-タスクスラッグ]",
  "role": "worker",
  "input": {
    "description": "[タスクの詳細説明（日本語可）]",
    "target_files": [
      "src/components/[TargetComponent].astro"
    ],
    "constraints": [
      "yarn astro check を通すこと",
      "既存のTailwindクラスのみ使用（インラインスタイル禁止）",
      "URLは src/consts.ts から import すること",
      "main ブランチへの直接プッシュ禁止",
      "npm/npx 禁止（yarn のみ）"
    ],
    "context_files": [
      "CLAUDE.md",
      "AGENTS.md",
      "src/types.ts",
      "src/consts.ts"
    ]
  },
  "output_format": {
    "type": "git_branch",
    "branch": "agent/worker/[YYYYMMDD-タスクスラッグ]"
  }
}
```

---

## 委任チェックリスト

委任前に確認:
- [ ] タスクの説明は具体的か（何を、どのファイルに、どう実装するか）
- [ ] 完了条件（`yarn astro check` パス等）は明記したか
- [ ] 参照すべきファイル（型定義・定数）は `context_files` に含めたか
- [ ] 高影響ファイルへの変更を含む場合、ドラフトPRを先に作成したか
- [ ] ブランチ名はルール通りか（`agent/worker/[スラッグ]`）

---

## 委任に向いているタスク（Claude Code向け）

✅ 委任すべき:
- コンポーネントの実装・大幅な変更
- 複数ファイルにまたがるリファクタリング
- `yarn astro check` を繰り返すデバッグ作業
- CSS・スタイルの細かい調整

❌ 委任しないもの（自分でやる）:
- ブラウザでの表示確認
- ライブラリ・API の調査
- ドキュメントの更新
- タスクの設計・分解

---

## 委任後の受け取り方

Claude Codeから以下のJSONが返ってくる想定:

```json
{
  "task_id": "[委任時と同一ID]",
  "status": "success | failure | partial",
  "output": {
    "branch": "agent/worker/[スラッグ]",
    "pr_url": "https://github.com/ta96sse/mori-mori-tokyo/pull/XX",
    "summary": "変更内容の要約",
    "issues": ["未解決の問題があれば記載"]
  }
}
```

受け取り後:
1. ブランチを確認: `git diff main..agent/worker/[スラッグ]`
2. `review.md` でコードレビュー
3. `visual-check.md` で表示確認
4. 問題なければユーザーにPR提示

---

## 緊急委任（ショートフォーマット）

急ぎの小さなタスクの場合:

```
Claude Codeへ:
- ブランチ: agent/worker/[スラッグ]
- タスク: [1〜2行で説明]
- 制約: yarn astro check を通すこと / yarn のみ / mainへの直接プッシュ禁止
- 参照: CLAUDE.md, src/types.ts, src/consts.ts
- 完了後: PR作成してください
```
