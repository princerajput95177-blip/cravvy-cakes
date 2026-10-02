# 🌐 Cravvy Cakes - Custom Domain & App Store / Play Store Publishing Guide

> **Official Publishing & Domain Setup Guide for Prince Rajput**  
> App: **Cravvy Cakes** (100% Pure Veg & Eggless Bakery)  
> Developer: princerajput95177@gmail.com  

---

## ⚡ 1. The Magic of "Live Auto-Sync" (Sabse Bada Sawaal)
> **Aapka Sawaal:** *"kabhi bhi koi changes karni ho to mai yaha change kru to app store or playstore me khud hi change ho jaye kaise hoga?"*

### Yeh Kaise Kaam Karta Hai?
Cravvy Cakes app **TWA (Trusted Web Activity) / Progressive Web App (PWA)** architecture par bani hai.
- Jab aap is app ko PWABuilder se Play Store ya App Store par daalte hain, toh Android app ek high-performance container ban jati hai jo aapke **live custom domain (`https://cravvycakes.in` ya `.com`)** se connect rehti hai.
- Iska matlab:
  1. **Menu / Price badalna:** Aap database ya admin panel me badlenge, Play Store app kholte hi naya price aur new cake dikhega!
  2. **Banners & Offers:** Admin panel se new banner upload karenge, turant sabhi customers ke phone me show hoga.
  3. **New Features & Code:** Jab bhi aap code me changes karke publish karenge, phone app me background me 1 second me naya version load ho jayega (**Zero Play Store Re-submissions**).

---

## 🌐 2. Custom Domain Kaise Connect Karein (GoDaddy / Hostinger / Namecheap)

Agar aapne **GoDaddy, Hostinger, Namecheap ya BigRock** se domain khareeda hai (e.g., `cravvycakes.in` ya `cravvycakes.com`):

### Option A: 100% Free Vercel / Netlify Hosting (Sabse Recommended)
1. **GitHub Setup:** Is project ko apne GitHub account par push karein.
2. **Vercel / Netlify Login:**
   - [Vercel.com](https://vercel.com) par free account banayein (GitHub se sign in karein).
   - "Add New Project" click karein aur apna repository select karein.
   - Framework preset: `Vite` (Auto-detect ho jayega).
   - Click **Deploy**. (1 minute me app live ho jayegi).
3. **Domain Connect Karein:**
   - Vercel Dashboard me **Project Settings > Domains** par jayein.
   - Apna domain type karein: `cravvycakes.in` aur `Add` dabayein.
4. **DNS Records Add Karein (Domain Provider ke DNS Manager me):**
   Apne GoDaddy / Hostinger account me jakar **DNS Records** me yeh 2 entries add karein:

| Type | Name / Host | Value / Points To | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `76.76.21.21` | Auto / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | Auto / 3600 |

> ✅ **Free SSL (HTTPS):** Vercel / Netlify automatic 2 minute me free SSL certificate enable kar deta hai (`https://`).

---

## 📱 3. Google Play Store Par Kaise Publish Karein

### Step 1: Google Play Console Account
- [Google Play Console](https://play.google.com/console) par jayein.
- Ek Google Account se register karein ($25 one-time registration fee, lifetime valid).

### Step 2: Android App Bundle (.aab) File Banayein (PWABuilder se)
1. [PWABuilder.com](https://www.pwabuilder.com) kholein.
2. Apna live domain dalein: `https://yourdomain.com` aur **Start** dabayein.
3. PWABuilder aapke app ke icons, manifest aur service worker verify karega (Score 100% aayega).
4. **"Package for Store"** button par click karein aur **Android** select karein.
5. Package Name dalein (e.g. `com.cravvycakes.app`).
6. **Download Package** par click karein — aapko signed `.aab` file mil jayegi.

### Step 3: Google Play Console Listing Form Bharein
1. **Create App:**
   - App Name: `Cravvy Cakes`
   - Default language: `English (India)`
   - App or game: `App`
   - Free or paid: `Free`
2. **Graphics Upload:**
   - App Icon: 512x512 PNG (App ke andar APK Export modal se 1-click download karein).
   - Feature Graphic: 1024x500 banner.
   - Phone Screenshots: 2 se 8 screenshots (App ke home, menu, order tracking ke screenshots).
3. **Mandatory Policy URLs (Most Important):**
   - 🛡️ **Account Deletion URL (Google Play Policy Mandate):**
     `https://yourdomain.com/?view=delete-account`
     *(Google Play Data safety section me maangega: "Does your app allow users to delete their account?" -> Select "Yes" aur yeh link paste karein).*
   - 📜 **Privacy Policy URL:**
     `https://yourdomain.com/?view=privacy`
4. **Content Rating & Data Safety Questionnaire:**
   - Fill the basic questionnaire (Bakery/E-commerce, suitable for all ages).

### Step 4: App Bundle (.aab) Upload & Submit
- Go to **Production > Releases > Create new release**.
- PWABuilder se mili `.aab` file drag-and-drop karein.
- Release notes me likhein: `Initial Release of Cravvy Cakes Pure Veg Bakery App`.
- Click **Next > Save > Review Release > Start rollout to Production**.
- Google Play team 24 se 48 ghante me review karke aapki app Google Play Store par live kar degi!

---

## 🍏 4. Apple App Store (iOS) Par Kaise Publish Karein

### Option A: Direct Web App / PWA Install (100% Free & Zero Approval Wait)
- iPhone / iPad users bina App Store ke bhi app direct install kar sakte hain:
  1. Safari browser me `https://yourdomain.com` kholein.
  2. Share icon (square with arrow) dabayein.
  3. **"Add to Home Screen"** dabayein.
  4. App iPhone ke home screen par bilkul native app ki tarah full-screen chalegi!

### Option B: Official Apple App Store Publishing
1. [Apple Developer Program](https://developer.apple.com/programs/) enroll karein ($99/year fee).
2. PWABuilder par jakar **"Package for Store > iOS"** select karein.
3. Xcode project download karke App Store Connect par upload karein.
4. Privacy Policy URL aur Support URL enter karke review me bhejein.

---

## 📋 Quick Copy-Paste Reference

| Item | Value |
| :--- | :--- |
| **App Name** | Cravvy Cakes |
| **Category** | Food & Drink / Shopping |
| **Account Deletion Link** | `https://yourdomain.com/?view=delete-account` |
| **Privacy Policy Link** | `https://yourdomain.com/?view=privacy` |
| **PWA Manifest** | `https://yourdomain.com/manifest.webmanifest` |
| **Vercel DNS A Record** | `@` -> `76.76.21.21` |
| **Vercel DNS CNAME** | `www` -> `cname.vercel-dns.com` |
