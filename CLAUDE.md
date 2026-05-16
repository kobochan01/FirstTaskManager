# FirstTaskManager — Claude Code プロジェクトルール

## GitHub ワークフロー（必須ルール）

以下のルールは**例外なく**適用される。Claude Codeはこれらを自律的に守り、ユーザーにも守るよう促すこと。

### 作業開始前

1. **GitHub Issueを必ず作成する**
   - 機能追加・バグ修正・ドキュメント更新・設定変更を問わず、すべての作業はIssueから始める
   - Issueには目的・背景・完了条件を記載する
   - 適切なラベルを付与する（`feature` / `bug` / `docs` / `chore` / `question`）

2. **Issueに紐づくブランチを切る**
   - mainから直接作業することを禁止する
   - ブランチ名はIssue番号を含む以下の形式に従う

### ブランチ命名規則

```
feature/<issue番号>-<簡潔な英語説明>   # 新機能
fix/<issue番号>-<簡潔な英語説明>       # バグ修正
docs/<issue番号>-<簡潔な英語説明>      # ドキュメント
chore/<issue番号>-<簡潔な英語説明>     # 設定・依存関係・雑務
```

例: `feature/12-add-task-card-api`, `fix/34-fix-login-error`

### 作業中

- コミットメッセージは変更の「なぜ」を説明する（何を変えたかはdiffで分かる）
- 1コミット = 1論理的な変更単位とする
- コミットメッセージの書式: `<type>: <説明>（例: feat: タスクカード作成APIを追加）`

### 作業完了後

1. **Pull Requestを作成する**
   - PRタイトルは `[#<issue番号>] <変更概要>` の形式にする
   - PRの本文テンプレートをすべて記入する
   - `Closes #<issue番号>` でIssueと自動連携する

2. **mainへの直接pushは禁止**
   - GitHub側でブランチ保護ルールにより技術的にも拒否される
   - `git push origin main` は実行しないこと

### Issueラベル定義

| ラベル | 用途 |
|---|---|
| `feature` | 新機能の追加 |
| `bug` | 不具合の修正 |
| `docs` | ドキュメントの変更 |
| `chore` | ビルド・設定・依存関係の変更 |
| `question` | 調査・検討事項 |

---

## 技術スタック

- **フロントエンド**: React + TypeScript
- **バックエンド**: Java 21 + Spring Boot 3.3
- **データベース**: PostgreSQL 16
- **インフラ**: Docker / docker-compose
- **ORM**: Spring Data JPA + Hibernate

## 開発環境起動

```bash
# DB起動
docker-compose up -d

# バックエンド起動
cd backend && ./mvnw spring-boot:run
```
