# Windows用セットアップスクリプト (PowerShell)
# 管理者権限で実行してください

Write-Host "🪟 Windows用タイムカードアプリセットアップ開始..." -ForegroundColor Green

# WSL2の確認
Write-Host "📋 WSL2の確認中..." -ForegroundColor Yellow
try {
    $wslVersion = wsl --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ WSL2が利用可能です" -ForegroundColor Green
    } else {
        Write-Host "❌ WSL2がインストールされていません" -ForegroundColor Red
        Write-Host "以下のコマンドを管理者権限で実行してWSL2をインストールしてください:" -ForegroundColor Yellow
        Write-Host "wsl --install" -ForegroundColor Cyan
        exit 1
    }
} catch {
    Write-Host "❌ WSL2の確認に失敗しました" -ForegroundColor Red
    exit 1
}

# Docker Desktopの確認
Write-Host "🐳 Docker Desktopの確認中..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker Desktopが利用可能です: $dockerVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker Desktopがインストールされていません" -ForegroundColor Red
        Write-Host "https://www.docker.com/products/docker-desktop/ からインストールしてください" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Docker Desktopの確認に失敗しました" -ForegroundColor Red
    exit 1
}

# Git for Windowsの確認
Write-Host "📦 Git for Windowsの確認中..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git for Windowsが利用可能です: $gitVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Git for Windowsがインストールされていません" -ForegroundColor Red
        Write-Host "https://git-scm.com/download/win からインストールしてください" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Git for Windowsの確認に失敗しました" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 必要なソフトウェアが揃っています！" -ForegroundColor Green
Write-Host ""
Write-Host "次のステップ:" -ForegroundColor Yellow
Write-Host "1. WSL2 Ubuntuターミナルを開く" -ForegroundColor Cyan
Write-Host "2. 以下のコマンドを実行:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   cd ~" -ForegroundColor White
Write-Host "   git clone <repository-url>" -ForegroundColor White
Write-Host "   cd timecard_web_v3" -ForegroundColor White
Write-Host "   chmod +x setup.sh" -ForegroundColor White
Write-Host "   ./setup.sh" -ForegroundColor White
Write-Host ""
Write-Host "セットアップ完了後、http://localhost:3000 でアクセスできます" -ForegroundColor Green

# VSCode設定ファイルの作成
Write-Host "📝 VS Code設定の作成..." -ForegroundColor Yellow
$vscodeDir = ".vscode"
if (!(Test-Path $vscodeDir)) {
    New-Item -ItemType Directory -Force -Path $vscodeDir | Out-Null
}

$settingsJson = @"
{
  "remote.WSL.fileWatcher.polling": true,
  "files.eol": "\n",
  "terminal.integrated.defaultProfile.windows": "WSL",
  "eslint.workingDirectories": ["frontend", "backend"],
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
"@

$settingsJson | Out-File -FilePath "$vscodeDir/settings.json" -Encoding UTF8
Write-Host "✅ VS Code設定を作成しました: .vscode/settings.json" -ForegroundColor Green

# 推奨拡張機能リストの作成
$extensionsJson = @"
{
  "recommendations": [
    "ms-vscode-remote.remote-wsl",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-docker",
    "ms-vscode.vscode-json"
  ]
}
"@

$extensionsJson | Out-File -FilePath "$vscodeDir/extensions.json" -Encoding UTF8
Write-Host "✅ VS Code推奨拡張機能リストを作成しました: .vscode/extensions.json" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Windows環境の準備が完了しました！" -ForegroundColor Green
Write-Host "WSL2 Ubuntuでプロジェクトのセットアップを続行してください。" -ForegroundColor Yellow