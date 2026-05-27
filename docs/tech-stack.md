# 技術スタック

## フェーズ1：プロトタイプ

| 役割 | 技術 |
|------|------|
| マークアップ | HTML |
| スタイル | CSS |
| インタラクション | JavaScript（Vanilla） |

## フェーズ2：本実装

### フロントエンド

| 役割 | 技術 | バージョン |
|------|------|-----------|
| UIフレームワーク | React | 19.2.6 |
| 言語 | TypeScript | 6.0.3 |
| ビルドツール | Vite | 8.0.13 |
| ルーティング | React Router DOM | 7.15.1 |

### バックエンド

| 役割 | 技術 | バージョン |
|------|------|-----------|
| 言語 | Java | 21 |
| フレームワーク | Spring Boot | 3.3.5 |
| API | Spring Web MVC | Spring Boot 3.3.5 同梱 |
| ORM | Spring Data JPA + Hibernate | Spring Boot 3.3.5 同梱 |
| ビルドツール | Maven (mvnw) | 3.9.15 |
| ユーティリティ | Lombok | Spring Boot 3.3.5 同梱 |

### データベース・インフラ（ローカル開発）

| 役割 | 技術 | バージョン |
|------|------|-----------|
| データベース | PostgreSQL | 16 |
| コンテナ | Docker | 29.4.3 |
| コンテナ管理 | Docker Compose | 5.1.3 |

> バックエンド（Java + Spring Boot）・フロントエンド（React）・データベース（PostgreSQL）はスクール指定のため固定。
> その他のツールはそれぞれの技術に合わせて選定。

### AWS 本番環境インフラ

| 役割 | 技術 |
|------|------|
| IaC | Terraform |
| サーバー | AWS EC2 (Amazon Linux 2023) |
| リバースプロキシ | nginx |
| データベース | AWS RDS (PostgreSQL) |
| ネットワーク | AWS VPC |

---

## AWS インフラ構成

### アーキテクチャ図

```
インターネット
     │
     ▼（HTTP :80）
┌────────────────────────────────────────────────┐
│  VPC (ap-northeast-1)                          │
│                                                │
│  ┌──────────────── パブリックサブネット ─────────┐  │
│  │                                            │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  EC2 (t3.micro / Amazon Linux 2023) │  │  │
│  │  │                                     │  │  │
│  │  │  ┌───────────┐   ┌──────────────┐  │  │  │
│  │  │  │   nginx   │──▶│ Spring Boot  │  │  │  │
│  │  │  │  :80      │   │  :8080       │  │  │  │
│  │  │  │ /         │   │ /api/**      │  │  │  │
│  │  │  │ React SPA │   │              │  │  │  │
│  │  │  └───────────┘   └──────┬───────┘  │  │  │
│  │  └─────────────────────────┼───────────┘  │  │
│  │                            │              │  │
│  └────────────────────────────┼──────────────┘  │
│                               │ PostgreSQL :5432 │
│  ┌──────── プライベートサブネット (2 AZ) ──────────┐  │
│  │                            ▼              │  │
│  │         ┌──────────────────────────┐      │  │
│  │         │  RDS (db.t3.micro)       │      │  │
│  │         │  PostgreSQL 16           │      │  │
│  │         └──────────────────────────┘      │  │
│  └───────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

### リクエストの流れ

| パス | 処理 |
|------|------|
| `/*` | nginx が `/var/www/html` の React ビルド済みファイルを返す |
| `/api/*` | nginx が Spring Boot（:8080）へリバースプロキシ |
| Spring Boot → RDS | プライベートサブネット内の PostgreSQL に接続 |

### ネットワーク構成

| リソース | 用途 |
|----------|------|
| VPC | 全リソースを格納するプライベートネットワーク |
| パブリックサブネット | EC2 を配置。Elastic IP で固定パブリック IP を付与 |
| プライベートサブネット（2 AZ）| RDS を配置。インターネットからの直接アクセス不可 |
| インターネットゲートウェイ | EC2 へのインバウンドを許可 |

### セキュリティグループ

| SG | 許可インバウンド |
|----|----------------|
| EC2 SG | SSH (22)・HTTP (80) — 自分の IP のみ |
| RDS SG | PostgreSQL (5432) — EC2 SG からのみ |

### EC2 内の構成

```
/opt/taskmanager/
└── taskmanager.jar        # Spring Boot Fat JAR

/var/www/html/             # nginx の配信ルート
├── index.html
└── assets/

/etc/nginx/conf.d/
└── app.conf               # リバースプロキシ設定

/etc/taskmanager/
└── app.env                # DB 接続情報（環境変数、root 読み取り専用）

/etc/systemd/system/
└── taskmanager.service    # Spring Boot の自動起動サービス定義
```

### Terraform ディレクトリ構成

```
terraform/
├── main.tf            # プロバイダー・VPC・サブネット・SG・EC2・RDS
├── variables.tf       # 変数定義（リージョン・プロジェクト名・DB 認証情報など）
├── outputs.tf         # EC2 パブリック IP・RDS エンドポイント・SSH コマンド
└── terraform.tfvars   # 変数の実値（gitignore 済み）
```

### デプロイフロー概要

```
ローカル
  1. terraform apply     → AWS にインフラを構築
  2. npm run build       → React をビルド（dist/ 生成）
  3. mvnw package        → Spring Boot JAR をビルド
  4. scp dist/ → EC2    → フロントエンドをデプロイ
  5. scp *.jar → EC2    → バックエンドをデプロイ
  6. systemctl restart  → Spring Boot を再起動
```
