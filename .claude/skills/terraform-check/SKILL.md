---
name: terraform-check
description: Terraformコードの品質チェックを実行する（fmt・validate・plan）。terraform/ ディレクトリが存在するときに使う。
argument-hint: "[fmt|validate|plan|all]"
allowed-tools: Bash PowerShell
---

# terraform-check スキル

`terraform/` ディレクトリ内のコードに対して品質チェックを実施する。
引数なし or `all` で全チェック、個別指定も可。

## 前提条件

- Terraform CLI がインストール済みであること（`terraform version` で確認）
- `terraform/` ディレクトリが存在すること
- `terraform.tfvars` などの機密変数ファイルは gitignore 済みであること

## チェック手順

### 1. フォーマットチェック（fmt）

```powershell
cd "c:\Projects\FirstTaskManager\terraform"
terraform fmt -check -recursive
```

フォーマットがずれている場合は以下で自動修正する：

```powershell
terraform fmt -recursive
```

### 2. 構文・設定バリデーション（validate）

```powershell
cd "c:\Projects\FirstTaskManager\terraform"
terraform init -backend=false -input=false 2>&1
terraform validate
```

`init -backend=false` でリモートバックエンドなしに初期化してからバリデーションする。

### 3. 実行計画確認（plan）

plan は AWS 接続が必要なため、以下の条件が揃っている場合のみ実行する：
- AWS CLI が設定済みで認証が通っている
- `terraform.tfvars` が存在する

```powershell
cd "c:\Projects\FirstTaskManager\terraform"
terraform plan -var-file="terraform.tfvars" -out=tfplan 2>&1
```

エラーがなく `Plan:` 行が表示されれば OK。

## 確認ポイント

| チェック | 合格基準 |
|---------|---------|
| `fmt -check` | exit code 0（差分なし） |
| `validate` | `Success! The configuration is valid.` |
| `plan` | `Plan: X to add, Y to change, Z to destroy.` が表示され意図しない destroy がない |

## 注意事項

- `plan` はインフラへの変更は行わない（読み取りのみ）
- `plan -destroy` は実行しない
- `apply` はこのスキルの範囲外。ユーザーが明示的に指示した場合のみ実行する
- `terraform.tfvars` に機密情報（DB パスワード等）が含まれるためログ出力に注意
