# 🪟 Windows開発環境セットアップガイド

このガイドでは、Windows環境でタイムカードアプリの開発環境を構築する手順を詳しく説明します。

## 📋 前提条件

- Windows 10 version 2004以上 または Windows 11
- 管理者権限のあるアカウント
- インターネット接続

## 🛠 必要なソフトウェア

### 1. WSL2 (Windows Subsystem for Linux 2)

WSL2は、Windows上でLinux環境を動作させるための仮想化技術です。

#### インストール手順

1. **PowerShellを管理者として起動**
   - `Windows + X` → `Windows PowerShell (管理者)`

2. **WSL2をインストール**
   ```powershell
   wsl --install
   ```

3. **システムを再起動**

4. **Ubuntu設定**
   - 再起動後、Ubuntuが自動で起動
   - ユーザー名とパスワードを設定

5. **WSL2バージョンを確認**
   ```powershell
   wsl --list --verbose
   ```

### 2. Docker Desktop for Windows

#### インストール手順

1. [Docker Desktop公式サイト](https://www.docker.com/products/docker-desktop/)からダウンロード

2. インストーラーを実行し、以下を確認：
   - ✅ Enable WSL 2 integration
   - ✅ Add to PATH

3. 再起動後、Docker Desktopを起動

4. **Settings → Resources → WSL Integration**
   - ✅ Enable integration with my default WSL distro
   - ✅ Ubuntu (使用するディストリビューション)

### 3. Git for Windows

1. [Git公式サイト](https://git-scm.com/download/win)からダウンロード
2. インストール時の推奨設定：
   - Editor: Visual Studio Code (if available)
   - Line ending conversions: Checkout as-is, commit Unix-style line endings
   - Terminal emulator: Use Windows default console window

### 4. Visual Studio Code (推奨)

1. [VS Code公式サイト](https://code.visualstudio.com/)からダウンロード
2. インストール時に以下をチェック：
   - ✅ Add to PATH
   - ✅ Register Code as an editor for supported file types

#### 必須拡張機能

VS Codeに以下の拡張機能をインストール：

```
- Remote - WSL
- TypeScript and JavaScript Language Features
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- Prisma
- Docker
```

## 🚀 プロジェクトセットアップ

### ステップ1: WSL2 Ubuntuでの準備

```bash
# WSL2 Ubuntuターミナルを開く
# パッケージの更新
sudo apt update && sudo apt upgrade -y

# 必要なパッケージをインストール
sudo apt install -y curl wget git unzip

# Node.js 18のインストール
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# インストール確認
node --version  # v18.x.x
npm --version   # 9.x.x
```

### ステップ2: プロジェクトのクローンとセットアップ

```bash
# ホームディレクトリに移動
cd ~

# プロジェクトをクローン
git clone <repository-url>
cd timecard_web_v3

# セットアップスクリプトに実行権限を付与
chmod +x setup.sh
chmod +x scripts/*.sh

# 自動セットアップを実行
./setup.sh
```

### ステップ3: 環境変数の設定

```bash
# .envファイルをコピー
cp .env.example .env

# .envファイルを編集
nano .env
```

必要に応じて以下の値を設定：
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/timecard_dev"
JWT_SECRET="your-super-secret-jwt-key-here"
NOTION_API_KEY="your-notion-integration-token"  # オプション
NOTION_DATABASE_ID="your-notion-database-id"    # オプション
```

### ステップ4: アプリケーションの起動

```bash
# 開発環境の起動
./scripts/dev.sh
```

成功すると以下のURLでアクセス可能：
- フロントエンド: http://localhost:3000
- API: http://localhost:5000

## 🔧 VS Code連携

### WSL拡張機能の使用

1. VS Codeを起動
2. `Ctrl + Shift + P` → `Remote-WSL: New WSL Window`
3. WSL内でプロジェクトフォルダを開く：
   ```bash
   code ~/timecard_web_v3
   ```

### 推奨ワークスペース設定

`.vscode/settings.json`:
```json
{
  "remote.WSL.fileWatcher.polling": true,
  "files.eol": "\n",
  "terminal.integrated.defaultProfile.windows": "WSL",
  "eslint.workingDirectories": ["frontend", "backend"],
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🚨 よくある問題と解決方法

### WSL2関連の問題

#### メモリ不足エラー
```bash
# WSL2のメモリ使用量を確認
cat /proc/meminfo | grep MemTotal

# Windows側で.wslconfigファイルを作成
# %USERPROFILE%\.wslconfig
[wsl2]
memory=4GB
processors=2
```

#### ファイルシステムのパフォーマンス問題
- WSL2内（`/home/user/`）でプロジェクトを作業
- Windows側（`/mnt/c/`）での作業は避ける

### Docker関連の問題

#### Docker Desktopが起動しない
1. Windows機能の確認：
   - Hyper-V
   - Windows Subsystem for Linux
   - Virtual Machine Platform

2. BIOS設定の確認：
   - 仮想化支援技術の有効化

#### コンテナの起動失敗
```bash
# Dockerサービスの確認
sudo service docker status

# Dockerサービスの再起動
sudo service docker restart
```

### ポート競合の解決

```bash
# 使用中のポートを確認（Windows側）
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# プロセス終了（タスクマネージャー推奨）
```

### Node.js関連の問題

#### Node.jsバージョンエラー
```bash
# 現在のバージョン確認
node --version

# Node.js 18の再インストール
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 📱 便利なツール

### Windows Terminal

より快適なターミナル体験のために推奨：

1. Microsoft Storeから「Windows Terminal」をインストール
2. 設定でWSL2 Ubuntuをデフォルトプロファイルに設定

### PowerToys

Windowsの生産性向上ツール：

1. [PowerToys GitHub](https://github.com/microsoft/PowerToys)からダウンロード
2. 便利な機能：
   - PowerToys Run: アプリケーションランチャー
   - FancyZones: ウィンドウ管理
   - ColorPicker: カラーピッカー

## 🔄 定期メンテナンス

### WSL2の更新
```bash
# WSL2カーネルの更新（PowerShell）
wsl --update

# Ubuntuパッケージの更新
sudo apt update && sudo apt upgrade -y
```

### Docker環境のクリーンアップ
```bash
# 不要なコンテナ・イメージの削除
docker system prune -a
```

## 📞 サポート

問題が発生した場合：

1. **GitHub Issues**: バグ報告・質問
2. **Wiki**: FAQ・Tips
3. **Discord**: リアルタイム質問

## 🎯 パフォーマンス最適化

### WSL2の最適化

1. **メモリ制限の設定**（.wslconfig）
2. **ファイルウォッチングの最適化**
3. **不要なサービスの無効化**

### Windows環境の最適化

1. **Windows Defenderの除外設定**
   - WSL2のディスク（通常`%LOCALAPPDATA%\Packages\CanonicalGroupLimited.*`）
   - Docker Desktop関連フォルダ

2. **電源設定の最適化**
   - 高パフォーマンスモードに設定

---

このガイドに従って、Windows環境でのタイムカードアプリ開発環境が構築できます。問題が発生した場合は、トラブルシューティングセクションを参照してください。