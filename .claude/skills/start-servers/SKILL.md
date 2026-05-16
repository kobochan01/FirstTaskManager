---
name: start-servers
description: FirstTaskManagerの開発サーバーをすべて起動する。ポート競合が発生した場合は競合プロセスを停止してデフォルトポートで起動する。
argument-hint: "[backend|frontend|all]"
allowed-tools: Bash PowerShell
---

# start-servers スキル

FirstTaskManager の開発サーバーを起動する。引数なし or `all` で全サービス、`backend` でバックエンドのみ、`frontend` でフロントエンドのみ起動する。

## ポートの固定ルール（絶対に変えない）

| サービス | ポート |
|---|---|
| バックエンド（Spring Boot） | 8080 |
| フロントエンド（Vite/React） | 5173 |
| DB（PostgreSQL） | 5432 |

**代替ポートでの起動は禁止。** 競合が発生した場合は必ず競合プロセスを停止してからデフォルトポートで起動する。

## 手順

### 1. ポート競合チェック

起動前に対象ポートを確認する：

```powershell
netstat -ano | findstr ":8080 :5173 :5432"
```

競合プロセスがあれば停止する：

```powershell
# PIDを特定して停止
$port = 8080  # 対象ポート
$pids = (netstat -ano | findstr ":$port " | Where-Object { $_ -match "LISTENING" } | ForEach-Object { ($_ -split '\s+')[-1] } | Sort-Object -Unique)
$pids | ForEach-Object { taskkill /PID $_ /F }
```

### 2. DB（PostgreSQL）の確認

DB は docker-compose で管理。起動していない場合のみ起動する：

```powershell
cd "c:\Users\koboc\OneDrive\デスクトップ\CursorProject\FirstTaskManager"
docker-compose up -d
```

### 3. バックエンド（Spring Boot / port 8080）の起動

```powershell
cd "c:\Users\koboc\OneDrive\デスクトップ\CursorProject\FirstTaskManager\backend"
./mvnw spring-boot:run
```

バックグラウンドで起動し、`Started` ログが出るまで待つ。

### 4. フロントエンド（Vite / port 5173）の起動

```powershell
cd "c:\Users\koboc\OneDrive\デスクトップ\CursorProject\FirstTaskManager\frontend"
npm run dev
```

`http://localhost:5173` が表示されたら起動完了。

## 起動後の確認

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:8080/api/tasks
- Viteのプロキシ設定により `/api/*` は自動で 8080 に転送される
