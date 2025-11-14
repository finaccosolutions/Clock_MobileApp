# World Clock App - Build and Distribution Guide

This guide explains how to build your Expo clock app as an Android APK and share it with others or publish it to the Google Play Store.

## Prerequisites

Before starting, you need:

1. **Node.js and npm** installed on your computer
2. **Expo CLI** installed globally:
   ```bash
   npm install -g expo-cli
   ```
3. **EAS CLI** installed globally:
   ```bash
   npm install -g eas-cli
   ```
4. **Expo Account** (free) - Create one at https://expo.dev
5. **Logged in to EAS** - Run:
   ```bash
   eas login
   ```

## Building an APK for Direct Distribution

### Option 1: Using EAS Build (Recommended)

EAS Build is Expo's cloud-based build service that handles all the complexity of building native Android apps.

**Step 1: Authenticate with EAS**

```bash
eas login
```

**Step 2: Build the APK**

Run this command to build your APK:

```bash
eas build --platform android --local
```

Or for a cloud build (no local native build tools needed):

```bash
eas build --platform android
```

Choose the build profile when prompted:
- `production` - Final release build, optimized
- `preview` - Good for testing, smaller file

**Step 3: Download Your APK**

Once the build completes, you'll receive a download link. The APK file is typically around 50-70MB.

**Step 4: Test on Your Device**

1. Download the APK to your Android device
2. Enable "Install from Unknown Sources" in Android Settings
3. Open the APK file and tap "Install"
4. Launch the app from your app drawer

### Option 2: Using Local Build Tools

If you have Android Studio and the Android NDK installed locally:

```bash
eas build --platform android --local
```

This runs the build on your machine instead of in the cloud.

## Sharing Your APK

### Direct Download Link

After building with EAS:

1. The build service provides a direct download link
2. Share this link with others via email, messaging, or cloud storage
3. Recipients can download and install the APK directly

### Using Cloud Storage

Upload your APK to:
- Google Drive
- Dropbox
- OneDrive
- AWS S3

Generate a shareable link and send to others.

### Building for Multiple Devices

To update your app version:

1. Update the version in `app.json`:
   ```json
   "version": "1.0.1"
   ```

2. Update the Android version code:
   ```json
   "android": {
     "versionCode": 2
   }
   ```

3. Rebuild using the same EAS build command

## Publishing to Google Play Store

### Prerequisites

1. **Google Play Developer Account** - $25 one-time fee at https://play.google.com/console
2. **Google Play API Key** - Generated in your developer account
3. **App Signing** - Google Play handles signing for you

### Step 1: Prepare Your App

Update version numbers in `app.json`:

```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

### Step 2: Create Release Build

```bash
eas build --platform android --auto-submit
```

Or build manually without auto-submit:

```bash
eas build --platform android
```

### Step 3: Set Up Google Play Console

1. Go to https://play.google.com/console
2. Create a new app named "World Clock"
3. Fill in the store listing details:
   - App name
   - Short description
   - Full description
   - Category: Productivity or Utilities
   - Screenshots (4-5 recommended)
   - Feature graphic (1024 x 500 pixels)

### Step 4: Submit to Play Store

If you used `--auto-submit`, your app is automatically submitted.

Otherwise, manually upload:

1. In Play Console, go to "Internal testing" or "Production"
2. Click "Create new release"
3. Upload the AAB (Android App Bundle) from your EAS build
4. Fill in the release notes
5. Click "Review release" then "Start rollout"

### Step 5: Review and Launch

1. Google Play reviews your app (usually 24-48 hours)
2. Once approved, it appears in the Play Store
3. Monitor user reviews and ratings

## Managing Updates

### Over-the-Air Updates (Optional)

Enable Expo Updates to push JavaScript changes without rebuilding:

1. In your Expo app, updates are enabled by default
2. Push updates using:
   ```bash
   eas update
   ```

### Building New Versions

For each update:

1. Update `version` in `app.json`
2. Increment `versionCode` for Android
3. Rebuild the APK/AAB
4. For Play Store, submit new release through the console

## Troubleshooting

### Build Fails

Check common issues:
- Ensure you're logged into EAS: `eas whoami`
- Update your dependencies: `npm install`
- Clear cache: `npm cache clean --force`

### APK Won't Install

- Ensure device has "Unknown Sources" enabled
- Clear app cache if reinstalling: Settings > Apps > World Clock > Storage > Clear Cache
- Try on a different Android device

### Play Store Rejection

Common reasons:
- Crash on launch - Test thoroughly before submitting
- Privacy policy missing - Add privacy policy link to app
- Inappropriate content - Review app description and content
- Functionality issues - Ensure all features work as described

## Size Optimization

To reduce APK size:

1. Use production build (already optimized)
2. Remove unused dependencies
3. Optimize images and assets

## Checking Build Status

Monitor your builds at:
- https://expo.dev/builds (web dashboard)
- Or via CLI: `eas build:list`

## Testing Before Release

1. Build APK to your test device
2. Test all features:
   - Clock display
   - Time updates
   - World clock functionality
   - Timer operation
   - Stopwatch functionality
3. Check for crashes or errors
4. Test on different Android versions if possible

## Resources

- Expo Documentation: https://docs.expo.dev
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Google Play Console: https://play.google.com/console
- Android Development: https://developer.android.com

## Support

For issues or questions:
- Expo Discord: https://discord.gg/expo
- Expo GitHub Issues: https://github.com/expo/expo/issues
- Google Play Help: https://support.google.com/googleplay/
