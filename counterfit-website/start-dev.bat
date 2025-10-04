@echo off
cd /d "C:\Users\Administrator\Desktop\Counterfit\counterfit-app\counterfit-website"
set NODE_OPTIONS=--max-old-space-size=4096
set npm_config_script_shell=
node node_modules\next\dist\bin\next dev
pause
