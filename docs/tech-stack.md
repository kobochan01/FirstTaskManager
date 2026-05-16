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

### データベース・インフラ

| 役割 | 技術 | バージョン |
|------|------|-----------|
| データベース | PostgreSQL | 16 |
| コンテナ | Docker | 29.4.3 |
| コンテナ管理 | Docker Compose | 5.1.3 |

> バックエンド（Java + Spring Boot）・フロントエンド（React）・データベース（PostgreSQL）はスクール指定のため固定。
> その他のツールはそれぞれの技術に合わせて選定。
