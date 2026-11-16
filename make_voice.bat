@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul && (set PY=py) || (set PY=python)
echo === Installing the Google voice package (gTTS, edge-tts) ===
%PY% -m pip install --quiet --upgrade gTTS edge-tts
if errorlevel 1 (
  echo.
  echo Could not install gTTS. Check that Python is installed and that you are online.
  pause
  exit /b 1
)
echo.
echo === Generating the voice-over MP3 files (this can take 10-20 minutes) ===
%PY% make_voice.py %*
echo.
echo Finished. Now commit and push the new assets\voice folder to GitHub.
pause
