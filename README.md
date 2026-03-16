# 💸 SaveKaro v4.1 — Complete Affiliate Cashback Platform

India's most complete cashback & deals website. Built with React.

---

## 🚀 Quick Start

```bash
npm install
npm start        # Development
npm run build    # Production build
```

---

## 📁 File Structure

```
src/
├── App.jsx          # Main app — all pages, state, modals
├── components.jsx   # SpinWheel, ShareButtons, AIChatbot, LoginModal, LoyaltyBar, ExpiryTimer, ProfileDropdown
├── hooks.js         # usePersist, useCountdown, useToast, usePoints, useAuth
├── data.js          # All products, stores, coupons, REDIRECT_MAP
├── index.js         # Entry point
public/
├── index.html       # GA4 + FB Pixel + PWA meta tags
├── manifest.json    # PWA manifest (installable app)
├── sw.js            # Service worker (offline + push notifications)
```

---

## ✅ Complete Feature List (v4.1)

### 🔐 Security
- **Secure link redirector** — Real affiliate URLs only in `REDIRECT_MAP`. Users see `/go/amz-tv-1` not your tag
- Move `REDIRECT_MAP` to backend `/api/go/:slug` for full server-side protection

### 💰 Monetization
- Affiliate links for Amazon, Flipkart, Myntra, Nykaa, Ajio, Swiggy, MakeMyTrip, Meesho
- Cashback tracker with purchase history
- Coupon codes with copy-to-clipboard

### 🤖 AI Features
- **AI Deal Finder chatbot** — Powered by Claude AI. Users type naturally, get matched products with quick-shop cards

### 🎮 Engagement
- **Spin & Win wheel** — Gamified coupon reveal (auto-shows after 20s, once per day)
- **Loyalty points system** — Earn points for clicks, shares, signups, purchases
- **Referral system** — Unique referral links per user

### 👤 User System
- **Login modal** — Google OAuth + Phone OTP (mock, connect Firebase/Supabase in production)
- **User profile dropdown** — Points, level, quick navigation
- **Persistent state** — Wishlist, tracker, dark mode saved via localStorage

### 🛍️ Shopping
- 12 curated products with real Unsplash images
- **Price comparison** across stores
- **Per-product expiry timers** (live countdown)
- **Out of stock badges** with disabled state
- **Trending badge** (auto-marks products with 8k+ clicks)
- **Flash sale timer** (site-wide 48hr countdown)
- **Advanced filters** — Sort by discount, cashback, price, rating, expiry

### 📱 Mobile & PWA
- **PWA manifest** — Users can install as app on phone homescreen
- **Service worker** — Offline support + push notifications
- **Mobile hamburger nav** — Full slide-out menu
- **Dark mode** — Full dark theme, persisted

### 🌐 Language
- **Hindi / English toggle** — Every label switches instantly

### 📣 Social & Growth
- **Share buttons** on every product — WhatsApp, Telegram, Twitter, Copy Link
- **Newsletter popup** (EmailJS-ready, auto-shows at 10s)
- **WhatsApp Group link** in footer
- **Referral link** with copy button

### 📜 Legal (required by affiliate programs)
- Privacy Policy
- Terms of Use
- Affiliate Disclosure

### ❓ Trust
- How Cashback Works page (6-step explainer)
- User-submitted reviews with star rating

### 📊 Analytics
- Google Analytics 4 placeholder in index.html
- Facebook Pixel placeholder in index.html
- `trackEvent()` helper throughout app

### 🔍 SEO
- Dynamic `<title>` and meta tags per page
- Open Graph tags for social sharing
- Structured data (JSON-LD)

---

## 🔧 Setup Checklist

### 1. Replace Affiliate Links
In `src/data.js`, find `REDIRECT_MAP` and replace:
- `YOUR_AMAZON_TAG` → your Amazon Associates tag
- `YOUR_FLIPKART_TAG` → your Flipkart affiliate ID
- `YOUR_MYNTRA_TAG` → your Myntra affiliate tag
- etc.

### 2. Add Analytics IDs
In `public/index.html`:
- Replace `G-XXXXXXXXXX` with your Google Analytics 4 measurement ID
- Replace `YOUR_PIXEL_ID` with your Facebook Pixel ID

### 3. Connect EmailJS (Newsletter)
In `src/App.jsx`, find the comment `// INTEGRATION: emailjs.send(...)` and add:
```js
import emailjs from '@emailjs/browser';
emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
  name: nlForm.name,
  contact: nlForm.contact,
  from_name: "SaveKaro",
});
```

### 4. Connect Firebase Auth (Login)
In `src/components.jsx`, replace mock login functions with:
```js
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
const result = await signInWithPopup(auth, new GoogleAuthProvider());
onLogin({ name: result.user.displayName, email: result.user.email, ... });
```

### 5. Connect Firebase/Supabase (Persistent User Data)
Replace `usePersist` localStorage calls with real database saves for:
- Wishlist
- Purchase history
- Loyalty points
- Newsletter subscribers

### 6. Backend Redirect API (Most Important for Security)
Create an Express/Next.js endpoint:
```js
app.get('/api/go/:slug', (req, res) => {
  const url = REDIRECT_MAP[req.params.slug];
  if (!url) return res.status(404).json({ error: 'Not found' });
  // Log the click here for analytics
  res.json({ url });
});
```
Then in `App.jsx` replace `goTo()` with:
```js
const { url } = await fetch(`/api/go/${slug}`).then(r => r.json());
window.open(url, '_blank', 'noopener,noreferrer');
```

---

## 🌐 Deploy to Vercel (Free)

1. Push to GitHub
2. Go to vercel.com → Import Project
3. Select your repo
4. Click Deploy

Your site will be live at `yourproject.vercel.app` in ~2 minutes.

---

## 💡 Affiliate Programs to Sign Up For

| Store | Program | URL |
|-------|---------|-----|
| Amazon | Amazon Associates India | affiliate-program.amazon.in |
| Flipkart | Flipkart Affiliate | affiliate.flipkart.com |
| Myntra | Admitad / vCommission | vcommission.com |
| Nykaa | vCommission | vcommission.com |
| Ajio | vCommission | vcommission.com |
| Swiggy | Apply directly | swiggy.com/affiliate |
| MakeMyTrip | MMT Affiliate | affiliate.makemytrip.com |

---

## 📞 Support
Email: support@SaveKaro.in