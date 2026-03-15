import { useState } from "react";
import { PRODUCTS, STORES, COUPONS } from "./data.js";

/* ═══════════════════════════════════════════
   Admin Dashboard
   Password protected. Default: "admin123"
   Change ADMIN_PASSWORD before deploying!
═══════════════════════════════════════════ */

const ADMIN_PASSWORD = "admin123"; // 🔴 CHANGE THIS before deploying!

// Mock analytics — replace with real data from your backend/Firebase
const MOCK_STATS = {
  totalClicks: 24871,
  todayClicks: 342,
  totalRevenue: 18450,
  thisMonthRevenue: 6280,
  topProducts: [
    { id:2,  title:"Apple iPhone 15 128GB",        clicks:15200, revenue:4560, store:"Flipkart" },
    { id:10, title:"Minimalist Niacinamide Serum",  clicks:18500, revenue:1295, store:"Nykaa"   },
    { id:3,  title:"boAt Airdopes 141",             clicks:32000, revenue:2880, store:"Amazon"  },
    { id:1,  title:'Samsung 65" 4K QLED Smart TV', clicks:8420,  revenue:3750, store:"Amazon"  },
    { id:4,  title:"Levis 511 Slim Fit Jeans",      clicks:5400,  revenue:2400, store:"Myntra"  },
  ],
  topStores: [
    { name:"Amazon",   clicks:42000, revenue:7200, cashbackPaid:3600 },
    { name:"Flipkart", clicks:31000, revenue:5580, cashbackPaid:2790 },
    { name:"Myntra",   clicks:18000, revenue:3240, cashbackPaid:1620 },
    { name:"Nykaa",    clicks:12000, revenue:1680, cashbackPaid:840  },
    { name:"Ajio",     clicks:8000,  revenue:1200, cashbackPaid:600  },
  ],
  recentClicks: [
    { time:"2 mins ago", product:"boAt Airdopes 141",    store:"Amazon",   ip:"192.168.x.x" },
    { time:"5 mins ago", product:"iPhone 15 128GB",      store:"Flipkart", ip:"10.0.x.x"    },
    { time:"8 mins ago", product:"Minimalist Serum",     store:"Nykaa",    ip:"172.16.x.x"  },
    { time:"12 mins ago",product:"Levis 511 Jeans",      store:"Myntra",   ip:"192.168.x.x" },
    { time:"18 mins ago",product:"Samsung QLED TV",      store:"Amazon",   ip:"10.0.x.x"    },
    { time:"24 mins ago",product:"Nike Air Max 270",     store:"Ajio",     ip:"172.16.x.x"  },
    { time:"31 mins ago",product:"Lakme Lipstick Combo", store:"Nykaa",    ip:"192.168.x.x" },
  ],
  dailyRevenue: [
    { day:"Mon", amount:820 },  { day:"Tue", amount:1240 },
    { day:"Wed", amount:960 },  { day:"Thu", amount:1580 },
    { day:"Fri", amount:2100 }, { day:"Sat", amount:2890 },
    { day:"Sun", amount:1740 },
  ],
  subscribers: 1847,
  newSubscribersToday: 23,
  referrals: 312,
  wishlistAdds: 4821,
};

export function AdminDashboard({ D, onClose }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState("overview");
  const [editProduct, setEditProduct] = useState(null);

  const fmt = n => "₹" + Number(n).toLocaleString("en-IN");
  const maxBar = Math.max(...MOCK_STATS.dailyRevenue.map(d => d.amount));

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else { setPwError(true); setPw(""); }
  };

  if (!authed) return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:9500,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:D.card,borderRadius:20,padding:"40px 36px",maxWidth:360,width:"92%",textAlign:"center",color:D.text }}>
        <div style={{ fontSize:48,marginBottom:12 }}>🔐</div>
        <h2 style={{ fontWeight:900,fontSize:20,marginBottom:6 }}>Admin Dashboard</h2>
        <p style={{ color:D.sub,fontSize:13,marginBottom:24 }}>Enter password to access the admin panel</p>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setPwError(false); }} onKeyDown={e => e.key==="Enter" && handleLogin()} placeholder="Admin password" autoFocus
          style={{ width:"100%",padding:"12px 16px",borderRadius:10,border:`1.5px solid ${pwError?"#FC8181":D.inputBorder}`,fontSize:15,textAlign:"center",letterSpacing:4,outline:"none",fontFamily:"inherit",background:D.input,color:D.text,marginBottom:pwError?8:16 }} />
        {pwError && <p style={{ color:"#FC8181",fontSize:12,marginBottom:12 }}>Incorrect password. Try again.</p>}
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={onClose} style={{ flex:1,padding:"11px",borderRadius:10,border:`1px solid ${D.border}`,background:"none",color:D.sub,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
          <button onClick={handleLogin} style={{ flex:2,padding:"11px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",fontWeight:800,cursor:"pointer",fontFamily:"inherit" }}>Login →</button>
        </div>
        <p style={{ fontSize:11,color:D.sub,marginTop:14 }}>Default password: admin123 — change in admin.jsx before deploying</p>
      </div>
    </div>
  );

  const tabs = [["overview","📊 Overview"],["products","🛍️ Products"],["stores","🏪 Stores"],["clicks","🖱️ Live Clicks"],["subscribers","📧 Subscribers"]];

  return (
    <div style={{ position:"fixed",inset:0,background:D.bg,zIndex:9500,overflowY:"auto",display:"flex",flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1a202c,#2d3748)",padding:"16px 4%",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>💸</div>
          <div>
            <div style={{ color:"#fff",fontWeight:900,fontSize:16 }}>DealKaro Admin</div>
            <div style={{ color:"#68D391",fontSize:11,fontWeight:600 }}>● Live Dashboard</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,.1)",border:"none",borderRadius:10,padding:"8px 16px",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit" }}>✕ Close</button>
      </div>

      {/* Tabs */}
      <div style={{ background:D.nav,borderBottom:`1px solid ${D.border}`,padding:"0 4%",display:"flex",gap:4,overflowX:"auto" }}>
        {tabs.map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding:"14px 18px",background:"none",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,color:tab===id?"#FF5722":D.sub,borderBottom:tab===id?"2px solid #FF5722":"2px solid transparent",whiteSpace:"nowrap",fontFamily:"inherit",transition:"color .15s" }}>{label}</button>
        ))}
      </div>

      <div style={{ padding:"28px 4%",flex:1 }}>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div>
            {/* KPI Cards */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:28 }}>
              {[
                { icon:"🖱️", label:"Total Clicks", value:MOCK_STATS.totalClicks.toLocaleString(), sub:`+${MOCK_STATS.todayClicks} today`, color:"#2874F0" },
                { icon:"💰", label:"Total Revenue", value:fmt(MOCK_STATS.totalRevenue), sub:`${fmt(MOCK_STATS.thisMonthRevenue)} this month`, color:"#48BB78" },
                { icon:"📧", label:"Subscribers", value:MOCK_STATS.subscribers.toLocaleString(), sub:`+${MOCK_STATS.newSubscribersToday} today`, color:"#F6AD55" },
                { icon:"🏷️", label:"Referrals", value:MOCK_STATS.referrals.toLocaleString(), sub:"All time", color:"#6C63FF" },
                { icon:"❤️", label:"Wishlist Adds", value:MOCK_STATS.wishlistAdds.toLocaleString(), sub:"All time", color:"#FC2779" },
                { icon:"📦", label:"Active Products", value:PRODUCTS.length, sub:`${PRODUCTS.filter(p=>!p.inStock).length} out of stock`, color:"#DD6B20" },
              ].map(c => (
                <div key={c.label} style={{ background:D.card,borderRadius:14,padding:"20px",border:`1px solid ${D.border}`,boxShadow:"0 3px 12px rgba(0,0,0,.06)" }}>
                  <div style={{ fontSize:28,marginBottom:8 }}>{c.icon}</div>
                  <div style={{ fontSize:22,fontWeight:900,color:c.color,marginBottom:3 }}>{c.value}</div>
                  <div style={{ fontSize:12,fontWeight:700,color:D.text,marginBottom:2 }}>{c.label}</div>
                  <div style={{ fontSize:11,color:D.sub }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div style={{ background:D.card,borderRadius:16,padding:"24px",border:`1px solid ${D.border}`,marginBottom:24 }}>
              <h3 style={{ fontWeight:800,fontSize:16,marginBottom:20 }}>📈 Revenue This Week</h3>
              <div style={{ display:"flex",alignItems:"flex-end",gap:12,height:160 }}>
                {MOCK_STATS.dailyRevenue.map(d => (
                  <div key={d.day} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:D.sub }}>{fmt(d.amount)}</div>
                    <div style={{ width:"100%",background:"linear-gradient(180deg,#FF5722,#FF9800)",borderRadius:"6px 6px 0 0",height:`${(d.amount/maxBar)*120}px`,transition:"height .5s ease" }} />
                    <div style={{ fontSize:12,fontWeight:700,color:D.sub }}>{d.day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
              <div style={{ background:D.card,borderRadius:16,padding:"20px",border:`1px solid ${D.border}` }}>
                <h3 style={{ fontWeight:800,fontSize:15,marginBottom:16 }}>🔥 Top Products by Clicks</h3>
                {MOCK_STATS.topProducts.map((p,i) => (
                  <div key={p.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${D.border}` }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <span style={{ fontWeight:900,color:"#FF5722",fontSize:14,width:20 }}>#{i+1}</span>
                      <div>
                        <div style={{ fontWeight:700,fontSize:12,lineHeight:1.3 }}>{p.title.slice(0,28)}…</div>
                        <div style={{ fontSize:11,color:D.sub }}>{p.store}</div>
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontWeight:800,fontSize:13,color:"#2874F0" }}>{p.clicks.toLocaleString()}</div>
                      <div style={{ fontSize:11,color:"#48BB78",fontWeight:700 }}>{fmt(p.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:D.card,borderRadius:16,padding:"20px",border:`1px solid ${D.border}` }}>
                <h3 style={{ fontWeight:800,fontSize:15,marginBottom:16 }}>🏪 Top Stores by Revenue</h3>
                {MOCK_STATS.topStores.map((s,i) => (
                  <div key={s.name} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${D.border}` }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <span style={{ fontWeight:900,color:"#FF5722",fontSize:14,width:20 }}>#{i+1}</span>
                      <span style={{ fontWeight:700,fontSize:13 }}>{s.name}</span>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontWeight:800,fontSize:13,color:"#48BB78" }}>{fmt(s.revenue)}</div>
                      <div style={{ fontSize:11,color:D.sub }}>{s.clicks.toLocaleString()} clicks</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h2 style={{ fontWeight:800,fontSize:18 }}>🛍️ Products ({PRODUCTS.length})</h2>
              <button style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",border:"none",borderRadius:10,padding:"9px 18px",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>+ Add Product</button>
            </div>
            <div style={{ background:D.card,borderRadius:16,overflow:"hidden",border:`1px solid ${D.border}`,overflowX:"auto" }}>
              <table style={{ width:"100%" }}>
                <thead>
                  <tr style={{ background:D.bg }}>
                    {["Product","Store","Price","Cashback","Status","Stock","Actions"].map(h => (
                      <th key={h} style={{ padding:"12px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:D.sub,letterSpacing:.5,borderBottom:`1px solid ${D.border}`,whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.map(p => (
                    <tr key={p.id} style={{ borderBottom:`1px solid ${D.border}` }}>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <img src={p.image} alt={p.title} style={{ width:40,height:40,borderRadius:8,objectFit:"cover" }} />
                          <div style={{ fontSize:12,fontWeight:700,maxWidth:180,lineHeight:1.3 }}>{p.title}</div>
                        </div>
                      </td>
                      <td style={{ padding:"12px 14px" }}><span style={{ fontSize:11,color:p.storeColor,fontWeight:700,background:`${p.storeColor}22`,padding:"2px 8px",borderRadius:8 }}>{p.store}</span></td>
                      <td style={{ padding:"12px 14px",fontWeight:800,fontSize:13 }}>₹{p.price.toLocaleString()}</td>
                      <td style={{ padding:"12px 14px",fontWeight:700,color:"#48BB78",fontSize:12 }}>{p.cashbackPct}%</td>
                      <td style={{ padding:"12px 14px" }}><span style={{ fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:8,background:p.flashSale?"#FF572222":p.topDeal?"#48BB7822":"#e2e8f0",color:p.flashSale?"#FF5722":p.topDeal?"#276749":"#718096" }}>{p.flashSale?"Flash":p.topDeal?"Top Deal":"Normal"}</span></td>
                      <td style={{ padding:"12px 14px" }}><span style={{ fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:8,background:p.inStock?"#48BB7822":"#FC818122",color:p.inStock?"#276749":"#E53E3E" }}>{p.inStock?"In Stock":"Out of Stock"}</span></td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex",gap:6 }}>
                          <button onClick={() => setEditProduct(p)} style={{ background:"#EEF4FF",border:"none",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700,color:"#2874F0",fontFamily:"inherit" }}>Edit</button>
                          <button style={{ background:"#FFF5F5",border:"none",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700,color:"#E53E3E",fontFamily:"inherit" }}>Hide</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── STORES TAB ── */}
        {tab === "stores" && (
          <div>
            <h2 style={{ fontWeight:800,fontSize:18,marginBottom:20 }}>🏪 Store Performance</h2>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16 }}>
              {MOCK_STATS.topStores.map(s => (
                <div key={s.name} style={{ background:D.card,borderRadius:14,padding:"20px",border:`1px solid ${D.border}` }}>
                  <div style={{ fontWeight:800,fontSize:16,marginBottom:14 }}>{s.name}</div>
                  {[["🖱️ Total Clicks",s.clicks.toLocaleString()],["💰 Revenue Earned",fmt(s.revenue)],["💸 Cashback Paid",fmt(s.cashbackPaid)]].map(([label,val]) => (
                    <div key={label} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${D.border}`,fontSize:13 }}>
                      <span style={{ color:D.sub }}>{label}</span>
                      <span style={{ fontWeight:800 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:14 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:D.sub,marginBottom:5 }}><span>Conversion Rate</span><span style={{ fontWeight:700,color:"#48BB78" }}>3.2%</span></div>
                    <div style={{ background:D.bg,borderRadius:999,height:6,overflow:"hidden" }}>
                      <div style={{ width:"32%",height:"100%",background:"linear-gradient(90deg,#48BB78,#68D391)",borderRadius:999 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LIVE CLICKS TAB ── */}
        {tab === "clicks" && (
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h2 style={{ fontWeight:800,fontSize:18 }}>🖱️ Live Click Activity</h2>
              <div style={{ display:"flex",alignItems:"center",gap:8,background:"#48BB7822",color:"#48BB78",padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700 }}>
                <div style={{ width:7,height:7,borderRadius:"50%",background:"#48BB78",animation:"blink 1.5s infinite" }} />
                Live
              </div>
            </div>
            <div style={{ background:D.card,borderRadius:16,overflow:"hidden",border:`1px solid ${D.border}` }}>
              <table style={{ width:"100%" }}>
                <thead>
                  <tr style={{ background:D.bg }}>
                    {["Time","Product","Store","IP (masked)"].map(h => <th key={h} style={{ padding:"12px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:D.sub,borderBottom:`1px solid ${D.border}` }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STATS.recentClicks.map((c,i) => (
                    <tr key={i} style={{ borderBottom:`1px solid ${D.border}` }}>
                      <td style={{ padding:"12px 14px",fontSize:12,color:D.sub }}>{c.time}</td>
                      <td style={{ padding:"12px 14px",fontSize:12,fontWeight:700 }}>{c.product}</td>
                      <td style={{ padding:"12px 14px" }}><span style={{ fontSize:11,fontWeight:700,color:"#2874F0",background:"#EEF4FF",padding:"2px 8px",borderRadius:8 }}>{c.store}</span></td>
                      <td style={{ padding:"12px 14px",fontSize:12,color:D.sub,fontFamily:"monospace" }}>{c.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize:12,color:D.sub,marginTop:12 }}>IPs are partially masked for privacy. Connect your backend for real-time data.</p>
          </div>
        )}

        {/* ── SUBSCRIBERS TAB ── */}
        {tab === "subscribers" && (
          <div>
            <h2 style={{ fontWeight:800,fontSize:18,marginBottom:20 }}>📧 Subscribers & Growth</h2>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:28 }}>
              {[["📧","Total Subscribers","1,847","#2874F0"],["📈","New Today","23","#48BB78"],["🔔","Push Enabled","612","#F6AD55"],["🏷️","Referrals Sent","312","#6C63FF"]].map(([icon,label,value,color]) => (
                <div key={label} style={{ background:D.card,borderRadius:14,padding:"20px",border:`1px solid ${D.border}` }}>
                  <div style={{ fontSize:28,marginBottom:8 }}>{icon}</div>
                  <div style={{ fontSize:24,fontWeight:900,color,marginBottom:4 }}>{value}</div>
                  <div style={{ fontSize:13,color:D.sub,fontWeight:600 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:D.card,borderRadius:16,padding:"24px",border:`1px solid ${D.border}` }}>
              <h3 style={{ fontWeight:800,fontSize:15,marginBottom:16 }}>📤 Send Broadcast Message</h3>
              <p style={{ color:D.sub,fontSize:13,marginBottom:16,lineHeight:1.6 }}>Send a deal alert to all subscribers. Connect EmailJS or Firebase to enable this.</p>
              <textarea placeholder="Type your deal alert message here…" rows={3} style={{ width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${D.inputBorder}`,fontSize:13,outline:"none",background:D.input,color:D.text,fontFamily:"inherit",resize:"none",marginBottom:12 }} />
              <button style={{ background:"linear-gradient(135deg,#FF5722,#FF9800)",color:"#fff",border:"none",borderRadius:10,padding:"10px 24px",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>📤 Send to All Subscribers</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}