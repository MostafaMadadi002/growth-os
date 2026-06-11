# GrowthOS

GrowthOS is a unified **Personal Growth Operating System** designed to help users consolidate their journaling, habit tracking, goal management, and reflections into a single, cohesive platform.

## Project Structure

- `docs/`: Formal documentation (Vision, SRS, Architecture, etc.)
- `src/`: Application source code (React + TypeScript)
- `assets/`: UI/UX assets and illustrations

## Mobile Deployment Guide (How to get APK)

To turn this web application into a mobile app (Android or iOS), we use **Capacitor**. Follow these steps on your local machine:

### 1. Prerequisites
- **Node.js** installed.
- **Android Studio** (for Android) or **Xcode** (for iOS/macOS).
- Run `npm run build` once to generate the `dist` folder.

### 2. Setup Capacitor
Run these commands in your project root:
```bash
# Install Capacitor core
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init GrowthOS com.mostafamadadi.growthos

# Add Android/iOS platforms
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

### 3. Sync and Open
Every time you make changes to the Web code:
1. Run `npm run build`
2. Run `npx cap copy` (to copy the web files to the mobile project)
3. Run `npx cap open android` (this opens Android Studio)

### 4. Build the APK
In **Android Studio**:
1. Wait for Gradle to finish syncing.
2. Go to **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
3. Once finished, a notification will appear with a "locate" link to find your `.apk` file.

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
