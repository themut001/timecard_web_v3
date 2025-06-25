#!/usr/bin/env node

/**
 * 一般的な問題の自動修正スクリプト
 * Windows環境でのタイムカードアプリ開発時の問題を自動修正
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// カラー出力
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function colorLog(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('');
  colorLog(`🔧 ${message}`, 'magenta');
  colorLog('='.repeat(60), 'blue');
}

function success(message) {
  colorLog(`✅ ${message}`, 'green');
}

function error(message) {
  colorLog(`❌ ${message}`, 'red');
}

function warning(message) {
  colorLog(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  colorLog(`💡 ${message}`, 'cyan');
}

function status(message) {
  colorLog(`🔄 ${message}`, 'blue');
}

// コマンド実行ヘルパー
function execCommand(command, silent = false) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: silent ? 'pipe' : 'inherit',
      timeout: 30000 
    });
    return { success: true, output: result.trim() };
  } catch (error) {
    return { success: false, error: error.message, output: '' };
  }
}

// ファイル安全書き込み
function safeWriteFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    error(`ファイル書き込みエラー: ${error.message}`);
    return false;
  }
}

// 修正処理クラス
class FixManager {
  constructor() {
    this.fixedCount = 0;
    this.skippedCount = 0;
    this.errorCount = 0;
  }

  async runFix(name, description, fixFunction) {
    status(`${description}を実行中...`);
    try {
      const result = await fixFunction();
      if (result) {
        success(`${name}: 修正完了`);
        this.fixedCount++;
      } else {
        warning(`${name}: スキップ`);
        this.skippedCount++;
      }
    } catch (err) {
      error(`${name}: エラー - ${err.message}`);
      this.errorCount++;
    }
  }

  getSummary() {
    return {
      fixed: this.fixedCount,
      skipped: this.skippedCount,
      errors: this.errorCount
    };
  }
}

// 修正機能の実装
class AutoFixer {
  
  // .envファイルの作成・修正
  static fixEnvFile() {
    if (fs.existsSync('.env')) {
      info('.env ファイルは既に存在します');
      return false;
    }

    if (!fs.existsSync('.env.example')) {
      // .env.exampleが存在しない場合は基本的な内容で作成
      const defaultEnv = `# Timecard Web v3 環境変数設定
# 開発環境用のデフォルト設定

# データベース設定 (SQLiteを使用)
DATABASE_URL="file:./dev.db"

# PostgreSQL使用時 (コメントアウトを解除)
# DATABASE_URL="postgresql://postgres:password@localhost:5432/timecard_dev"

# 認証設定
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-${Date.now()}"
JWT_EXPIRES_IN="7d"

# サーバー設定
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Notion連携 (オプション)
# NOTION_API_KEY="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
# NOTION_DATABASE_ID="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ログ設定
LOG_LEVEL="info"
`;
      
      if (safeWriteFile('.env', defaultEnv)) {
        success('.env ファイルを作成しました');
        return true;
      }
    } else {
      // .env.exampleからコピー
      try {
        fs.copyFileSync('.env.example', '.env');
        success('.env.example から .env ファイルを作成しました');
        return true;
      } catch (err) {
        error(`.env ファイルの作成に失敗: ${err.message}`);
        return false;
      }
    }
    return false;
  }

  // npmキャッシュクリア
  static fixNpmCache() {
    status('npm キャッシュをクリア中...');
    const result = execCommand('npm cache clean --force', true);
    return result.success;
  }

  // 依存関係の再インストール
  static fixDependencies() {
    const hasNodeModules = fs.existsSync('node_modules');
    const hasFrontendModules = fs.existsSync('frontend/node_modules');
    const hasBackendModules = fs.existsSync('backend/node_modules');

    if (hasNodeModules && hasFrontendModules && hasBackendModules) {
      info('依存関係は既にインストールされています');
      return false;
    }

    status('依存関係をインストール中...');
    
    // ルート依存関係
    if (!hasNodeModules) {
      const result = execCommand('npm install --no-audit --no-fund');
      if (!result.success) return false;
    }

    // フロントエンド依存関係
    if (!hasFrontendModules && fs.existsSync('frontend/package.json')) {
      process.chdir('frontend');
      const frontendResult = execCommand('npm install --no-audit --no-fund');
      process.chdir('..');
      if (!frontendResult.success) return false;
    }

    // バックエンド依存関係
    if (!hasBackendModules && fs.existsSync('backend/package.json')) {
      process.chdir('backend');
      const backendResult = execCommand('npm install --no-audit --no-fund');
      process.chdir('..');
      if (!backendResult.success) return false;
    }

    return true;
  }

  // データベースセットアップ
  static fixDatabase() {
    if (!fs.existsSync('backend/package.json')) {
      info('バックエンドが見つかりません。データベース設定をスキップします');
      return false;
    }

    status('データベースを設定中...');
    
    // まずSQLite用のセットアップを試行
    process.chdir('backend');
    let result = execCommand('npm run db:setup:sqlite 2>nul', true);
    
    if (!result.success) {
      // 通常のセットアップを試行
      result = execCommand('npm run db:migrate', true);
    }
    
    process.chdir('..');
    return result.success;
  }

  // VS Code設定ファイルの作成
  static fixVSCodeSettings() {
    const vscodeDir = '.vscode';
    const settingsFile = path.join(vscodeDir, 'settings.json');
    const extensionsFile = path.join(vscodeDir, 'extensions.json');

    if (fs.existsSync(settingsFile) && fs.existsSync(extensionsFile)) {
      info('VS Code設定は既に存在します');
      return false;
    }

    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir, { recursive: true });
    }

    // settings.json
    const settings = {
      "files.eol": "\\n",
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
        "**/build": true,
        "**/.env": true
      }
    };

    // extensions.json
    const extensions = {
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
    };

    let success_count = 0;

    if (!fs.existsSync(settingsFile)) {
      if (safeWriteFile(settingsFile, JSON.stringify(settings, null, 2))) {
        success_count++;
      }
    }

    if (!fs.existsSync(extensionsFile)) {
      if (safeWriteFile(extensionsFile, JSON.stringify(extensions, null, 2))) {
        success_count++;
      }
    }

    return success_count > 0;
  }

  // ポート競合解決（情報提供）
  static fixPortConflicts() {
    const ports = [3000, 5000];
    const conflicts = [];

    ports.forEach(port => {
      const result = execCommand(`netstat -ano | findstr :${port}`, true);
      if (result.success && result.output.trim()) {
        conflicts.push(port);
      }
    });

    if (conflicts.length === 0) {
      info('ポート競合は検出されませんでした');
      return false;
    }

    warning(`ポート競合が検出されました: ${conflicts.join(', ')}`);
    info('解決方法:');
    info('  1. タスクマネージャーで該当プロセスを終了');
    info('  2. 別ポートで起動: set PORT=3001 && npm run dev');
    info('  3. システム再起動');

    // 競合プロセス情報を表示
    conflicts.forEach(port => {
      const result = execCommand(`netstat -ano | findstr :${port}`, true);
      if (result.success) {
        info(`ポート ${port} 使用プロセス情報:`);
        const lines = result.output.split('\\n');
        lines.forEach(line => {
          if (line.trim()) {
            const parts = line.trim().split(/\\s+/);
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid)) {
              const processResult = execCommand(`tasklist /FI "PID eq ${pid}"`, true);
              if (processResult.success) {
                info(`  PID ${pid}: ${processResult.output.split('\\n')[3] || 'Unknown'}`);
              }
            }
          }
        });
      }
    });

    return true; // 情報提供として成功扱い
  }

  // 権限問題の修正
  static fixPermissions() {
    if (os.platform() !== 'win32') {
      return false;
    }

    // npm設定の最適化
    const npmCachePath = path.join(os.homedir(), '.npm-cache');
    const npmPrefix = path.join(os.homedir(), '.npm-global');

    try {
      if (!fs.existsSync(npmCachePath)) {
        fs.mkdirSync(npmCachePath, { recursive: true });
      }
      if (!fs.existsSync(npmPrefix)) {
        fs.mkdirSync(npmPrefix, { recursive: true });
      }

      // npm設定の更新
      execCommand(`npm config set cache "${npmCachePath}"`, true);
      execCommand(`npm config set prefix "${npmPrefix}"`, true);
      
      success('npm権限設定を最適化しました');
      return true;
    } catch (err) {
      warning(`権限設定の最適化に失敗: ${err.message}`);
      return false;
    }
  }

  // セキュリティ監査の実行
  static fixSecurity() {
    status('セキュリティ監査を実行中...');
    const auditResult = execCommand('npm audit fix --force', true);
    
    if (auditResult.success) {
      success('セキュリティ脆弱性を修正しました');
      return true;
    } else {
      warning('セキュリティ監査で修正可能な脆弱性は見つかりませんでした');
      return false;
    }
  }

  // ログディレクトリの作成
  static fixLogDirectories() {
    const logDirs = ['logs', 'backend/logs', 'frontend/logs'];
    let created = 0;

    logDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir, { recursive: true });
          created++;
        } catch (err) {
          // ディレクトリ作成失敗は無視
        }
      }
    });

    if (created > 0) {
      success(`${created} 個のログディレクトリを作成しました`);
      return true;
    }

    return false;
  }
}

// メイン修正処理
async function runAutoFix() {
  header('Timecard Web v3 自動修正ツール');
  colorLog(`実行日時: ${new Date().toLocaleString('ja-JP')}`, 'cyan');
  colorLog(`実行環境: ${os.platform()} ${os.release()}`, 'cyan');

  const fixManager = new FixManager();

  // 修正処理の実行
  await fixManager.runFix(
    'ENV',
    '環境変数ファイルの作成',
    AutoFixer.fixEnvFile
  );

  await fixManager.runFix(
    'CACHE',
    'npmキャッシュのクリア',
    AutoFixer.fixNpmCache
  );

  await fixManager.runFix(
    'DEPS',
    '依存関係の修正',
    AutoFixer.fixDependencies
  );

  await fixManager.runFix(
    'DB',
    'データベースセットアップ',
    AutoFixer.fixDatabase
  );

  await fixManager.runFix(
    'VSCODE',
    'VS Code設定の作成',
    AutoFixer.fixVSCodeSettings
  );

  await fixManager.runFix(
    'PORTS',
    'ポート競合の確認',
    AutoFixer.fixPortConflicts
  );

  await fixManager.runFix(
    'PERMS',
    '権限問題の修正',
    AutoFixer.fixPermissions
  );

  await fixManager.runFix(
    'SECURITY',
    'セキュリティ監査',
    AutoFixer.fixSecurity
  );

  await fixManager.runFix(
    'LOGS',
    'ログディレクトリの作成',
    AutoFixer.fixLogDirectories
  );

  // 結果サマリー
  header('修正結果サマリー');
  const summary = fixManager.getSummary();

  colorLog('', 'white');
  success(`✅ 修正完了: ${summary.fixed} 件`);
  if (summary.skipped > 0) {
    warning(`⚠️  スキップ: ${summary.skipped} 件`);
  }
  if (summary.errors > 0) {
    error(`❌ エラー: ${summary.errors} 件`);
  }

  // 推奨次ステップ
  if (summary.fixed > 0) {
    header('推奨次ステップ');
    info('1. npm run check で環境を再確認');
    info('2. npm run dev で開発環境を起動');
    info('3. ブラウザで http://localhost:3000 にアクセス');
  }

  colorLog('', 'white');
  colorLog('自動修正完了', 'magenta');

  // 終了コード
  if (summary.errors > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// スクリプト実行
if (require.main === module) {
  try {
    runAutoFix();
  } catch (error) {
    error(`修正中にエラーが発生しました: ${error.message}`);
    process.exit(1);
  }
}