@echo off
echo 🚀 Building Medical Interview Summarizer for Production...
echo.

echo 📁 Building frontend with Railway backend...
call npm run build

echo.
echo ✅ Production build complete!
echo.
echo 📂 Your production files are in the 'dist' folder:
dir dist

echo.
echo 🌐 Next steps:
echo 1. Upload the contents of the 'dist' folder to goodtimesstudio.com
echo 2. Your app will connect to: https://medical-interview-summarizer-production.up.railway.app
echo.
echo 🎉 Your secure Medical Interview Summarizer is ready!

pause
