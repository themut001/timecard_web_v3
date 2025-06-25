# 🪟 タイムカードWeb v3 - Windows対応版

> **純Windows環境**で動作する社内勤怠管理・Notion連携Webアプリケーション  
> **WSL2不要** - PowerShell/Command Promptで完結

## 🚀 3分クイックスタート

### 前提条件チェック
```powershell
# PowerShellで実行
node --version  # v18.0.0以上が必要
npm --version   # v9.0.0以上が必要
git --version   # Git for Windows必須
```

### 自動セットアップ
```cmd
# 管理者権限でCommand Prompt/PowerShellを開く
git clone https://github.com/your-repo/timecard_web_v3.git
cd timecard_web_v3
setup.bat
```

### 起動確認
```cmd
npm run dev
```
✅ **成功**: http://localhost:3000 でアプリが開く  
❌ **失敗**: [トラブルシューティング](#-よくある問題と解決法)を参照

---

## 📋 システム要件

### 必須環境
- **OS**: Windows 10 (1909以降) / Windows 11
- **Node.js**: 18.0.0以上 ([公式サイトからダウンロード](https://nodejs.org/))
- **Git**: Git for Windows ([公式サイトからダウンロード](https://git-scm.com/))
- **メモリ**: 8GB以上推奨
- **ディスク**: 5GB以上の空き容量

### オプション
- **PostgreSQL**: 本格運用時 (開発時はSQLite自動利用)
- **Docker Desktop**: コンテナ環境使用時
- **Visual Studio Code**: 開発エディタ推奨

---

## ⚙️ 詳細セットアップ手順

### ステップ1: 依存関係のインストール

#### Node.js (必須)
1. [Node.js公式サイト](https://nodejs.org/)からLTS版をダウンロード
2. インストーラーを実行
3. 確認: `node --version` (18.0.0以上)

#### Git for Windows (必須)
1. [Git公式サイト](https://git-scm.com/)からダウンロード
2. インストール時の推奨設定:
   - ✅ Add Git to PATH
   - ✅ Checkout as-is, commit Unix-style line endings
3. 確認: `git --version`

#### PostgreSQL (オプション)
本格運用時のみ。開発環境では自動的にSQLiteを使用。

1. [PostgreSQL公式サイト](https://www.postgresql.org/download/windows/)からダウンロード
2. デフォルト設定でインストール
3. パスワードを記録（後で`.env`ファイルに設定）

### ステップ2: プロジェクトのセットアップ

```cmd
# 1. プロジェクトをクローン
git clone https://github.com/your-repo/timecard_web_v3.git
cd timecard_web_v3

# 2. 自動セットアップ実行
setup.bat

# 3. 環境変数設定（必要な場合のみ）
copy .env.example .env
notepad .env

# 4. 開発環境起動
npm run dev
```

### ステップ3: 動作確認

1. **フロントエンド**: http://localhost:3000
2. **API**: http://localhost:5000/api/health
3. **初期ログイン**: 
   - ID: `admin@example.com`
   - Password: `admin123`

---

## 🛠 利用可能なコマンド

### 基本コマンド
```cmd
npm run dev          # 開発環境起動（推奨）
npm run dev:sqlite   # SQLite使用で開発環境起動
npm run build        # 本番用ビルド
npm run start        # 本番環境起動
npm run test         # テスト実行
```

### 開発支援コマンド
```cmd
npm run setup        # 初期セットアップ
npm run check        # 環境診断
npm run fix          # 一般的な問題の自動修正
npm run doctor       # 包括的な環境チェック
```

### データベース管理
```cmd
npm run db:migrate   # データベース移行
npm run db:seed      # 初期データ投入
npm run db:reset     # データベースリセット
```

---

## ⚠️ よくある問題と解決法

### 🔴 「npm install」が失敗する

**症状**: `EACCES` や `permission denied` エラー

**解決法**:
```cmd
# 管理者権限でコマンドプロンプトを再起動
# Windows + R → cmd → Ctrl + Shift + Enter
npm install
```

### 🔴 ポート3000が使用中

**症状**: `Port 3000 is already in use`

**解決法**:
```cmd
# 使用中のプロセスを確認
netstat -ano | findstr :3000

# タスクマネージャーでプロセス終了、または別ポート使用
set PORT=3001 && npm run dev
```

### 🔴 データベース接続エラー

**症状**: `Database connection failed`

**解決法**:
```cmd
# SQLiteモードで起動（推奨）
npm run dev:sqlite

# またはPostgreSQLサービス開始
net start postgresql-x64-14
```

### 🔴 Windows Defenderの干渉

**症状**: ファイルアクセスが異常に遅い

**解決法**:
1. Windows Defender → ウイルスと脅威の防止
2. 設定の管理 → 除外の追加
3. フォルダーを除外: プロジェクトフォルダー

### 🔴 「.env」ファイルが見つからない

**症状**: `Environment variables not loaded`

**解決法**:
```cmd
# .envファイルを作成
copy .env.example .env
notepad .env
```

---

## 🔧 環境変数設定

`.env`ファイル（基本設定）:
```env
# データベース設定
DATABASE_URL="file:./dev.db"  # SQLite使用時
# DATABASE_URL="postgresql://postgres:password@localhost:5432/timecard_dev"  # PostgreSQL使用時

# 認証設定
JWT_SECRET="your-super-secret-jwt-key-here-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Notion連携（オプション）
NOTION_API_KEY="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NOTION_DATABASE_ID="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 環境設定
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

---

## 📱 主な機能

### 👥 社員向け機能
- ✅ **出勤/退勤打刻** - ワンクリックで勤怠記録
- ✅ **日報作成** - Notionタグ連携で工数管理
- ✅ **勤怠履歴** - カレンダー表示・CSV出力
- ✅ **申請機能** - 有給・残業・遅刻早退申請

### 👨‍💼 管理者向け機能
- ✅ **社員管理** - 一覧・検索・権限管理
- ✅ **勤怠管理** - 全社員状況・異常検知
- ✅ **工数分析** - Notion連携・プロジェクト別集計
- ✅ **レポート** - 部署別・期間別各種分析

### 🔗 外部連携
- ✅ **Notion API** - プロジェクトタグ同期
- ✅ **自動同期** - 最大1000件のタグ管理
- ✅ **工数集計** - タグ別・期間別工数分析

---

## 🎨 技術スタック

### フロントエンド
- **React 18** + **TypeScript**
- **Tailwind CSS** + **Liquid Glass Design**
- **Redux Toolkit** (状態管理)
- **React Router** (ルーティング)

### バックエンド
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** (データベース)
- **JWT認証** + **bcrypt**
- **Notion API** (外部連携)

### データベース
- **SQLite** (開発環境・デフォルト)
- **PostgreSQL** (本番環境・推奨)

---

## 🧪 開発環境の動作確認

### 基本動作チェック
```cmd
# 1. 依存関係確認
npm run check

# 2. 開発環境起動
npm run dev

# 3. 各エンドポイント確認
curl http://localhost:5000/api/health
curl http://localhost:3000
```

### 成功時の画面
1. **ターミナル**: `✅ Server running on port 5000` と表示
2. **ブラウザ**: http://localhost:3000 でログイン画面表示
3. **API**: http://localhost:5000/api/health で `{"status": "ok"}` 応答

---

## 🚢 本番環境デプロイ

### Windowsサーバー向け
```cmd
# 1. 本番用ビルド
npm run build

# 2. 本番環境起動
npm run start

# 3. プロセス管理（PM2推奨）
npm install -g pm2
pm2 start npm --name "timecard-app" -- start
```

### Docker使用時
```cmd
# 1. イメージビルド
docker-compose build

# 2. 起動
docker-compose up -d

# 3. 確認
docker-compose ps
```

---

## 📞 サポート

### 問題報告
- **GitHub Issues**: [Issues](https://github.com/your-repo/timecard_web_v3/issues)
- **バグ報告**: 詳細な環境情報を含めて報告

### 診断情報の取得
```cmd
# 環境情報を取得
npm run doctor > diagnostic-report.txt
```

### よくある質問
1. **Q**: SQLiteとPostgreSQLどちらを使うべき？
   **A**: 開発・小規模運用はSQLite、本格運用はPostgreSQLを推奨

2. **Q**: Notion連携は必須？
   **A**: オプション機能。`.env`で`NOTION_API_KEY`を設定しない場合は無効化

3. **Q**: Windows 10 Homeで動作する？
   **A**: はい。Docker不使用なら全エディションで動作

---

## 📝 更新履歴

### v3.0.0 (2025-01-25)
- ✅ Windows純正環境対応
- ✅ WSL2依存関係削除
- ✅ 自動セットアップスクリプト強化
- ✅ SQLite標準サポート
- ✅ トラブルシューティング充実

### v2.x.x
- Docker + WSL2ベース環境

---

## 📄 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照

---

**🎉 セットアップ完了後、お疲れ様でした！**  
**問題がある場合は[トラブルシューティング](#-よくある問題と解決法)または[サポート](#-サポート)を確認してください。**