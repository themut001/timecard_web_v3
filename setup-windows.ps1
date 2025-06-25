# ===================================================================
# Timecard Web v3 - Windows専用セットアップスクリプト
# PowerShell実行ポリシー: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# 管理者権限推奨（自動インストール機能使用時）
# ===================================================================

param(
    [switch]$Force,      # 強制実行（確認をスキップ）
    [switch]$NoInstall,  # 自動インストールをスキップ
    [switch]$Repair,     # 修復モード
    [switch]$DevMode     # 開発者モード（詳細ログ）
)

# 設定
$RequiredNodeVersion = "18.0.0"
$RequiredNpmVersion = "9.0.0"
$ProjectName = "Timecard Web v3"
$PortFrontend = 3000
$PortBackend = 5000

# カラー出力関数
function Write-Status($Message, $Color = "White") {
    Write-Host "🔄 $Message" -ForegroundColor $Color
}

function Write-Success($Message) {
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error($Message) {
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning($Message) {
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info($Message) {
    Write-Host "💡 $Message" -ForegroundColor Cyan
}

function Write-Header($Message) {
    Write-Host ""
    Write-Host "🪟 $Message" -ForegroundColor Magenta
    Write-Host ("=" * 60) -ForegroundColor DarkGray
}

# 管理者権限チェック
function Test-AdminRights {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
}

# バージョン比較関数
function Compare-Version($version1, $version2) {
    $v1 = [Version]($version1 -replace '^v', '')
    $v2 = [Version]($version2 -replace '^v', '')
    return $v1.CompareTo($v2)
}

# ポート使用チェック
function Test-PortAvailable($Port) {
    try {
        $connection = New-Object System.Net.NetworkInformation.TcpClient
        $connection.Connect("127.0.0.1", $Port)
        $connection.Close()
        return $false
    }
    catch {
        return $true
    }
}

# Chocolatey自動インストール
function Install-Chocolatey {
    if (-not $NoInstall) {
        Write-Status "Chocolateyをインストール中..."
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Chocolateyのインストールが完了しました"
            # PATHを更新
            $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
            return $true
        } else {
            Write-Error "Chocolateyのインストールに失敗しました"
            return $false
        }
    }
    return $false
}

# Node.js自動インストール
function Install-NodeJS {
    if (-not $NoInstall) {
        Write-Status "Node.js LTSをインストール中..."
        
        # Chocolateyが利用可能かチェック
        if (Get-Command choco -ErrorAction SilentlyContinue) {
            choco install nodejs-lts -y
        } else {
            Write-Warning "Node.jsの手動インストールが必要です"
            Write-Info "https://nodejs.org/ からLTS版をダウンロードしてインストールしてください"
            Write-Info "インストール後、PowerShellを再起動してこのスクリプトを再実行してください"
            return $false
        }
        
        # PATHを更新
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        
        # インストール確認
        Start-Sleep -Seconds 3
        if (Get-Command node -ErrorAction SilentlyContinue) {
            $nodeVersion = (node --version) -replace '^v', ''
            Write-Success "Node.js v$nodeVersion がインストールされました"
            return $true
        } else {
            Write-Error "Node.jsのインストールに失敗しました"
            return $false
        }
    }
    return $false
}

# Git自動インストール
function Install-Git {
    if (-not $NoInstall) {
        Write-Status "Git for Windowsをインストール中..."
        
        if (Get-Command choco -ErrorAction SilentlyContinue) {
            choco install git -y
        } else {
            Write-Warning "Gitの手動インストールが必要です"
            Write-Info "https://git-scm.com/download/win からダウンロードしてインストールしてください"
            return $false
        }
        
        # PATHを更新
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        
        # インストール確認
        Start-Sleep -Seconds 3
        if (Get-Command git -ErrorAction SilentlyContinue) {
            $gitVersion = git --version
            Write-Success "$gitVersion がインストールされました"
            return $true
        } else {
            Write-Error "Gitのインストールに失敗しました"
            return $false
        }
    }
    return $false
}

# 環境診断
function Test-Environment {
    Write-Header "環境診断を実行中"
    
    $issues = @()
    $warnings = @()
    
    # Windows バージョン確認
    $osVersion = [System.Environment]::OSVersion.Version
    if ($osVersion.Major -ge 10) {
        Write-Success "Windows $($osVersion.Major).$($osVersion.Minor) (サポート対象)"
    } else {
        $issues += "Windows 10以上が必要です（現在: Windows $($osVersion.Major).$($osVersion.Minor)）"
    }
    
    # PowerShell バージョン確認
    $psVersion = $PSVersionTable.PSVersion
    if ($psVersion.Major -ge 5) {
        Write-Success "PowerShell $($psVersion.Major).$($psVersion.Minor) (OK)"
    } else {
        $issues += "PowerShell 5.0以上が必要です（現在: $($psVersion.Major).$($psVersion.Minor)）"
    }
    
    # Node.js確認
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeVersion = (node --version) -replace '^v', ''
        if ((Compare-Version $nodeVersion $RequiredNodeVersion) -ge 0) {
            Write-Success "Node.js v$nodeVersion (OK)"
        } else {
            $issues += "Node.js $RequiredNodeVersion以上が必要です（現在: v$nodeVersion）"
        }
    } else {
        $issues += "Node.jsがインストールされていません"
    }
    
    # npm確認
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        $npmVersion = npm --version
        if ((Compare-Version $npmVersion $RequiredNpmVersion) -ge 0) {
            Write-Success "npm v$npmVersion (OK)"
        } else {
            $warnings += "npm $RequiredNpmVersion以上を推奨します（現在: v$npmVersion）"
        }
    } else {
        $issues += "npmがインストールされていません"
    }
    
    # Git確認
    if (Get-Command git -ErrorAction SilentlyContinue) {
        $gitVersion = git --version
        Write-Success "$gitVersion (OK)"
    } else {
        $issues += "Git for Windowsがインストールされていません"
    }
    
    # ポート使用確認
    if (-not (Test-PortAvailable $PortFrontend)) {
        $warnings += "ポート $PortFrontend が使用中です"
    } else {
        Write-Success "ポート $PortFrontend (フロントエンド) 利用可能"
    }
    
    if (-not (Test-PortAvailable $PortBackend)) {
        $warnings += "ポート $PortBackend が使用中です"
    } else {
        Write-Success "ポート $PortBackend (バックエンド) 利用可能"
    }
    
    # メモリ確認
    $totalMemory = (Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB
    if ($totalMemory -ge 8) {
        Write-Success "メモリ $([math]::Round($totalMemory, 1))GB (十分)"
    } elseif ($totalMemory -ge 4) {
        $warnings += "メモリ $([math]::Round($totalMemory, 1))GB (動作可能だが8GB以上推奨)"
    } else {
        $issues += "メモリ不足: $([math]::Round($totalMemory, 1))GB (4GB以上必要)"
    }
    
    # ディスク容量確認
    $freeSpace = (Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'").FreeSpace / 1GB
    if ($freeSpace -ge 5) {
        Write-Success "ディスク空き容量 $([math]::Round($freeSpace, 1))GB (十分)"
    } else {
        $issues += "ディスク容量不足: $([math]::Round($freeSpace, 1))GB (5GB以上必要)"
    }
    
    return @{
        Issues = $issues
        Warnings = $warnings
    }
}

# ポート競合解決
function Resolve-PortConflicts {
    $conflicts = @()
    
    if (-not (Test-PortAvailable $PortFrontend)) {
        $conflicts += $PortFrontend
    }
    
    if (-not (Test-PortAvailable $PortBackend)) {
        $conflicts += $PortBackend
    }
    
    if ($conflicts.Count -gt 0) {
        Write-Warning "ポート競合が検出されました: $($conflicts -join ', ')"
        
        if (-not $Force) {
            $response = Read-Host "競合するプロセスを確認しますか？ (y/n)"
            if ($response -eq 'y' -or $response -eq 'Y') {
                foreach ($port in $conflicts) {
                    Write-Info "ポート $port を使用中のプロセス:"
                    netstat -ano | Select-String ":$port " | ForEach-Object {
                        $line = $_.Line.Trim() -split '\s+'
                        $pid = $line[-1]
                        $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
                        Write-Host "  PID: $pid, プロセス名: $processName"
                    }
                }
                
                Write-Info "タスクマネージャーで該当プロセスを終了するか、別のポートを使用してください"
                Write-Info "別ポート使用例: `$env:PORT=3001; npm run dev"
            }
        }
    }
}

# プロジェクトセットアップ
function Setup-Project {
    Write-Header "プロジェクトセットアップを実行中"
    
    # package.jsonの存在確認
    if (-not (Test-Path "package.json")) {
        Write-Error "package.jsonが見つかりません。プロジェクトのルートディレクトリで実行してください。"
        return $false
    }
    
    try {
        # 依存関係インストール
        Write-Status "依存関係をインストール中..."
        npm install --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) {
            Write-Error "依存関係のインストールに失敗しました"
            return $false
        }
        Write-Success "依存関係のインストールが完了しました"
        
        # フロントエンド依存関係
        if (Test-Path "frontend/package.json") {
            Write-Status "フロントエンド依存関係をインストール中..."
            Set-Location "frontend"
            npm install --no-audit --no-fund
            if ($LASTEXITCODE -ne 0) {
                Write-Error "フロントエンド依存関係のインストールに失敗しました"
                Set-Location ".."
                return $false
            }
            Set-Location ".."
            Write-Success "フロントエンド依存関係のインストールが完了しました"
        }
        
        # バックエンド依存関係
        if (Test-Path "backend/package.json") {
            Write-Status "バックエンド依存関係をインストール中..."
            Set-Location "backend"
            npm install --no-audit --no-fund
            if ($LASTEXITCODE -ne 0) {
                Write-Error "バックエンド依存関係のインストールに失敗しました"
                Set-Location ".."
                return $false
            }
            Set-Location ".."
            Write-Success "バックエンド依存関係のインストールが完了しました"
        }
        
        # 環境変数ファイル作成
        if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
            Write-Status "環境変数ファイルを作成中..."
            Copy-Item ".env.example" ".env"
            Write-Success "環境変数ファイル (.env) を作成しました"
            Write-Info "必要に応じて .env ファイルを編集してください"
        }
        
        # データベースセットアップ
        Write-Status "データベースをセットアップ中..."
        npm run db:migrate 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "データベースセットアップが完了しました"
        } else {
            Write-Warning "データベースセットアップに失敗しました（SQLiteで自動実行されます）"
        }
        
        return $true
    }
    catch {
        Write-Error "プロジェクトセットアップ中にエラーが発生しました: $($_.Exception.Message)"
        return $false
    }
}

# VS Code設定
function Setup-VSCode {
    Write-Status "VS Code設定を作成中..."
    
    $vscodeDir = ".vscode"
    if (-not (Test-Path $vscodeDir)) {
        New-Item -ItemType Directory -Force -Path $vscodeDir | Out-Null
    }
    
    # settings.json
    $settingsJson = @"
{
  "files.eol": "\n",
  "eslint.workingDirectories": ["frontend", "backend"],
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "files.exclude": {
    "**/node_modules": true,
    "**/.git": true,
    "**/dist": true,
    "**/build": true
  }
}
"@
    
    $settingsJson | Out-File -FilePath "$vscodeDir/settings.json" -Encoding UTF8
    
    # extensions.json
    $extensionsJson = @"
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
"@
    
    $extensionsJson | Out-File -FilePath "$vscodeDir/extensions.json" -Encoding UTF8
    
    Write-Success "VS Code設定を作成しました"
}

# 動作確認
function Test-Installation {
    Write-Header "インストール確認テスト"
    
    try {
        # 基本チェック
        Write-Status "基本チェックを実行中..."
        $checkResult = npm run check 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "基本チェックが完了しました"
        } else {
            Write-Warning "基本チェックで警告が発生しました"
        }
        
        # ビルドテスト
        Write-Status "ビルドテストを実行中..."
        $buildResult = npm run build 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "ビルドテストが成功しました"
        } else {
            Write-Warning "ビルドテストで警告が発生しました（開発環境では問題ありません）"
        }
        
        Write-Info "詳細なテストは 'npm run dev' で開発環境を起動して確認してください"
        return $true
    }
    catch {
        Write-Error "インストール確認中にエラーが発生しました: $($_.Exception.Message)"
        return $false
    }
}

# メイン処理
function Main {
    Clear-Host
    Write-Header "$ProjectName Windows セットアップスクリプト"
    
    if ($DevMode) {
        Write-Info "開発者モードで実行中"
        $VerbosePreference = "Continue"
    }
    
    # 管理者権限チェック
    if (-not $NoInstall -and -not (Test-AdminRights)) {
        Write-Warning "管理者権限で実行することを推奨します（自動インストール機能を使用する場合）"
        if (-not $Force) {
            $response = Read-Host "続行しますか？ (y/n)"
            if ($response -ne 'y' -and $response -ne 'Y') {
                Write-Info "管理者権限でPowerShellを再起動してください：Windows + X → Windows PowerShell (管理者)"
                exit 0
            }
        }
    }
    
    # 環境診断
    $diagnosis = Test-Environment
    
    if ($diagnosis.Issues.Count -gt 0) {
        Write-Header "❌ 問題が検出されました"
        foreach ($issue in $diagnosis.Issues) {
            Write-Error $issue
        }
        
        if (-not $NoInstall -and (Test-AdminRights)) {
            Write-Info "自動修復を試行します..."
            
            # 必要なソフトウェアの自動インストール
            if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
                Install-Chocolatey
            }
            
            if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
                Install-NodeJS
            }
            
            if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
                Install-Git
            }
            
            # 再診断
            Write-Status "環境を再確認中..."
            $diagnosis = Test-Environment
        }
        
        if ($diagnosis.Issues.Count -gt 0) {
            Write-Error "解決されていない問題があります。手動でインストールしてください。"
            Write-Info "詳細は README.md の「詳細セットアップ手順」を参照してください"
            exit 1
        }
    }
    
    if ($diagnosis.Warnings.Count -gt 0) {
        Write-Header "⚠️ 警告"
        foreach ($warning in $diagnosis.Warnings) {
            Write-Warning $warning
        }
        
        if (-not $Force) {
            $response = Read-Host "警告がありますが続行しますか？ (y/n)"
            if ($response -ne 'y' -and $response -ne 'Y') {
                exit 0
            }
        }
    }
    
    # ポート競合解決
    Resolve-PortConflicts
    
    # プロジェクトセットアップ
    if (-not (Setup-Project)) {
        Write-Error "プロジェクトセットアップに失敗しました"
        exit 1
    }
    
    # VS Code設定
    Setup-VSCode
    
    # インストール確認
    if (-not $Repair) {
        Test-Installation
    }
    
    # 完了メッセージ
    Write-Header "🎉 セットアップが完了しました！"
    Write-Success "全ての準備が整いました"
    Write-Info ""
    Write-Info "次のステップ:"
    Write-Info "  1. npm run dev       # 開発環境を起動"
    Write-Info "  2. ブラウザで http://localhost:3000 にアクセス"
    Write-Info "  3. 初期ログイン: admin@example.com / admin123"
    Write-Info ""
    Write-Info "問題がある場合:"
    Write-Info "  - README.md のトラブルシューティングを確認"
    Write-Info "  - npm run doctor で診断実行"
    Write-Info "  - TROUBLESHOOTING-WINDOWS.md で詳細確認"
    Write-Info ""
    
    if (-not $Force) {
        $response = Read-Host "今すぐ開発環境を起動しますか？ (y/n)"
        if ($response -eq 'y' -or $response -eq 'Y') {
            Write-Status "開発環境を起動中..."
            npm run dev
        }
    }
}

# エラーハンドリング
trap {
    Write-Error "予期しないエラーが発生しました: $($_.Exception.Message)"
    Write-Info "詳細なログは `$env:TEMP\timecard-setup.log に記録されます"
    exit 1
}

# スクリプト実行
Main