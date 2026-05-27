variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "プロジェクト名（リソース名のプレフィックスに使用）"
  type        = string
  default     = "first-task-manager"
}

variable "ec2_key_name" {
  description = "EC2 SSH接続に使用するキーペア名（AWSコンソールで事前に作成が必要）"
  type        = string
}

variable "my_ip_cidr" {
  description = "アクセスを許可する自分のIPアドレス（CIDR形式 例: 203.0.113.1/32）"
  type        = string
}

variable "db_username" {
  description = "RDS PostgreSQL の管理ユーザー名"
  type        = string
  default     = "taskmanager"
}

variable "db_password" {
  description = "RDS PostgreSQL のパスワード（terraform.tfvars で指定）"
  type        = string
  sensitive   = true
}
