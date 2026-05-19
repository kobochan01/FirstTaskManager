# TDD Hook: コード変更後にテストを自動実行し、失敗したらClaudeにフィードバックする
$json = [Console]::In.ReadToEnd() | ConvertFrom-Json
$f = $json.tool_input.file_path -replace '\\', '/'

# 対象外ファイルはスキップ
if ($f -match '\.(md|json|yaml|yml|toml|lock|gitignore|env|xml|properties|txt)$') { exit 0 }
if ($f -match '\.claude/') { exit 0 }

$projectRoot = "c:/Projects/FirstTaskManager"

if ($f -match 'frontend/' -and $f -match '\.(ts|tsx|js|jsx|css|scss)$') {
    Push-Location "$projectRoot/frontend"
    $output = npm test -- --run 2>&1
    $exitCode = $LASTEXITCODE
    Pop-Location

    if ($exitCode -ne 0) {
        @{
            decision = 'block'
            reason   = "フロントエンドのテストが失敗しました。全テストがパスするまで修正してください。`n`n" + ($output -join "`n")
        } | ConvertTo-Json
    }
}
elseif ($f -match 'backend/' -and $f -match '\.java$') {
    Push-Location "$projectRoot/backend"
    $output = .\mvnw test -q 2>&1
    $exitCode = $LASTEXITCODE
    Pop-Location

    if ($exitCode -ne 0) {
        @{
            decision = 'block'
            reason   = "バックエンドのテストが失敗しました。全テストがパスするまで修正してください。`n`n" + ($output -join "`n")
        } | ConvertTo-Json
    }
}
