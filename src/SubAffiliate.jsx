import { useState } from "react";

/* ═══════════════════════════════════════════
   SubAffiliate.jsx — B2B Affiliate Sub-Network
   Let bloggers / influencers earn under your account.
   You earn 20–30% of their referred commissions.
═══════════════════════════════════════════ */

const TIERS = [
  { name:"Starter",   color:"#CD7F32", minReferrals:0,  commission:20, perks:["Your own referral link","Basic dashboard","WhatsApp support"] },
  { name:"Pro",       color:"#C0C0C0", minReferrals:10, commission:25, perks:["Everything in Starter","Custom sub-domain","Priority support","Monthly payout","Marketing materials"] },
  { name:"Elite",     color:"#F6AD55", minReferrals:50, commission:30, perks:["Everything in Pro","Dedicated account manager","Co-branded content","Early access to deals","Quarterly bonus"] },
];

const MOCK_PARTNERS = [
  { name:"TechReviewer Rahul", platform:"YouTube", followers:"45K", monthlyClicks:1240, earned:3840, tier:"Pro"    },
  { name:"FashionWithPreeti",  platform:"Instagram",followers:"28K", monthlyClicks:890,  earned:2100, tier:"Starter"},
  { name:"DealsBySneha",       platform:"WhatsApp", followers:"12K", monthlyClicks:2100, earned:5200, tier:"Elite"  },
  { name:"TechDealsAnkit",     platform:"Telegram", followers:"8K",  monthlyClicks:670,  earned:1560, tier:"Starter"},
];

export function SubAffiliatePage({ D }) {
  const [tab, setTab] = useState("join"); // join | dashboard | partners
  const [form, setForm] = useState({ name:"", email:"", platform:"", audience:"", followers:"" });
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const myLink = "https://dealkaro.in?ref=PARTNER_CODE";

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.platform) return;
    // POST /api/partners/apply  body: form
    setSubmitted(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(myLink).catch(()=>{});
    setCopiedLink(true);
    setTimeout(()=>setCopiedLink(false), 2500);
  };

  const tierColor = { Starter:"#CD7F32", Pro:"#C0C0C0", Elite:"#F6AD55" };

  return (
    <div style={{ padding:"28px 6%" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center",marginBottom:36 }}>
          <div style={{ fontSize:48,marginBottom:10 }}>🤝</div>
          <h1 style={{ fontSize:28,fontWeight:900,marginBottom:8 }}>DealKaro Partner Network</h1>
          <p style={{ color:D.sub,fontSize:16,lineHeight:1.7,maxWidth:580,margin:"0 auto" }}>
            Are you a blogger, influencer, or WhatsApp group admin? Join our partner program and earn up to 30% commission on every sale you refer.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16,marginBottom:32 }}>
          {[["💰","₹2 Lakh+","Paid to Partners"],["🤝","47","Active Partners"],["📊","30%","Max Commission"],["⚡","Weekly","Payout Cycle"]].map(([icon,val,label])=>(
            <div key={label} style={{ background:D.card,borderRadius:14,padding:"20px",textAlign:"center",border:`1px solid ${D.border}` }}>
              <div style={{ fontSize:28,marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:22,fontWeight:900,color:"#FF5722",marginBottom:3 }}>{val}</div>
              <div style={{ fontSize:12,color:D.sub,fontWeight:600 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex",gap:4,marginBottom:28,background:D.card,borderRadius:14,padding:6,border:`1px solid ${D.border}` }}>
          {[["join","🚀 Join Program"],["dashboard","📊 My Dashboard"],["partners","👥 Top Partners"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{ flex:1,padding:"11px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit",
                background: tab===id?"linear-gradient(135deg,#FF5722,#FF9800)":"none",
                color: tab===id?"#fff":D.sub }}>
              {label}
            </button>
          ))}
        </div>

        {/* JOIN TAB */}
        {tab === "join" && (
          <div>
            {/* Tiers */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16,marginBottom:32 }}>
              {TIERS.map(tier=>(
                <div key={tier.name} style={{ background:D.card,borderRadius:16,padding:"22px",border:`2px solid ${tier.color}44`,position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:4,background:tier.color }} />
                  <div style={{ fontWeight:900,fontSize:18,color:tier.color,marginBottom:4 }}>{tier.name}</div>
                  <div style={{ fontSize:28,fontWeight:900,color:D.text,marginBottom:2 }}>{tier.commission}%</div>
                  <div style={{ fontSize:12,color:D.sub,marginBottom:14 }}>Commission on referrals</div>
                  <div style={{ fontSize:11,color:D.sub,marginBottom:12 }}>Min {tier.minReferrals} referrals/month</div>
                  {tier.perks.map(p=>(
                    <div key={p} style={{ display:"flex",gap:8,alignItems:"center",marginBottom:7,fontSize:13 }}>
                      <span style={{ color:tier.color }}>✓</span><span style={{ color:D.sub }}>{p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Application form */}
            {submitted ? (
              <div style={{ background:D.card,borderRadius:16,padding:"36px",textAlign:"center",border:`1px solid ${D.border}` }}>
                <div style={{ fontSize:56,marginBottom:12 }}>🎉</div>
                <h2 style={{ fontWeight:900,fontSize:20,marginBottom:8 }}>Application Submitted!</h2>
                <p style={{ color:D.sub,fontSize:14,lineHeight:1.7 }}>
                  We'll review your application and get back to you within 24 hours on <strong>{form.email}</strong>.
                  Once approved, you'll get your unique referral link and partner dashboard access.
                </p>
              </div>
            ) : (
              <div style={{ background:D.card,borderRadius:16,padding:"28px",border:`1px solid ${D.border}` }}>
                <h3 style={{ fontWeight:800,fontSize:18,marginBottom:20 }}>Apply to Become a Partner</h3>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
                  {[["Full Name","name","text","Rahul Sharma"],["Email","email","email","rahul@gmail.com"],["Platform","platform","text","YouTube / Instagram / WhatsApp"],["Followers / Group Size","followers","number","10000"]].map(([label,key,type,ph])=>(
                    <div key={key}>
                      <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:5 }}>{label} {["name","email","platform"].includes(key)?"*":""}</label>
                      <input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph}
                        style={{ width:"100%",padding:"11px 14px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:13,outline:"none",background:D.input,color:D.text,fontFamily:"inherit" }} />
                    </div>
                  ))}
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={{ fontSize:12,fontWeight:700,color:D.sub,display:"block",marginBottom:5 }}>What is your audience interested in?</label>
                    <input value={form.audience} onChange={e=>setForm(f=>({...f,audience:e.target.value}))} placeholder="e.g. tech deals, fashion, home appliances…"
                      style={{ width:"100%",padding:"11px 14px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:13,outline:"none",background:D.input,color:D.text,fontFamily:"inherit" }} />
                  </div>
                </div>
                <button onClick={handleSubmit} disabled={!form.name||!form.email||!form.platform}
                  style={{ marginTop:20,width:"100%",padding:"14px",borderRadius:12,border:"none",background:form.name&&form.email&&form.platform?"linear-gradient(135deg,#FF5722,#FF9800)":"#a0aec0",color:"#fff",fontWeight:800,fontSize:15,cursor:form.name&&form.email&&form.platform?"pointer":"not-allowed",fontFamily:"inherit" }}>
                  🚀 Apply Now — It's Free!
                </button>
              </div>
            )}
          </div>
        )}

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div>
            <div style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",borderRadius:16,padding:"24px",marginBottom:24,color:"#fff" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16 }}>
                <div>
                  <div style={{ fontSize:13,opacity:.8,marginBottom:4 }}>Your Referral Link</div>
                  <div style={{ fontFamily:"monospace",fontSize:14,background:"rgba(255,255,255,.15)",borderRadius:8,padding:"8px 14px",marginBottom:12 }}>{myLink}</div>
                  <button onClick={copyLink} style={{ background:"#fff",color:"#FF5722",border:"none",borderRadius:9,padding:"9px 18px",fontWeight:800,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>
                    {copiedLink ? "✅ Copied!" : "📋 Copy Link"}
                  </button>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11,opacity:.8 }}>Your Tier</div>
                  <div style={{ fontSize:24,fontWeight:900 }}>⭐ Pro</div>
                  <div style={{ fontSize:12,opacity:.8 }}>25% commission</div>
                </div>
              </div>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:14,marginBottom:24 }}>
              {[["🖱️","Total Clicks","3,840","All time"],["💰","Total Earned","₹9,600","All time"],["📅","This Month","₹2,400","March 2026"],["⏳","Pending Payout","₹1,200","Processes Friday"]].map(([icon,label,val,sub])=>(
                <div key={label} style={{ background:D.card,borderRadius:13,padding:"18px",border:`1px solid ${D.border}` }}>
                  <div style={{ fontSize:26,marginBottom:7 }}>{icon}</div>
                  <div style={{ fontWeight:900,fontSize:19,color:"#FF5722",marginBottom:3 }}>{val}</div>
                  <div style={{ fontSize:12,fontWeight:700,marginBottom:2 }}>{label}</div>
                  <div style={{ fontSize:11,color:D.sub }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Marketing materials */}
            <div style={{ background:D.card,borderRadius:14,padding:"20px",border:`1px solid ${D.border}` }}>
              <h3 style={{ fontWeight:800,fontSize:15,marginBottom:14 }}>📦 Marketing Materials</h3>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10 }}>
                {[["🖼️","Banner Images","12 sizes included"],["📝","Pre-written WhatsApp messages","Copy & paste ready"],["🎥","Deal card templates","For Reels & Stories"],["📊","Monthly deal report","Auto-generated PDF"]].map(([icon,name,desc])=>(
                  <div key={name} style={{ background:D.bg,borderRadius:10,padding:"14px",textAlign:"center",cursor:"pointer",border:`1px solid ${D.border}` }}>
                    <div style={{ fontSize:28,marginBottom:6 }}>{icon}</div>
                    <div style={{ fontWeight:700,fontSize:12,marginBottom:3 }}>{name}</div>
                    <div style={{ fontSize:11,color:D.sub }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TOP PARTNERS TAB */}
        {tab === "partners" && (
          <div>
            <p style={{ color:D.sub,fontSize:14,marginBottom:20,lineHeight:1.6 }}>
              Our top-performing partners earn ₹5,000–₹25,000/month by sharing DealKaro links with their audience.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {MOCK_PARTNERS.map((p,i)=>(
                <div key={i} style={{ background:D.card,borderRadius:14,padding:"18px 20px",display:"flex",alignItems:"center",gap:16,border:`1px solid ${D.border}` }}>
                  <div style={{ width:42,height:42,background:"linear-gradient(135deg,#FF5722,#FF9800)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:16,flexShrink:0 }}>
                    {p.name[0]}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800,fontSize:14,marginBottom:3 }}>{p.name}</div>
                    <div style={{ display:"flex",gap:10,fontSize:12,color:D.sub,flexWrap:"wrap" }}>
                      <span>📱 {p.platform}</span>
                      <span>👥 {p.followers} followers</span>
                      <span>🖱️ {p.monthlyClicks.toLocaleString()} clicks/mo</span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right",flexShrink:0 }}>
                    <div style={{ fontWeight:900,fontSize:16,color:"#48BB78" }}>₹{p.earned.toLocaleString()}</div>
                    <div style={{ fontSize:11,color:D.sub }}>earned total</div>
                    <span style={{ fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:8,background:`${tierColor[p.tier]}22`,color:tierColor[p.tier] }}>{p.tier}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",borderRadius:14,padding:"22px",textAlign:"center",marginTop:24 }}>
              <h3 style={{ color:"#fff",fontWeight:900,fontSize:18,marginBottom:8 }}>Ready to Start Earning?</h3>
              <p style={{ color:"rgba(255,255,255,.85)",fontSize:13,marginBottom:16 }}>Join 47+ partners earning commissions on every deal they share</p>
              <button onClick={()=>setTab("join")} style={{ background:"#fff",color:"#FF5722",border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",fontSize:14,fontFamily:"inherit" }}>
                🚀 Apply Now — Free
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}