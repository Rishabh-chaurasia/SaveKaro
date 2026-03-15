import { useState, useEffect, useRef, Component } from "react";
import { PRODUCTS, SITE } from "./data.js";

/* ═══════════════════════════════════════════════
   polish.jsx — Production Polish Features

   1.  PriceHistoryChart  — sparkline + history
   2.  SkeletonCard       — loading placeholder
   3.  SkeletonGrid       — full grid skeleton
   4.  ErrorBoundary      — catches crashes gracefully
   5.  NotFoundPage       — 404 page
   6.  CookieConsent      — GDPR / IT Act banner
   7.  DealSubmissionForm — community deal submissions
   8.  WhatsAppBroadcast  — auto-message composer
   9.  PageTransition     — smooth page changes
═══════════════════════════════════════════════ */

const fmt = n => "₹" + Number(n).toLocaleString("en-IN");

/* ══════════════════════════════════════════
   1. PRICE HISTORY CHART
   Shows 30-day price sparkline per product.
   In production: fetch from your price tracking API.
   Here we generate realistic mock history.
══════════════════════════════════════════ */
function generatePriceHistory(currentPrice, mrp, days = 30) {
  const history = [];
  let price = mrp;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    if (i === 3) price = currentPrice; // dropped 3 days ago
    else if (i > 20) price = mrp;
    else if (i > 10) price = Math.round(mrp * (0.85 + Math.random() * 0.1));
    else price = Math.round(currentPrice * (1 + Math.random() * 0.08));
    history.push({
      date: date.toLocaleDateString("en-IN", { day:"numeric", month:"short" }),
      price: Math.max(currentPrice, Math.min(mrp, price)),
    });
  }
  history[history.length - 1].price = currentPrice;
  return history;
}

export function PriceHistoryChart({ product, D, onClose }) {
  const history = generatePriceHistory(product.price, product.mrp);
  const prices = history.map(h => h.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;
  const W = 340, H = 100, pad = 10;

  const points = history.map((h, i) => {
    const x = pad + (i / (history.length - 1)) * (W - pad * 2);
    const y = pad + ((maxP - h.price) / range) * (H - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  const lowestIdx = prices.indexOf(minP);
  const lx = pad + (lowestIdx / (history.length - 1)) * (W - pad * 2);
  const ly = pad + ((maxP - minP) / range) * (H - pad * 2);

  const allTimeLow = minP === product.price;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:D.card,borderRadius:20,padding:"28px",maxWidth:420,width:"92%",color:D.text,animation:"popIn .3s ease",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:22,cursor:"pointer",color:D.sub }}>✕</button>
        <h2 style={{ fontWeight:900,fontSize:18,marginBottom:4 }}>📈 Price History</h2>
        <p style={{ color:D.sub,fontSize:12,marginBottom:16,lineHeight:1.5 }}>{product.title}</p>

        {allTimeLow && (
          <div style={{ background:"#F0FFF4",border:"1.5px solid #48BB78",borderRadius:10,padding:"8px 14px",marginBottom:14,fontSize:12,color:"#276749",fontWeight:700 }}>
            🎯 This is the ALL-TIME LOWEST price! Best time to buy.
          </div>
        )}

        {/* Sparkline */}
        <div style={{ background:D.bg,borderRadius:12,padding:"12px",marginBottom:16 }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
            <defs>
              <linearGradient id="ph-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5722" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#FF5722" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Area fill */}
            <polygon
              points={`${pad},${H} ${points} ${W-pad},${H}`}
              fill="url(#ph-grad)" />
            {/* Line */}
            <polyline points={points} fill="none" stroke="#FF5722" strokeWidth="2" strokeLinejoin="round" />
            {/* Current price dot */}
            <circle cx={W-pad} cy={pad + ((maxP - product.price)/range)*(H-pad*2)} r="4" fill="#FF5722" />
            {/* Lowest price marker */}
            {lowestIdx !== history.length-1 && (
              <>
                <circle cx={lx} cy={ly} r="4" fill="#48BB78" />
                <text x={lx} y={ly-8} textAnchor="middle" fontSize="9" fill="#276749" fontWeight="700">LOW</text>
              </>
            )}
          </svg>
        </div>

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16 }}>
          {[["Current",fmt(product.price),"#FF5722"],["30-day Low",fmt(minP),"#48BB78"],["30-day High",fmt(maxP),"#FC8181"]].map(([label,val,color])=>(
            <div key={label} style={{ background:D.bg,borderRadius:10,padding:"10px",textAlign:"center" }}>
              <div style={{ fontSize:11,color:D.sub,marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:14,fontWeight:900,color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Recent history */}
        <div style={{ display:"flex",flexDirection:"column",gap:4,maxHeight:120,overflowY:"auto" }}>
          {[...history].reverse().slice(0,7).map((h,i)=>(
            <div key={i} style={{ display:"flex",justifyContent:"space-between",fontSize:12,padding:"5px 8px",borderRadius:7,background:h.price===minP?"#F0FFF4":D.bg }}>
              <span style={{ color:D.sub }}>{h.date}</span>
              <span style={{ fontWeight:700,color:h.price===minP?"#276749":h.price===product.price?"#FF5722":D.text }}>{fmt(h.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   2. SKELETON LOADING CARDS
   Shows while products/data loads on slow 4G
══════════════════════════════════════════ */
function Shimmer({ w="100%", h=14, r=6, mb=8 }) {
  return (
    <div style={{ width:w,height:h,borderRadius:r,marginBottom:mb,
      background:"linear-gradient(90deg,var(--color-border-tertiary) 25%,var(--color-background-secondary) 50%,var(--color-border-tertiary) 75%)",
      backgroundSize:"200% 100%",animation:"shimmer 1.4s infinite" }} />
  );
}

export function SkeletonCard() {
  return (
    <div style={{ background:"var(--color-background-primary)",borderRadius:15,overflow:"hidden",
      border:"0.5px solid var(--color-border-tertiary)" }}>
      <Shimmer h={178} r={0} mb={0} />
      <div style={{ padding:"14px 16px" }}>
        <Shimmer w="60%" h={10} />
        <Shimmer h={14} />
        <Shimmer w="80%" h={14} />
        <Shimmer w="40%" h={20} r={8} />
        <Shimmer h={36} r={9} mb={0} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count=8 }) {
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:20 }}>
        {Array.from({length:count}).map((_,i) => <SkeletonCard key={i} />)}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   3. ERROR BOUNDARY
   Catches React crashes — shows friendly page
   instead of white screen
══════════════════════════════════════════ */
export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError:false, error:null }; }
  static getDerivedStateFromError(error) { return { hasError:true, error }; }
  componentDidCatch(error, info) { console.error("DealKaro Error:", error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ minHeight:"60vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px",textAlign:"center",fontFamily:"'Poppins',sans-serif" }}>
        <div style={{ fontSize:72,marginBottom:16 }}>😵</div>
        <h2 style={{ fontWeight:900,fontSize:22,marginBottom:8 }}>Something went wrong</h2>
        <p style={{ color:"#718096",fontSize:14,marginBottom:24,lineHeight:1.7,maxWidth:400 }}>
          We hit an unexpected error. Don't worry — your deals are safe!
        </p>
        <div style={{ display:"flex",gap:12 }}>
          <button onClick={() => window.location.reload()}
            style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",border:"none",borderRadius:12,padding:"12px 28px",fontWeight:800,cursor:"pointer",fontSize:14,fontFamily:"inherit" }}>
            🔄 Reload Page
          </button>
          <button onClick={() => this.setState({hasError:false,error:null})}
            style={{ background:"none",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 28px",fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"inherit",color:"#718096" }}>
            Try Again
          </button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details style={{ marginTop:20,fontSize:11,color:"#a0aec0",maxWidth:500,textAlign:"left" }}>
            <summary style={{ cursor:"pointer" }}>Error details (dev only)</summary>
            <pre style={{ marginTop:8,overflow:"auto" }}>{this.state.error?.toString()}</pre>
          </details>
        )}
      </div>
    );
  }
}

/* ══════════════════════════════════════════
   4. 404 NOT FOUND PAGE
══════════════════════════════════════════ */
export function NotFoundPage({ D, onNavigate }) {
  return (
    <div style={{ minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px",textAlign:"center" }}>
      <div style={{ fontSize:80,marginBottom:8 }}>🔍</div>
      <h1 style={{ fontWeight:900,fontSize:48,color:"#FF5722",marginBottom:8 }}>404</h1>
      <h2 style={{ fontWeight:800,fontSize:22,marginBottom:12 }}>Page not found</h2>
      <p style={{ color:D.sub,fontSize:15,marginBottom:32,lineHeight:1.7,maxWidth:420 }}>
        The page you're looking for doesn't exist. But don't worry — there are plenty of great deals waiting for you!
      </p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,maxWidth:520,width:"100%",marginBottom:32 }}>
        {[["🔥","Top Deals","deals"],["🎟️","Coupons","coupons"],["🏪","All Stores","stores"],["📰","Blog","blog"]].map(([icon,label,page])=>(
          <button key={page} onClick={()=>onNavigate(page)}
            style={{ background:D.card,border:`1px solid ${D.border}`,borderRadius:14,padding:"16px",cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:"inherit",color:D.text }}>
            <div style={{ fontSize:28,marginBottom:6 }}>{icon}</div>{label}
          </button>
        ))}
      </div>
      <button onClick={()=>onNavigate("home")}
        style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",border:"none",borderRadius:12,padding:"13px 32px",fontWeight:800,cursor:"pointer",fontSize:15,fontFamily:"inherit" }}>
        🏠 Back to Home
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   5. COOKIE CONSENT BANNER
   Required under India's IT Act (2000) + GDPR
   if any EU visitors. Appears on first visit.
══════════════════════════════════════════ */
export function CookieConsent({ D, onAccept, onDecline }) {
  return (
    <div style={{ position:"fixed",bottom:0,left:0,right:0,zIndex:8800,
      background:D.nav,borderTop:`1px solid ${D.border}`,
      padding:"16px 6%",display:"flex",alignItems:"center",
      justifyContent:"space-between",gap:16,flexWrap:"wrap",
      boxShadow:"0 -4px 24px rgba(0,0,0,.15)",animation:"slideDown .4s ease" }}>
      <div style={{ flex:1,minWidth:260 }}>
        <div style={{ fontWeight:700,fontSize:14,marginBottom:4 }}>🍪 We use cookies</div>
        <p style={{ fontSize:12,color:D.sub,lineHeight:1.6,margin:0 }}>
          We use cookies for analytics (Google Analytics), retargeting (Facebook Pixel), and affiliate tracking.
          By continuing, you agree to our{" "}
          <span style={{ color:"#FF5722",cursor:"pointer",textDecoration:"underline" }}>Privacy Policy</span>.
          Your data is never sold.
        </p>
      </div>
      <div style={{ display:"flex",gap:10,flexShrink:0 }}>
        <button onClick={onDecline}
          style={{ padding:"9px 18px",borderRadius:10,border:`1px solid ${D.border}`,background:"none",color:D.sub,fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>
          Essential only
        </button>
        <button onClick={onAccept}
          style={{ padding:"9px 18px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>
          Accept All ✓
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   6. DEAL SUBMISSION FORM
   Community members submit deals they found.
   You review and approve before publishing.
   Increases content without your effort.
══════════════════════════════════════════ */
export function DealSubmissionForm({ D, onClose, showToast }) {
  const [form, setForm] = useState({ title:"", store:"Amazon", link:"", mrp:"", price:"", category:"electronics", submitterName:"", submitterContact:"" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.link.trim() || !form.link.startsWith("http")) e.link = "Must be a valid URL";
    if (!form.mrp || isNaN(form.mrp)) e.mrp = "Required";
    if (!form.price || isNaN(form.price)) e.price = "Required";
    if (Number(form.price) >= Number(form.mrp)) e.price = "Sale price must be less than MRP";
    if (!form.submitterName.trim()) e.submitterName = "Required";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    // POST /api/deal-submissions  body: form
    // Admin reviews at /admin → approves → adds to PRODUCTS array
    setSubmitted(true);
    showToast && showToast("Deal submitted! We'll review it within 24hrs. +50 pts 🎉");
  };

  const field = (label, key, type="text", placeholder="") => (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:5 }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => { setForm(f=>({...f,[key]:e.target.value})); setErrors(er=>({...er,[key]:undefined})); }}
        placeholder={placeholder}
        style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${errors[key]?"#FC8181":D.inputBorder}`,fontSize:13,outline:"none",fontFamily:"inherit",background:D.input,color:D.text }} />
      {errors[key] && <div style={{ fontSize:11,color:"#FC8181",marginTop:3 }}>{errors[key]}</div>}
    </div>
  );

  const discount = form.mrp && form.price ? Math.round(((form.mrp-form.price)/form.mrp)*100) : 0;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:D.card,borderRadius:20,padding:"28px",maxWidth:480,width:"92%",color:D.text,animation:"popIn .3s ease",position:"relative",maxHeight:"92vh",overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:22,cursor:"pointer",color:D.sub }}>✕</button>

        {submitted ? (
          <div style={{ textAlign:"center",padding:"20px 0" }}>
            <div style={{ fontSize:56,marginBottom:12 }}>🎉</div>
            <h2 style={{ fontWeight:900,fontSize:20,marginBottom:8 }}>Deal Submitted!</h2>
            <p style={{ color:D.sub,fontSize:14,lineHeight:1.7,marginBottom:20 }}>
              Our team will review your deal within 24 hours. If approved, it'll be live on DealKaro and you'll get credited +50 loyalty points!
            </p>
            <button onClick={onClose} style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",border:"none",borderRadius:12,padding:"12px 28px",fontWeight:800,cursor:"pointer",fontSize:14,fontFamily:"inherit" }}>Done ✓</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize:36,textAlign:"center",marginBottom:8 }}>💡</div>
            <h2 style={{ fontWeight:900,fontSize:18,textAlign:"center",marginBottom:4 }}>Submit a Deal</h2>
            <p style={{ color:D.sub,fontSize:13,textAlign:"center",marginBottom:20,lineHeight:1.5 }}>Found a great deal? Share it and earn +50 loyalty points when approved!</p>

            {field("Product Title *","title","text","e.g. boAt Airdopes 141 TWS Earbuds")}

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:5 }}>Store *</label>
              <select value={form.store} onChange={e=>setForm(f=>({...f,store:e.target.value}))}
                style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:13,background:D.input,color:D.text,outline:"none",fontFamily:"inherit" }}>
                {["Amazon","Flipkart","Myntra","Nykaa","Ajio","Swiggy","MakeMyTrip","Meesho","Other"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>

            {field("Deal Link (URL) *","link","url","https://www.amazon.in/dp/...")}

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:5 }}>MRP (₹) *</label>
                <input type="number" value={form.mrp} onChange={e=>{setForm(f=>({...f,mrp:e.target.value}));setErrors(er=>({...er,mrp:undefined}));}}
                  placeholder="4990" style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${errors.mrp?"#FC8181":D.inputBorder}`,fontSize:13,outline:"none",fontFamily:"inherit",background:D.input,color:D.text }} />
                {errors.mrp && <div style={{ fontSize:11,color:"#FC8181",marginTop:3 }}>{errors.mrp}</div>}
              </div>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:5 }}>Sale Price (₹) *</label>
                <input type="number" value={form.price} onChange={e=>{setForm(f=>({...f,price:e.target.value}));setErrors(er=>({...er,price:undefined}));}}
                  placeholder="1199" style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${errors.price?"#FC8181":D.inputBorder}`,fontSize:13,outline:"none",fontFamily:"inherit",background:D.input,color:D.text }} />
                {errors.price && <div style={{ fontSize:11,color:"#FC8181",marginTop:3 }}>{errors.price}</div>}
              </div>
            </div>

            {discount > 0 && (
              <div style={{ background:"#FFF8F6",border:"1px solid #FF572233",borderRadius:8,padding:"8px 12px",margin:"8px 0 14px",fontSize:12,color:"#FF5722",fontWeight:700 }}>
                🔥 That's {discount}% OFF — looks like a great deal!
              </div>
            )}

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:5 }}>Category</label>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:13,background:D.input,color:D.text,outline:"none",fontFamily:"inherit" }}>
                {["electronics","fashion","home","beauty","food","travel","sports"].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>

            {field("Your Name *","submitterName","text","Rahul Sharma")}
            {field("WhatsApp / Email (for credit notification)","submitterContact","text","9876543210 or email@example.com")}

            <button onClick={submit}
              style={{ width:"100%",padding:"13px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit" }}>
              Submit Deal (+50 pts) 🚀
            </button>
            <p style={{ fontSize:11,color:D.sub,textAlign:"center",marginTop:10,lineHeight:1.6 }}>All submissions are reviewed. Spam or fake deals will be rejected.</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   7. WHATSAPP BROADCAST COMPOSER
   Generates ready-to-send WhatsApp messages
   for your broadcast list / groups.
   In production: integrate with WhatsApp
   Business API for auto-sending.
══════════════════════════════════════════ */
export function WhatsAppBroadcast({ D, onClose }) {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [copied, setCopied] = useState(false);

  const message = `🔥 *HOT DEAL ALERT!*

📦 *${selectedProduct.title}*

💰 Price: *₹${selectedProduct.price.toLocaleString("en-IN")}* ~~₹${selectedProduct.mrp.toLocaleString("en-IN")}~~
🏷️ ${Math.round(((selectedProduct.mrp-selectedProduct.price)/selectedProduct.mrp)*100)}% OFF + *${selectedProduct.cashbackPct}% extra cashback*

🛒 Shop via DealKaro (cashback tracked automatically):
👉 ${SITE.url}/?deal=${selectedProduct.slug}

⏰ Limited time offer!
📲 Join our deals group: ${SITE.whatsappGroup || "https://chat.whatsapp.com/YOUR_GROUP"}

_DealKaro — Shop Smart, Earn Cashback_ 💸`;

  const copy = () => {
    navigator.clipboard.writeText(message).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 2500);
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:D.card,borderRadius:20,padding:"28px",maxWidth:480,width:"92%",color:D.text,animation:"popIn .3s ease",position:"relative",maxHeight:"92vh",overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:22,cursor:"pointer",color:D.sub }}>✕</button>
        <div style={{ fontSize:36,textAlign:"center",marginBottom:8 }}>📢</div>
        <h2 style={{ fontWeight:900,fontSize:18,textAlign:"center",marginBottom:4 }}>WhatsApp Broadcast</h2>
        <p style={{ color:D.sub,fontSize:12,textAlign:"center",marginBottom:20 }}>Generate a ready-to-send deal alert for your WhatsApp groups</p>

        <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:6 }}>Select Product</label>
        <select value={selectedProduct.id} onChange={e=>setSelectedProduct(PRODUCTS.find(p=>p.id===Number(e.target.value)))}
          style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:13,background:D.input,color:D.text,outline:"none",fontFamily:"inherit",marginBottom:16 }}>
          {PRODUCTS.filter(p=>p.inStock).map(p=><option key={p.id} value={p.id}>{p.title} — ₹{p.price.toLocaleString("en-IN")}</option>)}
        </select>

        <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:6 }}>Message Preview</label>
        <textarea value={message} readOnly rows={12}
          style={{ width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:12,background:D.bg,color:D.text,fontFamily:"monospace",resize:"none",lineHeight:1.6,marginBottom:16 }} />

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
          <button onClick={copy}
            style={{ padding:"12px",borderRadius:10,border:`1px solid ${D.border}`,background:copied?"#48BB78":D.input,color:copied?"#fff":D.sub,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13,transition:"all .2s" }}>
            {copied ? "✅ Copied!" : "📋 Copy Message"}
          </button>
          <button onClick={openWhatsApp}
            style={{ padding:"12px",borderRadius:10,border:"none",background:"#25D366",color:"#fff",fontWeight:800,cursor:"pointer",fontFamily:"inherit",fontSize:13 }}>
            💬 Open WhatsApp
          </button>
        </div>

        <div style={{ marginTop:14,padding:"12px",background:D.bg,borderRadius:10,fontSize:12,color:D.sub,lineHeight:1.7 }}>
          <strong style={{ color:D.text }}>Pro tip:</strong> To auto-send to multiple groups at once, use{" "}
          <span style={{ color:"#FF5722" }}>WhatsApp Business API</span> with a tool like Wati.io or Interakt.co.
          This lets you broadcast to 1000s of contacts with one click. Costs ~₹2,000/month but can multiply your clicks 10x.
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   8. PAGE TRANSITION WRAPPER
   Smooth fade+slide between pages
══════════════════════════════════════════ */
export function PageTransition({ children, pageKey }) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState(children);
  const [prevKey, setPrevKey] = useState(pageKey);

  useEffect(() => {
    if (pageKey !== prevKey) {
      setVisible(false);
      const t = setTimeout(() => {
        setContent(children);
        setPrevKey(pageKey);
        setVisible(true);
        window.scrollTo({ top:0, behavior:"smooth" });
      }, 150);
      return () => clearTimeout(t);
    } else {
      setVisible(true);
    }
  }, [pageKey, children]);

  return (
    <div style={{ opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(10px)", transition:"opacity .2s ease, transform .2s ease" }}>
      {content}
    </div>
  );
}