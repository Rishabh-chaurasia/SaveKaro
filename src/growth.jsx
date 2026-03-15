import { useState, useEffect, useRef } from "react";
import { PRODUCTS, SITE } from "./data.js";
import { BLOG_POSTS, BLOG_CATEGORIES } from "./blog.js";

/* ═══════════════════════════════════════════════
   growth.jsx — All Growth & Monetization Features

   1. ExitIntentPopup
   2. PWAInstallBanner
   3. PushNotificationBanner
   4. AntiAdblockBanner
   5. FeaturedDealOfDay
   6. LiveChatButton
   7. BlogPage + BlogPostPage
═══════════════════════════════════════════════ */

const fmt = n => "₹" + Number(n).toLocaleString("en-IN");
const disc = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);

/* ══════════════════════════════════
   1. EXIT-INTENT POPUP
   Triggers when mouse moves toward top of browser
══════════════════════════════════ */
export function ExitIntentPopup({ D, onShop, onClose }) {
  // Pick a random high-value deal
  const deal = PRODUCTS.filter(p => p.inStock && disc(p.mrp, p.price) >= 40)[
    Math.floor(Math.random() * 3)
  ] || PRODUCTS[0];

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:9200,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:D.card,borderRadius:22,maxWidth:480,width:"92%",overflow:"hidden",animation:"popIn .35s ease",color:D.text }}>
        {/* Top urgency bar */}
        <div style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ color:"#fff",fontWeight:900,fontSize:14 }}>⚡ Wait! Don't leave yet…</span>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:"24px" }}>
          <p style={{ color:D.sub,fontSize:14,marginBottom:20,textAlign:"center",lineHeight:1.7 }}>
            You're missing out on today's best deal! This price won't last long 👇
          </p>
          {/* Deal card */}
          <div style={{ display:"flex",gap:16,alignItems:"center",background:D.bg,borderRadius:14,padding:"16px",marginBottom:20,border:`2px solid #FF572233` }}>
            <img src={deal.image} alt={deal.title} style={{ width:80,height:80,borderRadius:12,objectFit:"cover",flexShrink:0 }} />
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontWeight:800,fontSize:14,lineHeight:1.4,marginBottom:6 }}>{deal.title}</div>
              <div style={{ display:"flex",alignItems:"baseline",gap:8,marginBottom:6 }}>
                <span style={{ fontSize:18,fontWeight:900,color:"#FF5722" }}>{fmt(deal.price)}</span>
                <span style={{ fontSize:12,color:D.sub,textDecoration:"line-through" }}>{fmt(deal.mrp)}</span>
                <span style={{ fontSize:11,background:"#E53E3E22",color:"#E53E3E",padding:"2px 7px",borderRadius:8,fontWeight:800 }}>{disc(deal.mrp,deal.price)}% OFF</span>
              </div>
              <div style={{ fontSize:12,color:"#FF5722",fontWeight:700 }}>💰 +{deal.cashbackPct}% cashback = {fmt(Math.round(deal.price * deal.cashbackPct / 100))} back</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={onClose} style={{ flex:1,padding:"11px",borderRadius:11,border:`1px solid ${D.border}`,background:"none",color:D.sub,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13 }}>No thanks</button>
            <button onClick={() => { onShop(deal.slug, deal.store, deal); onClose(); }}
              style={{ flex:2,padding:"11px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",fontWeight:800,cursor:"pointer",fontFamily:"inherit",fontSize:14 }}>
              Grab This Deal! 🔥
            </button>
          </div>
          <p style={{ fontSize:11,color:D.sub,textAlign:"center",marginTop:10 }}>Only available for a limited time. No obligation.</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   2. PWA INSTALL BANNER
   Smart banner for mobile users
══════════════════════════════════ */
export function PWAInstallBanner({ D, onDismiss }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferredPrompt(null);
    }
    onDismiss();
  };

  if (installed) return null;

  return (
    <div style={{ position:"fixed",bottom:0,left:0,right:0,zIndex:7500,background:"linear-gradient(135deg,#1a202c,#2d3748)",padding:"14px 4%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",boxShadow:"0 -4px 24px rgba(0,0,0,.3)" }}>
      <div style={{ display:"flex",alignItems:"center",gap:12 }}>
        <div style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",borderRadius:12,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>💸</div>
        <div>
          <div style={{ color:"#fff",fontWeight:800,fontSize:14 }}>Install DealKaro App</div>
          <div style={{ color:"#a0aec0",fontSize:12 }}>Get instant deal alerts • Works offline • No Play Store needed</div>
        </div>
      </div>
      <div style={{ display:"flex",gap:10,flexShrink:0 }}>
        <button onClick={onDismiss} style={{ background:"rgba(255,255,255,.1)",border:"none",borderRadius:9,padding:"8px 14px",color:"#a0aec0",cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit" }}>Later</button>
        <button onClick={handleInstall} style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",border:"none",borderRadius:9,padding:"8px 18px",color:"#fff",cursor:"pointer",fontWeight:800,fontSize:13,fontFamily:"inherit",boxShadow:"0 4px 14px rgba(255,87,34,.4)" }}>
          📱 Install Free
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   3. PUSH NOTIFICATION PERMISSION BANNER
══════════════════════════════════ */
export function PushNotificationBanner({ D, onDismiss }) {
  const [status, setStatus] = useState("idle"); // idle | requesting | granted | denied

  const requestPermission = async () => {
    setStatus("requesting");
    try {
      const result = await Notification.requestPermission();
      setStatus(result);
      if (result === "granted") {
        // Register push subscription here with your backend
        // const reg = await navigator.serviceWorker.ready;
        // const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: YOUR_VAPID_KEY });
        // await fetch('/api/push/subscribe', { method:'POST', body: JSON.stringify(sub) });
        setTimeout(onDismiss, 2000);
      }
    } catch { setStatus("denied"); }
  };

  if (!("Notification" in window) || Notification.permission === "granted") return null;

  return (
    <div style={{ position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",zIndex:7500,background:D.card,borderRadius:16,padding:"16px 20px",boxShadow:"0 12px 40px rgba(0,0,0,.2)",border:`1px solid ${D.border}`,maxWidth:400,width:"92%",display:"flex",alignItems:"center",gap:14 }}>
      <div style={{ fontSize:32,flexShrink:0 }}>🔔</div>
      <div style={{ flex:1 }}>
        {status === "granted" ? (
          <div style={{ fontWeight:700,fontSize:14,color:"#48BB78" }}>✅ Notifications enabled! You'll get deal alerts.</div>
        ) : status === "denied" ? (
          <div style={{ fontWeight:700,fontSize:13,color:"#FC8181" }}>Notifications blocked. Enable in browser settings.</div>
        ) : (
          <>
            <div style={{ fontWeight:800,fontSize:13,marginBottom:3 }}>Get notified about flash deals! 🔥</div>
            <div style={{ fontSize:11,color:D.sub,marginBottom:10 }}>We'll alert you when prices drop or new deals go live.</div>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={onDismiss} style={{ background:"none",border:`1px solid ${D.border}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:700,color:D.sub,fontFamily:"inherit" }}>Not now</button>
              <button onClick={requestPermission} disabled={status==="requesting"}
                style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:11,fontWeight:800,color:"#fff",fontFamily:"inherit" }}>
                {status==="requesting" ? "Enabling…" : "Enable Alerts"}
              </button>
            </div>
          </>
        )}
      </div>
      {status === "idle" && <button onClick={onDismiss} style={{ background:"none",border:"none",cursor:"pointer",color:D.sub,fontSize:18,flexShrink:0 }}>✕</button>}
    </div>
  );
}

/* ══════════════════════════════════
   4. ANTI-ADBLOCK BANNER
   Polite message — doesn't force anything
══════════════════════════════════ */
export function AntiAdblockBanner({ D, onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9100,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:D.card,borderRadius:20,padding:"36px 32px",maxWidth:420,width:"92%",textAlign:"center",color:D.text,animation:"popIn .3s ease" }}>
        <div style={{ fontSize:56,marginBottom:14 }}>🙏</div>
        <h2 style={{ fontWeight:900,fontSize:20,marginBottom:8 }}>Please support DealKaro</h2>
        <p style={{ color:D.sub,fontSize:14,lineHeight:1.7,marginBottom:20 }}>
          We noticed you're using an ad blocker. DealKaro is completely free — we earn a small commission when you shop through our links (no extra cost to you). No annoying ads, just great deals!
        </p>
        <div style={{ background:D.bg,borderRadius:12,padding:"14px",marginBottom:24 }}>
          <div style={{ fontSize:13,fontWeight:700,marginBottom:4 }}>How we make money 💡</div>
          <div style={{ fontSize:12,color:D.sub,lineHeight:1.7 }}>Amazon/Flipkart pays us a tiny commission when you click our link. The price you pay is <strong>exactly the same</strong> — or less with our cashback! No ads involved.</div>
        </div>
        <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
          <button onClick={onClose} style={{ flex:1,padding:"12px",borderRadius:11,border:`1px solid ${D.border}`,background:"none",color:D.sub,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13 }}>Continue anyway</button>
          <button onClick={onClose} style={{ flex:1.5,padding:"12px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",fontWeight:800,cursor:"pointer",fontFamily:"inherit",fontSize:13 }}>
            ✅ Got it, I'll whitelist!
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   5. FEATURED DEAL OF THE DAY
   Hero spotlight on homepage
══════════════════════════════════ */
export function FeaturedDealOfDay({ D, dark, onShop }) {
  // Rotate daily based on date
  const dayIndex = new Date().getDate() % PRODUCTS.filter(p => p.inStock).length;
  const deal = PRODUCTS.filter(p => p.inStock)[dayIndex];
  const cashbackAmt = Math.round(deal.price * deal.cashbackPct / 100);

  // Countdown to midnight
  const [timeLeft, setTimeLeft] = useState({ h:"--", m:"--", s:"--" });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      setTimeLeft({
        h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ margin:"0 6% 32px",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(255,87,34,.2)",border:"2px solid #FF572233" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:22 }}>🌟</span>
          <div>
            <div style={{ color:"#fff",fontWeight:900,fontSize:16 }}>Deal of the Day</div>
            <div style={{ color:"rgba(255,255,255,.8)",fontSize:11 }}>Changes at midnight • Don't miss it!</div>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ color:"rgba(255,255,255,.8)",fontSize:12 }}>Ends in:</span>
          {[timeLeft.h, timeLeft.m, timeLeft.s].map((v, i) => (
            <span key={i} style={{ display:"inline-flex",alignItems:"center",gap:3 }}>
              <span style={{ background:"rgba(0,0,0,.25)",color:"#fff",fontWeight:900,fontSize:15,padding:"4px 10px",borderRadius:8,minWidth:36,textAlign:"center" }}>{v}</span>
              {i < 2 && <span style={{ color:"rgba(255,255,255,.7)",fontWeight:900 }}>:</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Deal body */}
      <div style={{ background:D.card,padding:"20px 24px",display:"flex",gap:20,alignItems:"center",flexWrap:"wrap" }}>
        <img src={deal.image} alt={deal.title} style={{ width:120,height:120,borderRadius:14,objectFit:"cover",flexShrink:0,boxShadow:"0 4px 20px rgba(0,0,0,.12)" }} />
        <div style={{ flex:1,minWidth:200 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
            <span style={{ fontSize:11,color:deal.storeColor,fontWeight:700,background:`${deal.storeColor}22`,padding:"2px 8px",borderRadius:8 }}>{deal.store}</span>
            <span style={{ fontSize:11,background:"#E53E3E22",color:"#E53E3E",padding:"2px 8px",borderRadius:8,fontWeight:800 }}>{disc(deal.mrp, deal.price)}% OFF</span>
            {deal.flashSale && <span style={{ fontSize:11,background:"#FF572222",color:"#FF5722",padding:"2px 8px",borderRadius:8,fontWeight:800 }}>⚡ Flash Sale</span>}
          </div>
          <h3 style={{ fontWeight:900,fontSize:18,marginBottom:8,lineHeight:1.3 }}>{deal.title}</h3>
          <div style={{ display:"flex",alignItems:"baseline",gap:10,marginBottom:10 }}>
            <span style={{ fontSize:28,fontWeight:900,color:"#FF5722" }}>{fmt(deal.price)}</span>
            <span style={{ fontSize:15,color:D.sub,textDecoration:"line-through" }}>{fmt(deal.mrp)}</span>
            <span style={{ fontSize:14,color:"#FF5722",fontWeight:800 }}>Save {fmt(deal.mrp - deal.price)}</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
            <div style={{ background:"#FFF8F6",border:"1px dashed #FF5722",borderRadius:8,padding:"7px 14px",display:"inline-flex",gap:6,alignItems:"center" }}>
              <span style={{ fontSize:13,color:"#FF5722",fontWeight:800 }}>💰 Extra {deal.cashbackPct}% Cashback</span>
              <span style={{ fontSize:13,color:"#FF5722",fontWeight:900 }}>= +{fmt(cashbackAmt)}</span>
            </div>
          </div>
          <button onClick={() => onShop(deal.slug, deal.store, deal)}
            style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",border:"none",borderRadius:12,padding:"13px 32px",fontWeight:800,cursor:"pointer",fontSize:15,fontFamily:"inherit",boxShadow:"0 6px 20px rgba(255,87,34,.35)" }}>
            🔥 Grab Today's Deal →
          </button>
        </div>
        {/* Rating */}
        <div style={{ textAlign:"center",padding:"16px 20px",background:D.bg,borderRadius:14,flexShrink:0 }}>
          <div style={{ fontSize:36,fontWeight:900,color:"#F6AD55" }}>{deal.rating}</div>
          <div style={{ display:"flex",justifyContent:"center",gap:2,marginBottom:4 }}>
            {[1,2,3,4,5].map(s => <span key={s} style={{ color:s<=Math.round(deal.rating)?"#F6AD55":"#CBD5E0",fontSize:16 }}>★</span>)}
          </div>
          <div style={{ fontSize:11,color:D.sub }}>{deal.reviews.toLocaleString()} reviews</div>
          <div style={{ fontSize:11,color:"#2874F0",fontWeight:700,marginTop:4 }}>{(deal.clicks/1000).toFixed(1)}K views today</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   6. LIVE CHAT BUTTON
   Tawk.to / Crisp integration
══════════════════════════════════ */
export function LiveChatButton() {
  const loaded = useRef(false);

  const openChat = () => {
    if (!loaded.current) {
      // Tawk.to integration
      // Replace YOUR_TAWK_PROPERTY_ID and YOUR_TAWK_WIDGET_ID
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://embed.tawk.to/YOUR_TAWK_PROPERTY_ID/YOUR_TAWK_WIDGET_ID";
      s.charset = "UTF-8";
      s.setAttribute("crossorigin", "*");
      document.head.appendChild(s);
      loaded.current = true;

      // Alternative: Crisp
      // window.$crisp = [];
      // window.CRISP_WEBSITE_ID = "YOUR_CRISP_WEBSITE_ID";
      // const d = document.createElement("script");
      // d.src = "https://client.crisp.chat/l.js";
      // d.async = 1;
      // document.head.appendChild(d);

      setTimeout(() => {
        if (window.Tawk_API) window.Tawk_API.toggle();
      }, 2000);
    } else {
      if (window.Tawk_API) window.Tawk_API.toggle();
    }
  };

  return (
    <button onClick={openChat}
      className="fab"
      title="Live Chat Support"
      style={{ position:"fixed",bottom:36,left:22,zIndex:7000,background:"linear-gradient(135deg,#00A8E1,#0077B6)",borderRadius:"50%",width:52,height:52,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 6px 20px rgba(0,168,225,.45)" }}>
      💬
    </button>
  );
}

/* ══════════════════════════════════
   7. BLOG PAGE
══════════════════════════════════ */
export function BlogPage({ D, dark, onNavigate }) {
  const [activePost, setActivePost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  if (activePost) return <BlogPostPage D={D} dark={dark} post={activePost} onBack={() => setActivePost(null)} />;

  const filtered = activeCategory === "All" ? BLOG_POSTS : BLOG_POSTS.filter(p => p.category === activeCategory);

  return (
    <div style={{ padding:"32px 6%" }}>
      {/* SEO */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26,fontWeight:900,marginBottom:6 }}>📰 DealKaro Blog</h1>
        <p style={{ color:D.sub,fontSize:14 }}>Expert buying guides, price comparisons & money-saving tips for Indian shoppers</p>
      </div>

      {/* Category filter */}
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:28 }}>
        {BLOG_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{ padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit",background:activeCategory===cat?"linear-gradient(135deg,#FF5722,#FF9800)":D.card,color:activeCategory===cat?"#fff":D.sub,boxShadow:activeCategory===cat?"0 4px 14px rgba(255,87,34,.3)":`0 2px 8px rgba(0,0,0,${dark?.12:.07})` }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured post */}
      {filtered.filter(p => p.featured).slice(0,1).map(post => (
        <div key={post.id} className="ch" onClick={() => setActivePost(post)}
          style={{ borderRadius:18,overflow:"hidden",marginBottom:28,cursor:"pointer",border:`1px solid ${D.border}`,boxShadow:`0 4px 20px rgba(0,0,0,${dark?.15:.08})` }}>
          <div style={{ position:"relative" }}>
            <img src={post.image} alt={post.title} style={{ width:"100%",height:260,objectFit:"cover",display:"block" }} />
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.75),transparent)" }} />
            <div style={{ position:"absolute",bottom:20,left:24,right:24 }}>
              <div style={{ display:"flex",gap:8,marginBottom:8 }}>
                <span style={{ background:"#FF5722",color:"#fff",fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:20 }}>⭐ FEATURED</span>
                <span style={{ background:"rgba(255,255,255,.2)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20 }}>{post.category}</span>
              </div>
              <h2 style={{ color:"#fff",fontWeight:900,fontSize:22,lineHeight:1.3,marginBottom:6 }}>{post.title}</h2>
              <div style={{ display:"flex",gap:12,fontSize:12,color:"rgba(255,255,255,.7)" }}>
                <span>📅 {post.date}</span>
                <span>⏱ {post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Post grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20 }}>
        {filtered.filter(p => !p.featured || filtered.length > 1).map(post => (
          <div key={post.id} className="ch" onClick={() => setActivePost(post)}
            style={{ background:D.card,borderRadius:16,overflow:"hidden",cursor:"pointer",border:`1px solid ${D.border}`,boxShadow:`0 3px 14px rgba(0,0,0,${dark?.12:.07})` }}>
            <img src={post.image} alt={post.title} style={{ width:"100%",height:160,objectFit:"cover",display:"block" }} />
            <div style={{ padding:"16px" }}>
              <div style={{ display:"flex",gap:6,marginBottom:8 }}>
                <span style={{ background:`${dark?"#2d3148":"#F7F8FC"}`,color:D.sub,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8 }}>{post.category}</span>
                <span style={{ color:D.sub,fontSize:10 }}>{post.readTime}</span>
              </div>
              <h3 style={{ fontWeight:800,fontSize:15,lineHeight:1.4,marginBottom:8 }}>{post.title}</h3>
              <p style={{ color:D.sub,fontSize:12,lineHeight:1.6,marginBottom:12,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{post.intro}</p>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <span style={{ fontSize:11,color:D.sub }}>{post.date}</span>
                <span style={{ fontSize:12,color:"#FF5722",fontWeight:700 }}>Read More →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",borderRadius:16,padding:"24px",textAlign:"center",marginTop:32 }}>
        <h3 style={{ color:"#fff",fontWeight:900,fontSize:18,marginBottom:8 }}>📧 Never Miss a Deal Guide</h3>
        <p style={{ color:"rgba(255,255,255,.85)",fontSize:13,marginBottom:16 }}>Get our weekly deal roundup delivered to your WhatsApp</p>
        <button onClick={() => window.open(SITE.whatsappGroup,"_blank")} style={{ background:"#25D366",color:"#fff",border:"none",borderRadius:10,padding:"11px 24px",fontWeight:800,cursor:"pointer",fontSize:14,fontFamily:"inherit" }}>💬 Join WhatsApp Group</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   BLOG POST PAGE
══════════════════════════════════ */
function BlogPostPage({ D, dark, post, onBack }) {
  return (
    <div style={{ padding:"28px 6% 48px",maxWidth:820,margin:"0 auto" }}>
      {/* Back */}
      <button onClick={onBack} style={{ background:"none",border:"none",cursor:"pointer",color:"#FF5722",fontWeight:700,fontSize:13,fontFamily:"inherit",marginBottom:20,display:"flex",alignItems:"center",gap:6 }}>
        ← Back to Blog
      </button>

      {/* Hero image */}
      <img src={post.image} alt={post.title} style={{ width:"100%",height:300,objectFit:"cover",borderRadius:18,marginBottom:24,display:"block" }} />

      {/* Meta */}
      <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginBottom:12 }}>
        <span style={{ background:"#FF572222",color:"#FF5722",fontSize:11,fontWeight:800,padding:"4px 12px",borderRadius:20 }}>{post.category}</span>
        <span style={{ color:D.sub,fontSize:12 }}>📅 {post.date}</span>
        <span style={{ color:D.sub,fontSize:12 }}>⏱ {post.readTime}</span>
      </div>

      <h1 style={{ fontSize:"clamp(22px,3vw,32px)",fontWeight:900,lineHeight:1.25,marginBottom:16 }}>{post.title}</h1>
      <p style={{ fontSize:16,color:D.sub,lineHeight:1.8,marginBottom:28,borderLeft:"3px solid #FF5722",paddingLeft:16 }}>{post.intro}</p>

      {/* Tags */}
      <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:32 }}>
        {post.tags.map(t => <span key={t} style={{ background:D.bg,color:D.sub,fontSize:11,padding:"4px 10px",borderRadius:20,border:`1px solid ${D.border}` }}>#{t}</span>)}
      </div>

      {/* Sections */}
      {post.sections.map((s, i) => (
        <div key={i} style={{ marginBottom:36 }}>
          <h2 style={{ fontSize:20,fontWeight:900,marginBottom:12 }}>{s.heading}</h2>
          <p style={{ fontSize:15,lineHeight:1.8,color:D.sub,marginBottom:16 }}>{s.content}</p>

          {/* Highlight box */}
          <div style={{ background:"linear-gradient(135deg,#FFF8F6,#FFF0EB)",border:"2px solid #FF572233",borderRadius:12,padding:"14px 18px",marginBottom:16,fontSize:13,color:"#FF5722",fontWeight:700,lineHeight:1.6 }}>
            💡 {s.highlight}
          </div>

          {/* Pros/Cons */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16 }}>
            <div style={{ background:"#F0FFF4",borderRadius:12,padding:"14px" }}>
              <div style={{ fontWeight:800,color:"#276749",fontSize:13,marginBottom:8 }}>✅ Pros</div>
              {s.pros.map((p,j) => <div key={j} style={{ fontSize:12,color:"#276749",marginBottom:5,display:"flex",gap:6 }}><span>•</span>{p}</div>)}
            </div>
            <div style={{ background:"#FFF5F5",borderRadius:12,padding:"14px" }}>
              <div style={{ fontWeight:800,color:"#E53E3E",fontSize:13,marginBottom:8 }}>❌ Cons</div>
              {s.cons.map((c,j) => <div key={j} style={{ fontSize:12,color:"#E53E3E",marginBottom:5,display:"flex",gap:6 }}><span>•</span>{c}</div>)}
            </div>
          </div>
        </div>
      ))}

      {/* Buying Guide */}
      <div style={{ background:D.card,borderRadius:16,padding:"24px",border:`2px solid #FF572233`,marginBottom:32 }}>
        <h3 style={{ fontWeight:900,fontSize:17,color:"#FF5722",marginBottom:16 }}>🛒 {post.buyingGuide.title}</h3>
        {post.buyingGuide.points.map((p, i) => (
          <div key={i} style={{ display:"flex",gap:12,marginBottom:10,alignItems:"flex-start" }}>
            <span style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,flexShrink:0,marginTop:1 }}>{i+1}</span>
            <span style={{ fontSize:14,color:D.sub,lineHeight:1.6 }}>{p}</span>
          </div>
        ))}
      </div>

      {/* Conclusion */}
      <div style={{ background:dark?"#1e2130":"#F7F8FC",borderRadius:14,padding:"20px",border:`1px solid ${D.border}`,marginBottom:32 }}>
        <h3 style={{ fontWeight:800,fontSize:15,marginBottom:8 }}>💬 Conclusion</h3>
        <p style={{ fontSize:14,color:D.sub,lineHeight:1.8 }}>{post.conclusion}</p>
      </div>

      {/* Share */}
      <div style={{ background:"linear-gradient(135deg,#25D366,#128C7E)",borderRadius:14,padding:"20px",textAlign:"center" }}>
        <h3 style={{ color:"#fff",fontWeight:900,fontSize:16,marginBottom:6 }}>📣 Found this helpful?</h3>
        <p style={{ color:"rgba(255,255,255,.85)",fontSize:13,marginBottom:14 }}>Share with friends and family on WhatsApp — help them save money too!</p>
        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`📖 ${post.title}\n\nRead this guide on DealKaro to save money:\nhttps://dealkaro.in/blog/${post.slug}`)}`, "_blank")}
          style={{ background:"#fff",color:"#128C7E",border:"none",borderRadius:10,padding:"11px 24px",fontWeight:800,cursor:"pointer",fontSize:14,fontFamily:"inherit" }}>
          💬 Share on WhatsApp
        </button>
      </div>
    </div>
  );
}