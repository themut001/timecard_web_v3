#!/usr/bin/env node

/**
 * 環境診断スクリプト
 * Windows環境でのタイムカードアプリ開発環境をチェック
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
  colorLog(`🔍 ${message}`, 'magenta');
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

// コマンド実行ヘルパー
function execCommand(command, silent = false) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: silent ? 'pipe' : 'inherit',
      timeout: 10000 
    });
    return { success: true, output: result.trim() };
  } catch (error) {
    return { success: false, error: error.message, output: '' };
  }
}

// バージョン比較
function compareVersion(version1, version2) {
  const v1 = version1.replace(/^v/, '').split('.').map(Number);
  const v2 = version2.replace(/^v/, '').split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const a = v1[i] || 0;
    const b = v2[i] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}

// ポート使用チェック
function checkPort(port) {
  const result = execCommand(`netstat -ano | findstr :${port}`, true);
  return !result.success || result.output === '';
}

// ファイル存在チェック
function checkFile(filePath, required = false) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    success(`${filePath} が見つかりました`);
  } else if (required) {
    error(`${filePath} が見つかりません（必須）`);
  } else {
    warning(`${filePath} が見つかりません（オプション）`);
  }
  return exists;
}

// メイン診断処理
function runDiagnostics() {
  const issues = [];
  const warnings = [];
  const recommendations = [];

  header('Timecard Web v3 環境診断');
  colorLog(`実行日時: ${new Date().toLocaleString('ja-JP')}`, 'cyan');
  colorLog(`実行環境: ${os.platform()} ${os.release()}`, 'cyan');

  // ===== システム情報 =====
  header('システム情報');
  
  const platform = os.platform();
  const release = os.release();
  const arch = os.arch();
  const totalMem = Math.round(os.totalmem() / 1024 / 1024 / 1024);
  const freeMem = Math.round(os.freemem() / 1024 / 1024 / 1024);

  success(`OS: ${platform} ${release} (${arch})`);
  success(`メモリ: ${totalMem}GB (空き: ${freeMem}GB)`);

  if (platform !== 'win32') {
    warnings.push('Windows以外の環境では一部機能が制限される場合があります');
  }

  if (totalMem < 4) {
    issues.push(`メモリ不足: ${totalMem}GB (4GB以上必要)`);
  } else if (totalMem < 8) {
    warnings.push(`メモリ ${totalMem}GB (8GB以上推奨)`);
  }

  // ===== Node.js環境 =====
  header('Node.js環境');

  const nodeResult = execCommand('node --version', true);
  if (nodeResult.success) {
    const nodeVersion = nodeResult.output.replace(/^v/, '');
    if (compareVersion(nodeVersion, '18.0.0') >= 0) {
      success(`Node.js ${nodeVersion} (OK)`);
    } else {
      issues.push(`Node.js ${nodeVersion} (18.0.0以上必要)`);
    }
  } else {
    issues.push('Node.jsがインストールされていません');
  }

  const npmResult = execCommand('npm --version', true);
  if (npmResult.success) {
    const npmVersion = npmResult.output;
    if (compareVersion(npmVersion, '9.0.0') >= 0) {
      success(`npm ${npmVersion} (OK)`);
    } else {
      warnings.push(`npm ${npmVersion} (9.0.0以上推奨)`);
    }
  } else {
    issues.push('npmがインストールされていません');
  }

  // ===== Git環境 =====
  header('Git環境');

  const gitResult = execCommand('git --version', true);
  if (gitResult.success) {
    success(`${gitResult.output} (OK)`);
  } else {
    issues.push('Git for Windowsがインストールされていません');
  }

  // ===== プロジェクト構造 =====
  header('プロジェクト構造');

  const requiredFiles = [
    'package.json',
    'frontend/package.json',
    'backend/package.json'
  ];

  const optionalFiles = [
    '.env',
    '.env.example',
    'docker-compose.yml',
    'setup-windows.ps1'
  ];

  requiredFiles.forEach(file => {
    if (!checkFile(file, true)) {
      issues.push(`必須ファイル ${file} が見つかりません`);
    }
  });

  optionalFiles.forEach(file => {
    checkFile(file, false);
  });

  // ===== ポート使用状況 =====
  header('ポート使用状況');

  const ports = [3000, 5000, 5432];
  ports.forEach(port => {
    if (checkPort(port)) {
      success(`ポート ${port} 利用可能`);
    } else {
      warnings.push(`ポート ${port} が使用中です`);
    }
  });

  // ===== 依存関係チェック =====
  header('依存関係チェック');

  if (fs.existsSync('node_modules')) {
    success('ルート依存関係がインストールされています');
  } else {
    warnings.push('npm install を実行してください');
  }

  if (fs.existsSync('frontend/node_modules')) {
    success('フロントエンド依存関係がインストールされています');
  } else {
    warnings.push('cd frontend && npm install を実行してください');
  }

  if (fs.existsSync('backend/node_modules')) {
    success('バックエンド依存関係がインストールされています');
  } else {
    warnings.push('cd backend && npm install を実行してください');
  }

  // ===== 環境変数チェック =====
  header('環境変数');

  if (fs.existsSync('.env')) {
    success('.env ファイルが存在します');
    
    const envContent = fs.readFileSync('.env', 'utf8');
    const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
    const optionalVars = ['NOTION_API_KEY', 'NOTION_DATABASE_ID'];

    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        success(`${varName} が設定されています`);
      } else {
        warnings.push(`${varName} の設定を確認してください`);
      }
    });

    optionalVars.forEach(varName => {
      if (envContent.includes(varName)) {
        info(`${varName} が設定されています（オプション）`);
      }
    });
  } else {
    warnings.push('.env ファイルが見つかりません (.env.example をコピーしてください)');
  }

  // ===== パフォーマンス診断 =====
  header('パフォーマンス診断');

  const cpuCount = os.cpus().length;
  success(`CPU コア数: ${cpuCount}`);

  if (cpuCount < 2) {
    warnings.push('CPU コア数が少ないです（2コア以上推奨）');
  }

  // ディスク容量チェック (Windows)
  if (platform === 'win32') {
    try {
      const driveResult = execCommand('dir C:\\ /-c', true);
      if (driveResult.success) {
        success('ディスク容量を確認できました');
      }
    } catch (e) {
      info('ディスク容量の確認をスキップしました');
    }
  }

  // ===== 結果サマリー =====
  header('診断結果サマリー');

  colorLog('', 'white');
  
  if (issues.length === 0) {
    success('🎉 重大な問題は検出されませんでした！');
  } else {
    error(`❌ ${issues.length} 件の問題が検出されました:`);
    issues.forEach(issue => error(`  • ${issue}`));
  }

  if (warnings.length > 0) {
    colorLog('', 'white');
    warning(`⚠️  ${warnings.length} 件の警告があります:`);
    warnings.forEach(warn => warning(`  • ${warn}`));
  }

  // ===== 推奨アクション =====
  if (issues.length > 0 || warnings.length > 0) {
    header('推奨アクション');

    if (issues.length > 0) {
      error('重大な問題の解決:');
      if (issues.some(i => i.includes('Node.js'))) {
        info('  1. Node.js 18.x をインストール: https://nodejs.org/');
      }
      if (issues.some(i => i.includes('Git'))) {
        info('  2. Git for Windows をインストール: https://git-scm.com/');
      }
      if (issues.some(i => i.includes('package.json'))) {
        info('  3. プロジェクトのルートディレクトリで実行してください');
      }
    }

    if (warnings.length > 0) {
      warning('警告の対処:');
      if (warnings.some(w => w.includes('npm install'))) {
        info('  1. npm run setup を実行してください');
      }
      if (warnings.some(w => w.includes('.env'))) {
        info('  2. cp .env.example .env でファイルを作成してください');
      }
      if (warnings.some(w => w.includes('ポート'))) {
        info('  3. 使用中のプロセスを終了するか、別ポートを使用してください');
      }
    }

    colorLog('', 'white');
    info('自動修正を試行: npm run fix');
    info('詳細情報: TROUBLESHOOTING-WINDOWS.md を参照');
  }

  // ===== 終了処理 =====
  colorLog('', 'white');
  colorLog('診断完了', 'magenta');
  
  // 終了コード設定
  if (issues.length > 0) {
    process.exit(1);
  } else if (warnings.length > 0) {
    process.exit(2);
  } else {
    process.exit(0);
  }
}

// スクリプト実行
if (require.main === module) {
  try {
    runDiagnostics();
  } catch (error) {
    error(`診断中にエラーが発生しました: ${error.message}`);
    process.exit(1);
  }
}