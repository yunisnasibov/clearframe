@echo off
setlocal
cd /d "%~dp0"
set "clearframe_node=node"
where node >nul 2>nul
if errorlevel 1 set "clearframe_node=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
"%clearframe_node%" scripts/build.mjs
if errorlevel 1 goto failed
start "" http://127.0.0.1:4173
"%clearframe_node%" scripts/serve.mjs
goto end
:failed
echo Node.js 20 or newer is required. Install it, then try again.
pause
:end
