# FirstTaskManager

Trello風のタスク管理アプリです。ボード・リスト・カードを使ってタスクを視覚的に管理できます。

---

## 概要

プログラミングスクールの課題として作成したWebアプリケーションです。
ReactとSpring Bootを用いたフルスタック開発、PostgreSQLによるデータ永続化などの学習を目的としています。

---

## 主な機能

- ボードの作成・編集・削除
- リストの作成・編集・削除
- カードの作成・編集・削除
- カードへの説明文・期限日・ラベルの設定
- ドラッグ&ドロップによるカードのリスト間移動
- PostgreSQLによるデータ永続化

---

## 技術スタック

### フェーズ1：プロトタイプ（完了）

| 役割 | 技術 |
|------|------|
| マークアップ | HTML |
| スタイル | CSS |
| インタラクション | JavaScript（Vanilla） |

### フェーズ2：本実装（進行中）

| 役割 | 技術 |
|------|------|
| フロントエンド | React + TypeScript |
| バックエンド | Java 21 + Spring Boot 3.3 |
| ORM | Spring Data JPA + Hibernate |
| データベース | PostgreSQL 16 |
| インフラ | Docker / docker-compose |

---

## 環境構築・起動方法

### 必要なもの

- Docker Desktop

### 1. DBの起動

```bash
docker-compose up -d
```

| サービス | URL | 備考 |
|---------|-----|------|
| PostgreSQL | `localhost:5432` | DB本体 |
| pgAdmin | `http://localhost:5050` | DB管理UI |

pgAdminのログイン情報：
- Email: `admin@example.com`
- Password: `admin`

### 2. バックエンドの起動

```bash
# Mac / Linux
cd backend
./mvnw spring-boot:run

# Windows
cd backend
.\mvnw.cmd spring-boot:run
```

起動後、以下のエンドポイントで動作確認できます。

| エンドポイント | 内容 |
|--------------|------|
| `GET http://localhost:8080/api/health` | ヘルスチェック |
| `GET http://localhost:8080/api/boards` | ボード一覧取得 |

---

## 設計ドキュメント

| ドキュメント | リンク |
|-------------|--------|
| 要件定義書 | [docs/requirements.md](docs/requirements.md) |
| 機能要件 | [docs/functional-requirements.md](docs/functional-requirements.md) |
| 画面設計 | [docs/screen-design.md](docs/screen-design.md) |
| データベース設計 | [docs/database-design.md](docs/database-design.md) |
| 技術スタック | [docs/tech-stack.md](docs/tech-stack.md) |
