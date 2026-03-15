import { useState, useEffect, useRef } from "react";
import { PRODUCTS, SITE } from "./data.js";

/* ═══════════════════════════════════════════════════
   revenue.jsx — Direct Revenue-Boosting Features

   1.  PriceDropAlert     — user sets target price
   2.  EMICalculator      — monthly cost across banks
   3.  GiftingAssistant   — AI gift recommender
   4.  DealShareCard      — social-ready OG card generator
   5.  CityDealsPanel     — Swiggy/Zomato city deals
   6.  RetargetingBanner  — show last viewed to returning users
═══════════════════════════════════════════════════ */

const fmt  = n => "₹" + Number(n).toLocaleString("en-IN");
const disc = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);

/* ══════════════════════════════════════════
   1. PRICE DROP ALERT
   User sets a target price. We store it and
   "notify" them next visit if current price ≤ target.
   In production: compare daily via cron + push/email.
══════════════════════════════════════════ */
export function PriceDropAlert({ product, D, onClose }) {
  const storageKey = `dk_alert_${product.id}`;
  const existing   = (() => { try { return JSON.parse(localStorage.getItem(storageKey)); } catch { return null; } })();
  const [target, setTarget]   = useState(existing?.target || "");
  const [contact, setContact] = useState(existing?.contact || "");
  const [saved, setSaved]     = useState(!!existing);

  const save = () => {
    if (!target || Number(target) <= 0) return;
    const alert = { target: Number(target), contact, productId: product.id, title: product.title, setAt: Date.now() };
    localStorage.setItem(storageKey, JSON.stringify(alert));
    setSaved(true);
    // Production: POST /api/price-alerts  body: alert
    // Then a daily cron checks prices and sends push/email when target is hit
  };

  const remove = () => { localStorage.removeItem(storageKey); setSaved(false); setTarget(""); };

  const saving = Math.round(product.price - Number(target));

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:D.card,borderRadius:20,padding:"32px",maxWidth:400,width:"92%",color:D.text,animation:"popIn .3s ease",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:22,cursor:"pointer",color:D.sub }}>✕</button>
        <div style={{ fontSize:44,textAlign:"center",marginBottom:10 }}>🔔</div>
        <h2 style={{ fontWeight:900,fontSize:19,textAlign:"center",marginBottom:4 }}>Set Price Drop Alert</h2>
        <p style={{ color:D.sub,fontSize:13,textAlign:"center",marginBottom:6,lineHeight:1.6 }}>{product.title}</p>
        <div style={{ background:D.bg,borderRadius:10,padding:"10px 14px",marginBottom:20,display:"flex",justifyContent:"space-between",fontSize:13 }}>
          <span style={{ color:D.sub }}>Current Price</span>
          <span style={{ fontWeight:800,color:"#FF5722" }}>{fmt(product.price)}</span>
        </div>

        {saved ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48,marginBottom:10 }}>✅</div>
            <div style={{ fontWeight:800,fontSize:16,marginBottom:6 }}>Alert Set!</div>
            <div style={{ color:D.sub,fontSize:13,marginBottom:20,lineHeight:1.6 }}>
              We'll notify you when <strong>{product.title}</strong> drops below <strong>{fmt(Number(target))}</strong>.
            </div>
            <button onClick={remove} style={{ background:"none",border:`1px solid ${D.border}`,borderRadius:10,padding:"9px 20px",cursor:"pointer",color:D.sub,fontWeight:700,fontSize:13,fontFamily:"inherit" }}>
              🗑 Remove Alert
            </button>
          </div>
        ) : (
          <>
            <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:6 }}>My Target Price (₹)</label>
            <input type="number" value={target} onChange={e => setTarget(e.target.value)}
              placeholder={`e.g. ${Math.round(product.price * 0.85).toLocaleString("en-IN")}`}
              style={{ width:"100%",padding:"12px 16px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:16,marginBottom:target && Number(target) < product.price ? 6 : 14,outline:"none",fontFamily:"inherit",background:D.input,color:D.text }} />

            {target && Number(target) < product.price && (
              <div style={{ fontSize:12,color:"#48BB78",fontWeight:700,marginBottom:14 }}>
                🎯 You'd save {fmt(Math.abs(saving))} from current price
              </div>
            )}
            {target && Number(target) >= product.price && (
              <div style={{ fontSize:12,color:"#FC8181",fontWeight:700,marginBottom:14 }}>
                ⚠️ Target must be lower than current price {fmt(product.price)}
              </div>
            )}

            <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:6 }}>Notify me via (WhatsApp or Email)</label>
            <input type="text" value={contact} onChange={e => setContact(e.target.value)}
              placeholder="9876543210 or you@email.com"
              style={{ width:"100%",padding:"12px 16px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:14,marginBottom:20,outline:"none",fontFamily:"inherit",background:D.input,color:D.text }} />

            <button onClick={save} disabled={!target || Number(target) >= product.price}
              style={{ width:"100%",padding:"13px",borderRadius:12,border:"none",
                background: target && Number(target) < product.price
                  ? "linear-gradient(135deg,#FF5722,#FF9800)" : "#a0aec0",
                color:"#fff",fontWeight:800,fontSize:15,cursor: target && Number(target) < product.price ? "pointer":"not-allowed",fontFamily:"inherit" }}>
              🔔 Set Alert — Notify Me!
            </button>
            <p style={{ fontSize:11,color:D.sub,textAlign:"center",marginTop:10 }}>
              We check prices daily. No spam — only one alert when price drops.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   2. EMI CALCULATOR
   Shows monthly EMI across major Indian banks.
   Massive for electronics / high-ticket items.
══════════════════════════════════════════ */
const EMI_BANKS = [
  { name:"HDFC",    rate:13, color:"#004C8F", processing:199 },
  { name:"ICICI",   rate:13, color:"#B02A2A", processing:199 },
  { name:"SBI",     rate:11, color:"#2D7DD2", processing:0   },
  { name:"Axis",    rate:14, color:"#800000", processing:249 },
  { name:"Kotak",   rate:12, color:"#EE2E24", processing:199 },
  { name:"IDFC",    rate:10, color:"#F4801A", processing:0   },
  { name:"No Cost", rate:0,  color:"#48BB78", processing:0   },
];

const calcEMI = (principal, ratePA, months) => {
  if (ratePA === 0) return principal / months;
  const r = ratePA / 12 / 100;
  return principal * r * Math.pow(1+r,months) / (Math.pow(1+r,months)-1);
};

export function EMICalculator({ product, D, onClose }) {
  const [tenure, setTenure] = useState(6);
  const tenures = [3, 6, 9, 12, 18, 24];

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:D.card,borderRadius:20,padding:"28px 28px",maxWidth:480,width:"92%",color:D.text,animation:"popIn .3s ease",position:"relative",maxHeight:"90vh",overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:22,cursor:"pointer",color:D.sub }}>✕</button>
        <div style={{ fontSize:36,textAlign:"center",marginBottom:8 }}>💳</div>
        <h2 style={{ fontWeight:900,fontSize:18,textAlign:"center",marginBottom:4 }}>EMI Calculator</h2>
        <p style={{ color:D.sub,fontSize:12,textAlign:"center",marginBottom:16 }}>{product.title}</p>

        <div style={{ background:D.bg,borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11,color:D.sub,marginBottom:2 }}>Product Price</div>
            <div style={{ fontWeight:900,fontSize:20,color:"#FF5722" }}>{fmt(product.price)}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11,color:D.sub,marginBottom:2 }}>Cashback</div>
            <div style={{ fontWeight:800,fontSize:14,color:"#48BB78" }}>-{fmt(Math.round(product.price * product.cashbackPct/100))}</div>
          </div>
        </div>

        {/* Tenure selector */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12,fontWeight:700,color:D.sub,marginBottom:8 }}>Tenure</div>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {tenures.map(t => (
              <button key={t} onClick={() => setTenure(t)}
                style={{ padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit",
                  background: tenure===t ? "linear-gradient(135deg,#FF5722,#FF9800)" : D.bg,
                  color: tenure===t ? "#fff" : D.sub }}>
                {t} months
              </button>
            ))}
          </div>
        </div>

        {/* Bank comparison */}
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {EMI_BANKS.map(bank => {
            const emi = calcEMI(product.price, bank.rate, tenure);
            const total = emi * tenure + bank.processing;
            const interest = total - product.price;
            const isNoCost = bank.rate === 0;
            return (
              <div key={bank.name} style={{ background:D.bg,borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",border:`1.5px solid ${isNoCost ? "#48BB78" : D.border}` }}>
                <div>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                    <div style={{ width:32,height:20,background:bank.color,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <span style={{ color:"#fff",fontSize:9,fontWeight:900 }}>{bank.name}</span>
                    </div>
                    {isNoCost && <span style={{ background:"#48BB7822",color:"#48BB78",fontSize:10,fontWeight:800,padding:"1px 6px",borderRadius:6 }}>✨ No Cost</span>}
                  </div>
                  <div style={{ fontSize:11,color:D.sub }}>
                    {isNoCost ? "No interest charged" : `${bank.rate}% p.a. • Processing: ${bank.processing===0?"Free":fmt(bank.processing)}`}
                  </div>
                  {!isNoCost && <div style={{ fontSize:11,color:"#FC8181",marginTop:2 }}>Total interest: {fmt(Math.round(interest))}</div>}
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontWeight:900,fontSize:18,color: isNoCost ? "#48BB78" : D.text }}>{fmt(Math.round(emi))}</div>
                  <div style={{ fontSize:10,color:D.sub }}>per month</div>
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize:11,color:D.sub,marginTop:14,textAlign:"center",lineHeight:1.6 }}>
          Rates are indicative. Final EMI depends on your bank's approval and credit score.
          Always check with your bank before purchasing.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   3. GIFTING ASSISTANT (AI-powered)
   User enters budget + occasion → Claude AI
   recommends matching products with affiliate links
══════════════════════════════════════════ */
const OCCASIONS = ["Birthday 🎂","Anniversary 💑","Diwali 🪔","Raksha Bandhan 🪢","Valentine's Day 💝","Wedding 💍","Graduation 🎓","Baby Shower 👶","Housewarming 🏠","Friendship Day 🤝","Just Because 😊"];
const RECIPIENTS = ["Wife / Partner","Husband / Partner","Mom","Dad","Sister","Brother","Friend","Boss","Colleague","Kids","Grandparents"];

export function GiftingAssistant({ D, products, onShop, onClose }) {
  const [step, setStep]         = useState("form"); // form | results | loading
  const [budget, setBudget]     = useState("");
  const [occasion, setOccasion] = useState("");
  const [recipient, setRecipient] = useState("");
  const [interests, setInterests] = useState("");
  const [results, setResults]   = useState([]);
  const [aiNote, setAiNote]     = useState("");
  const [error, setError]       = useState("");

  const findGifts = async () => {
    if (!budget || !occasion || !recipient) return;
    setStep("loading");
    setError("");

    const productList = products
      .filter(p => p.inStock && p.price <= Number(budget) * 1.2)
      .map(p => `ID:${p.id} | "${p.title}" | ₹${p.price} | ${p.category} | ${p.store} | ${p.cashbackPct}% cashback | tags: ${p.tags?.join(",")||""}`)
      .join("\n");

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:500,
          system:`You are a gifting expert for Indian shoppers. Recommend the best gifts from the product catalog for the given occasion, recipient, and budget.

CATALOG:
${productList}

Respond ONLY in this JSON format (no markdown, no explanation):
{
  "picks": [1,2,3],
  "note": "A warm 1-sentence gifting tip"
}

Rules:
- picks = array of product IDs (2-4 products max), sorted best first
- Only pick products within budget (allow 10% over if clearly worth it)
- Consider occasion + recipient when matching
- picks must be valid IDs from the catalog`,
          messages:[{ role:"user", content:`Budget: ₹${budget}\nOccasion: ${occasion}\nRecipient: ${recipient}\nInterests/notes: ${interests||"general"}` }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      const matched = (parsed.picks||[]).map(id => products.find(p=>p.id===id)).filter(Boolean);
      setResults(matched);
      setAiNote(parsed.note || "");
      setStep("results");
    } catch {
      // Fallback: filter by budget + category heuristic
      const fallback = products
        .filter(p => p.inStock && p.price <= Number(budget) * 1.1)
        .sort((a,b) => disc(b.mrp,b.price) - disc(a.mrp,a.price))
        .slice(0,3);
      setResults(fallback);
      setAiNote("Here are our top picks within your budget!");
      setStep("results");
    }
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:D.card,borderRadius:22,padding:"28px",maxWidth:500,width:"92%",color:D.text,animation:"popIn .3s ease",position:"relative",maxHeight:"92vh",overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:22,cursor:"pointer",color:D.sub }}>✕</button>

        {step === "form" && (
          <>
            <div style={{ fontSize:40,textAlign:"center",marginBottom:8 }}>🎁</div>
            <h2 style={{ fontWeight:900,fontSize:19,textAlign:"center",marginBottom:4 }}>AI Gifting Assistant</h2>
            <p style={{ color:D.sub,fontSize:13,textAlign:"center",marginBottom:22,lineHeight:1.5 }}>Tell us about the occasion and we'll find the perfect gift with cashback!</p>

            <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:6 }}>Budget (₹) *</label>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14 }}>
              {["500","1000","2000","5000","10000"].map(b => (
                <button key={b} onClick={() => setBudget(b)}
                  style={{ padding:"7px 14px",borderRadius:20,border:`1.5px solid ${budget===b?"#FF5722":D.border}`,cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit",background:budget===b?"#FF572218":D.input,color:budget===b?"#FF5722":D.sub }}>
                  {fmt(Number(b))}
                </button>
              ))}
              <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Custom"
                style={{ width:90,padding:"7px 12px",borderRadius:20,border:`1.5px solid ${D.inputBorder}`,fontSize:12,outline:"none",background:D.input,color:D.text,fontFamily:"inherit" }} />
            </div>

            <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:6 }}>Occasion *</label>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:14 }}>
              {OCCASIONS.map(o => (
                <button key={o} onClick={() => setOccasion(o)}
                  style={{ padding:"6px 12px",borderRadius:20,border:`1.5px solid ${occasion===o?"#FF5722":D.border}`,cursor:"pointer",fontWeight:600,fontSize:11,fontFamily:"inherit",background:occasion===o?"#FF572218":D.input,color:occasion===o?"#FF5722":D.sub }}>
                  {o}
                </button>
              ))}
            </div>

            <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:6 }}>Gift is for *</label>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:14 }}>
              {RECIPIENTS.map(r => (
                <button key={r} onClick={() => setRecipient(r)}
                  style={{ padding:"6px 12px",borderRadius:20,border:`1.5px solid ${recipient===r?"#FF5722":D.border}`,cursor:"pointer",fontWeight:600,fontSize:11,fontFamily:"inherit",background:recipient===r?"#FF572218":D.input,color:recipient===r?"#FF5722":D.sub }}>
                  {r}
                </button>
              ))}
            </div>

            <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:6 }}>Their interests (optional)</label>
            <input value={interests} onChange={e=>setInterests(e.target.value)} placeholder="e.g. fitness, cooking, tech, fashion…"
              style={{ width:"100%",padding:"11px 14px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:13,outline:"none",background:D.input,color:D.text,fontFamily:"inherit",marginBottom:20 }} />

            <button onClick={findGifts} disabled={!budget||!occasion||!recipient}
              style={{ width:"100%",padding:"14px",borderRadius:12,border:"none",background:budget&&occasion&&recipient?"linear-gradient(135deg,#FF5722,#FF9800)":"#a0aec0",color:"#fff",fontWeight:800,fontSize:15,cursor:budget&&occasion&&recipient?"pointer":"not-allowed",fontFamily:"inherit" }}>
              🎁 Find Perfect Gifts →
            </button>
          </>
        )}

        {step === "loading" && (
          <div style={{ textAlign:"center",padding:"40px 0" }}>
            <div style={{ fontSize:56,marginBottom:16,animation:"spin 1.5s linear infinite",display:"inline-block" }}>🎁</div>
            <div style={{ fontWeight:800,fontSize:16,marginBottom:8 }}>Finding perfect gifts…</div>
            <div style={{ color:D.sub,fontSize:13 }}>Our AI is searching {products.length} deals for the best match</div>
          </div>
        )}

        {step === "results" && (
          <>
            <div style={{ fontSize:36,textAlign:"center",marginBottom:8 }}>🎉</div>
            <h2 style={{ fontWeight:900,fontSize:18,textAlign:"center",marginBottom:4 }}>Perfect Gifts Found!</h2>
            {aiNote && <div style={{ background:D.bg,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:D.sub,textAlign:"center",fontStyle:"italic" }}>💡 {aiNote}</div>}

            {results.map((p,i) => (
              <div key={p.id} style={{ background:D.bg,borderRadius:14,padding:"14px",marginBottom:12,display:"flex",gap:12,alignItems:"center",border:`1.5px solid ${i===0?"#FF572244":D.border}` }}>
                {i===0 && <div style={{ position:"absolute",background:"#FF5722",color:"#fff",fontSize:9,fontWeight:900,padding:"2px 7px",borderRadius:8,marginTop:-24,marginLeft:-2 }}>⭐ TOP PICK</div>}
                <img src={p.image} alt={p.title} style={{ width:68,height:68,borderRadius:10,objectFit:"cover",flexShrink:0 }} />
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:700,fontSize:13,lineHeight:1.35,marginBottom:4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{p.title}</div>
                  <div style={{ display:"flex",gap:6,alignItems:"center",marginBottom:4 }}>
                    <span style={{ fontSize:16,fontWeight:900,color:"#FF5722" }}>{fmt(p.price)}</span>
                    <span style={{ fontSize:11,color:D.sub,textDecoration:"line-through" }}>{fmt(p.mrp)}</span>
                  </div>
                  <span style={{ fontSize:11,background:"#48BB7822",color:"#48BB78",padding:"2px 8px",borderRadius:8,fontWeight:700 }}>💰 +{p.cashbackPct}% cashback</span>
                </div>
                <button onClick={() => { onShop(p.slug,p.store,p); onClose(); }}
                  style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",border:"none",borderRadius:10,padding:"9px 14px",fontWeight:800,cursor:"pointer",fontSize:12,fontFamily:"inherit",flexShrink:0,whiteSpace:"nowrap" }}>
                  Buy Gift →
                </button>
              </div>
            ))}

            <button onClick={() => { setStep("form"); setResults([]); }} style={{ width:"100%",padding:"11px",borderRadius:11,border:`1px solid ${D.border}`,background:"none",color:D.sub,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13,marginTop:6 }}>
              ← Search Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   4. DEAL SHARE CARD GENERATOR
   Creates a visual card users can screenshot
   and share on WhatsApp, Reels, Stories
══════════════════════════════════════════ */
export function DealShareCard({ product, D, onClose }) {
  const canvasRef = useRef(null);
  const [generated, setGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 1080, H = 1080;
    canvas.width = W; canvas.height = H;

    // Background gradient
    const grad = ctx.createLinearGradient(0,0,W,H);
    grad.addColorStop(0,"#FF5722"); grad.addColorStop(1,"#FF9800");
    ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

    // White card
    ctx.fillStyle = "#fff";
    roundRect(ctx, 60,60,W-120,H-120, 40);
    ctx.fill();

    // Discount badge
    const d = disc(product.mrp, product.price);
    ctx.fillStyle = "#E53E3E";
    ctx.beginPath(); ctx.arc(W-120,120,80,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#fff"; ctx.font="bold 36px Arial"; ctx.textAlign="center";
    ctx.fillText(`${d}%`, W-120, 108);
    ctx.font="bold 20px Arial"; ctx.fillText("OFF", W-120, 140);

    // Brand label
    ctx.fillStyle="#FF5722"; ctx.font="bold 28px Arial"; ctx.textAlign="left";
    ctx.fillText("💸 DealKaro.in", 100, 140);

    // Store chip
    ctx.fillStyle=`${product.storeColor}22`;
    ctx.beginPath(); ctx.roundRect(100, 160, 180, 40, 20); ctx.fill();
    ctx.fillStyle=product.storeColor; ctx.font="bold 22px Arial";
    ctx.fillText(product.store, 120, 187);

    // Product title (wrapped)
    ctx.fillStyle="#1a202c"; ctx.font="bold 46px Arial";
    wrapText(ctx, product.title, 100, 280, W-220, 58);

    // Prices
    ctx.fillStyle="#FF5722"; ctx.font="bold 80px Arial";
    ctx.fillText(`₹${product.price.toLocaleString("en-IN")}`, 100, 620);
    ctx.fillStyle="#a0aec0"; ctx.font="36px Arial";
    const mrpText = `₹${product.mrp.toLocaleString("en-IN")}`;
    const mrpX = 100;
    ctx.fillText(mrpText, mrpX, 670);
    ctx.strokeStyle="#a0aec0"; ctx.lineWidth=3;
    const mrpW = ctx.measureText(mrpText).width;
    ctx.beginPath(); ctx.moveTo(mrpX, 655); ctx.lineTo(mrpX+mrpW, 655); ctx.stroke();

    // Cashback strip
    ctx.fillStyle="#48BB7818";
    ctx.beginPath(); ctx.roundRect(100, 720, W-220, 80, 16); ctx.fill();
    ctx.strokeStyle="#48BB78"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(100, 720, W-220, 80, 16); ctx.stroke();
    ctx.fillStyle="#48BB78"; ctx.font="bold 30px Arial";
    ctx.fillText(`💰 Extra ${product.cashbackPct}% Cashback = ₹${Math.round(product.price*product.cashbackPct/100).toLocaleString("en-IN")} back!`, 120, 768);

    // CTA
    const ctaGrad = ctx.createLinearGradient(100,840,W-120,920);
    ctaGrad.addColorStop(0,"#FF5722"); ctaGrad.addColorStop(1,"#FF9800");
    ctx.fillStyle=ctaGrad;
    ctx.beginPath(); ctx.roundRect(100,840,W-220,100,20); ctx.fill();
    ctx.fillStyle="#fff"; ctx.font="bold 38px Arial"; ctx.textAlign="center";
    ctx.fillText("🛒 Shop via DealKaro & Earn Cashback →", W/2, 900);

    // Rating stars
    ctx.fillStyle="#F6AD55"; ctx.font="bold 32px Arial"; ctx.textAlign="left";
    const stars = "★".repeat(Math.round(product.rating)) + "☆".repeat(5-Math.round(product.rating));
    ctx.fillText(stars, 100, 990);
    ctx.fillStyle="#718096"; ctx.font="24px Arial";
    ctx.fillText(`  ${product.rating} (${product.reviews.toLocaleString()} reviews)`, 280, 990);

    setGenerated(true);
  }, [product]);

  const download = () => {
    setDownloading(true);
    const link = document.createElement("a");
    link.download = `dealkaro-${product.slug}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
    setTimeout(() => setDownloading(false), 1000);
  };

  const share = () => {
    const text = `🔥 ${product.title}\n₹${product.price.toLocaleString("en-IN")} (${disc(product.mrp,product.price)}% OFF) + ${product.cashbackPct}% cashback!\n\nShop via DealKaro: ${SITE.url}/?deal=${product.slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:D.card,borderRadius:20,padding:"24px",maxWidth:420,width:"100%",color:D.text,animation:"popIn .3s ease",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:22,cursor:"pointer",color:D.sub }}>✕</button>
        <h2 style={{ fontWeight:900,fontSize:18,marginBottom:4,textAlign:"center" }}>🎥 Share Deal Card</h2>
        <p style={{ color:D.sub,fontSize:12,textAlign:"center",marginBottom:16 }}>Download and share on WhatsApp, Instagram, Reels</p>

        <canvas ref={canvasRef} style={{ width:"100%",borderRadius:12,display:"block",marginBottom:16,boxShadow:"0 4px 20px rgba(0,0,0,.2)" }} />

        <div style={{ display:"flex",gap:10 }}>
          <button onClick={share} style={{ flex:1,padding:"12px",borderRadius:11,border:"none",background:"#25D366",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>
            💬 WhatsApp
          </button>
          <button onClick={download} style={{ flex:1,padding:"12px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>
            {downloading ? "Downloading…" : "⬇️ Download"}
          </button>
        </div>
        <p style={{ fontSize:11,color:D.sub,textAlign:"center",marginTop:10 }}>
          1080×1080px — perfect for Instagram posts, WhatsApp status & YouTube thumbnails
        </p>
      </div>
    </div>
  );
}

// Canvas helper functions
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}
function wrapText(ctx, text, x, y, maxWidth, lineH) {
  const words = text.split(" "); let line = "";
  for (let w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxWidth && line) { ctx.fillText(line, x, y); line = w+" "; y += lineH; }
    else line = test;
  }
  ctx.fillText(line, x, y);
}

/* ══════════════════════════════════════════
   5. CITY-SPECIFIC DEALS PANEL
   Shows local food/delivery deals based on city.
   Uses geolocation or user selection.
══════════════════════════════════════════ */
const CITY_DEALS = {
  Mumbai: [
    { store:"Swiggy",     icon:"🍔", title:"50% off on first order",         code:"SWIGGY50",    link:"cpn-swiggy", minOrder:"₹199", validTill:"31 Mar" },
    { store:"Zomato",     icon:"🍕", title:"Flat ₹100 off + free delivery",  code:"ZOMATO100",   link:"go-amazon",  minOrder:"₹299", validTill:"20 Mar" },
    { store:"Blinkit",    icon:"⚡", title:"10 min grocery delivery — ₹50 off",code:"BLINK50",   link:"go-amazon",  minOrder:"₹299", validTill:"25 Mar" },
    { store:"BookMyShow", icon:"🎬", title:"Buy 1 Get 1 on movies",          code:"BMSBOGO",     link:"go-amazon",  minOrder:"Any",  validTill:"28 Mar" },
  ],
  Delhi: [
    { store:"Swiggy",  icon:"🍔", title:"40% off + free delivery",           code:"DILLI40",    link:"cpn-swiggy", minOrder:"₹149", validTill:"31 Mar" },
    { store:"Zomato",  icon:"🍕", title:"₹80 off on orders above ₹250",      code:"ZOM80DEL",   link:"go-amazon",  minOrder:"₹250", validTill:"22 Mar" },
    { store:"Zepto",   icon:"🥦", title:"Groceries delivered in 10 min",     code:"ZEPTO60",    link:"go-amazon",  minOrder:"₹199", validTill:"30 Mar" },
    { store:"Ola",     icon:"🚗", title:"₹50 off on rides",                  code:"OLA50DEL",   link:"go-amazon",  minOrder:"₹100", validTill:"15 Apr" },
  ],
  Bangalore: [
    { store:"Swiggy",  icon:"🍔", title:"30% off on restaurants",            code:"BLRFOOD30",  link:"cpn-swiggy", minOrder:"₹199", validTill:"31 Mar" },
    { store:"Zomato",  icon:"🍕", title:"Free delivery all week",            code:"BLRFREE",    link:"go-amazon",  minOrder:"₹149", validTill:"20 Mar" },
    { store:"Rapido",  icon:"🛵", title:"₹30 off on bike rides",             code:"RAPIDOBLR",  link:"go-amazon",  minOrder:"Any",  validTill:"30 Apr" },
    { store:"Dunzo",   icon:"📦", title:"₹40 off on deliveries",             code:"DUNZOBLR",   link:"go-amazon",  minOrder:"₹99",  validTill:"25 Mar" },
  ],
  Hyderabad: [
    { store:"Swiggy",  icon:"🍔", title:"Biryani at 35% off",               code:"HYD35",      link:"cpn-swiggy", minOrder:"₹199", validTill:"28 Mar" },
    { store:"Zomato",  icon:"🍕", title:"₹60 off on lunch orders",          code:"HYDLUNCH",   link:"go-amazon",  minOrder:"₹249", validTill:"20 Mar" },
    { store:"Blinkit", icon:"⚡", title:"Free delivery on groceries",       code:"BLINKFREE",  link:"go-amazon",  minOrder:"₹299", validTill:"31 Mar" },
  ],
  Chennai: [
    { store:"Swiggy",  icon:"🍔", title:"South Indian meals at 25% off",    code:"CHN25",      link:"cpn-swiggy", minOrder:"₹149", validTill:"31 Mar" },
    { store:"Zomato",  icon:"🍕", title:"₹75 off on dinner orders",         code:"CHNDIN",     link:"go-amazon",  minOrder:"₹299", validTill:"22 Mar" },
    { store:"Ola",     icon:"🚗", title:"₹40 off on auto rides",            code:"OLAAUTO40",  link:"go-amazon",  minOrder:"Any",  validTill:"15 Apr" },
  ],
};

export function CityDealsPanel({ D, onClose }) {
  const CITIES = Object.keys(CITY_DEALS);
  const [city, setCity] = useState("Mumbai");
  const [detecting, setDetecting] = useState(false);
  const [copied, setCopied] = useState(null);

  const detectCity = () => {
    setDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // In production: reverse geocode coords → city name
          // For now, cycle through cities as demo
          const demo = CITIES[Math.floor(Math.random()*CITIES.length)];
          setCity(demo);
          setDetecting(false);
        },
        () => setDetecting(false),
        { timeout:5000 }
      );
    } else setDetecting(false);
  };

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code).catch(()=>{});
    setCopied(id); setTimeout(()=>setCopied(null), 2500);
  };

  const deals = CITY_DEALS[city] || [];

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:D.card,borderRadius:20,padding:"28px",maxWidth:440,width:"92%",color:D.text,animation:"popIn .3s ease",position:"relative",maxHeight:"90vh",overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:22,cursor:"pointer",color:D.sub }}>✕</button>
        <div style={{ fontSize:36,textAlign:"center",marginBottom:8 }}>📍</div>
        <h2 style={{ fontWeight:900,fontSize:18,textAlign:"center",marginBottom:4 }}>City Deals</h2>
        <p style={{ color:D.sub,fontSize:12,textAlign:"center",marginBottom:18 }}>Local food & delivery deals near you</p>

        {/* City selector */}
        <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:18,flexWrap:"wrap" }}>
          <select value={city} onChange={e=>setCity(e.target.value)}
            style={{ flex:1,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:14,background:D.input,color:D.text,outline:"none",fontFamily:"inherit" }}>
            {CITIES.map(c=><option key={c}>{c}</option>)}
          </select>
          <button onClick={detectCity} disabled={detecting}
            style={{ padding:"10px 14px",borderRadius:10,border:`1px solid ${D.border}`,background:D.input,color:D.sub,cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit",whiteSpace:"nowrap" }}>
            {detecting?"Detecting…":"📍 Auto-detect"}
          </button>
        </div>

        {/* Deal list */}
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {deals.map((deal,i) => (
            <div key={i} style={{ background:D.bg,borderRadius:14,padding:"14px 16px",border:`1px solid ${D.border}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:24 }}>{deal.icon}</span>
                  <div>
                    <div style={{ fontWeight:800,fontSize:14 }}>{deal.store}</div>
                    <div style={{ fontSize:12,color:D.sub }}>{deal.title}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:10,color:D.sub }}>Min: {deal.minOrder}</div>
                  <div style={{ fontSize:10,color:"#FC8181",fontWeight:700 }}>Till {deal.validTill}</div>
                </div>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <div style={{ flex:1,background:"#fff",border:`2px dashed #FF5722`,borderRadius:8,padding:"6px 12px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <span style={{ fontWeight:900,fontSize:14,color:"#FF5722",letterSpacing:1 }}>{deal.code}</span>
                </div>
                <button onClick={()=>copyCode(deal.code,i)}
                  style={{ padding:"6px 14px",borderRadius:8,border:"none",background:copied===i?"#48BB78":"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap" }}>
                  {copied===i?"✅ Copied!":"📋 Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize:11,color:D.sub,textAlign:"center",marginTop:14,lineHeight:1.6 }}>
          Codes updated weekly. Availability may vary by location and restaurant.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   6. RETARGETING BANNER
   Shows last-viewed product to returning users
   on their next visit — increases re-engagement.
══════════════════════════════════════════ */
export function RetargetingBanner({ D, recentlyViewed, onShop, onDismiss }) {
  const product = recentlyViewed?.[0];
  if (!product) return null;

  const cashbackAmt = Math.round(product.price * product.cashbackPct / 100);

  return (
    <div style={{ position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",zIndex:7200,background:D.card,borderRadius:16,padding:"14px 18px",boxShadow:"0 12px 40px rgba(0,0,0,.22)",border:`2px solid #FF572244`,display:"flex",gap:14,alignItems:"center",maxWidth:420,width:"calc(100% - 40px)",animation:"slideDown .4s ease" }}>
      <img src={product.image} alt={product.title} style={{ width:52,height:52,borderRadius:10,objectFit:"cover",flexShrink:0 }} />
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:11,color:"#FF5722",fontWeight:800,marginBottom:2 }}>👀 You were looking at this…</div>
        <div style={{ fontWeight:700,fontSize:12,lineHeight:1.3,marginBottom:3,display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{product.title}</div>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          <span style={{ fontSize:14,fontWeight:900,color:"#FF5722" }}>{fmt(product.price)}</span>
          <span style={{ fontSize:10,color:"#48BB78",fontWeight:700 }}>+₹{cashbackAmt} cashback</span>
        </div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:6,flexShrink:0 }}>
        <button onClick={()=>{ onShop(product.slug, product.store, product); onDismiss(); }}
          style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",border:"none",borderRadius:9,padding:"8px 14px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:12,fontFamily:"inherit",whiteSpace:"nowrap" }}>
          Buy Now →
        </button>
        <button onClick={onDismiss}
          style={{ background:"none",border:`1px solid ${D.border}`,borderRadius:9,padding:"5px 14px",color:D.sub,fontWeight:600,cursor:"pointer",fontSize:11,fontFamily:"inherit" }}>
          Dismiss
        </button>
      </div>
    </div>
  );
}