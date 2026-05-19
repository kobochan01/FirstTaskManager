# Danger Guard Hook: 危険なBashコマンドを実行前にブロックする
$json = [Console]::In.ReadToEnd() | ConvertFrom-Json
$cmd = $json.tool_input.command

$patterns = @(
    'rm\s+-rf',
    'rm\s+-r\s',
    'git\s+reset\s+--hard',
    'git\s+push\s+--force',
    'git\s+push\s+-f(\s|$)',
    'git\s+clean\s+-f',
    'DROP\s+TABLE',
    'DROP\s+DATABASE',
    'TRUNCATE\s+TABLE',
    'git\s+branch\s+-D',
    'format\s+[a-zA-Z]:'
)

$matched = $patterns | Where-Object { $cmd -imatch $_ } | Select-Object -First 1

if ($matched) {
    @{
        decision = 'block'
        reason   = "危険なコマンドが検出されたためブロックしました。`n検出パターン: $matched`n実行しようとしたコマンド: $cmd"
    } | ConvertTo-Json
}
