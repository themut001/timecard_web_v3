#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}${colors.bright}🚀 Timecard Web v3 - 環境設定セットアップ${colors.reset}\n`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function setupEnvironment() {
  const envPath = path.join(__dirname, '../.env');
  const examplePath = path.join(__dirname, '../.env.example');

  // .env.example が存在するかチェック
  if (!fs.existsSync(examplePath)) {
    console.log(`${colors.yellow}⚠️  .env.example ファイルが見つかりません。デフォルト設定を作成します。${colors.reset}`);
    createDefaultEnvExample();
  }

  // 既存の .env ファイルがある場合の確認
  if (fs.existsSync(envPath)) {
    console.log(`${colors.yellow}ℹ️  既存の .env ファイルが見つかりました。${colors.reset}`);
    const overwrite = await question('上書きしますか？ (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log(`${colors.green}✅ 既存の設定を使用します。${colors.reset}`);
      rl.close();
      return;
    }
  }

  console.log(`${colors.blue}📝 環境変数を設定します。Enterキーでデフォルト値を使用できます。${colors.reset}\n`);

  // データベース設定
  console.log(`${colors.bright}📊 データベース設定${colors.reset}`);
  const dbType = await question('データベースタイプを選択してください (1: PostgreSQL, 2: SQLite) [1]: ');
  
  let dbUrl;
  if (dbType === '2') {
    dbUrl = 'file:./dev.db';
    console.log(`${colors.green}✅ SQLite データベースを使用します（設定不要）${colors.reset}`);
  } else {
    const dbHost = await question('データベースホスト [localhost]: ') || 'localhost';
    const dbPort = await question('データベースポート [5432]: ') || '5432';
    const dbName = await question('データベース名 [timecard_dev]: ') || 'timecard_dev';
    const dbUser = await question('データベースユーザー [postgres]: ') || 'postgres';
    const dbPass = await question('データベースパスワード [password]: ') || 'password';
    dbUrl = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
  }

  // JWT設定
  console.log(`\n${colors.bright}🔐 JWT認証設定${colors.reset}`);
  const jwtSecret = await question('JWT Secret (ランダム文字列) [timecard-jwt-secret-key]: ') || 'timecard-jwt-secret-key';
  const jwtRefreshSecret = await question('JWT Refresh Secret [timecard-refresh-secret-key]: ') || 'timecard-refresh-secret-key';

  // アプリケーション設定
  console.log(`\n${colors.bright}⚙️  アプリケーション設定${colors.reset}`);
  const nodeEnv = await question('実行環境 [development]: ') || 'development';
  const port = await question('バックエンドポート [5000]: ') || '5000';
  const frontendUrl = await question('フロントエンドURL [http://localhost:3000]: ') || 'http://localhost:3000';

  // Notion API設定（オプション）
  console.log(`\n${colors.bright}🔗 Notion API設定（オプション）${colors.reset}`);
  console.log(`${colors.yellow}💡 Notion連携が不要な場合は空のままEnterを押してください${colors.reset}`);
  const notionApiKey = await question('Notion API Key: ') || '';
  const notionDbId = await question('Notion Database ID: ') || '';

  // .env ファイルを作成
  const envContent = `# データベース設定
DATABASE_URL="${dbUrl}"

# JWT認証
JWT_SECRET="${jwtSecret}"
JWT_REFRESH_SECRET="${jwtRefreshSecret}"

# アプリケーション設定
NODE_ENV="${nodeEnv}"
PORT=${port}
FRONTEND_URL="${frontendUrl}"

# Notion API (オプション)
${notionApiKey ? `NOTION_API_KEY="${notionApiKey}"` : '# NOTION_API_KEY=""'}
${notionDbId ? `NOTION_DATABASE_ID="${notionDbId}"` : '# NOTION_DATABASE_ID=""'}

# メール設定 (将来の機能拡張用)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT=587
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"
`;

  fs.writeFileSync(envPath, envContent);
  
  console.log(`\n${colors.green}${colors.bright}✅ 環境設定が完了しました！${colors.reset}`);
  console.log(`${colors.green}📁 .env ファイルが作成されました${colors.reset}`);
  
  if (dbType !== '2') {
    console.log(`\n${colors.yellow}📝 次の手順:${colors.reset}`);
    console.log(`${colors.yellow}1. PostgreSQLがインストールされていることを確認してください${colors.reset}`);
    console.log(`${colors.yellow}2. データベース "${dbName || 'timecard_dev'}" を作成してください${colors.reset}`);
    console.log(`${colors.yellow}3. npm run dev を実行してアプリケーションを起動してください${colors.reset}`);
  } else {
    console.log(`\n${colors.green}🎉 SQLiteを使用するため、すぐに開発を開始できます！${colors.reset}`);
    console.log(`${colors.green}npm run dev:sqlite を実行してアプリケーションを起動してください${colors.reset}`);
  }

  rl.close();
}

function createDefaultEnvExample() {
  const defaultContent = `# データベース設定
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
`;

  fs.writeFileSync(path.join(__dirname, '../.env.example'), defaultContent);
}

// エラーハンドリング
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}⚠️  セットアップがキャンセルされました${colors.reset}`);
  rl.close();
  process.exit(0);
});

// 実行
setupEnvironment().catch(error => {
  console.error(`${colors.red}❌ エラーが発生しました: ${error.message}${colors.reset}`);
  rl.close();
  process.exit(1);
});