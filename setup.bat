@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo 🚀 Timecard Web v3 - Windows セットアップ
echo ==========================================
echo.

REM Node.js のバージョンチェック
echo 📋 Node.js のバージョンを確認中...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js がインストールされていません
    echo    https://nodejs.org/ からダウンロードしてください
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% が見つかりました

echo.
echo 📦 依存関係をインストール中...
npm install
if errorlevel 1 (
    echo ❌ npm install に失敗しました
    pause
    exit /b 1
)

echo.
echo ⚙️  環境設定をセットアップ中...
npm run setup:env
if errorlevel 1 (
    echo ❌ 環境設定に失敗しました
    pause
    exit /b 1
)

echo.
echo 📊 データベースをセットアップ中...
npm run setup:db
if errorlevel 1 (
    echo ⚠️  データベースのセットアップに失敗しました
    echo    PostgreSQL がインストールされていない可能性があります
    echo    SQLite を使用する場合は 'npm run dev:sqlite' を実行してください
)

echo.
echo 🎉 セットアップが完了しました！
echo.
echo 📝 次の手順:
echo    1. npm run dev       - 通常の開発環境を起動
echo    2. npm run dev:sqlite - SQLite を使用した開発環境を起動
echo.
echo 💡 ブラウザで http://localhost:3000 にアクセスしてください
echo.
pause