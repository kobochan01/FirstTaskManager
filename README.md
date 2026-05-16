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

#### フロントエンド

| 役割 | 技術 | バージョン |
|------|------|-----------|
| UIフレームワーク | React | 19.2.6 |
| 言語 | TypeScript | 6.0.3 |
| ビルドツール | Vite | 8.0.13 |
| ルーティング | React Router DOM | 7.15.1 |

#### バックエンド

| 役割 | 技術 | バージョン |
|------|------|-----------|
| 言語 | Java | 21 |
| フレームワーク | Spring Boot | 3.3.5 |
| ORM | Spring Data JPA + Hibernate | Spring Boot 3.3.5 同梱 |
| データベース | PostgreSQL | 16 |
| インフラ | Docker / docker-compose | — |

---

## 環境構築・起動方法

### 必要なもの

- Docker Desktop
- Node.js（npm）

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

### 3. フロントエンドの起動

```bash
cd frontend
npm install   # 初回のみ
npm run dev
```

起動後、ブラウザで以下のURLにアクセスします。

| URL | 内容 |
|-----|------|
| `http://localhost:5173` | フロントエンドUI |

---

## 設計ドキュメント

| ドキュメント | リンク |
|-------------|--------|
| 要件定義書 | [docs/requirements.md](docs/requirements.md) |
| 機能要件 | [docs/functional-requirements.md](docs/functional-requirements.md) |
| 画面設計 | [docs/screen-design.md](docs/screen-design.md) |
| データベース設計 | [docs/database-design.md](docs/database-design.md) |
| 技術スタック | [docs/tech-stack.md](docs/tech-stack.md) |
