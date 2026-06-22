# GrowthOS

GrowthOS is a unified **Personal Growth Operating System** designed to help users consolidate their journaling, habit tracking, goal management, and reflections into a single, cohesive platform.

## Project Structure

- `docs/`: Formal documentation (Vision, SRS, Architecture, etc.)
- `src/`: Application source code (React + TypeScript)
- `assets/`: UI/UX assets and illustrations

## 📱 راهنمای تبدیل به اپلیکیشن موبایل (Mobile Deployment)

برای تبدیل این برنامه وب به اپلیکیشن اندروید (APK) یا iOS، از **Capacitor** استفاده می‌کنیم. در اینجا تمامی دستورات لازم آورده شده است:

### مرحله ۱: خروجی گرفتن از نسخه وب
ابتدا باید فایل‌های نهایی وب را تولید کنید:
```bash
npm install
npm run build
```
*این دستور پوشه `dist` را ایجاد می‌کند که برای موبایل ضروری است.*

### مرحله ۲: نصب ابزارهای موبایل
```bash
# نصب پکیج اندروید
npm install @capacitor/android

# اضافه کردن پروژه اندروید به برنامه
npx cap add android
```

### مرحله ۳: همگام‌سازی و باز کردن در Android Studio
هر زمان که کدی را تغییر دادید، این مراحل را تکرار کنید:
```bash
# ۱. ساخت نسخه جدید وب
npm run build

# ۲. انتقال تغییرات به پوشه اندروید
npx cap sync

# ۳. باز کردن پروژه در اندروید استودیو
npx cap open android
```

### مرحله ۴: خروجی گرفتن APK (در Android Studio)
1. منتظر بمانید تا پروژه لود شود (Gradle finish).
2. از منوی بالا: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)** را بزنید.
3. پس از اتمام، روی **Locate** کلیک کنید تا فایل `.apk` را بردارید و روی گوشی نصب کنید.

---

## 🚀 English: Mobile Deployment Guide

To turn this web application into a mobile app, follow these refined steps:

### Step 1: Web Build
```bash
npm install
npm run build
```

### Step 2: Add Platform
```bash
npm install @capacitor/android
npx cap add android
```

### Step 3: Fast Iteration (Update App)
```bash
npm run build
npx cap sync
npx cap open android
```

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
