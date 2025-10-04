@echo off
set NODE_OPTIONS=--max-old-space-size=4096
set npm_config_script_shell=cmd
npm run dev
