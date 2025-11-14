# Quick Start: Build and Share Your APK in 5 Minutes

## Super Fast Version

### 1. Install Tools (One Time)

```bash
npm install -g expo-cli eas-cli
eas login
```

### 2. Build APK

```bash
cd /path/to/your/project
eas build --platform android
```

**Choose:** `production` (final release) or `preview` (for testing)

### 3. Download & Share

- Check your email or https://expo.dev for the download link
- Share the APK file with anyone
- They can install it directly on their Android phone

---

## Installation Instructions for Others

Give these instructions to people who receive your APK:

1. **Download** the APK file to their Android phone
2. **Enable unknown sources:**
   - Settings → Apps & notifications → Advanced → Special app access → Install unknown apps
   - Select your file manager (or Chrome) and toggle ON
3. **Open** the APK file in file manager or browser
4. **Tap** "Install"
5. **Done!** App appears in their app drawer

---

## What Happens During Build?

- EAS Build creates the native Android app in the cloud
- Takes 5-15 minutes typically
- You'll get a direct download link via email
- The APK is about 60MB

---

## Want to Publish to Google Play Store?

```bash
eas build --platform android --auto-submit
```

Then verify in Google Play Console.

---

## Update Your App Later

1. Make code changes
2. Update version in `app.json`:
   ```json
   "version": "1.0.1"
   ```
3. Update Android version code:
   ```json
   "android": { "versionCode": 2 }
   ```
4. Run build command again: `eas build --platform android`

---

## Problems?

- **Can't log in:** Run `eas logout` then `eas login` again
- **Build fails:** Make sure you have Node.js 18+ installed
- **APK won't install:** Make sure you enable "Install from unknown sources"

See `BUILD_AND_PUBLISH.md` for full details.
