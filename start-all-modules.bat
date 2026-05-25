@echo off
REM Batch file to run all HDFC micro frontend modules and host app in separate terminals

start cmd /k "cd /d %~dp0host-app && npm start"
start cmd /k "cd /d %~dp0business-reports && npm start"
start cmd /k "cd /d %~dp0model-portfolio-configuration && npm start"
start cmd /k "cd /d %~dp0outgoing-api-logs && npm start"
start cmd /k "cd /d %~dp0incoming-api-logs && npm start"
start cmd /k "cd /d %~dp0maker-requests && npm start"
start cmd /k "cd /d %~dp0vro-uploads && npm start"
start cmd /k "cd /d %~dp0ai-agent-backend && python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000"
start cmd /k "cd /d %~dp0ai-agent-module && npm start"

echo All modules and host are starting in separate terminals.
pause
