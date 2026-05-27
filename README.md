# FirstTaskManager

Trello風のタスク管理アプリです。ボード・リスト・カードを使ってタスクを視覚的に管理できます。

---

## 概要

プログラミングスクールの課題として作成したWebアプリケーションです。
ReactとSpring Bootを用いたフルスタック開発、PostgreSQLによるデータ永続化などの学習を目的としています。

---

## 主な機能

- ボードの作成・削除
- リストの作成・削除
- カードの作成・編集・削除
- カードへの説明文・期限日の設定
- カードのリスト間移動（ドラッグ＆ドロップ・モーダルから選択）
- キーワードによるカード横断検索
- PostgreSQLによるデータ永続化

---

## 技術スタック

### フロントエンド

| 役割 | 技術 | バージョン |
|------|------|-----------|
| UIフレームワーク | React | 19.2.6 |
| 言語 | TypeScript | 6.0.2 |
| ビルドツール | Vite | 8.0.12 |
| ルーティング | React Router DOM | 7.15.1 |

### バックエンド

| 役割 | 技術 | バージョン |
|------|------|-----------|
| 言語 | Java | 21 |
| フレームワーク | Spring Boot | 3.5.0 |
| ビルドツール | Maven (mvnw) | 3.9.15 |
| ORM | Spring Data JPA + Hibernate | Spring Boot 3.5.0 同梱 |

### ローカル開発環境

| 役割 | 技術 | バージョン |
|------|------|-----------|
| データベース | PostgreSQL | 16 |
| コンテナ | Docker | 29.4.3 |
| コンテナ管理 | Docker Compose | 5.1.3 |

### 本番環境（AWS）

| 役割 | 技術 |
|------|------|
| IaC | Terraform |
| サーバー | AWS EC2 (t3.micro / Amazon Linux 2023) |
| リバースプロキシ | nginx |
| データベース | AWS RDS (PostgreSQL 16 / db.t3.micro) |
| ネットワーク | AWS VPC（パブリック + プライベートサブネット） |

---

## ローカル環境構築・起動方法

### 必要なもの

- Docker Desktop
- Node.js（npm）
- Java 21（Amazon Corretto 推奨）

### 1. DBの起動

```bash
docker-compose up -d
```

| サービス | URL | 備考 |
|---------|-----|------|
| PostgreSQL | `localhost:5433` | DB本体 |
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

## 本番環境デプロイ

AWS インフラは Terraform で管理しています。インフラ構成の詳細は [docs/tech-stack.md](docs/tech-stack.md) を参照してください。

```
ローカル
  1. terraform apply     → AWS にインフラを構築
  2. npm run build       → React をビルド（dist/ 生成）
  3. mvnw package        → Spring Boot JAR をビルド
  4. scp dist/ → EC2    → フロントエンドをデプロイ
  5. scp *.jar → EC2    → バックエンドをデプロイ
  6. systemctl restart  → Spring Boot を再起動
```

---

## 設計ドキュメント

| ドキュメント | リンク |
|-------------|--------|
| 要件定義書 | [docs/requirements.md](docs/requirements.md) |
| 機能要件 | [docs/functional-requirements.md](docs/functional-requirements.md) |
| 画面設計 | [docs/screen-design.md](docs/screen-design.md) |
| データベース設計 | [docs/database-design.md](docs/database-design.md) |
| 技術スタック・インフラ構成 | [docs/tech-stack.md](docs/tech-stack.md) |
