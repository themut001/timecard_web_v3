<div align="center">

# 🏢 Timecard Web v3
## 社内勤怠管理・Notion連携アプリケーション

![Node.js](https://img.shields.io/badge/Node.js-18+-44cc11?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-API-000000?style=for-the-badge&logo=notion&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**✨ Liquid Glass デザインを採用した現代的な勤怠管理システム**  
*Notion API との連携により、プロジェクトタグ管理と工数集計を実現*

[🚀 クイックスタート](#-クイックスタート) • [📖 使用方法](#-使用方法) • [🛠 開発](#-開発) • [🤝 コントリビューション](#-コントリビューション)

</div>

---

## 📋 目次

- [🎯 概要](#-概要)
- [✨ 主要機能](#-主要機能)  
- [🛠 技術スタック](#-技術スタック)
- [🚀 クイックスタート](#-クイックスタート)
  - [前提条件](#前提条件)
  - [簡単セットアップ](#簡単セットアップ)
  - [アクセス方法](#アクセス方法)
- [⚙️ 詳細セットアップ](#️-詳細セットアップ)
  - [Windows環境](#windows環境)
  - [Linux/Mac環境](#linuxmac環境)
  - [手動セットアップ](#手動セットアップ)
- [📝 使用方法](#-使用方法)
- [🛠 開発](#-開発)
  - [開発環境の起動](#開発環境の起動)
  - [主要コマンド](#主要コマンド)
  - [開発用アカウント](#開発用アカウント)
- [🚨 トラブルシューティング](#-トラブルシューティング)
- [📊 API仕様](#-api仕様)
- [🏗 プロジェクト構造](#-プロジェクト構造)
- [🤝 コントリビューション](#-コントリビューション)
- [📚 関連ドキュメント](#-関連ドキュメント)
- [📞 サポート](#-サポート)

---

## 🎯 概要

Liquid Glass デザインを採用した現代的な勤怠管理システムです。Notion API との連携により、プロジェクトタグ管理と工数集計を実現します。

**🎨 デザインの特徴**
- 美しいガラスモーフィズム UI
- パステルカラーのカラーパレット  
- 直感的で使いやすいインターフェース

**🔗 Notion連携機能**
- プロジェクトタグの自動同期（最大1000件）
- タグ別工数入力・集計・分析
- リアルタイムでの工数管理

## ✨ 主要機能

- 🕐 **勤怠管理**: 出退勤打刻、履歴表示、申請機能
- 🔗 **Notion連携**: プロジェクトタグの自動同期（最大1000件）
- 📊 **工数管理**: タグ別工数入力・集計・分析
- 📝 **日報機能**: 作業内容と工数の記録
- 👥 **管理機能**: 社員管理、レポート出力
- 🎨 **Liquid Glassデザイン**: 美しいガラスモーフィズムUI

## 🛠 技術スタック

### フロントエンド
- **React 18+** with TypeScript
- **Tailwind CSS** + カスタムLiquid Glassデザイン
- **Framer Motion** アニメーション
- **React Router v7** ルーティング
- **Redux Toolkit** 状態管理

### バックエンド
- **Node.js + Express** with TypeScript
- **Prisma ORM** + PostgreSQL
- **JWT認証** + Refresh Token
- **Notion API v1** 連携

### インフラ・開発環境
- **Docker + Docker Compose** コンテナ化
- **Nginx** リバースプロキシ
- **WSL2対応** Windows開発環境
- **Hot Reload** 開発効率化

## 🚀 クイックスタート

### 前提条件

<div align="center">

| 🪟 **Windows（推奨）** | 🐧 **Linux/Mac** |
|----------------------|------------------|
| • **Node.js 18+** | • **Node.js 18+** |
| • **Git for Windows** | • **Git** |
| • **VS Code** (推奨) | • **VS Code** (推奨) |
| • **PostgreSQL** (オプション) | • **PostgreSQL** (オプション) |

</div>

> 🎉 **WSL不要！** Windows ネイティブ環境で開発可能です

### 🚀 超簡単セットアップ（3分で完了）

<div align="center">

**🪟 Windows ユーザー（推奨）**

</div>

**1️⃣ リポジトリをクローン**
\`\`\`cmd
git clone <repository-url>
cd timecard_web_v3
\`\`\`

**2️⃣ ワンクリックセットアップ実行**
\`\`\`cmd
setup.bat
\`\`\`

または手動で：
\`\`\`cmd
npm run setup
\`\`\`

**3️⃣ 開発サーバー起動**
\`\`\`cmd
npm run dev
\`\`\`

**🎊 完了！** ブラウザで http://localhost:3000 にアクセス

---

<div align="center">

**🐧 Linux/Mac ユーザー**

</div>

\`\`\`bash
git clone <repository-url>
cd timecard_web_v3
npm run setup
npm run dev
\`\`\`

### アクセス方法

<div align="center">

| サービス | URL | 説明 |
|---------|-----|------|
| 🖥 **フロントエンド** | http://localhost:3000 | メインアプリケーション |
| 🔌 **API** | http://localhost:5000/api | バックエンドAPI |
| 🗄️ **データベース** | localhost:5432 | PostgreSQL |

</div>

---

## ⚙️ 詳細セットアップ・代替手順

<details>
<summary><strong>🪟 Windows ネイティブ環境（推奨）</strong></summary>

### Windows環境での詳細セットアップ

#### 1. Node.js のインストール
1. [Node.js 公式サイト](https://nodejs.org/)から LTS版をダウンロード
2. インストーラーを実行（すべてデフォルト設定でOK）
3. コマンドプロンプトで確認：
   \`\`\`cmd
   node --version
   npm --version
   \`\`\`

#### 2. PostgreSQL のインストール（オプション）
1. [PostgreSQL 公式サイト](https://www.postgresql.org/download/windows/)からダウンロード
2. インストール時にパスワードを設定（例：\`password\`）
3. ポート：5432（デフォルト）

#### 3. 環境変数の設定（簡単版）
プロジェクトルートで \`.env.example\` を \`.env\` にコピーして編集：
\`\`\`cmd
copy .env.example .env
notepad .env
\`\`\`

</details>

<details>
<summary><strong>🔧 SQLite を使用した超簡単セットアップ</strong></summary>

### SQLite 版（データベース設定不要）

PostgreSQL の代わりに SQLite を使用することで、データベースのインストールが不要になります：

#### 1. SQLite モードで起動
\`\`\`cmd
npm run dev:sqlite
\`\`\`

#### 2. 特徴
- ✅ データベースのインストール不要
- ✅ ファイルベースのデータベース
- ✅ 開発・テスト用に最適
- ⚠️ 本番環境では PostgreSQL を推奨

</details>

<details>
<summary><strong>🐳 Docker を使用したセットアップ（従来版）</strong></summary>

### Docker 環境でのセットアップ

Docker Desktop が必要ですが、WSL2 は不要です：

#### 1. Docker Desktop のインストール
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)をダウンロード
2. **WSL2 統合は無効** にしてインストール

#### 2. Docker 環境での起動
\`\`\`cmd
docker-compose up -d
\`\`\`

#### 3. データベースの初期化
\`\`\`cmd
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma generate
docker-compose exec backend npm run db:seed
\`\`\`

</details>

<details>
<summary><strong>🔧 Notion API設定（オプション）</strong></summary>

### Notion 連携の設定

Notion との連携が必要な場合のみ設定してください：

#### 1. Notion Integration の作成
1. [Notion Developers](https://www.notion.so/my-integrations)にアクセス
2. 「New integration」をクリック
3. 名前を入力して「Submit」

#### 2. データベースの共有
1. Notion でプロジェクト管理用データベースを開く
2. 右上の「Share」→ 作成した Integration を招待

#### 3. 環境変数に設定
\`.env\` ファイルに以下を追加：
\`\`\`env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`

</details>

### 🔧 開発環境の起動

#### Windows (WSL2)
\`\`\`bash
# WSL2 Ubuntuターミナルで実行
./scripts/dev.sh
\`\`\`

#### Linux/Mac
\`\`\`bash
./scripts/dev.sh
\`\`\`

### 🗄️ データベースのリセット

\`\`\`bash
./scripts/reset-db.sh
\`\`\`

---

## 🚨 トラブルシューティング

<details>
<summary><strong>🪟 Windows固有の問題</strong></summary>

### WSL2でDockerが起動しない
\`\`\`bash
# WSL2のメモリ制限を確認
cat /proc/meminfo | grep MemTotal

# Docker Desktopの再起動
# WindowsでDocker Desktopを右クリック → Restart
\`\`\`

### ファイルパーミッションエラー
\`\`\`bash
# WSL2でスクリプトに実行権限を付与
chmod +x setup.sh
chmod +x scripts/*.sh
\`\`\`

### ポート競合エラー
\`\`\`bash
# 使用中のポートを確認
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# プロセスを終了（TaskManager使用推奨）
\`\`\`

### VS Code設定
推奨設定ファイル \`.vscode/settings.json\`:
\`\`\`json
{
  "remote.WSL.fileWatcher.polling": true,
  "files.eol": "\\n",
  "terminal.integrated.defaultProfile.windows": "WSL"
}
\`\`\`

</details>

<details>
<summary><strong>🔧 共通の問題</strong></summary>

### Node.jsバージョンエラー
\`\`\`bash
node --version  # 18以上が必要
\`\`\`

### Docker Composeエラー
\`\`\`bash
docker --version
docker-compose --version
docker-compose ps
docker-compose logs
\`\`\`

### データベース接続エラー
\`\`\`bash
# PostgreSQLコンテナの確認
docker-compose exec postgres psql -U postgres -d timecard_dev

# データベースの再構築
./scripts/reset-db.sh
\`\`\`

</details>

<details>
<summary><strong>🔗 Notion API関連</strong></summary>

### 同期エラーの解決方法
1. Notion API Keyが正しく設定されているか確認
2. データベースIDが正しいか確認  
3. Integrationがデータベースに招待されているか確認

### 環境変数の確認
\`\`\`bash
echo $NOTION_API_KEY
echo $NOTION_DATABASE_ID
\`\`\`

</details>

## 📝 使用方法

### 社員ユーザー
1. ログイン後、ダッシュボードで勤務状況を確認
2. 出退勤ボタンで打刻
3. 日報画面でタグ別工数を入力
4. 履歴画面で過去の勤怠を確認

### 管理者
1. 社員管理画面で従業員情報を管理
2. Notionタグ同期でプロジェクトタグを更新
3. 工数集計でプロジェクト分析
4. レポート機能で詳細分析

## 🏗 プロジェクト構造

\`\`\`
timecard_web_v3/
├── frontend/                    # React フロントエンド
│   ├── src/
│   │   ├── components/         # UIコンポーネント
│   │   │   ├── common/        # 共通コンポーネント
│   │   │   ├── forms/         # フォームコンポーネント
│   │   │   ├── ui/            # 再利用可能UIコンポーネント
│   │   │   ├── admin/         # 管理者専用コンポーネント
│   │   │   └── performance/   # パフォーマンス最適化コンポーネント
│   │   ├── pages/             # ページコンポーネント
│   │   ├── hooks/             # カスタムフック
│   │   ├── store/             # Redux状態管理
│   │   ├── services/          # API呼び出しサービス
│   │   ├── types/             # TypeScript型定義
│   │   ├── utils/             # ユーティリティ関数
│   │   └── styles/            # スタイル設定
│   ├── public/                # 静的ファイル
│   ├── package.json           # フロントエンド依存関係
│   └── tailwind.config.js     # Tailwind CSS設定
├── backend/                    # Express バックエンド
│   ├── src/
│   │   ├── controllers/       # APIコントローラー
│   │   ├── middleware/        # ミドルウェア
│   │   ├── routes/           # ルート定義
│   │   ├── services/         # ビジネスロジック
│   │   ├── utils/            # ユーティリティ
│   │   └── types/            # TypeScript型定義
│   ├── prisma/               # データベーススキーマ
│   └── package.json          # バックエンド依存関係
├── scripts/                   # 開発用スクリプト
│   ├── setup-env.js          # 環境設定セットアップ
│   ├── setup.sh              # 自動セットアップ（Linux/Mac）
│   ├── dev.sh                # 開発環境起動
│   └── reset-db.sh           # データベースリセット
├── setup.bat                 # Windowsワンクリックセットアップ
├── package.json              # プロジェクト依存関係・スクリプト
├── docker-compose.yml         # Docker設定
├── .env.example              # 環境変数テンプレート
├── CLAUDE.md                 # プロジェクト仕様書
├── REFACTORING.md            # リファクタリングレポート
└── README.md                 # このファイル
\`\`\`

---

## 🛠 開発

### 開発環境の起動

<div align="center">

| 環境 | コマンド | 説明 |
|------|----------|------|
| 🚀 **通常** | `npm run dev` | PostgreSQL + フル機能 |
| 🔧 **簡単** | `npm run dev:sqlite` | SQLite + DB設定不要 |
| 🐳 **Docker** | `npm run docker:dev` | Docker環境 |

</div>

### 主要コマンド

<details>
<summary><strong>📦 プロジェクト管理</strong></summary>

\`\`\`cmd
REM Windows
npm run setup            # 初期セットアップ
setup.bat               # ワンクリックセットアップ
npm run dev             # 開発環境起動
npm run dev:sqlite      # SQLite版開発環境

REM データベース
npm run db:reset        # データベースリセット
npm run db:migrate      # マイグレーション実行
npm run db:seed         # 初期データ投入
\`\`\`

</details>

<details>
<summary><strong>🎨 フロントエンド</strong></summary>

\`\`\`cmd
npm run dev:frontend    # フロントエンドのみ起動
npm run build:frontend  # プロダクションビルド
npm run lint:frontend   # ESLint チェック
npm run test:frontend   # テスト実行
\`\`\`

</details>

<details>
<summary><strong>⚙️ バックエンド</strong></summary>

\`\`\`cmd
npm run dev:backend     # バックエンドのみ起動
npm run build:backend   # TypeScript ビルド
npm run start           # プロダクション起動
npm run lint:backend    # ESLint チェック
npm run test:backend    # テスト実行
\`\`\`

</details>

<details>
<summary><strong>🐳 Docker操作</strong></summary>

\`\`\`cmd
npm run docker:dev      # Docker環境起動
npm run docker:down     # Docker環境停止
npm run docker:reset    # Docker環境リセット
\`\`\`

</details>

### 開発用アカウント

<div align="center">

| 種類 | メールアドレス | パスワード |
|------|---------------|------------|
| 👨‍💼 **管理者** | admin@company.com | Admin123! |
| 👤 **一般ユーザー** | user@company.com | User123! |

</div>

### 🌿 ブランチ戦略
- \`main\`: 本番環境用安定版
- \`develop\`: 開発環境統合ブランチ
- \`feature/*\`: 機能開発ブランチ
- \`hotfix/*\`: 緊急修正ブランチ

## ⚙️ 環境変数

### 必須設定

\`.env\`ファイルで以下の変数を設定：

\`\`\`env
# データベース設定
DATABASE_URL="postgresql://postgres:password@localhost:5432/timecard_dev"

# JWT認証
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# アプリケーション設定
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Notion API (オプション)
NOTION_API_KEY="your-notion-integration-token"
NOTION_DATABASE_ID="your-notion-database-id"

# メール設定 (将来の機能拡張用)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
\`\`\`

### Windows環境での注意点

- WSL2使用時は、\`.env\`ファイルをLinux形式（LF）で保存
- Windowsパスではなく、WSL2内パス（\`/home/user/...\`）を使用

## 📊 API エンドポイント

### 認証
- \`POST /api/auth/login\` - ログイン
- \`POST /api/auth/logout\` - ログアウト
- \`POST /api/auth/refresh\` - トークン更新
- \`GET /api/auth/me\` - 現在のユーザー情報

### 勤怠管理
- \`GET /api/attendance/today\` - 今日の勤怠記録
- \`POST /api/attendance/clock-in\` - 出勤打刻
- \`POST /api/attendance/clock-out\` - 退勤打刻
- \`GET /api/attendance/records\` - 勤怠履歴
- \`GET /api/attendance/summary\` - 勤怠サマリー

### タグ管理
- \`GET /api/tags\` - タグ一覧
- \`GET /api/tags/search\` - タグ検索
- \`POST /api/tags/sync\` - Notion同期
- \`GET /api/tags/sync-status\` - 同期ステータス

### 日報・工数
- \`GET /api/reports/daily\` - 日報一覧
- \`POST /api/reports/daily\` - 日報作成
- \`GET /api/reports/effort-summary\` - 工数集計

### 管理者機能
- \`GET /api/admin/employees\` - 社員管理
- \`GET /api/admin/attendance/all\` - 全社員勤怠
- \`GET /api/admin/reports/monthly\` - 月次レポート

詳細なAPI仕様は[CLAUDE.md](./CLAUDE.md)を参照してください。

## 🤝 コントリビューション

### 開発フロー

1. **Issue作成**: 機能要求やバグ報告
2. **ブランチ作成**: \`feature/[issue-number]-[brief-description]\`
3. **開発・テスト**: コード作成とテスト実行
4. **プルリクエスト**: develop branchへのPR作成
5. **コードレビュー**: チームメンバーによるレビュー
6. **マージ**: レビュー完了後にマージ

### コーディング規約

- **TypeScript**: 厳密な型定義を使用
- **ESLint/Prettier**: コードフォーマットの統一
- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/)形式
- **テスト**: 新機能には必ずテストを追加

### プルリクエストガイドライン

- 明確なタイトルと説明を記載
- 関連するIssueをリンク
- スクリーンショット（UI変更の場合）
- 破壊的変更がある場合は明記

## 📚 関連ドキュメント

- [プロジェクト仕様書](./CLAUDE.md) - 詳細な技術仕様
- [リファクタリングレポート](./REFACTORING.md) - コード改善履歴
- [Notion API設定ガイド](./docs/notion-setup.md) - Notion連携設定
- [デプロイガイド](./docs/deployment.md) - 本番環境デプロイ手順

## 📞 サポート

### 質問・相談
- GitHub Issues: バグ報告・機能要求
- Discord: リアルタイム質問（開発チーム）
- Wiki: FAQ・Tips集

### 貢献者
- フロントエンド: React + TypeScript スペシャリスト
- バックエンド: Node.js + Express スペシャリスト  
- デザイン: UI/UXデザイナー
- DevOps: インフラエンジニア

## 📄 ライセンス

MIT License - 詳細は[LICENSE](./LICENSE)ファイルを参照

---

<div align="center">

**⭐ このプロジェクトが役立ったら、ぜひスターをお願いします！**

[🐛 バグ報告](https://github.com/your-org/timecard_web_v3/issues/new?template=bug_report.md) • [💡 機能要求](https://github.com/your-org/timecard_web_v3/issues/new?template=feature_request.md) • [📖 ドキュメント](./docs/)

</div>