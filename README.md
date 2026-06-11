# GrowthOS

GrowthOS is a unified **Personal Growth Operating System** designed to help users consolidate their journaling, habit tracking, goal management, and reflections into a single, cohesive platform.

## Project Structure

- `docs/`: Formal documentation (Vision, SRS, Architecture, etc.)
- `src/`: Application source code (React + TypeScript)
- `assets/`: UI/UX assets and illustrations

## 📱 Mobile Deployment Guide (How to get APK)

To turn this web application into a mobile app (Android or iOS), we use **Capacitor**. 

### ⚠️ CRITICAL: The "Missing Dist" Error
If you see `[warn] sync could not run--missing dist directory`, it is because you haven't built the web version yet. **Step 1 is mandatory.**

### Step 1: Generate the Web Build
Run this on your local machine terminal:
```bash
npm install
npm run build
```
*This creates a `dist` folder. Capacitor needs this folder to work.*

### Step 2: Capacitor Configuration
I have already created a `capacitor.config.ts` file for you. If you get an error saying it already exists during `npx cap init`, you can simply skip the `init` command and proceed to:
```bash
# Install platform packages
npm install @capacitor/android

# Add the Android project
npx cap add android
```

### 🛠 Troubleshooting: "Cannot run init..."
If you encounter `[error] Cannot run init for a project using a non-JSON configuration file`, it is because a typescript config already exists.
**Fix:** 
1. Delete `capacitor.config.ts` (if you want to run `init` manually).
2. OR better: Just use the one I provided and skip `npx cap init`.


### Step 4: Sync & Open in Android Studio
Whenever you change your code, run this sequence:
```bash
npm run build
npx cap sync
npx cap open android
```

### Step 5: Build the final APK (inside Android Studio)
1. Wait for the project to load and Gradle to finish (1-2 minutes).
2. Look at the top menu: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3. A popup will appear at the bottom right when finished. Click **Locate** to get your `.apk` file.
4. Transfer that APK to your phone and install!

---

## Phased Roadmap

1. **Phase 0**: Vision & Scope
2. **Phase 1**: Software Requirements Specification (SRS)
3. **Phase 2**: User Stories & Journey Mapping
4. **Phase 3**: Domain Modeling
5. **Phase 4**: Database Design
6. **Phase 5**: Architecture Design
7. **Phase 6**: UI/UX Design
8. **Development**: Implementation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
