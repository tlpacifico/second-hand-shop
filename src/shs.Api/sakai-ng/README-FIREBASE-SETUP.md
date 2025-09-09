# Firebase Configuration Setup

## Security Notice
The `firebase.config.ts` file contains sensitive API keys and should **NEVER** be committed to version control.

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp src/environments/firebase.config.example.ts src/environments/firebase.config.ts
   ```

2. **Add your Firebase configuration:**
   - Open `src/environments/firebase.config.ts`
   - Replace the placeholder values with your actual Firebase configuration
   - Get these values from your Firebase Console → Project Settings → General → Your apps

3. **Verify .gitignore:**
   - Ensure `src/environments/firebase.config.ts` is listed in `.gitignore`
   - This prevents accidental commits of sensitive data

## Firebase Configuration Values

You can find these values in your Firebase Console:
- **apiKey**: Found in Project Settings → General → Your apps
- **authDomain**: Usually `your-project-id.firebaseapp.com`
- **projectId**: Your Firebase project ID
- **storageBucket**: Usually `your-project-id.firebasestorage.app`
- **messagingSenderId**: Found in Project Settings → General → Your apps
- **appId**: Found in Project Settings → General → Your apps
- **measurementId**: Found in Project Settings → General → Your apps (if Analytics is enabled)

## Security Best Practices

- ✅ Keep `firebase.config.ts` in `.gitignore`
- ✅ Use `firebase.config.example.ts` as a template
- ✅ Never commit actual API keys to version control
- ✅ Use environment variables in production deployments
- ✅ Regularly rotate API keys if compromised
