# 🛠 Windows トラブルシューティングガイド

> **Windows環境でのタイムカードアプリ開発時によくある問題と解決方法**

## 🚨 緊急対応チェックリスト

### アプリが起動しない場合
1. ✅ **Node.js確認**: `node --version` (18.0.0以上)
2. ✅ **npm確認**: `npm --version` (9.0.0以上)
3. ✅ **ポート確認**: `netstat -ano | findstr :3000`
4. ✅ **管理者権限確認**: PowerShellを管理者として実行
5. ✅ **環境診断実行**: `npm run doctor`

### 即座に試す解決策
```cmd
# 1. 環境リセット
npm run fix

# 2. 依存関係の再インストール
npm run setup

# 3. SQLiteモードで起動
npm run dev:sqlite

# 4. 修復モード実行
setup-windows.ps1 -Repair
```

---

## 📋 問題カテゴリ別解決法

### 🔴 インストール・セットアップ問題

#### ❌ Node.js がインストールされていません

**症状**:
```
'node' は、内部コマンドまたは外部コマンド、
操作可能なプログラムまたはバッチ ファイルとして認識されていません。
```

**解決法**:
1. **自動解決** (推奨):
   ```powershell
   # 管理者権限でPowerShell実行
   setup-windows.ps1
   ```

2. **手動解決**:
   - [Node.js公式サイト](https://nodejs.org/)からLTS版をダウンロード
   - インストーラーを実行（デフォルト設定でOK）
   - PowerShellを再起動
   - 確認: `node --version`

**注意点**:
- ✅ LTS版を選択（Current版は避ける）
- ✅ インストール後PowerShell再起動必須
- ✅ PATH環境変数は自動設定される

#### ❌ npm install が失敗する

**症状**:
```
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path C:\Users\...
npm ERR! errno -4048
```

**解決法**:
1. **管理者権限で実行**:
   ```cmd
   # Windows + X → コマンドプロンプト(管理者)
   npm install
   ```

2. **npmキャッシュクリア**:
   ```cmd
   npm cache clean --force
   npm install
   ```

3. **権限問題の根本解決**:
   ```cmd
   # npm設定変更
   npm config set cache C:\npm-cache --global
   npm config set prefix C:\npm --global
   ```

4. **Windows Defenderの除外設定**:
   - Windows Defender → ウイルスと脅威の防止
   - 設定の管理 → 除外の追加
   - フォルダーを除外: プロジェクトフォルダー

#### ❌ Git がインストールされていません

**症状**:
```
'git' は、内部コマンドまたは外部コマンド、
操作可能なプログラムまたはバッチ ファイルとして認識されていません。
```

**解決法**:
1. **自動インストール**:
   ```powershell
   # 管理者権限で実行
   choco install git -y
   ```

2. **手動インストール**:
   - [Git公式サイト](https://git-scm.com/download/win)からダウンロード
   - インストール時の推奨設定:
     - ✅ Add Git to PATH
     - ✅ Checkout as-is, commit Unix-style line endings
     - ✅ Use Windows default console window

---

### 🔴 開発環境起動問題

#### ❌ ポート3000が使用中

**症状**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解決法**:
1. **使用中プロセスの確認**:
   ```cmd
   netstat -ano | findstr :3000
   ```

2. **プロセスの終了**:
   ```cmd
   # タスクマネージャーで該当PIDのプロセスを終了
   # または PowerShellで：
   Get-Process -Id [PID] | Stop-Process -Force
   ```

3. **別ポートで起動**:
   ```cmd
   set PORT=3001
   npm run dev
   ```

4. **自動ポート競合解決**:
   ```powershell
   setup-windows.ps1 -Force
   ```

#### ❌ バックエンドAPIに接続できません

**症状**:
```
Network Error
Failed to fetch from http://localhost:5000
```

**解決法**:
1. **バックエンドサーバー起動確認**:
   ```cmd
   # 別ターミナルで確認
   curl http://localhost:5000/api/health
   ```

2. **ファイアウォール設定確認**:
   ```cmd
   # Windows Defender ファイアウォール設定
   # コントロールパネル → システムとセキュリティ → Windows Defender ファイアウォール
   # 詳細設定 → 受信の規則 → 新しい規則
   # ポート 5000 を許可
   ```

3. **プロキシ設定確認**:
   ```cmd
   npm config get proxy
   npm config get https-proxy
   # プロキシが設定されている場合：
   npm config delete proxy
   npm config delete https-proxy
   ```

#### ❌ データベース接続エラー

**症状**:
```
Database connection failed
Error: P1001: Can't reach database server
```

**解決法**:
1. **SQLiteモードで起動** (推奨):
   ```cmd
   npm run dev:sqlite
   ```

2. **PostgreSQL使用時の確認**:
   ```cmd
   # サービス起動確認
   net start postgresql-x64-14
   
   # 接続テスト
   psql -U postgres -h localhost -p 5432
   ```

3. **環境変数確認**:
   ```cmd
   # .envファイルの確認
   type .env
   
   # DATABASE_URLの設定例:
   # SQLite: DATABASE_URL="file:./dev.db"
   # PostgreSQL: DATABASE_URL="postgresql://postgres:password@localhost:5432/timecard_dev"
   ```

---

### 🔴 パフォーマンス問題

#### ⚠️ アプリケーションが異常に遅い

**症状**:
- ページ読み込みに10秒以上かかる
- ファイル保存時の反応が遅い
- npm installが異常に遅い

**解決法**:
1. **Windows Defenderの除外設定**:
   ```
   除外フォルダー:
   - プロジェクトルートフォルダー
   - C:\Program Files\nodejs
   - %APPDATA%\npm
   - %APPDATA%\npm-cache
   ```

2. **ウイルススキャンソフトの設定**:
   - リアルタイムスキャンからプロジェクトフォルダーを除外
   - 開発用ポート（3000, 5000）を除外

3. **パフォーマンス設定最適化**:
   ```cmd
   # 電源設定を高パフォーマンスに変更
   powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
   
   # Windows Update自動更新の一時無効化（開発中のみ）
   ```

#### ⚠️ メモリ不足エラー

**症状**:
```
FATAL ERROR: Ineffective mark-compacts near heap limit
JavaScript heap out of memory
```

**解決法**:
1. **Node.jsヒープサイズ増加**:
   ```cmd
   # 一時的な解決
   set NODE_OPTIONS=--max-old-space-size=4096
   npm run dev
   ```

2. **package.jsonに永続設定**:
   ```json
   {
     "scripts": {
       "dev": "cross-env NODE_OPTIONS=--max-old-space-size=4096 concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
     }
   }
   ```

3. **不要なプロセス終了**:
   ```cmd
   # タスクマネージャーで確認
   # Chrome、VS Code等の大量タブを閉じる
   ```

---

### 🔴 開発ツール問題

#### ❌ VS Code拡張機能が動作しない

**症状**:
- ESLintエラーが表示されない  
- TypeScriptエラーが表示されない
- Prettierの自動フォーマットが効かない

**解決法**:
1. **推奨拡張機能の確認**:
   ```cmd
   # プロジェクトルートで実行
   code --install-extension ms-vscode.vscode-typescript-next
   code --install-extension esbenp.prettier-vscode
   code --install-extension dbaeumer.vscode-eslint
   ```

2. **ワークスペース設定確認**:
   ```json
   // .vscode/settings.json
   {
     "eslint.workingDirectories": ["frontend", "backend"],
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": "explicit"
     }
   }
   ```

3. **TypeScript設定確認**:
   ```cmd
   # TypeScriptバージョン確認
   npx tsc --version
   
   # プロジェクト内TypeScript使用
   # VS Code: Ctrl+Shift+P → "TypeScript: Select TypeScript Version" → "Use Workspace Version"
   ```

#### ❌ PowerShellスクリプト実行ポリシーエラー

**症状**:
```
このシステムではスクリプトの実行が無効になっているため、
ファイル setup-windows.ps1 を読み込むことができません。
```

**解決法**:
1. **実行ポリシー変更** (推奨):
   ```powershell
   # 管理者権限でPowerShell実行
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **一時的な実行**:
   ```powershell
   PowerShell -ExecutionPolicy Bypass -File setup-windows.ps1
   ```

3. **セキュリティ確認**:
   ```powershell
   # 現在のポリシー確認
   Get-ExecutionPolicy -List
   
   # より制限的な設定（セキュリティ重視）
   Set-ExecutionPolicy -ExecutionPolicy AllSigned -Scope CurrentUser
   ```

---

### 🔴 ネットワーク・接続問題

#### ❌ npm パッケージダウンロード失敗

**症状**:
```
npm ERR! network request failed
npm ERR! network timeout
```

**解決法**:
1. **ネットワーク設定確認**:
   ```cmd
   # DNS確認
   nslookup registry.npmjs.org
   
   # インターネット接続確認
   ping 8.8.8.8
   ```

2. **npm設定変更**:
   ```cmd
   # タイムアウト延長
   npm config set timeout 300000
   
   # レジストリ変更（企業ネットワーク内）
   npm config set registry https://registry.npmjs.org/
   ```

3. **プロキシ設定** (企業環境):
   ```cmd
   npm config set proxy http://proxy.company.com:8080
   npm config set https-proxy http://proxy.company.com:8080
   ```

#### ❌ Notion API接続エラー

**症状**:
```
Notion API Error: Unauthorized (401)
Could not connect to Notion database
```

**解決法**:
1. **API キー確認**:
   - [Notion Developers](https://www.notion.so/my-integrations)で確認
   - `.env`ファイルの`NOTION_API_KEY`設定確認

2. **データベース権限確認**:
   - Notionデータベースに作成したIntegrationが招待されているか確認
   - データベースIDが正しいか確認

3. **テスト接続**:
   ```cmd
   # PowerShellでテスト
   $headers = @{ 'Authorization' = 'Bearer YOUR_NOTION_API_KEY'; 'Notion-Version' = '2022-06-28' }
   Invoke-RestMethod -Uri 'https://api.notion.com/v1/databases/YOUR_DATABASE_ID' -Headers $headers
   ```

---

### 🔴 ビルド・デプロイ問題

#### ❌ 本番ビルドが失敗する

**症状**:
```
npm run build
Build failed with errors
Module not found
```

**解決法**:
1. **依存関係確認**:
   ```cmd
   npm audit
   npm audit fix
   ```

2. **TypeScriptエラー確認**:
   ```cmd
   # フロントエンド
   cd frontend
   npx tsc --noEmit
   
   # バックエンド  
   cd backend
   npx tsc --noEmit
   ```

3. **環境変数設定**:
   ```cmd
   # 本番環境変数確認
   set NODE_ENV=production
   npm run build
   ```

#### ❌ Docker環境で文字化け

**症状**:
- コンテナ内で日本語が表示されない
- ログに文字化けが発生

**解決法**:
1. **Dockerfile修正**:
   ```dockerfile
   # ロケール設定追加
   ENV LANG=ja_JP.UTF-8
   ENV LC_ALL=ja_JP.UTF-8
   ```

2. **docker-compose.yml修正**:
   ```yaml
   environment:
     - LANG=ja_JP.UTF-8
     - LC_ALL=ja_JP.UTF-8
   ```

---

## 🔧 診断ツール・コマンド

### 自動診断コマンド
```cmd
# 包括的環境チェック
npm run doctor

# 基本環境確認
npm run check

# 問題自動修正
npm run fix

# PowerShell診断スクリプト
setup-windows.ps1 -DevMode
```

### 手動診断コマンド
```cmd
# システム情報
systeminfo | findstr /C:"OS Name" /C:"OS Version" /C:"Total Physical Memory"

# Node.js環境確認
node --version
npm --version
npm config list

# ネットワーク確認  
ipconfig /all
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# プロセス確認
tasklist | findstr node
tasklist | findstr npm

# ディスク容量確認
dir C:\ /-c
```

### ログファイル確認
```cmd
# npm ログ
type %APPDATA%\npm-cache\_logs\*-debug.log

# イベントビューアー
eventvwr.msc

# PowerShellログ
Get-WinEvent -LogName "Windows PowerShell"
```

---

## 📞 サポート・エスカレーション

### セルフヘルプ手順
1. 🔍 **このガイドで問題検索**
2. 🏥 **環境診断実行**: `npm run doctor`
3. 🔧 **自動修復試行**: `npm run fix`
4. 📋 **要件確認**: `requirements-windows.txt`
5. 📖 **README確認**: 基本セットアップ手順

### エスカレーション基準
以下の場合は外部サポートに相談：
- ✅ 上記手順をすべて試しても解決しない
- ✅ セキュリティポリシーで制限される
- ✅ 企業ネットワーク固有の問題
- ✅ ハードウェア起因の問題

### 問題報告に含める情報
```cmd
# 以下の情報を取得して報告
echo "=== システム情報 ==="
systeminfo | findstr /C:"OS Name" /C:"OS Version"

echo "=== Node.js情報 ==="
node --version
npm --version

echo "=== 環境診断結果 ==="
npm run doctor

echo "=== エラーログ ==="
# 発生したエラーメッセージの全文
```

### 連絡先
- **GitHub Issues**: [プロジェクトIssues](https://github.com/your-repo/timecard_web_v3/issues)
- **緊急時**: README.mdのサポートセクション参照

---

## 🔄 定期メンテナンス

### 週次メンテナンス
```cmd
# 依存関係更新確認
npm outdated

# セキュリティ監査
npm audit

# 不要ファイル削除
npm cache clean --force
```

### 月次メンテナンス  
```cmd
# Node.js更新確認
node --version
# 最新LTSと比較

# 環境再構築
setup-windows.ps1 -Force

# パフォーマンステスト
npm run build
# ビルド時間を記録
```

---

**🎯 このガイドで解決しない場合は、`npm run doctor`の結果と共にGitHub Issuesで報告してください。**