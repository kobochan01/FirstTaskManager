# Danger Guard Hook: 危険なBash/PowerShellコマンドを実行前にブロックする
$json = [Console]::In.ReadToEnd() | ConvertFrom-Json
$cmd = $json.tool_input.command

$patterns = @(
    # ファイル強制削除
    'rm\s+-rf',
    'rm\s+-r\s',
    'Remove-Item.*-Recurse.*-Force',
    'Remove-Item.*-Force.*-Recurse',
    'rd\s+/s\s+/q',
    'del\s+/f.*\/s',

    # Git 破壊的操作
    'git\s+reset\s+--hard',
    'git\s+push\s+--force',
    'git\s+push\s+-f(\s|$)',
    'git\s+clean\s+-f',
    'git\s+branch\s+-D',
    'git\s+checkout\s+--',
    'git\s+restore\s+\.',
    'git\s+stash\s+(drop|clear)',
    'git\s+rebase\s+-i',

    # データベース破壊
    'DROP\s+TABLE',
    'DROP\s+DATABASE',
    'DROP\s+SCHEMA',
    'TRUNCATE\s+TABLE',
    'ALTER\s+TABLE.*DROP\s+COLUMN',

    # Docker データ削除
    'docker.*system\s+prune',
    'docker.*volume\s+(rm|prune)',
    'docker-compose.*down.*-v',
    'docker.*rmi\s+-f',

    # GitHub CLI 削除
    'gh\s+repo\s+delete',
    'gh\s+release\s+delete',

    # システム操作
    'format\s+[a-zA-Z]:',
    '\bshutdown\b',
    'Restart-Computer',
    'Stop-Computer',

    # npm 誤公開防止
    'npm\s+publish'
)

$matched = $patterns | Where-Object { $cmd -imatch $_ } | Select-Object -First 1

if ($matched) {
    @{
        decision = 'block'
        reason   = "危険なコマンドが検出されたためブロックしました。`n検出パターン: $matched`n実行しようとしたコマンド: $cmd"
    } | ConvertTo-Json
}
