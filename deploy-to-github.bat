@echo off
echo Creating clean repository for GitHub...

REM Remove large files from git tracking
git rm -r --cached node_modules 2>nul
git rm -r --cached dist 2>nul
git rm -r --cached .git 2>nul

REM Add only essential files
git add src/
git add public/
git add *.json
git add *.js
git add *.ts
git add *.html
git add *.md
git add .gitignore

REM Commit changes
git commit -m "Clean repository - source code only"

REM Push to GitHub
git push -u origin main

echo Done! Check your GitHub repository.
pause