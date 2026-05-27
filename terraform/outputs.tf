output "ec2_public_ip" {
  description = "サーバーの固定パブリックIP"
  value       = aws_eip.server.public_ip
}

output "ssh_command" {
  description = "SSH接続コマンド"
  value       = "ssh -i ~/.ssh/${var.ec2_key_name}.pem ec2-user@${aws_eip.server.public_ip}"
}

output "rds_endpoint" {
  description = "RDS PostgreSQL エンドポイント"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_db_name" {
  description = "RDS データベース名"
  value       = aws_db_instance.postgres.db_name
}
