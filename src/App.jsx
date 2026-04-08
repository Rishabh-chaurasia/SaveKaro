import emailjs from "@emailjs/browser";
import { useState, useEffect } from "react";
import { REDIRECT_MAP, SITE, PRODUCTS, STORES, BANNERS, CATEGORIES, SORT_OPTIONS, CREDIT_OFFERS, TRENDING_SEARCHES, COLLECTIONS, BUDGET_SECTIONS, OCCASIONS, FLASH_DEAL } from "./data.js";
import { usePersist, useCountdown, useToast, useAuth, usePurchases, useClickTracker, useMissingCashback, useWishlist } from "./hooks.js";
import { ExpiryTimer, LoginModal, AIChatbot, ProfileDropdown } from "./components.jsx";
import { PWAInstallBanner, PushNotificationBanner, LiveChatButton, BlogPage } from "./growth.jsx";
import { SkeletonGrid, ErrorBoundary, NotFoundPage, CookieConsent } from "./polish.jsx";

const fmt = n => "₹" + Number(n).toLocaleString("en-IN");
const disc = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);
const FLASH_END = Date.now() + 48 * 3600 * 1000;

const goTo = (slug, storeName, showToast) => {
  const real = REDIRECT_MAP[slug];
  if (!real) return;
  showToast(`Opening ${storeName}… Cashback tracked! 💰`);
  setTimeout(() => window.open(real, "_blank", "noopener,noreferrer"), 650);
};

// ── HINDI TRANSLATION MAP ──────────────────────────────────────────────────
const LANG = {
  en: {
    home: "Home", deals: "Deals", coupons: "Coupons", stores: "Stores",
    wishlist: "Wishlist", tracker: "My Cashback", howItWorks: "How It Works",
    legal: "Legal", blog: "Blog", partners: "Partners",
    searchPlaceholder: "Search deals…", login: "Login",
    shopNow: "Shop Now & Earn →", outOfStock: "📦 Out of Stock",
    addToWishlist: "Added to Wishlist ❤️", removeFromWishlist: "Removed from Wishlist",
    topDeals: "⭐ Top Deals of the Week", topStores: "🏪 Top Stores",
    viewAll: "View All", findDeals: "Find Deals →",
    budget: "Budget", exploreDeals: "Explore All Deals 🎁",
    referEarn: "🏷️ Refer & Earn", copyReferral: "📋 Copy Referral Link",
    linkCopied: "✅ Link Copied!", howSaveKaroWorks: "How SaveKaro Works",
    step1T: "Find a Deal", step1D: "Browse from 50+ top Indian brands",
    step2T: "Click & Shop", step2D: "Go directly to the product via our link",
    step3T: "Earn Cashback", step3D: "Tracked automatically, paid to your wallet",
    readyToSave: "Ready to Start Saving?",
    joinUsers: "Join 5 lakh+ smart shoppers earning cashback every day",
    dealsFound: n => `${n} deals found`,
    noDeals: "No deals found", adjustFilters: "Try adjusting filters or budget",
    sortBy: "Sort by", reset: "Reset",
    cashbackCalc: "Cashback Calculator", seeEarnings: "See exactly how much you'll earn back",
    orderAmount: "Order Amount (₹)", cashbackRate: "Cashback Rate",
    youWillEarn: "You will earn back", on: "on a",
    order: "order", enterAmount: "Enter an amount above to see your savings",
    comparePrice: "📊 Price Comparison", bestPrice: "💰 Save up to",
    byBest: "by choosing best price!",
    customerReviews: "⭐ Customer Reviews", ratings: "ratings",
    writeReview: "✍️ Write a Review", submitReview: "Submit Review (+20 pts)",
    shopNowEarn: n => `Shop Now & Earn ${n}% Back →`,
    addPurchase: "➕ Add Purchase", savePurchase: "Save Purchase (+100 pts) ✅",
    myTracker: "💰 My Cashback Tracker", trackAll: "Track all purchases & earnings in one place",
    totalSpent: "Total Spent", totalEarned: "Total Earned", pending: "Pending",
    dkPoints: "DK Points", noPurchases: "No purchases yet",
    startShopping: "Start shopping through our links to track cashback here!",
    pointsHistory: "🏅 Points History",
    subscribeAlerts: "Get Exclusive Deal Alerts!", subscribeDesc: "Be first to know about flash sales & extra cashback offers via WhatsApp or Email.",
    yourName: "Your Name", whatsappOrEmail: "WhatsApp number or Email",
    subscribeCta: "🔔 Subscribe & Get +25 Points!", noSpam: "No spam. Unsubscribe anytime.",
    recentlyViewed: "🆕 Recently Viewed",
    flashSale: "⚡ FLASH SALE", extraOff: "🔥 Extra 5% off marked items",
    partnerStores: "Partner Stores", cashbackPaid: "Cashback Paid",
    happyUsers: "Happy Users", free: "Free",
    referDesc: "Share your link. Your friends shop. You earn bonus points.",
    howItWorksSubtitle: "3 simple steps to start earning cashback",
  },
  hi: {
    home: "होम", deals: "डील्स", coupons: "कूपन", stores: "स्टोर्स",
    wishlist: "विशलिस्ट", tracker: "मेरा कैशबैक", howItWorks: "कैसे काम करता है",
    legal: "नियम", blog: "ब्लॉग", partners: "पार्टनर",
    searchPlaceholder: "डील्स खोजें…", login: "लॉगिन",
    shopNow: "अभी खरीदें और कमाएं →", outOfStock: "📦 स्टॉक में नहीं",
    addToWishlist: "विशलिस्ट में जोड़ा ❤️", removeFromWishlist: "विशलिस्ट से हटाया",
    topDeals: "⭐ इस हफ्ते की टॉप डील्स", topStores: "🏪 टॉप स्टोर्स",
    viewAll: "सभी देखें", findDeals: "डील्स खोजें →",
    budget: "बजट", exploreDeals: "सभी डील्स देखें 🎁",
    referEarn: "🏷️ रेफर करें और कमाएं", copyReferral: "📋 रेफरल लिंक कॉपी करें",
    linkCopied: "✅ लिंक कॉपी हो गया!", howSaveKaroWorks: "SaveKaro कैसे काम करता है",
    step1T: "डील खोजें", step1D: "50+ टॉप भारतीय ब्रांड्स में से चुनें",
    step2T: "क्लिक करें और खरीदें", step2D: "हमारे लिंक से सीधे प्रोडक्ट पर जाएं",
    step3T: "कैशबैक कमाएं", step3D: "अपने आप ट्रैक होता है, वॉलेट में मिलता है",
    readyToSave: "बचत शुरू करने के लिए तैयार हैं?",
    joinUsers: "5 लाख+ स्मार्ट शॉपर्स से जुड़ें जो रोज कैशबैक कमाते हैं",
    dealsFound: n => `${n} डील्स मिलीं`,
    noDeals: "कोई डील नहीं मिली", adjustFilters: "फ़िल्टर या बजट बदलकर देखें",
    sortBy: "क्रमबद्ध करें", reset: "रीसेट",
    cashbackCalc: "कैशबैक कैलकुलेटर", seeEarnings: "देखें आप कितना वापस पाएंगे",
    orderAmount: "ऑर्डर राशि (₹)", cashbackRate: "कैशबैक दर",
    youWillEarn: "आप वापस पाएंगे", on: "पर",
    order: "ऑर्डर", enterAmount: "राशि डालें और बचत देखें",
    comparePrice: "📊 मूल्य तुलना", bestPrice: "💰 बचाएं",
    byBest: "सबसे अच्छी कीमत चुनकर!",
    customerReviews: "⭐ ग्राहक समीक्षाएं", ratings: "रेटिंग्स",
    writeReview: "✍️ समीक्षा लिखें", submitReview: "समीक्षा दें (+20 pts)",
    shopNowEarn: n => `अभी खरीदें और ${n}% वापस पाएं →`,
    addPurchase: "➕ खरीदारी जोड़ें", savePurchase: "खरीदारी सेव करें (+100 pts) ✅",
    myTracker: "💰 मेरा कैशबैक ट्रैकर", trackAll: "सभी खरीदारी और कमाई एक जगह",
    totalSpent: "कुल खर्च", totalEarned: "कुल कमाई", pending: "बाकी",
    dkPoints: "DK पॉइंट्स", noPurchases: "अभी तक कोई खरीदारी नहीं",
    startShopping: "हमारे लिंक से खरीदारी शुरू करें और यहाँ ट्रैक करें!",
    pointsHistory: "🏅 पॉइंट्स इतिहास",
    subscribeAlerts: "एक्सक्लूसिव डील अलर्ट पाएं!", subscribeDesc: "फ्लैश सेल और एक्स्ट्रा कैशबैक की जानकारी सबसे पहले पाएं।",
    yourName: "आपका नाम", whatsappOrEmail: "WhatsApp नंबर या Email",
    subscribeCta: "🔔 सब्सक्राइब करें और +25 पॉइंट्स पाएं!", noSpam: "स्पैम नहीं। कभी भी अनसब्सक्राइब करें।",
    recentlyViewed: "🆕 हाल में देखा",
    flashSale: "⚡ फ्लैश सेल", extraOff: "🔥 चिह्नित वस्तुओं पर 5% अतिरिक्त छूट",
    partnerStores: "पार्टनर स्टोर्स", cashbackPaid: "कैशबैक दिया गया",
    happyUsers: "खुश उपयोगकर्ता", free: "बिल्कुल मुफ्त",
    referDesc: "अपना लिंक शेयर करें। दोस्त खरीदें। आप बोनस पॉइंट्स कमाएं।",
    howItWorksSubtitle: "कैशबैक शुरू करने के 3 आसान कदम",
  }
};

// ── REACTIVE TRANSLATION HELPER ────────────────────────────────────────────
// Returns a T() function that is bound to the current lang value.
// Called inside App component so it re-creates on every lang state change.
const getT = (lang) => (key, ...args) => {
  const v = LANG[lang]?.[key] ?? LANG.en[key] ?? key;
  return typeof v === "function" ? v(...args) : v;
};


export default function App() {
  const [page, setPage]           = useState("home");
  const [dark, setDark]           = usePersist("sk_dark", false);
  const [lang, setLang]           = usePersist("sk_lang", "en");
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch]       = useState("");
  const [sortBy, setSortBy]       = useState("default");
  const [budgetMax, setBudgetMax] = usePersist("sk_budget", 80000);
  const [recentlyViewed, setRecentlyViewed] = usePersist("sk_recent", []);
  const [nlDone, setNlDone]       = usePersist("sk_nl", false);
  const [toast, showToast]        = useToast();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showReview, setShowReview]   = useState(null);
  const [showCompare, setShowCompare] = useState(null);
  const [showMissingCashback, setShowMissingCashback] = useState(false);
  const [showPWABanner, setShowPWABanner] = usePersist("sk_pwa", true);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [cookieConsent, setCookieConsent] = usePersist("sk_cookie", null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nlForm, setNlForm]       = useState({ name:"", contact:"" });
  const [linkCopied, setLinkCopied] = useState(false);
  const [pendingShop, setPendingShop] = useState(null);

  const { user, login, logout }   = useAuth();
  const flashTime                 = useCountdown(FLASH_END);

  // Firestore hooks
  const { purchases, loadingPurchases, deletePurchase } = usePurchases(user?.uid);
  const { trackClick }            = useClickTracker(user?.uid);
  const { requests: missingRequests, submitRequest: submitMissingCashback } = useMissingCashback(user?.uid);
  const { wishlist, toggleWishlist: toggleWishlistFn } = useWishlist(user?.uid);

  const T = (key) => key; // simplified — translations inline

  useEffect(() => {
    if (nlDone) return;
    const t = setTimeout(() => setShowNewsletter(true), 15000);
    return () => clearTimeout(t);
  }, [nlDone]);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowPushBanner(true), 30000);
    return () => clearTimeout(t);
  }, []);

  // Capture referral
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) localStorage.setItem("sk_referrer", ref);
  }, []);

  const D = dark ? {
    bg:"#0a0b0f", card:"#12141c", nav:"#0d0f18", border:"#1e2230",
    text:"#f1f5f9", sub:"#8892a4", input:"#181b27", inputBorder:"#252836",
    shadow:"rgba(0,0,0,.4)",
  } : {
    bg:"#f0f2f5", card:"#ffffff", nav:"#ffffff", border:"#e4e8ef",
    text:"#0f172a", sub:"#64748b", input:"#f8fafc", inputBorder:"#cbd5e1",
    shadow:"rgba(0,0,0,.07)",
  };

  const handleShop = (slug, storeName, product) => {
    if (!user) {
      showToast("Please login to earn cashback 💰", "info");
      setShowLogin(true);
      setPendingShop({ slug, storeName, product });
      return;
    }
    if (product) setRecentlyViewed(p => [product, ...p.filter(x => x.id !== product.id)].slice(0, 8));
    trackClick(product, slug);
    goTo(slug, storeName, showToast);
  };

  const toggleWishlist = async (product) => {
    if (!user) { showToast("Please login to save wishlists", "info"); setShowLogin(true); return; }
    const exists = wishlist.some(p => p.id === product.id);
    showToast(exists ? "Removed from wishlist" : "Added to wishlist ❤️", exists ? "info" : "success");
    await toggleWishlistFn(product);
  };

  const handleReferral = () => {
    const ref = `${SITE.url}?ref=${user?.uid || "FRIEND"}`;
    navigator.clipboard.writeText(ref).catch(() => {});
    setLinkCopied(true);
    showToast("Referral link copied! 🔗");
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleNlSubmit = () => {
    if (!nlForm.name || !nlForm.contact) { showToast("Please fill both fields", "info"); return; }
    emailjs.send("service_i46thd9","template_vlyzseg",{ name:nlForm.name, contact:nlForm.contact, time:new Date().toLocaleString("en-IN") },"DoNI46e520c5ajQHm").catch(() => {});
    setNlDone(true); setShowNewsletter(false);
    showToast("🎉 Subscribed! You'll get the best deals first.");
  };

  let filtered = PRODUCTS.filter(p => {
    const catOk = activeCat === "all" || p.category === activeCat;
    const searchOk = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.store.toLowerCase().includes(search.toLowerCase()) || p.tags?.some(t => t.includes(search.toLowerCase()));
    return catOk && searchOk && p.price <= budgetMax;
  });
  if (sortBy === "discount")  filtered = [...filtered].sort((a,b) => disc(b.mrp,b.price) - disc(a.mrp,a.price));
  if (sortBy === "cashback")  filtered = [...filtered].sort((a,b) => b.cashbackPct - a.cashbackPct);
  if (sortBy === "priceLow")  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sortBy === "priceHigh") filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sortBy === "rating")    filtered = [...filtered].sort((a,b) => b.rating - a.rating);

  const totalSpent   = purchases.reduce((s,p) => s + (p.amount||0), 0);
  const totalEarned  = purchases.filter(p=>p.status==="paid").reduce((s,p) => s + (p.cashback||0), 0);
  const totalPending = purchases.filter(p=>p.status==="pending"||p.status==="confirmed").reduce((s,p) => s + (p.cashback||0), 0);

  const OV = { position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:8000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)" };
  const MB = { background:D.card,borderRadius:16,padding:"28px",maxWidth:440,width:"92%",position:"relative",color:D.text,maxHeight:"90vh",overflowY:"auto" };

  return (
    <ErrorBoundary>
    <div style={{ fontFamily:"'Inter',system-ui,-apple-system,sans-serif",background:D.bg,minHeight:"100vh",color:D.text,transition:"background .3s,color .3s",fontSize:14 }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
      ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes popIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
      @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
      @keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
      .pc{transition:transform .2s,box-shadow .2s}.pc:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.12)!important}
      .sc{transition:all .2s}.sc:hover{transform:translateY(-4px);box-shadow:0 10px 24px rgba(0,0,0,.13)!important}
      .fab{transition:transform .18s,box-shadow .18s}.fab:hover{transform:scale(1.1)!important}
      input[type=range]{-webkit-appearance:none;width:100%;height:4px;border-radius:2px;background:#e2e8f0;outline:none}
      input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#2563eb;cursor:pointer}
      table{border-collapse:collapse;width:100%}th,td{padding:10px 12px;text-align:left;font-size:13px}
      select,input,button,textarea{font-family:'Inter',system-ui,sans-serif}
      @media(max-width:768px){.hide-m{display:none!important}.full-m{width:100%!important}}
      @media(min-width:769px){.hide-d{display:none!important}}
    `}</style>

    {/* TOAST */}
    {toast && <div style={{ position:"fixed",top:16,right:16,zIndex:9999,background:"#1e293b",color:"#fff",padding:"12px 18px",borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,.25)",fontSize:13,fontWeight:600,borderLeft:`4px solid ${toast.type==="info"?"#60a5fa":"#4ade80"}`,animation:"slideDown .3s ease",maxWidth:320 }}>{toast.msg}</div>}

    {/* MODALS */}
    {showLogin && <LoginModal D={D} pendingShop={pendingShop} onClose={() => { setShowLogin(false); setPendingShop(null); }} onLogin={u => {
      login(u);
      showToast(`Welcome, ${u.name}! 🎉`);
      setShowLogin(false);
      if (pendingShop) {
        const { slug, storeName, product } = pendingShop;
        setPendingShop(null);
        setTimeout(() => {
          if (product) setRecentlyViewed(p => [product, ...p.filter(x => x.id !== product.id)].slice(0, 8));
          trackClick(product, slug);
          goTo(slug, storeName, showToast);
        }, 600);
      }
    }} />}

    {showChatbot && <AIChatbot D={D} products={PRODUCTS} onShop={handleShop} onClose={() => setShowChatbot(false)} />}

    {/* NEWSLETTER MODAL */}
    {showNewsletter && (
      <div style={OV} onClick={e => e.target===e.currentTarget && setShowNewsletter(false)}>
        <div style={MB}>
          <button onClick={() => setShowNewsletter(false)} style={{ position:"absolute",top:12,right:14,background:"none",border:"none",fontSize:20,cursor:"pointer",color:D.sub }}>✕</button>
          <div style={{ textAlign:"center",marginBottom:16 }}>
            <div style={{ fontSize:40,marginBottom:8 }}>📧</div>
            <h2 style={{ fontSize:20,fontWeight:800,marginBottom:6 }}>Get Exclusive Deal Alerts!</h2>
            <p style={{ color:D.sub,fontSize:13,lineHeight:1.6 }}>Be first to know about flash sales & extra cashback via WhatsApp or Email.</p>
          </div>
          <input value={nlForm.name} onChange={e => setNlForm(f=>({...f,name:e.target.value}))} placeholder="Your Name" style={{ width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${D.inputBorder}`,fontSize:14,marginBottom:10,outline:"none",background:D.input,color:D.text }} />
          <input value={nlForm.contact} onChange={e => setNlForm(f=>({...f,contact:e.target.value}))} placeholder="WhatsApp number or Email" style={{ width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${D.inputBorder}`,fontSize:14,marginBottom:16,outline:"none",background:D.input,color:D.text }} />
          <button onClick={handleNlSubmit} style={{ width:"100%",padding:"13px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer" }}>🔔 Subscribe for Free</button>
        </div>
      </div>
    )}

    {/* COMPARE MODAL */}
    {showCompare && (
      <div style={OV} onClick={e => e.target===e.currentTarget && setShowCompare(null)}>
        <div style={MB}>
          <button onClick={() => setShowCompare(null)} style={{ position:"absolute",top:12,right:14,background:"none",border:"none",fontSize:20,cursor:"pointer",color:D.sub }}>✕</button>
          <h2 style={{ fontSize:17,fontWeight:800,marginBottom:4 }}>📊 Price Comparison</h2>
          <p style={{ color:D.sub,fontSize:13,marginBottom:16 }}>{showCompare.title}</p>
          {Object.entries(showCompare.comparePrice || {}).map(([store, price]) => {
            const best = price === Math.min(...Object.values(showCompare.comparePrice));
            return (
              <div key={store} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderRadius:10,marginBottom:8,background:best?(dark?"#14532d22":"#f0fdf4"):(dark?"#1e2130":"#f8fafc"),border:`1.5px solid ${best?"#16a34a":D.border}` }}>
                <div style={{ fontWeight:700 }}>{store} {best && <span style={{ background:"#16a34a",color:"#fff",fontSize:10,padding:"2px 7px",borderRadius:8,marginLeft:6 }}>BEST</span>}</div>
                <span style={{ fontWeight:900,fontSize:17,color:best?"#16a34a":D.text }}>{fmt(price)}</span>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* MISSING CASHBACK MODAL */}
    {showMissingCashback && user && <MissingCashbackModal D={D} user={user} onClose={() => setShowMissingCashback(false)} submitRequest={submitMissingCashback} showToast={showToast} missingRequests={missingRequests} />}

    {/* PUSH BANNER */}
    {showPushBanner && <PushNotificationBanner D={D} onDismiss={() => setShowPushBanner(false)} />}
    {!showPWABanner && <PWAInstallBanner D={D} onDismiss={() => setShowPWABanner(true)} />}
    {cookieConsent === null && <CookieConsent D={D} onAccept={() => setCookieConsent("all")} onDecline={() => setCookieConsent("essential")} />}
    <LiveChatButton />

    {/* FLOATING CHATBOT */}
    <button onClick={() => setShowChatbot(c=>!c)} className="fab"
      style={{ position:"fixed",bottom:80,right:18,zIndex:700,background:"linear-gradient(135deg,#2563eb,#7c3aed)",borderRadius:"50%",width:50,height:50,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 16px rgba(37,99,235,.5)" }}>🤖</button>
    <a href="https://wa.me/917052557408" target="_blank" rel="noreferrer" className="fab"
      style={{ position:"fixed",bottom:18,right:18,zIndex:700,background:"#25D366",borderRadius:"50%",width:50,height:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:"0 4px 16px rgba(37,211,102,.45)",textDecoration:"none" }}>💬</a>

    {/* ══ MOBILE MENU ══ */}
    {mobileMenuOpen && (
      <div style={{ position:"fixed",inset:0,zIndex:6000 }} onClick={() => setMobileMenuOpen(false)}>
        <div style={{ position:"absolute",top:0,left:0,width:"75%",maxWidth:280,height:"100vh",background:dark?"#0d0f18":"#1e40af",display:"flex",flexDirection:"column",animation:"slideInRight .25s ease",boxShadow:"4px 0 24px rgba(0,0,0,.3)" }} onClick={e=>e.stopPropagation()}>
          <div style={{ padding:"18px 16px",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ background:"#fbbf24",borderRadius:8,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>💸</div>
            <span style={{ fontSize:16,fontWeight:800,color:"#fff" }}>Save<span style={{ color:"#fbbf24" }}>Karo</span></span>
            <button onClick={() => setMobileMenuOpen(false)} style={{ marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,.7)",fontSize:18,cursor:"pointer" }}>✕</button>
          </div>
          <div style={{ padding:"12px 8px" }}>
            <input value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value){setPage("deals");setMobileMenuOpen(false);}}} placeholder="Search deals…"
              style={{ width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,.2)",fontSize:13,background:"rgba(255,255,255,.12)",color:"#fff",outline:"none" }} />
          </div>
          <div style={{ flex:1,overflowY:"auto" }}>
            {[["🏠","Home","home"],["🔥","Top Deals","deals"],["🏪","Stores","stores"],["❤️","Wishlist","wishlist"],["💰","My Cashback","tracker"],["❓","How It Works","howItWorks"],["📜","Legal","legal"],["📰","Blog","blog"]].map(([icon,label,p]) => (
              <button key={p} onClick={() => { setPage(p); setMobileMenuOpen(false); }}
                style={{ display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 16px",background:"none",border:"none",color:page===p?"#fbbf24":"rgba(255,255,255,.85)",fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer",borderLeft:page===p?"3px solid #fbbf24":"3px solid transparent" }}>
                <span style={{ fontSize:18 }}>{icon}</span>{label}
              </button>
            ))}
          </div>
          <div style={{ padding:"14px 16px",borderTop:"1px solid rgba(255,255,255,.1)",display:"flex",gap:8 }}>
            <button onClick={() => setDark(d=>!d)} style={{ flex:1,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",borderRadius:8,padding:"8px",cursor:"pointer",color:"#fff",fontSize:12,fontFamily:"inherit" }}>{dark?"☀️ Light":"🌙 Dark"}</button>
            <button onClick={() => setLang(l=>l==="en"?"hi":"en")} style={{ flex:1,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",borderRadius:8,padding:"8px",cursor:"pointer",color:"#fff",fontSize:12,fontFamily:"inherit",fontWeight:700 }}>{lang==="en"?"हिं":"EN"}</button>
          </div>
        </div>
      </div>
    )}

    {/* ══ NAVBAR — CashKaro style ══ */}
    <nav style={{ background:dark?"#0d0f18":"#fff",borderBottom:`1px solid ${D.border}`,position:"sticky",top:0,zIndex:500,boxShadow:"0 2px 10px rgba(0,0,0,.08)" }}>
      <div style={{ padding:"0 4%",display:"flex",alignItems:"center",gap:10,height:56 }}>
        {/* Hamburger (mobile) */}
        <button className="hide-d" onClick={() => setMobileMenuOpen(o=>!o)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:D.text,padding:"4px",flexShrink:0 }}>☰</button>

        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer",userSelect:"none",flexShrink:0 }}>
          <div style={{ background:"linear-gradient(135deg,#2563eb,#7c3aed)",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15 }}>💸</div>
          <span style={{ fontSize:18,fontWeight:900,color:dark?"#fff":"#1e40af",letterSpacing:"-.3px" }}>Save<span style={{ color:"#f59e0b" }}>Karo</span></span>
        </div>

        {/* Search */}
        <div className="hide-m" style={{ flex:1,maxWidth:500,position:"relative" }}>
          <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:15,pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value) setPage("deals");}} onKeyDown={e=>e.key==="Enter"&&setPage("deals")} placeholder="Search for stores, deals, products…"
            style={{ width:"100%",padding:"9px 14px 9px 36px",borderRadius:8,border:`1.5px solid ${D.inputBorder}`,fontSize:13,outline:"none",background:D.input,color:D.text,transition:"border-color .2s" }}
            onFocus={e=>e.target.style.borderColor="#2563eb"} onBlur={e=>e.target.style.borderColor=D.inputBorder} />
        </div>

        {/* Right */}
        <div style={{ display:"flex",alignItems:"center",gap:6,marginLeft:"auto",flexShrink:0 }}>
          {/* Auth */}
          <div style={{ position:"relative" }}>
            {user ? (
              <button onClick={() => setShowProfile(p=>!p)}
                style={{ display:"flex",alignItems:"center",gap:6,background:dark?"rgba(255,255,255,.08)":"#f0f4ff",border:`1px solid ${D.border}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",color:D.text,fontFamily:"inherit",fontSize:12,fontWeight:600 }}>
                <div style={{ width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,#2563eb,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:10 }}>{user.avatar}</div>
                <span className="hide-m">{user.name.split(" ")[0]}</span>
              </button>
            ) : (
              <button onClick={() => setShowLogin(true)}
                style={{ background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>
                Login
              </button>
            )}
            {showProfile && user && <ProfileDropdown user={user} D={D} onLogout={() => { logout(); setShowProfile(false); showToast("Signed out"); }} onNavigate={(p) => { setPage(p); setShowProfile(false); }} onClose={() => setShowProfile(false)} />}
          </div>

          {/* Wishlist */}
          <button onClick={() => setPage("wishlist")} style={{ background:"none",border:"none",cursor:"pointer",color:D.sub,fontSize:20,position:"relative",padding:"4px" }}>
            ❤️
            {wishlist.length > 0 && <span style={{ position:"absolute",top:-2,right:-2,background:"#ef4444",color:"#fff",fontSize:9,fontWeight:900,borderRadius:"50%",width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center" }}>{wishlist.length}</span>}
          </button>

          {/* Dark mode */}
          <button onClick={() => setDark(d=>!d)} className="hide-m" style={{ background:"none",border:`1px solid ${D.border}`,borderRadius:8,padding:"6px 9px",cursor:"pointer",fontSize:14,color:D.text }}>{dark?"☀️":"🌙"}</button>

          {/* Lang */}
          <button onClick={() => setLang(l=>l==="en"?"hi":"en")} className="hide-m" style={{ background:"none",border:`1px solid ${D.border}`,borderRadius:8,padding:"6px 9px",cursor:"pointer",fontSize:11,fontWeight:700,color:D.text }}>{lang==="en"?"हिं":"EN"}</button>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="hide-m" style={{ borderTop:`1px solid ${D.border}`,padding:"0 4%",display:"flex",alignItems:"center",gap:0,height:36,overflowX:"auto" }}>
        {[["Home","home"],["Top Deals","deals"],["Stores","stores"],["How It Works","howItWorks"],["Blog","blog"]].map(([label,p]) => (
          <button key={p} onClick={() => setPage(p)}
            style={{ background:"none",border:"none",borderBottom:page===p?"2px solid #2563eb":"2px solid transparent",padding:"0 14px",height:"100%",cursor:"pointer",fontSize:12,fontWeight:600,color:page===p?"#2563eb":D.sub,fontFamily:"inherit",whiteSpace:"nowrap",transition:"color .15s" }}>
            {label}
          </button>
        ))}
      </div>
    </nav>

    {/* Mobile search bar */}
    <div className="hide-d" style={{ background:D.card,borderBottom:`1px solid ${D.border}`,padding:"8px 14px" }}>
      <div style={{ position:"relative" }}>
        <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:14 }}>🔍</span>
        <input value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value) setPage("deals");}} placeholder="Search stores, deals…"
          style={{ width:"100%",padding:"9px 12px 9px 32px",borderRadius:8,border:`1.5px solid ${D.inputBorder}`,fontSize:13,outline:"none",background:D.input,color:D.text }} />
      </div>
    </div>

    {/* PAGES */}
    {isLoading ? (
      <div style={{ padding:"24px 4%" }}><SkeletonGrid count={6} /></div>
    ) : page==="home"       ? <HomePage D={D} dark={dark} lang={lang} bannerIdx={bannerIdx} setBannerIdx={setBannerIdx} onShop={handleShop} onNavigate={setPage} stores={STORES} wishlist={wishlist} onWishlist={toggleWishlist} onCompare={setShowCompare} budgetMax={budgetMax} setBudgetMax={setBudgetMax} onReferral={handleReferral} linkCopied={linkCopied} creditOffers={CREDIT_OFFERS} trendingSearches={TRENDING_SEARCHES} collections={COLLECTIONS} budgetSections={BUDGET_SECTIONS} occasions={OCCASIONS} flashDeal={FLASH_DEAL} flashTime={flashTime} />
    : page==="deals"        ? <DealsPage D={D} dark={dark} lang={lang} products={filtered} categories={CATEGORIES} activeCat={activeCat} setActiveCat={setActiveCat} onShop={handleShop} search={search} setSearch={setSearch} wishlist={wishlist} onWishlist={toggleWishlist} onCompare={setShowCompare} budgetMax={budgetMax} setBudgetMax={setBudgetMax} sortBy={sortBy} setSortBy={setSortBy} />
    : page==="stores"       ? <StoresPage D={D} stores={STORES} onShop={handleShop} />
    : page==="wishlist"     ? <WishlistPage D={D} wishlist={wishlist} onShop={handleShop} onWishlist={toggleWishlist} onNavigate={setPage} />
    : page==="tracker"      ? <TrackerPage D={D} user={user} onLogin={() => setShowLogin(true)} purchases={purchases} loadingPurchases={loadingPurchases} deletePurchase={deletePurchase} totalSpent={totalSpent} totalEarned={totalEarned} totalPending={totalPending} onRaiseMissing={() => setShowMissingCashback(true)} missingRequests={missingRequests} />
    : page==="howItWorks"   ? <HowItWorksPage D={D} />
    : page==="legal"        ? <LegalPage D={D} />
    : page==="blog"         ? <BlogPage D={D} dark={dark} onNavigate={setPage} />
    : <NotFoundPage D={D} onNavigate={setPage} />
    }

    {/* Recently viewed */}
    {recentlyViewed.length > 0 && !["tracker","howItWorks","legal"].includes(page) && (
      <div style={{ padding:"20px 4% 14px",background:D.card,borderTop:`1px solid ${D.border}` }}>
        <h3 style={{ fontSize:14,fontWeight:700,marginBottom:12,color:D.text }}>🕐 Recently Viewed</h3>
        <div style={{ display:"flex",gap:10,overflowX:"auto",paddingBottom:4 }}>
          {recentlyViewed.map(p => (
            <div key={p.id} onClick={() => handleShop(p.slug, p.store, p)}
              style={{ minWidth:110,flexShrink:0,background:D.bg,borderRadius:10,overflow:"hidden",cursor:"pointer",border:`1px solid ${D.border}` }}>
              <img src={p.image} alt={p.title} style={{ width:"100%",height:72,objectFit:"cover" }} />
              <div style={{ padding:"6px 8px" }}>
                <div style={{ fontSize:10,fontWeight:600,lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{p.title}</div>
                <div style={{ fontSize:11,fontWeight:700,color:"#2563eb",marginTop:2 }}>{fmt(p.price)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* FOOTER */}
    <footer style={{ background:dark?"#080a0f":"#0f172a",color:"#64748b",marginTop:24 }}>
      <div style={{ padding:"28px 4% 20px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:24 }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
            <div style={{ background:"linear-gradient(135deg,#2563eb,#7c3aed)",borderRadius:7,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13 }}>💸</div>
            <span style={{ fontSize:15,fontWeight:800,color:"#fff" }}>Save<span style={{ color:"#f59e0b" }}>Karo</span></span>
          </div>
          <p style={{ fontSize:11,lineHeight:1.8,marginBottom:12 }}>India's trusted cashback & deals platform. Earn real cashback on 50+ top stores.</p>
          <div style={{ display:"flex",gap:8 }}>
            <a href="https://wa.me/917052557408" target="_blank" rel="noreferrer" style={{ background:"#25D36618",color:"#4ade80",border:"1px solid #25D36628",borderRadius:6,padding:"4px 9px",fontSize:11,fontWeight:600,textDecoration:"none" }}>💬 WA</a>
            <a href="https://www.instagram.com/savekaro2026/" target="_blank" rel="noreferrer" style={{ background:"#E1306C18",color:"#f472b6",border:"1px solid #E1306C28",borderRadius:6,padding:"4px 9px",fontSize:11,fontWeight:600,textDecoration:"none" }}>📸 IG</a>
          </div>
        </div>
        <div>
          <h4 style={{ color:"#e2e8f0",fontWeight:700,fontSize:11,marginBottom:10,textTransform:"uppercase",letterSpacing:.6 }}>Quick Links</h4>
          {[["Home","home"],["Deals","deals"],["Stores","stores"],["My Cashback","tracker"],["How It Works","howItWorks"],["Blog","blog"]].map(([l,p]) => (
            <div key={l} onClick={() => setPage(p)} style={{ fontSize:12,marginBottom:7,cursor:"pointer",transition:"color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#93c5fd"} onMouseLeave={e=>e.currentTarget.style.color="#64748b"}>{l}</div>
          ))}
        </div>
        <div>
          <h4 style={{ color:"#e2e8f0",fontWeight:700,fontSize:11,marginBottom:10,textTransform:"uppercase",letterSpacing:.6 }}>Top Stores</h4>
          {[["Amazon","go-amazon"],["Flipkart","go-flipkart"],["Myntra","go-myntra"],["Nykaa","go-nykaa"],["Ajio","go-ajio"],["MakeMyTrip","go-mmt"]].map(([name,slug]) => (
            <div key={name} onClick={() => goTo(slug,name,showToast)} style={{ fontSize:12,marginBottom:7,cursor:"pointer",transition:"color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#93c5fd"} onMouseLeave={e=>e.currentTarget.style.color="#64748b"}>{name}</div>
          ))}
        </div>
        <div>
          <h4 style={{ color:"#e2e8f0",fontWeight:700,fontSize:11,marginBottom:10,textTransform:"uppercase",letterSpacing:.6 }}>Contact</h4>
          <div style={{ fontSize:12,marginBottom:7 }}>📧 savekaro2026@gmail.com</div>
          <div style={{ fontSize:12,marginBottom:7 }}>📱 +91 70525 57408</div>
          <a href="https://whatsapp.com/channel/0029VbC98wKHrDZWUnPjB72O" target="_blank" rel="noreferrer" style={{ display:"block",fontSize:12,marginBottom:7,color:"#64748b",textDecoration:"none" }}>💬 WhatsApp Channel</a>
          <a href="https://www.instagram.com/savekaro2026/" target="_blank" rel="noreferrer" style={{ display:"block",fontSize:12,color:"#64748b",textDecoration:"none" }}>📸 @savekaro2026</a>
        </div>
      </div>
      <div style={{ borderTop:"1px solid #1e293b",padding:"12px 4%",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,fontSize:11 }}>
        <span>© 2026 SaveKaro. All rights reserved.</span>
        <span style={{ color:"#475569" }}>Affiliate Disclosure: We earn commission on purchases via our links.</span>
      </div>
    </footer>
    </div>
    </ErrorBoundary>
  );
}


/* ══════  WRITE REVIEW  ══════ */
function WriteReview({ D, product, onSubmit }) {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  return (
    <div style={{ background:D.bg,borderRadius:12,padding:"14px",marginBottom:14,border:`1px solid ${D.border}` }}>
      <div style={{ fontWeight:700,fontSize:13,marginBottom:10 }}>✍️ Write a Review</div>
      <div style={{ display:"flex",gap:4,marginBottom:10 }}>
        {[1,2,3,4,5].map(s => <span key={s} onClick={() => setStars(s)} style={{ fontSize:22,cursor:"pointer",color:s<=stars?"#F6AD55":"#CBD5E0",transition:"color .1s" }}>★</span>)}
      </div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${D.inputBorder}`,fontSize:13,marginBottom:8,outline:"none",background:D.input,color:D.text,fontFamily:"inherit" }} />
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your experience…" rows={2} style={{ width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${D.inputBorder}`,fontSize:13,marginBottom:10,outline:"none",background:D.input,color:D.text,fontFamily:"inherit",resize:"none" }} />
      <button onClick={() => { if(stars&&text&&name) onSubmit({stars,text,name}); }} disabled={!stars||!text||!name}
        style={{ width:"100%",padding:"9px",borderRadius:9,border:"none",background:stars&&text&&name?"linear-gradient(135deg,#FF5722,#FF9800)":"#a0aec0",color:"#fff",fontWeight:700,fontSize:13,cursor:stars&&text&&name?"pointer":"not-allowed",fontFamily:"inherit" }}>
        Submit Review (+20 pts)
      </button>
    </div>
  );
}

/* ══════  HOME PAGE — CashKaro style  ══════ */
function HomePage({ D, dark, lang, bannerIdx, setBannerIdx, onShop, onNavigate, stores, wishlist, onWishlist, onCompare, budgetMax, setBudgetMax, onReferral, linkCopied, creditOffers, trendingSearches, collections, budgetSections, occasions, flashDeal, flashTime }) {
  const b = BANNERS[bannerIdx];
  const topDeals = PRODUCTS.filter(p => p.topDeal);
  const beautyStores  = stores.filter(s => ["Nykaa","mCaffeine","Mamaearth","Plum","VLCC","Lotus Botanicals","The Derma Co"].includes(s.name));
  const fashionStores = stores.filter(s => ["Myntra","Ajio","Flipkart","Puma","Uniqlo","Shopsy"].includes(s.name));
  const electroStores = stores.filter(s => ["Amazon","Croma","Noise","Flipkart"].includes(s.name));

  const StoreGrid = ({ items, title }) => (
    <div style={{ padding:"20px 4%", background:D.card, marginBottom:8 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <h2 style={{ fontSize:16,fontWeight:800,color:D.text }}>{title}</h2>
        <button onClick={() => onNavigate("stores")} style={{ fontSize:12,color:"#6366f1",fontWeight:600,background:"none",border:"none",cursor:"pointer" }}>View All →</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
        {items.slice(0,6).map(s => (
          <div key={s.name} onClick={() => onShop(s.slug,s.name)} style={{ background:D.bg,borderRadius:10,padding:"12px 8px",textAlign:"center",cursor:"pointer",border:`1px solid ${D.border}`,transition:"all .2s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#6366f1"} onMouseLeave={e=>e.currentTarget.style.borderColor=D.border}>
            <div style={{ fontSize:28,marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:11,fontWeight:700,color:D.text,marginBottom:2,lineHeight:1.2 }}>{s.name}</div>
            <div style={{ fontSize:10,color:"#16a34a",fontWeight:700,background:"#f0fdf4",padding:"2px 6px",borderRadius:4,display:"inline-block" }}>
              {s.cashback}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background:D.bg, maxWidth:"100%", overflowX:"hidden" }}>

      {/* ── HERO BANNER ── */}
      <div style={{ position:"relative", overflow:"hidden" }}>
        <div key={bannerIdx} style={{ background:b.gradient, padding:"clamp(28px,6vw,52px) 5% clamp(44px,8vw,72px)", animation:"fadeUp .4s ease", position:"relative" }}>
          <div style={{ position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,.07)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:-30,left:"45%",width:150,height:150,borderRadius:"50%",background:"rgba(255,255,255,.05)",pointerEvents:"none" }} />
          <div style={{ maxWidth:560,position:"relative",zIndex:1 }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.2)",backdropFilter:"blur(8px)",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,letterSpacing:.8,marginBottom:12,border:"1px solid rgba(255,255,255,.3)" }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:"#4ade80",animation:"pulse 1.5s infinite",display:"inline-block" }} />
              {b.badge} • {b.store}
            </div>
            <h1 style={{ fontSize:"clamp(20px,4.5vw,42px)",fontWeight:900,color:"#fff",lineHeight:1.2,marginBottom:8,textShadow:"0 2px 8px rgba(0,0,0,.15)" }}>{b.title}</h1>
            <p style={{ color:"rgba(255,255,255,.85)",fontSize:"clamp(12px,2vw,15px)",marginBottom:22,lineHeight:1.65,maxWidth:440 }}>{b.subtitle}</p>
            <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
              <button onClick={() => onShop(b.slug,b.store)} style={{ background:"#fff",border:"none",borderRadius:8,padding:"11px 24px",fontWeight:700,cursor:"pointer",fontSize:14,color:"#4f46e5",boxShadow:"0 4px 16px rgba(0,0,0,.2)",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6 }}>
                🛒 {b.cta}
              </button>
              <button onClick={() => onNavigate("deals")} style={{ background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:8,padding:"11px 20px",fontWeight:600,cursor:"pointer",fontSize:13,color:"#fff",backdropFilter:"blur(8px)",fontFamily:"inherit" }}>
                All Deals
              </button>
            </div>
          </div>
        </div>
        {/* Banner dots */}
        <div style={{ position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6 }}>
          {BANNERS.map((_,i) => <div key={i} onClick={() => setBannerIdx(i)} style={{ width:i===bannerIdx?20:6,height:6,borderRadius:3,cursor:"pointer",transition:"all .3s",background:i===bannerIdx?"#fff":"rgba(255,255,255,.4)" }} />)}
        </div>
      </div>

      {/* ── TOP CATEGORIES (CashKaro style) ── */}
      <div style={{ background:D.card, padding:"16px 4% 8px", marginBottom:8 }}>
        <h2 style={{ fontSize:15,fontWeight:800,color:D.text,marginBottom:14 }}>Top Categories</h2>
        <div style={{ display:"flex",gap:12,overflowX:"auto",paddingBottom:8 }}>
          {[
            { label:"Most Popular", icon:"⭐", color:"#fbbf24", bg:"#fef3c7", slug:"go-amazon" },
            { label:"Fashion",      icon:"👗", color:"#ec4899", bg:"#fdf2f8", slug:"go-myntra" },
            { label:"Beauty",       icon:"💄", color:"#a855f7", bg:"#faf5ff", slug:"go-nykaa" },
            { label:"Electronics",  icon:"📱", color:"#3b82f6", bg:"#eff6ff", slug:"go-croma" },
            { label:"Health",       icon:"💊", color:"#10b981", bg:"#f0fdf4", slug:"go-netmeds" },
            { label:"Travel",       icon:"✈️", color:"#f97316", bg:"#fff7ed", slug:"go-mmt" },
          ].map(cat => (
            <div key={cat.label} onClick={() => onShop(cat.slug, cat.label)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",flexShrink:0,minWidth:70 }}>
              <div style={{ width:56,height:56,borderRadius:"50%",background:cat.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:`2px solid ${cat.color}44`,boxShadow:`0 3px 10px ${cat.color}22` }}>{cat.icon}</div>
              <span style={{ fontSize:11,fontWeight:600,color:D.text,textAlign:"center",lineHeight:1.3 }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── ALL STORES GRID (CashKaro main style) ── */}
      <div style={{ background:D.card, padding:"16px 4%", marginBottom:8 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <h2 style={{ fontSize:15,fontWeight:800,color:D.text }}>Get Cashback on Shopping</h2>
          <button onClick={() => onNavigate("stores")} style={{ fontSize:12,color:"#6366f1",fontWeight:600,background:"none",border:"none",cursor:"pointer" }}>View All →</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
          {stores.slice(0,9).map(s => (
            <div key={s.name} onClick={() => onShop(s.slug,s.name)} style={{ background:D.bg,borderRadius:12,overflow:"hidden",cursor:"pointer",border:`1px solid ${D.border}`,transition:"all .18s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              {/* Off badge */}
              <div style={{ background:`${s.color}18`,padding:"4px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${s.color}22` }}>
                <span style={{ fontSize:9,color:s.color,fontWeight:700,letterSpacing:.3 }}>SALE LIVE</span>
                <span style={{ fontSize:9,color:"#16a34a",fontWeight:700 }}>Up to 60% Off</span>
              </div>
              <div style={{ padding:"12px 8px",textAlign:"center" }}>
                <div style={{ fontSize:26,marginBottom:6 }}>{s.icon}</div>
                <div style={{ fontSize:12,fontWeight:700,color:D.text,marginBottom:6,lineHeight:1.2 }}>{s.name}</div>
                <div style={{ background:"#6366f1",color:"#fff",fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:5,display:"inline-block",boxShadow:"0 2px 6px rgba(99,102,241,.3)" }}>
                  {s.cashback} Cashback
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => onNavigate("stores")} style={{ width:"100%",marginTop:14,padding:"10px",borderRadius:8,border:`1.5px solid ${D.border}`,background:"none",color:D.sub,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
          View All Stores →
        </button>
      </div>

      {/* ── TOP DEALS ── */}
      <div style={{ background:D.card, padding:"16px 4%", marginBottom:8 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <h2 style={{ fontSize:15,fontWeight:800,color:D.text }}>⭐ Top Deals This Week</h2>
          <button onClick={() => onNavigate("deals")} style={{ fontSize:12,color:"#6366f1",fontWeight:600,background:"none",border:"none",cursor:"pointer" }}>View All →</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12 }}>
          {topDeals.map(p => <PC key={p.id} p={p} D={D} dark={dark} onShop={onShop} wishlist={wishlist} onWishlist={onWishlist} onCompare={onCompare} featured />)}
        </div>
      </div>

      {/* ── GET CASHBACK ON FASHION ── */}
      <StoreGrid items={fashionStores} title="👗 Get Cashback on Fashion" />

      {/* ── GET CASHBACK ON BEAUTY ── */}
      <StoreGrid items={beautyStores} title="💄 Get Cashback on Beauty & Grooming" />

      {/* ── GET CASHBACK ON ELECTRONICS ── */}
      <StoreGrid items={electroStores} title="📱 Get Cashback on Electronics" />

      {/* ── BUDGET SECTION ── */}
      {budgetSections && (
        <div style={{ background:D.card, padding:"16px 4%", marginBottom:8 }}>
          <h2 style={{ fontSize:15,fontWeight:800,color:D.text,marginBottom:14 }}>💰 Shop by Budget</h2>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:10 }}>
            {budgetSections.map((b,i) => (
              <div key={i} onClick={() => onShop(b.slug,b.label)} style={{ background:D.bg,borderRadius:10,padding:"14px 8px",textAlign:"center",cursor:"pointer",border:`1.5px solid ${b.color}33`,transition:"all .18s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=b.color} onMouseLeave={e=>e.currentTarget.style.borderColor=`${b.color}33`}>
                <div style={{ fontSize:22,marginBottom:6 }}>{b.icon}</div>
                <div style={{ fontSize:12,fontWeight:800,color:b.color }}>{b.label}</div>
                <div style={{ fontSize:10,color:D.sub,marginTop:2 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CREDIT CARD OFFERS ── */}
      {creditOffers && creditOffers.length > 0 && (
        <div style={{ background:D.card, padding:"16px 4%", marginBottom:8 }}>
          <h2 style={{ fontSize:15,fontWeight:800,color:D.text,marginBottom:14 }}>💳 Credit Card Offers</h2>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {creditOffers.map((card,i) => (
              <div key={i} style={{ background:`linear-gradient(135deg,${card.color},${i===0?"#334155":"#1e3a5f"})`,borderRadius:14,padding:"18px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12 }}>
                <div>
                  <div style={{ color:"rgba(255,255,255,.7)",fontSize:11,fontWeight:600,marginBottom:4 }}>{card.badge}</div>
                  <div style={{ color:"#fff",fontWeight:800,fontSize:16 }}>{card.name}</div>
                  <div style={{ color:"rgba(255,255,255,.75)",fontSize:12,marginTop:2 }}>{card.subtitle}</div>
                </div>
                <button onClick={() => window.open(card.link,"_blank","noopener,noreferrer")} style={{ background:"#fff",border:"none",borderRadius:8,padding:"10px 18px",fontWeight:700,cursor:"pointer",fontSize:13,color:"#4f46e5",whiteSpace:"nowrap",flexShrink:0,fontFamily:"inherit" }}>
                  Apply →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── REFER & EARN ── */}
      <div style={{ margin:"0 4% 8px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:14,padding:"22px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
        <div>
          <h3 style={{ color:"#fff",fontSize:16,fontWeight:800,marginBottom:4 }}>🎁 Refer & Earn</h3>
          <p style={{ color:"rgba(255,255,255,.8)",fontSize:12,lineHeight:1.5 }}>Share your link. Friends shop. You earn bonus cashback.</p>
        </div>
        <button onClick={onReferral} style={{ background:linkCopied?"#4ade80":"#fff",color:linkCopied?"#fff":"#6366f1",border:"none",borderRadius:8,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit",flexShrink:0,transition:"all .2s" }}>
          {linkCopied?"✅ Copied!":"📋 Copy Referral Link"}
        </button>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ background:D.card, padding:"20px 4% 24px", marginBottom:8 }}>
        <h2 style={{ fontSize:15,fontWeight:800,color:D.text,marginBottom:16,textAlign:"center" }}>How SaveKaro Works</h2>
        <div style={{ display:"flex",justifyContent:"center",gap:0,flexWrap:"wrap" }}>
          {[
            { n:"1",icon:"🛒",t:"Click a Store",d:"Browse & click any store via SaveKaro" },
            { n:"2",icon:"🛍️",t:"Shop Normally",d:"Buy as usual on the store website" },
            { n:"3",icon:"💰",t:"Claim Cashback",d:"Submit order details & get paid to UPI" },
          ].map((s,i) => (
            <div key={s.n} style={{ maxWidth:180,padding:"0 16px",textAlign:"center",position:"relative" }}>
              {i<2 && <div style={{ position:"absolute",top:20,right:-12,width:24,height:2,background:"linear-gradient(90deg,#6366f1,#8b5cf6)",zIndex:1 }} />}
              <div style={{ width:44,height:44,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,margin:"0 auto 10px",boxShadow:"0 4px 12px rgba(99,102,241,.3)" }}>{s.icon}</div>
              <div style={{ fontSize:10,color:"#6366f1",fontWeight:700,letterSpacing:.8,marginBottom:3 }}>STEP {s.n}</div>
              <div style={{ fontSize:13,fontWeight:700,color:D.text,marginBottom:4 }}>{s.t}</div>
              <div style={{ fontSize:11,color:D.sub,lineHeight:1.6 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


function DealsPage({ D, dark, lang, products, categories, activeCat, setActiveCat, onShop, search, setSearch, wishlist, onWishlist, onCompare, budgetMax, setBudgetMax, sortBy, setSortBy }) {
  return (
    <div style={{ padding:"28px 6%" }}>
      {/* Deals page header */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:12 }}>
          <div>
            <h1 style={{ fontSize:20,fontWeight:700,marginBottom:2 }}>Top Deals & Offers</h1>
            <p style={{ color:D.sub,fontSize:13 }}>{products.length} deals found — earn cashback on every purchase</p>
          </div>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#9ca3af",pointerEvents:"none" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, brands…"
              style={{ padding:"9px 14px 9px 34px",borderRadius:6,border:`1px solid ${D.inputBorder}`,fontSize:13,width:240,outline:"none",background:D.input,fontFamily:"inherit",color:D.text }} />
          </div>
        </div>
      </div>
      <div style={{ background:D.card,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",border:`1px solid ${D.border}` }}>
        <span style={{ fontWeight:700,fontSize:13 }}>🎯 {fmt(budgetMax)}</span>
        <div style={{ flex:1,minWidth:130 }}><input type="range" min={500} max={80000} step={500} value={budgetMax} onChange={e => setBudgetMax(Number(e.target.value))} /></div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:"7px 12px",borderRadius:9,border:`1.5px solid ${D.inputBorder}`,fontSize:13,background:D.input,color:D.text,outline:"none",cursor:"pointer" }}>
          {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button onClick={() => setBudgetMax(80000)} style={{ background:"none",border:`1px solid ${D.border}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:600,color:D.sub,fontFamily:"inherit" }}>{"Reset"}</button>
      </div>
      <div style={{ display:"flex",gap:8,marginBottom:18,overflowX:"auto",paddingBottom:6,WebkitOverflowScrolling:"touch" }}>
        {categories.map(c => <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ padding:"7px 15px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,whiteSpace:"nowrap",fontFamily:"inherit",background:activeCat===c.id?"linear-gradient(135deg,#FF5722,#FF9800)":D.card,color:activeCat===c.id?"#fff":D.sub,boxShadow:activeCat===c.id?"0 4px 14px rgba(255,87,34,.35)":`0 2px 8px rgba(0,0,0,${dark?.12:.07})` }}>{c.icon} {lang==="hi"?c.labelHi:c.label}</button>)}
      </div>
      {products.length===0 ? <div style={{ textAlign:"center",padding:"70px 0",color:D.sub }}><div style={{ fontSize:52,marginBottom:10 }}>🔍</div><p style={{ fontWeight:700,fontSize:17 }}>{"No deals found"}</p><p style={{ fontSize:13,marginTop:7 }}>{"Try adjusting your filters or budget"}</p></div>
        : <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:14 }}>{products.map(p => <PC key={p.id} p={p} D={D} dark={dark} onShop={onShop} wishlist={wishlist} onWishlist={onWishlist} onCompare={onCompare} />)}</div>}
    </div>
  );
}

/* ══════  COUPONS PAGE  ══════ */
function CouponsPage({ D, coupons, onCopy, copied, onShop }) {
  return (
    <div style={{ padding:"28px 6%" }}>
      <h1 style={{ fontSize:22,fontWeight:800,marginBottom:4 }}>🎟️ Latest Coupon Codes</h1>
      <p style={{ color:D.sub,fontSize:13,marginBottom:24 }}>Copy code → click "Shop Now" → paste at checkout</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(290px,100%),1fr))",gap:16 }}>
        {coupons.map(c => (
          <div key={c.id} className="ch" style={{ background:D.card,borderRadius:15,overflow:"hidden",boxShadow:"0 3px 14px rgba(0,0,0,.08)",border:`1px solid ${D.border}` }}>
            <div style={{ background:c.storeBg,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div><div style={{ fontSize:10,color:"#718096",fontWeight:600 }}>STORE</div><div style={{ fontWeight:800,fontSize:16,color:c.storeColor }}>{c.store}</div></div>
              <div style={{ background:"#fff",border:`2px dashed ${c.storeColor}`,borderRadius:9,padding:"7px 14px",fontWeight:900,fontSize:14,color:c.storeColor,letterSpacing:1.5 }}>{c.code}</div>
            </div>
            <div style={{ padding:"12px 18px 16px" }}>
              <p style={{ fontSize:13,color:D.sub,marginBottom:8,lineHeight:1.6 }}>🎁 {c.desc}</p>
              <div style={{ fontSize:11,color:D.sub,marginBottom:12 }}>⏰ Expires: {c.expiry}</div>
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={() => onCopy(c.code,c.id,c.store)} style={{ flex:1,padding:"9px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit",transition:"all .2s",background:copied===c.id?"#48BB78":D.input,color:copied===c.id?"#fff":D.sub,border:`1.5px solid ${copied===c.id?"#48BB78":D.inputBorder}` }}>{copied===c.id?"✅ Copied!":"📋 Copy Code"}</button>
                <button onClick={() => onShop(c.slug,c.store)} style={{ flex:1,padding:"9px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit",background:`linear-gradient(135deg,${c.storeColor},${c.storeColor}cc)`,color:"#fff" }}>Shop Now →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════  STORES PAGE  ══════ */
function StoresPage({ D, stores, onShop }) {
  const [search, setSearch] = useState("");
  const filtered = stores.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ padding:"28px 6%" }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:26,fontWeight:900,marginBottom:6,color:D.text }}>🏪 All Partner Stores</h1>
        <p style={{ color:D.sub,fontSize:14,marginBottom:18 }}>Click any store to shop & earn cashback — verified affiliate partners</p>
        {/* Search */}
        <div style={{ position:"relative",maxWidth:400 }}>
          <svg style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={D.sub} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search stores…"
            style={{ width:"100%",padding:"11px 16px 11px 40px",borderRadius:12,border:`1.5px solid ${D.inputBorder}`,fontSize:14,outline:"none",background:D.input,color:D.text,fontFamily:"inherit" }}
            onFocus={e=>e.target.style.borderColor="#2563eb"} onBlur={e=>e.target.style.borderColor=D.inputBorder} />
        </div>
      </div>
      {/* Grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16 }}>
        {filtered.map(s => (
          <div key={s.name} className="ch" onClick={() => onShop(s.slug,s.name)}
            style={{ background:D.card,borderRadius:16,padding:"20px 16px",textAlign:"center",cursor:"pointer",border:`1px solid ${D.border}`,position:"relative",overflow:"hidden" }}>
            {/* Top color bar */}
            <div style={{ position:"absolute",top:0,left:0,right:0,height:4,background:s.color }} />
            <div style={{ fontSize:36,marginBottom:10,marginTop:4 }}>{s.icon}</div>
            <h3 style={{ fontWeight:800,fontSize:15,marginBottom:6,color:D.text }}>{s.name}</h3>
            <div style={{ background:`${s.color}18`,color:s.color,border:`1px solid ${s.color}44`,padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:800,display:"inline-block",marginBottom:14 }}>{s.cashback}</div>
            <div style={{ width:"100%",padding:"9px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${s.color},${s.color}cc)`,color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",letterSpacing:.2 }}>
              Shop & Earn →
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign:"center",padding:"60px 0",color:D.sub }}>
          <div style={{ fontSize:48,marginBottom:10 }}>🔍</div>
          <p style={{ fontWeight:700,fontSize:16 }}>No stores found for "{search}"</p>
        </div>
      )}
    </div>
  );
}

/* ══════  WISHLIST PAGE  ══════ */
function WishlistPage({ D, wishlist, onShop, onWishlist, onCompare, onNavigate }) {
  if (!wishlist.length) return <div style={{ textAlign:"center",padding:"80px 6%",color:D.sub }}><div style={{ fontSize:60,marginBottom:12 }}>❤️</div><h2 style={{ fontWeight:800,fontSize:20,color:D.text,marginBottom:6 }}>Your Wishlist is Empty</h2><p style={{ fontSize:14,marginBottom:22 }}>Save deals you love and come back anytime</p><button onClick={() => onNavigate("deals")} style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",border:"none",borderRadius:12,padding:"12px 28px",fontWeight:800,cursor:"pointer",fontSize:14,fontFamily:"inherit" }}>Browse Deals →</button></div>;
  return <div style={{ padding:"28px 6%" }}><h1 style={{ fontSize:22,fontWeight:800,marginBottom:4 }}>❤️ My Wishlist</h1><p style={{ color:D.sub,fontSize:13,marginBottom:22 }}>{wishlist.length} saved deal{wishlist.length!==1?"s":""}</p><div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:14 }}>{wishlist.map(p => <PC key={p.id} p={p} D={D} onShop={onShop} wishlist={wishlist} onWishlist={onWishlist} onCompare={onCompare} />)}</div></div>;
}

/* ══════  TRACKER PAGE  ══════ */
function TrackerPage({ D, user, onLogin, purchases, loadingPurchases, deletePurchase, totalSpent, totalEarned, totalPending, onRaiseMissing, missingRequests }) {
  const statusColor = { pending:"#F6AD55", confirmed:"#63B3ED", paid:"#68D391" };

  // Not logged in — show login prompt
  if (!user) return (
    <div style={{ textAlign:"center",padding:"80px 6%",color:D.sub }}>
      <div style={{ fontSize:64,marginBottom:16 }}>🔐</div>
      <h2 style={{ fontWeight:900,fontSize:22,color:D.text,marginBottom:8 }}>Login to View Your Cashback</h2>
      <p style={{ fontSize:14,marginBottom:24,lineHeight:1.7 }}>
        Your cashback, purchases and earnings are saved to your account.<br/>
        Login or register free to track everything in one place.
      </p>
      <button onClick={onLogin} style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",border:"none",borderRadius:12,padding:"13px 32px",fontWeight:800,cursor:"pointer",fontSize:15,fontFamily:"inherit" }}>
        Login / Register Free →
      </button>
    </div>
  );

  return (
    <div style={{ padding:"16px 4%" }}>
      <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,marginBottom:3 }}>{"My Cashback"}</h1>
          <p style={{ color:D.sub,fontSize:13 }}>Welcome, {user.name} • {"Track all purchases & earnings"}</p>
        </div>
        <button onClick={onRaiseMissing} style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",border:"none",borderRadius:11,padding:"10px 20px",fontWeight:800,cursor:"pointer",fontSize:13,fontFamily:"inherit",boxShadow:"0 4px 14px rgba(255,87,34,.3)" }}>
          💰 Claim Cashback
        </button>
      </div>

      {/* Stats cards */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:14,marginBottom:24 }}>
        {[
          ["🛒", "Total Spent",  fmt(totalSpent),  "#2874F0"],
          ["💰", "Total Earned", fmt(totalEarned), "#48BB78"],
          ["⏳", "Pending",     fmt(totalPending), "#F6AD55"],
          ["🛍️", "Total Orders",  purchases.length,  "#6C63FF"],
        ].map(([icon,label,value,color]) => (
          <div key={label} style={{ background:D.card,borderRadius:13,padding:"18px",boxShadow:"0 3px 14px rgba(0,0,0,.07)",border:`1px solid ${D.border}` }}>
            <div style={{ fontSize:26,marginBottom:7 }}>{icon}</div>
            <div style={{ fontSize:20,fontWeight:900,color,marginBottom:3 }}>{value}</div>
            <div style={{ fontSize:11,color:D.sub,fontWeight:600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* How cashback works */}
      <div style={{ background:"linear-gradient(135deg,#FF572211,#FF980011)",border:"1.5px solid #FF572233",borderRadius:14,padding:"14px 18px",marginBottom:20,fontSize:13,lineHeight:1.9,color:D.text }}>
        <strong>💡 How cashback is tracked:</strong> Click any deal → shop on the store → cashback appears here as <span style={{ color:"#F6AD55",fontWeight:700 }}>Pending</span> within 24–72 hrs → becomes <span style={{ color:"#63B3ED",fontWeight:700 }}>Confirmed</span> after return window → then <span style={{ color:"#48BB78",fontWeight:700 }}>Paid</span> to your account.
      </div>

      {/* Purchases table */}
      {loadingPurchases ? (
        <div style={{ textAlign:"center",padding:"40px 0",color:D.sub }}>
          <div style={{ fontSize:32,marginBottom:10 }}>⏳</div>
          <p>Loading your purchases…</p>
        </div>
      ) : purchases.length === 0 ? (
        <div style={{ textAlign:"center",padding:"50px 0",color:D.sub }}>
          <div style={{ fontSize:52,marginBottom:12 }}>🛒</div>
          <p style={{ fontWeight:700,fontSize:16,marginBottom:8,color:D.text }}>No purchases yet</p>
          <p style={{ fontSize:13,marginBottom:6 }}>Click any deal on SaveKaro and complete your purchase.</p>
          <p style={{ fontSize:12 }}>Your cashback will appear here automatically within 24–72 hours.</p>
        </div>
      ) : (
        <div style={{ background:D.card,borderRadius:14,overflow:"hidden",boxShadow:"0 3px 14px rgba(0,0,0,.07)",border:`1px solid ${D.border}`,overflowX:"auto" }}>
          <table>
            <thead>
              <tr style={{ background:D.bg }}>
                {["Date","Store","Product","Paid","Cashback","Status",""].map(h => (
                  <th key={h} style={{ color:D.sub,fontWeight:700,fontSize:11,letterSpacing:.4,borderBottom:`1px solid ${D.border}`,padding:"11px 13px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p.id} style={{ borderBottom:`1px solid ${D.border}` }}>
                  <td style={{ color:D.sub,fontSize:11 }}>{p.date}</td>
                  <td style={{ fontWeight:700,fontSize:12 }}>{p.platform}</td>
                  <td style={{ maxWidth:140,fontSize:12 }}>{p.product}</td>
                  <td style={{ fontWeight:700,fontSize:12 }}>{fmt(p.amount)}</td>
                  <td style={{ fontWeight:800,color:"#48BB78",fontSize:12 }}>+{fmt(p.cashback)}</td>
                  <td>
                    <span style={{ background:`${statusColor[p.status]||"#a0aec0"}22`,color:statusColor[p.status]||"#a0aec0",fontSize:10,fontWeight:800,padding:"3px 9px",borderRadius:10,textTransform:"capitalize" }}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => deletePurchase(p.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"#FC8181",fontSize:15 }}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Missing cashback requests */}
      {missingRequests?.length > 0 && (
        <div style={{ marginTop:24 }}>
          <h3 style={{ fontSize:15,fontWeight:800,marginBottom:14 }}>📋 My Cashback Claims</h3>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {missingRequests.map(r => (
              <div key={r.id} style={{ background:D.card,borderRadius:10,padding:"12px 16px",border:`1px solid ${D.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8 }}>
                <div>
                  <div style={{ fontSize:13,fontWeight:700 }}>{r.store} — {r.orderId}</div>
                  <div style={{ fontSize:11,color:D.sub }}>{r.purchaseDate} • ₹{r.amount}</div>
                </div>
                <span style={{ background:r.status==="resolved"?"#48BB7822":r.status==="reviewing"?"#63B3ED22":"#F6AD5522",color:r.status==="resolved"?"#276749":r.status==="reviewing"?"#2C7A7B":"#B7791F",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:10,textTransform:"capitalize" }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════  HOW IT WORKS PAGE  ══════ */
function HowItWorksPage({ D }) {
  const steps = [
    { icon:"🔍", title:"Find a Deal",         desc:"Browse deals from 50+ top Indian stores — Amazon, Flipkart, Myntra, Nykaa, Ajio and more. All showing real cashback percentages." },
    { icon:"🖱️", title:"Click & Shop",        desc:"Click 'Shop Now' — you'll be taken to the store via our special link. Shop and pay as usual. Important: do NOT use Incognito mode." },
    { icon:"📋", title:"Claim Your Cashback", desc:"After purchasing, go to My Cashback → click 'Claim My Cashback' → fill your Order ID, store name and amount paid. Takes 30 seconds." },
    { icon:"✅", title:"We Verify Your Order","desc":"Our team verifies your order with the affiliate network within 7 working days. You'll get an email once verified." },
    { icon:"💰", title:"Get Paid via UPI",    desc:"Verified cashback is sent directly to your UPI ID within 30 days. Minimum payout is ₹100." },
  ];
  return (
    <div style={{ padding:"28px 6% 48px",maxWidth:780,margin:"0 auto" }}>
      <h1 style={{ fontSize:26,fontWeight:900,marginBottom:6,textAlign:"center" }}>❓ {"How SaveKaro Works"}</h1>
      <p style={{ color:D.sub,fontSize:14,textAlign:"center",marginBottom:36,lineHeight:1.7 }}>{"3 simple steps to start earning cashback"}</p>
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        {steps.map((s,i) => (
          <div key={i} style={{ background:D.card,borderRadius:14,padding:"20px 22px",display:"flex",gap:16,alignItems:"flex-start",border:`1px solid ${D.border}`,boxShadow:"0 3px 12px rgba(0,0,0,.07)" }}>
            <div style={{ width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#FF5722,#FF9800)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:"0 4px 14px rgba(255,87,34,.3)" }}>{s.icon}</div>
            <div><div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:5 }}><span style={{ background:"#FF572222",color:"#FF5722",fontSize:10,fontWeight:900,padding:"2px 9px",borderRadius:10 }}>STEP {i+1}</span><h3 style={{ fontWeight:800,fontSize:15 }}>{s.title}</h3></div><p style={{ color:D.sub,fontSize:13,lineHeight:1.7 }}>{s.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background:D.card,border:"2px solid #FF572233",borderRadius:14,padding:"20px",marginTop:24 }}>
        <h3 style={{ fontWeight:800,fontSize:15,color:"#FF5722",marginBottom:10 }}>⚠️ Important Notes</h3>
        {["Always click our link before adding to cart — links clicked earlier may not be tracked.","Don't use Incognito mode or clear cookies before completing purchase.","Cancelled or returned orders will have cashback reversed.","Cashback rates may vary — always check the rate shown on SaveKaro before shopping."].map((t,i) => <div key={i} style={{ display:"flex",gap:9,marginBottom:7,fontSize:13,color:D.sub,lineHeight:1.6 }}><span>•</span><span>{t}</span></div>)}
      </div>
    </div>
  );
}

/* ══════  LEGAL PAGE  ══════ */
function LegalPage({ D }) {
  const [tab, setTab] = useState("privacy");
  const content = {
    privacy:[["Information We Collect","We collect your name, email address, WhatsApp number (when you subscribe to deal alerts), and anonymous usage data to improve our service."],["How We Use It","Your contact information is used only to send deal alerts and cashback updates you opted into. We never sell your personal data to third parties."],["Cookies","We use cookies to track affiliate referrals and analyze site traffic via Google Analytics. You can disable cookies in your browser settings, but this may affect cashback tracking."],["Third-Party Links","Our site contains affiliate links to third-party stores. We are not responsible for the privacy practices of those sites."],["Contact",`For privacy concerns, email us at ${SITE.email}`]],
    terms:[["Use of Site","SaveKaro is a free affiliate deals platform. You may browse and click our links for personal, non-commercial use only."],["Affiliate Relationship","We earn a commission when you purchase through our links. This comes from the retailer — not from you — and does not affect the price you pay."],["Cashback","Cashback amounts shown are estimates. Actual cashback may vary. SaveKaro is not responsible for missed cashback due to cookie issues or retailer policy changes."],["Accuracy","We strive to keep prices and offers accurate, but deals change frequently. Always verify the final price on the retailer's site."],["Limitation of Liability","SaveKaro is not liable for any loss or damage arising from use of our site or affiliated retailers."]],
    affiliate:[["What is an Affiliate Link?","An affiliate link is a special URL with a unique tracking code. When you click our link and purchase, the retailer pays SaveKaro a small commission."],["Does It Cost You More?","No. The price you pay is exactly the same. The commission comes from the retailer's marketing budget."],["Programs We Participate In","SaveKaro participates in Amazon Associates, Flipkart Affiliate, Myntra Affiliate, Nykaa Affiliate, Ajio Affiliate, and other Indian retailer programs."],["ASCI Compliance","In accordance with ASCI guidelines (India), we disclose that this site contains affiliate links and we may earn compensation when you click them."],["Editorial Independence","Our deal selection is based on genuine value to users. Affiliate relationships do not influence which deals we feature."]],
  };
  return (
    <div style={{ padding:"28px 6% 48px",maxWidth:760,margin:"0 auto" }}>
      <h1 style={{ fontSize:24,fontWeight:900,marginBottom:4 }}>📜 Legal</h1>
      <p style={{ color:D.sub,fontSize:13,marginBottom:24 }}>Last updated: March 2026</p>
      <div style={{ display:"flex",gap:8,marginBottom:24,flexWrap:"wrap" }}>
        {[["privacy","Privacy Policy"],["terms","Terms of Use"],["affiliate","Affiliate Disclosure"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding:"8px 18px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit",background:tab===id?"linear-gradient(135deg,#FF5722,#FF9800)":D.card,color:tab===id?"#fff":D.sub,boxShadow:tab===id?"0 4px 14px rgba(255,87,34,.3)":`0 2px 8px rgba(0,0,0,.07)` }}>{label}</button>
        ))}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        {content[tab].map(([heading,body],i) => (
          <div key={i} style={{ background:D.card,borderRadius:13,padding:"18px 20px",border:`1px solid ${D.border}` }}>
            <h3 style={{ fontWeight:800,fontSize:14,marginBottom:7 }}>{heading}</h3>
            <p style={{ fontSize:13,color:D.sub,lineHeight:1.75 }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════  OCCASION SECTION COMPONENT  ══════ */
function OccasionSection({ occ, D, dark, onShop }) {
  const [active, setActive] = useState(false);
  return (
    <div className="ch"
      style={{ background:D.card,borderRadius:16,overflow:"hidden",border:`2px solid ${active?occ.color:D.border}`,cursor:"pointer",minWidth:280,transition:"border-color .2s",flexShrink:0 }}
      onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
      {/* Header */}
      <div style={{ background:occ.gradient,padding:"14px 18px",display:"flex",alignItems:"center",gap:10 }}>
        <h3 style={{ color:"#fff",fontWeight:900,fontSize:16,marginBottom:2 }}>{occ.title}</h3>
        <span style={{ color:"rgba(255,255,255,.8)",fontSize:12,marginLeft:"auto" }}>{occ.subtitle}</span>
      </div>
      {/* Items grid */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:D.border }}>
        {occ.items.map((item, i) => (
          <div key={i} onClick={() => onShop(item.slug, item.store)}
            style={{ background:D.card,padding:"10px",cursor:"pointer",position:"relative" }}>
            <img src={item.img} alt={item.title}
              style={{ width:"100%",height:80,objectFit:"cover",borderRadius:8,marginBottom:6,display:"block" }} />
            <div style={{ fontSize:11,fontWeight:700,lineHeight:1.3,marginBottom:3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{item.title}</div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontSize:10,color:"#FF5722",fontWeight:700 }}>💰 {item.cashback}</span>
              <span style={{ fontSize:9,background:`${occ.color}22`,color:occ.color,padding:"1px 6px",borderRadius:6,fontWeight:700 }}>{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════  MISSING CASHBACK MODAL (Simple)  ══════ */
function MissingCashbackModal({ D, user, onClose, submitRequest, showToast }) {
  const [form, setForm] = useState({ store:"Amazon", orderId:"", amount:"", purchaseDate:new Date().toISOString().split("T")[0] });
  const [loading, setLoading] = useState(false);
  const OV = { position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9500,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" };
  const MB = { background:D.card,borderRadius:16,padding:"24px",maxWidth:440,width:"100%",position:"relative",color:D.text,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,.3)" };
  const inp = { width:"100%",padding:"11px 14px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:14,outline:"none",background:D.input,color:D.text,fontFamily:"inherit",marginBottom:12 };

  const handleSubmit = async () => {
    if (!form.orderId || !form.amount) { showToast("Please fill Order ID and Amount", "info"); return; }
    setLoading(true);
    try {
      await submitRequest({ ...form, amount: Number(form.amount), userName: user.name, userEmail: user.email });
      showToast("Cashback claim submitted! We'll verify within 7 days ✅");
      onClose();
    } catch { showToast("Failed to submit. Try again.", "info"); }
    setLoading(false);
  };

  return (
    <div style={OV} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={MB}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:22,cursor:"pointer",color:D.sub }}>✕</button>
        <h2 style={{ fontSize:18,fontWeight:800,marginBottom:4 }}>💰 Claim Your Cashback</h2>
        <p style={{ color:D.sub,fontSize:13,marginBottom:20 }}>Fill in your order details and we'll verify & credit your cashback within 7 working days.</p>

        <label style={{ fontSize:12,fontWeight:600,color:D.sub,display:"block",marginBottom:5 }}>Store *</label>
        <select value={form.store} onChange={e=>setForm(f=>({...f,store:e.target.value}))} style={{ ...inp }}>
          {["Amazon","Flipkart","Myntra","Nykaa","Ajio","Mamaearth","mCaffeine","MakeMyTrip","Croma","Noise","Puma","MuscleBlaze","Netmeds","Other"].map(s=><option key={s}>{s}</option>)}
        </select>

        <label style={{ fontSize:12,fontWeight:600,color:D.sub,display:"block",marginBottom:5 }}>Order ID *</label>
        <input value={form.orderId} onChange={e=>setForm(f=>({...f,orderId:e.target.value}))} placeholder="e.g. 408-1234567-8901234" style={inp} />

        <label style={{ fontSize:12,fontWeight:600,color:D.sub,display:"block",marginBottom:5 }}>Order Amount (₹) *</label>
        <input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="e.g. 1499" style={inp} />

        <label style={{ fontSize:12,fontWeight:600,color:D.sub,display:"block",marginBottom:5 }}>Purchase Date *</label>
        <input type="date" value={form.purchaseDate} onChange={e=>setForm(f=>({...f,purchaseDate:e.target.value}))} style={inp} />

        <div style={{ background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#92400e",lineHeight:1.7,marginBottom:16 }}>
          ⚠️ Make sure you clicked our store link before purchasing. Cashback is verified manually within 7 days.
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{ width:"100%",padding:"13px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontWeight:700,fontSize:15,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",opacity:loading?.7:1 }}>
          {loading ? "Submitting…" : "📤 Submit Claim"}
        </button>
      </div>
    </div>
  );
}


/* ══════  MISSING CASHBACK MODAL  ══════ */

/* ══════  SECTION HEADER  ══════ */
function SH({ D, title, sub, cta, onCta }) {
  return (
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap" }}>
      <div>
        <h2 style={{ fontSize:18,fontWeight:900,marginBottom:2,color:D.text }}>{title}</h2>
        {sub && <p style={{ color:D.sub,fontSize:12,marginTop:2 }}>{sub}</p>}
      </div>
      {cta && <button onClick={onCta}
        style={{ background:"linear-gradient(135deg,#5c35ff22,#ff6b3522)",border:"1px solid #5c35ff44",color:"#5c35ff",borderRadius:8,padding:"7px 14px",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0 }}>
        {cta} →
      </button>}
    </div>
  );
}

/* ══════  PRODUCT CARD ══════ */
function PC({ p, D, dark, onShop, wishlist, onWishlist, onCompare, featured }) {
  const discPct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  const isWished = wishlist ? wishlist.some(w => w.id === p.id) : false;
  const cashbackAmt = Math.round(p.price * p.cashbackPct / 100);
  return (
    <div className="pc" style={{
      background: D.card,
      borderRadius: 12,
      overflow: "hidden",
      border: `1px solid ${featured ? "#6366f133" : D.border}`,
      display: "flex",
      flexDirection: "column",
      boxShadow: featured ? "0 4px 20px rgba(99,102,241,.12)" : `0 2px 8px ${D.shadow}`,
    }}>
      {/* Ribbon */}
      {p.flashSale && (
        <div style={{ background:"linear-gradient(90deg,#ef4444,#f97316)",color:"#fff",fontSize:10,fontWeight:700,textAlign:"center",padding:"4px 0",letterSpacing:.6 }}>
          ⚡ FLASH SALE — Extra 5% OFF
        </div>
      )}

      {/* Image */}
      <div style={{ position:"relative", background:"#f8fafc", paddingTop: p.flashSale ? 0 : 0, cursor:p.inStock?"pointer":"default" }}
        onClick={() => p.inStock && onShop(p.slug, p.store, p)}>
        <img src={p.image} alt={p.title}
          style={{ width:"100%", height:185, objectFit:"contain", display:"block", padding:"14px", filter:p.inStock?"none":"grayscale(60%) opacity(.7)" }} />

        {/* Discount badge */}
        {discPct >= 5 && (
          <div style={{ position:"absolute",top:10,left:10,background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 8px",borderRadius:6,boxShadow:"0 2px 6px rgba(22,163,74,.4)" }}>
            {discPct}% OFF
          </div>
        )}

        {/* Out of stock */}
        {!p.inStock && (
          <div style={{ position:"absolute",inset:0,background:"rgba(248,250,252,.85)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(2px)" }}>
            <span style={{ background:"#64748b",color:"#fff",fontSize:12,fontWeight:700,padding:"6px 16px",borderRadius:20 }}>Out of Stock</span>
          </div>
        )}

        {/* Wishlist */}
        <button className="heart-btn" onClick={e => { e.stopPropagation(); onWishlist(p); }}
          style={{ position:"absolute",top:8,right:8,background:isWished?"#fff":"rgba(255,255,255,.9)",border:isWished?"1px solid #fca5a5":"1px solid #e2e8f0",borderRadius:50,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",color:isWished?"#ef4444":"#94a3b8" }}>
          {isWished ? "♥" : "♡"}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding:"12px 14px 14px", flex:1, display:"flex", flexDirection:"column", gap:7 }}>
        {/* Store + Rating row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11,color:p.storeColor,fontWeight:600,background:`${p.storeColor}18`,padding:"2px 8px",borderRadius:4,border:`1px solid ${p.storeColor}30` }}>{p.store}</span>
          <div style={{ display:"flex",alignItems:"center",gap:4,cursor:"pointer" }} onClick={() => {}}>
            <span style={{ background:"#16a34a",color:"#fff",fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:4,display:"inline-flex",alignItems:"center",gap:2 }}>
              ★ {p.rating}
            </span>
            <span style={{ fontSize:10,color:D.sub }}>({(p.reviews/1000).toFixed(0)}k)</span>
          </div>
        </div>

        {/* Title */}
        <h3 onClick={() => p.inStock && onShop(p.slug, p.store, p)}
          style={{ fontSize:13,fontWeight:500,lineHeight:1.5,color:D.text,cursor:p.inStock?"pointer":"default",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",minHeight:40 }}>
          {p.title}
        </h3>

        {/* Price */}
        <div style={{ display:"flex",alignItems:"baseline",gap:6,flexWrap:"wrap" }}>
          <span style={{ fontSize:19,fontWeight:700,color:D.text,fontVariantNumeric:"tabular-nums" }}>₹{p.price.toLocaleString("en-IN")}</span>
          <span style={{ fontSize:12,color:D.sub,textDecoration:"line-through" }}>₹{p.mrp.toLocaleString("en-IN")}</span>
        </div>

        {/* Cashback pill */}
        <div style={{ background: dark ? "#14532d22" : "#f0fdf4", border:`1px solid ${dark?"#16653044":"#bbf7d0"}`, borderRadius:6, padding:"6px 10px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:12,color:"#16a34a",fontWeight:700 }}>💰 Earn ₹{cashbackAmt} cashback</span>
          <span style={{ fontSize:11,color:"#15803d",fontWeight:600,background:"#dcfce7",padding:"2px 7px",borderRadius:4 }}>{p.cashbackPct}%</span>
        </div>

        {/* Expiry timer */}
        <ExpiryTimer hoursFromNow={p.expiresHours} D={D} />

        {/* CTA */}
        <button onClick={() => p.inStock && onShop(p.slug, p.store, p)} disabled={!p.inStock} className="btn-animate"
          style={{ width:"100%",padding:"11px",borderRadius:8,border:"none",background:p.inStock?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#cbd5e1",color:"#fff",fontWeight:700,fontSize:13,cursor:p.inStock?"pointer":"not-allowed",fontFamily:"inherit",letterSpacing:.2,boxShadow:p.inStock?"0 4px 14px rgba(99,102,241,.35)":"none",marginTop:"auto" }}>
          {p.inStock ? "🛒 Shop & Earn Cashback" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}