# Deployment Guide for Your Own Website

## 📁 Files to Upload

Upload the entire contents of the `dist` folder to your website's root directory (or subdirectory):

```
your-website.com/
├── index.html
└── assets/
    └── index-DqE-ESXY.js
```

## 🚀 Deployment Steps

### Method 1: FTP/SFTP Upload
1. Connect to your web server via FTP/SFTP
2. Navigate to your website's public directory (usually `public_html`, `www`, or `htdocs`)
3. Upload all files from the `dist` folder
4. Your app will be accessible at `https://your-website.com`

### Method 2: File Manager (cPanel/Hosting Control Panel)
1. Log into your hosting control panel
2. Open File Manager
3. Navigate to public_html (or your domain's root folder)
4. Upload the `dist` folder contents
5. Extract if uploaded as a zip file

### Method 3: Git Deployment (if your host supports it)
1. Push your project to a Git repository
2. Set up automatic deployment from the `dist` folder
3. Configure build commands: `npm install && npm run build`

## 🔒 Security Considerations

### Current Setup (Less Secure)
Your API key is embedded in the built JavaScript file. This means:
- ✅ Easy to deploy - just upload files
- ❌ API key is visible to anyone who views page source
- ❌ Potential for unauthorized usage

### Recommended Secure Setup
For better security, consider:

1. **User-provided API keys**: Users enter their own API key
2. **Backend proxy**: Create a simple backend to handle API calls
3. **Domain restrictions**: Configure your API key with domain restrictions in Google Cloud Console

## 🌍 Testing Your Deployment

After uploading:
1. Visit your website URL
2. Test the functionality
3. Check browser developer console for any errors
4. Verify API calls work correctly

## 📋 Requirements

- Web server with HTTPS (required for audio recording)
- Modern browser support for your users
- Google Gemini API key configured

## 🔧 Troubleshooting

**If the app doesn't load:**
- Check that `index.html` is in the root directory
- Verify all asset files are uploaded
- Check browser console for errors

**If API calls fail:**
- Verify your API key is valid
- Check if your domain needs to be whitelisted
- Ensure HTTPS is enabled (required for microphone access)

## 📱 Additional Notes

- The app is responsive and works on mobile devices
- Audio recording requires HTTPS and user permission
- File uploads work with various audio formats
