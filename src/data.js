/* ═══════════════════════════════════════════
   data.js  —  All site data in one place
   Replace YOUR_*_TAG values with real IDs
═══════════════════════════════════════════ */

export const REDIRECT_MAP = {
  "go-amazon":    "https://www.amazon.in/?tag=YOUR_AMAZON_TAG",
  "go-myntra":    "https://www.myntra.com/?utm_source=affiliate&utm_medium=YOUR_MYNTRA_TAG",
  "go-flipkart":  "https://www.flipkart.com/?affid=YOUR_FLIPKART_TAG",
  "go-nykaa":     "https://www.nykaa.com/?ref=YOUR_NYKAA_TAG",
  "go-ajio":      "https://www.ajio.com/?ref=YOUR_AJIO_TAG",
  "go-swiggy":    "https://www.swiggy.com/?ref=YOUR_SWIGGY_TAG",
  "go-mmt":       "https://www.makemytrip.com/?affid=YOUR_MMT_TAG",
  "go-meesho":    "https://www.meesho.com/?ref=YOUR_MEESHO_TAG",
  "amz-tv-1":     "https://www.amazon.in/dp/B0CHX2HFQG?tag=YOUR_AMAZON_TAG",
  "fk-iphone-2":  "https://www.flipkart.com/apple-iphone-15/p/itm?affid=YOUR_FLIPKART_TAG",
  "amz-boat-3":   "https://www.amazon.in/dp/B09YRBFJQ7?tag=YOUR_AMAZON_TAG",
  "myn-jeans-4":  "https://www.myntra.com/levis/511/p/123?utm_source=aff&utm_medium=YOUR_MYNTRA_TAG",
  "ajio-nike-5":  "https://www.ajio.com/nike-air-max/p/460358?ref=YOUR_AJIO_TAG",
  "myn-dress-6":  "https://www.myntra.com/hm/dress/p/456?utm_source=aff&utm_medium=YOUR_MYNTRA_TAG",
  "amz-cook-7":   "https://www.amazon.in/dp/B07WQKB7YX?tag=YOUR_AMAZON_TAG",
  "fk-dyson-8":   "https://www.flipkart.com/dyson-v11/p/itm?affid=YOUR_FLIPKART_TAG",
  "nyk-lakme-9":  "https://www.nykaa.com/lakme-lipstick/p/123?ref=YOUR_NYKAA_TAG",
  "nyk-serum-10": "https://www.nykaa.com/minimalist-serum/p/456?ref=YOUR_NYKAA_TAG",
  "amz-gym-11":   "https://www.amazon.in/dp/B08CXYZ123?tag=YOUR_AMAZON_TAG",
  "fk-yon-12":    "https://www.flipkart.com/yonex-racket/p/itm?affid=YOUR_FLIPKART_TAG",
  "cpn-amazon":   "https://www.amazon.in/?tag=YOUR_AMAZON_TAG",
  "cpn-myntra":   "https://www.myntra.com/?utm_source=aff&utm_medium=YOUR_MYNTRA_TAG",
  "cpn-flipkart": "https://www.flipkart.com/?affid=YOUR_FLIPKART_TAG",
  "cpn-nykaa":    "https://www.nykaa.com/?ref=YOUR_NYKAA_TAG",
  "cpn-swiggy":   "https://www.swiggy.com/?ref=YOUR_SWIGGY_TAG",
  "cpn-mmt":      "https://www.makemytrip.com/?affid=YOUR_MMT_TAG",
};

export const SITE = {
  name: "DealKaro",
  url: "https://dealkaro.in",
  whatsapp: "https://wa.me/91XXXXXXXXXX",
  instagram: "https://instagram.com/youraccount",
  email: "support@dealkaro.in",
  whatsappGroup: "https://chat.whatsapp.com/YOUR_GROUP_INVITE",
};

export const BANNERS = [
  { id:1, title:"Amazon Great Indian Festival", subtitle:"Up to 80% OFF + Extra 10% Bank Discount", cta:"Shop Now", badge:"LIVE NOW", store:"Amazon", slug:"go-amazon", gradient:"linear-gradient(135deg,#FF9900,#e65c00)", expires: Date.now() + 3*24*3600*1000 },
  { id:2, title:"Myntra End of Reason Sale", subtitle:"Minimum 50% OFF on Top Fashion Brands", cta:"Explore Deals", badge:"TRENDING", store:"Myntra", slug:"go-myntra", gradient:"linear-gradient(135deg,#FF3F6C,#c0134a)", expires: Date.now() + 5*24*3600*1000 },
  { id:3, title:"Flipkart Big Billion Days", subtitle:"Biggest Sale of the Year — Prices Slashed", cta:"Grab Deals", badge:"HOT", store:"Flipkart", slug:"go-flipkart", gradient:"linear-gradient(135deg,#2874F0,#0a52c4)", expires: Date.now() + 2*24*3600*1000 },
];

export const CATEGORIES = [
  { id:"all",         label:"All Deals",      labelHi:"सभी",              icon:"🔥" },
  { id:"electronics", label:"Electronics",    labelHi:"इलेक्ट्रॉनिक्स",   icon:"📱" },
  { id:"fashion",     label:"Fashion",        labelHi:"फैशन",             icon:"👗" },
  { id:"home",        label:"Home & Kitchen", labelHi:"होम",              icon:"🏠" },
  { id:"beauty",      label:"Beauty",         labelHi:"ब्यूटी",           icon:"💄" },
  { id:"food",        label:"Food",           labelHi:"खाना",             icon:"🍔" },
  { id:"travel",      label:"Travel",         labelHi:"यात्रा",           icon:"✈️" },
  { id:"sports",      label:"Sports",         labelHi:"खेल",              icon:"🏃" },
];

export const PRODUCTS = [
  { id:1,  category:"electronics", store:"Amazon",   storeColor:"#FF9900", title:'Samsung 65" 4K QLED Smart TV',         image:"https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80",  mrp:129999, price:74999,  cashbackPct:5,  badge:"Best Seller",  badgeColor:"#FF9900", slug:"amz-tv-1",     rating:4.4, reviews:2341,  clicks:8420,  flashSale:true,  inStock:true,  topDeal:true,  expiresHours:48, comparePrice:{Amazon:74999,Flipkart:76499},  tags:["tv","samsung","4k","oled"],     userReviews:[{name:"Ravi K.",stars:5,text:"Amazing picture quality! Worth every rupee.",date:"2026-03-01"},{name:"Priya S.",stars:4,text:"Great TV, setup was easy.",date:"2026-02-20"}] },
  { id:2,  category:"electronics", store:"Flipkart", storeColor:"#2874F0", title:"Apple iPhone 15 128GB",                 image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",  mrp:79999,  price:69999,  cashbackPct:3,  badge:"Top Rated",    badgeColor:"#2874F0", slug:"fk-iphone-2",  rating:4.7, reviews:8923,  clicks:15200, flashSale:false, inStock:true,  topDeal:true,  expiresHours:72, comparePrice:{Amazon:71999,Flipkart:69999}, tags:["iphone","apple","smartphone"],  userReviews:[{name:"Amit P.",stars:5,text:"Best iPhone I've owned. Camera is outstanding!",date:"2026-03-05"},{name:"Sneha R.",stars:4,text:"Fast delivery, original product.",date:"2026-02-28"}] },
  { id:3,  category:"electronics", store:"Amazon",   storeColor:"#FF9900", title:"boAt Airdopes 141 TWS Earbuds",         image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&q=80",  mrp:4990,   price:1199,   cashbackPct:8,  badge:"76% OFF",      badgeColor:"#E53E3E", slug:"amz-boat-3",   rating:4.1, reviews:45621, clicks:32000, flashSale:true,  inStock:true,  topDeal:false, expiresHours:12, comparePrice:{Amazon:1199,Flipkart:1299},    tags:["earbuds","boat","wireless","earphones","audio"], userReviews:[{name:"Nikhil M.",stars:4,text:"Great sound for the price.",date:"2026-03-10"},{name:"Divya T.",stars:4,text:"Value for money earbuds!",date:"2026-03-08"}] },
  { id:4,  category:"fashion",     store:"Myntra",   storeColor:"#FF3F6C", title:"Levis 511 Slim Fit Jeans",              image:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",  mrp:3999,   price:1999,   cashbackPct:12, badge:"50% OFF",      badgeColor:"#E53E3E", slug:"myn-jeans-4",  rating:4.3, reviews:1204,  clicks:5400,  flashSale:false, inStock:true,  topDeal:true,  expiresHours:96, comparePrice:{Myntra:1999,Ajio:2199},        tags:["jeans","levis","denim","men"],   userReviews:[{name:"Rohit V.",stars:5,text:"Perfect fit, great quality denim.",date:"2026-03-02"},{name:"Aisha N.",stars:4,text:"Love the colour and fit!",date:"2026-02-25"}] },
  { id:5,  category:"fashion",     store:"Ajio",     storeColor:"#8B5CF6", title:"Nike Air Max 270 Running Shoes",         image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",  mrp:12995,  price:7795,   cashbackPct:10, badge:"40% OFF",      badgeColor:"#E53E3E", slug:"ajio-nike-5",  rating:4.5, reviews:3892,  clicks:9800,  flashSale:false, inStock:false, topDeal:false, expiresHours:24, comparePrice:{Myntra:8495,Ajio:7795},        tags:["shoes","nike","running","sports"], userReviews:[{name:"Karan B.",stars:5,text:"Super comfortable, great for long runs.",date:"2026-03-06"},{name:"Meera J.",stars:5,text:"Original Nike at a great price!",date:"2026-02-22"}] },
  { id:6,  category:"fashion",     store:"Myntra",   storeColor:"#FF3F6C", title:"H&M Women's Summer Dress",              image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",  mrp:2999,   price:1499,   cashbackPct:12, badge:"New Arrival",  badgeColor:"#48BB78", slug:"myn-dress-6",  rating:4.2, reviews:892,   clicks:3200,  flashSale:false, inStock:true,  topDeal:false, expiresHours:120,comparePrice:{Myntra:1499,Ajio:1699},        tags:["dress","women","summer","hm"],   userReviews:[{name:"Pooja L.",stars:4,text:"Lovely fabric and colour. Perfect for summer!",date:"2026-03-09"},{name:"Tanya C.",stars:5,text:"Exactly as shown. Great quality.",date:"2026-03-01"}] },
  { id:7,  category:"home",        store:"Amazon",   storeColor:"#FF9900", title:"Prestige Induction Cooktop",            image:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",  mrp:3995,   price:1999,   cashbackPct:6,  badge:"50% OFF",      badgeColor:"#E53E3E", slug:"amz-cook-7",   rating:4.3, reviews:7821,  clicks:6700,  flashSale:false, inStock:true,  topDeal:true,  expiresHours:60, comparePrice:{Amazon:1999,Flipkart:2199},    tags:["kitchen","induction","cooktop","prestige"], userReviews:[{name:"Sunita P.",stars:5,text:"Excellent performance. Heats up quickly.",date:"2026-02-18"},{name:"Harish K.",stars:4,text:"Good build quality for the price.",date:"2026-02-10"}] },
  { id:8,  category:"home",        store:"Flipkart", storeColor:"#2874F0", title:"Dyson V11 Absolute Vacuum Cleaner",     image:"https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80",  mrp:54900,  price:39900,  cashbackPct:4,  badge:"Premium",      badgeColor:"#805AD5", slug:"fk-dyson-8",   rating:4.6, reviews:1203,  clicks:4100,  flashSale:false, inStock:false, topDeal:false, expiresHours:80, comparePrice:{Amazon:41999,Flipkart:39900},  tags:["vacuum","dyson","cleaning","home"], userReviews:[{name:"Vandana S.",stars:5,text:"Powerful suction, worth the investment.",date:"2026-02-15"},{name:"Rajesh M.",stars:5,text:"Best vacuum cleaner I've used.",date:"2026-02-05"}] },
  { id:9,  category:"beauty",      store:"Nykaa",    storeColor:"#FC2779", title:"Lakme 9to5 Primer + Matte Lipstick",    image:"https://images.unsplash.com/photo-1586495777744-4e6232bf0877?w=400&q=80",  mrp:1350,   price:675,    cashbackPct:7,  badge:"50% OFF",      badgeColor:"#E53E3E", slug:"nyk-lakme-9",  rating:4.4, reviews:5621,  clicks:7200,  flashSale:false, inStock:true,  topDeal:false, expiresHours:36, comparePrice:{Nykaa:675,Amazon:699},          tags:["lipstick","lakme","makeup","beauty"], userReviews:[{name:"Ananya R.",stars:5,text:"Long lasting matte finish. Love it!",date:"2026-03-04"},{name:"Simran K.",stars:4,text:"Great combo offer.",date:"2026-02-28"}] },
  { id:10, category:"beauty",      store:"Nykaa",    storeColor:"#FC2779", title:"Minimalist 10% Niacinamide Serum",      image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",  mrp:699,    price:559,    cashbackPct:7,  badge:"Viral",        badgeColor:"#DD6B20", slug:"nyk-serum-10", rating:4.6, reviews:12034, clicks:18500, flashSale:true,  inStock:true,  topDeal:true,  expiresHours:18, comparePrice:{Nykaa:559,Amazon:589},          tags:["serum","niacinamide","skincare","minimalist"], userReviews:[{name:"Kritika D.",stars:5,text:"Reduced my pores in just 2 weeks!",date:"2026-03-11"},{name:"Ishaan T.",stars:5,text:"Best serum for the price.",date:"2026-03-07"}] },
  { id:11, category:"sports",      store:"Amazon",   storeColor:"#FF9900", title:"Boldfit Gym Gloves with Wrist Support", image:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",  mrp:999,    price:449,    cashbackPct:8,  badge:"55% OFF",      badgeColor:"#E53E3E", slug:"amz-gym-11",   rating:4.2, reviews:8904,  clicks:5600,  flashSale:false, inStock:true,  topDeal:false, expiresHours:48, comparePrice:{Amazon:449,Flipkart:499},        tags:["gym","gloves","fitness","workout"], userReviews:[{name:"Vikram S.",stars:4,text:"Good grip and comfortable fit.",date:"2026-03-03"},{name:"Naina P.",stars:4,text:"Nice quality for the price.",date:"2026-02-26"}] },
  { id:12, category:"sports",      store:"Flipkart", storeColor:"#2874F0", title:"Yonex Muscle Power Badminton Racket",   image:"https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80",  mrp:2490,   price:1299,   cashbackPct:5,  badge:"Top Pick",     badgeColor:"#2874F0", slug:"fk-yon-12",    rating:4.3, reviews:3201,  clicks:4800,  flashSale:false, inStock:true,  topDeal:false, expiresHours:72, comparePrice:{Amazon:1399,Flipkart:1299},     tags:["badminton","yonex","racket","sports"], userReviews:[{name:"Arjun M.",stars:5,text:"Lightweight and powerful. Great for beginners.",date:"2026-03-06"},{name:"Sonia G.",stars:4,text:"Good quality racket, fast delivery.",date:"2026-02-27"}] },
];

export const COUPONS = [
  { id:1, store:"Amazon",     storeColor:"#FF9900", storeBg:"#FFF8ED", code:"AMAZON200",  desc:"Extra ₹200 off on orders above ₹1,499",       expiry:"31 Mar 2026", slug:"cpn-amazon"   },
  { id:2, store:"Myntra",     storeColor:"#FF3F6C", storeBg:"#FFF0F4", code:"MYNTRA30",   desc:"30% off on Fashion — Min. order ₹999",         expiry:"20 Mar 2026", slug:"cpn-myntra"   },
  { id:3, store:"Flipkart",   storeColor:"#2874F0", storeBg:"#EEF4FF", code:"FLIPNEW10",  desc:"Extra 10% off for new users",                  expiry:"28 Mar 2026", slug:"cpn-flipkart" },
  { id:4, store:"Nykaa",      storeColor:"#FC2779", storeBg:"#FFF0F6", code:"NYKAA15",    desc:"15% off on Beauty orders above ₹599",          expiry:"25 Mar 2026", slug:"cpn-nykaa"    },
  { id:5, store:"Swiggy",     storeColor:"#FC8019", storeBg:"#FFF5EE", code:"SWIGGY50",   desc:"Flat ₹50 off on your next food order",         expiry:"18 Mar 2026", slug:"cpn-swiggy"   },
  { id:6, store:"MakeMyTrip", storeColor:"#00A8E1", storeBg:"#EDF8FD", code:"MMT500",     desc:"₹500 off on Hotel bookings above ₹3,000",     expiry:"30 Apr 2026", slug:"cpn-mmt"      },
];

export const STORES = [
  { name:"Amazon",     icon:"🛒", color:"#FF9900", cashback:"Up to 8%",  slug:"go-amazon"   },
  { name:"Myntra",     icon:"👗", color:"#FF3F6C", cashback:"Up to 12%", slug:"go-myntra"   },
  { name:"Flipkart",   icon:"📦", color:"#2874F0", cashback:"Up to 10%", slug:"go-flipkart" },
  { name:"Nykaa",      icon:"💄", color:"#FC2779", cashback:"Up to 7%",  slug:"go-nykaa"    },
  { name:"Ajio",       icon:"✨", color:"#8B5CF6", cashback:"Up to 15%", slug:"go-ajio"     },
  { name:"Swiggy",     icon:"🍔", color:"#FC8019", cashback:"Up to 5%",  slug:"go-swiggy"   },
  { name:"MakeMyTrip", icon:"✈️", color:"#00A8E1", cashback:"Up to 6%",  slug:"go-mmt"      },
  { name:"Meesho",     icon:"🏷️", color:"#9B51E0", cashback:"Up to 9%",  slug:"go-meesho"   },
];

export const SPIN_PRIZES = [
  { label:"₹50 Off",     code:"SPIN50",    color:"#FF5722", prob:0.20 },
  { label:"5% Extra",    code:"SPIN5PCT",  color:"#2874F0", prob:0.20 },
  { label:"Free Ship",   code:"FREESHIP",  color:"#48BB78", prob:0.15 },
  { label:"Try Again",   code:null,        color:"#a0aec0", prob:0.20 },
  { label:"₹100 Off",    code:"SPIN100",   color:"#F6AD55", prob:0.10 },
  { label:"10% Extra",   code:"SPIN10PCT", color:"#FC2779", prob:0.10 },
  { label:"₹200 Off",    code:"SPIN200",   color:"#805AD5", prob:0.03 },
  { label:"Jackpot!",    code:"JACKPOT",   color:"#FF9900", prob:0.02 },
];

export const SORT_OPTIONS = [
  { value:"default",   label:"Default",           labelHi:"डिफ़ॉल्ट"           },
  { value:"discount",  label:"Highest Discount",   labelHi:"सबसे ज़्यादा छूट"  },
  { value:"cashback",  label:"Highest Cashback",   labelHi:"सबसे ज़्यादा कैशबैक"},
  { value:"priceLow",  label:"Price: Low → High",  labelHi:"कीमत: कम से ज़्यादा"},
  { value:"priceHigh", label:"Price: High → Low",  labelHi:"कीमत: ज़्यादा से कम"},
  { value:"rating",    label:"Highest Rated",       labelHi:"सबसे अधिक रेटेड"   },
  { value:"expiring",  label:"Expiring Soon",       labelHi:"जल्द समाप्त"        },
];