// lib/data.js
export const P=[["Classic Package A",999,1],["Classic Package B",1199,1],["Classic Package C",1799,1],["Prestige Package",3499,1],["Yearbook Package",649,2],["Express",399,1],["Duo: Basic",599,2],["Duo: Premium",899,2],["Group: Basic",1399,3],["Group: Elite",1899,4]];
// color = CSS color o gradient. Optional: img:"/images/backdrops/white.jpg" (mas inuuna ang img)
// color = CSS color o gradient. Optional: img:"/images/backdrops/white.jpg" (mas inuuna ang img)
export const BD=[
  {name:"Yearbook Exclusive",color:"linear-gradient(160deg,#3b82a6,#1e4f6b)"},
  {name:"Salt & Sun",color:"linear-gradient(160deg,#38bdf8,#0284c7)"},
  {name:"White",color:"#ffffff"},
  {name:"Paper Cream",color:"#efe6d2"},
  {name:"Static Gray",color:"linear-gradient(160deg,#9ca3af,#4b5563)"},
  {name:"Black",color:"#111111"},
  {name:"Rose Pink",color:"linear-gradient(160deg,#f9a8d4,#ec4899)"},
  {name:"Sunset Orange",color:"linear-gradient(160deg,#fdba74,#ea580c)"},
  {name:"Sage Green",color:"linear-gradient(160deg,#a7c4a0,#4d7c5a)"},
  {name:"Deep Teal",color:"linear-gradient(160deg,#2dd4bf,#0f766e)"},
  {name:"Royal Purple",color:"linear-gradient(160deg,#a78bfa,#5b21b6)"},
  {name:"Crimson Red",color:"linear-gradient(160deg,#f87171,#991b1b)"},
  {name:"Not sure yet",color:"repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb 8px,#f3f4f6 8px,#f3f4f6 16px)"},
];
;export const peso=n=>"₱"+n.toLocaleString("en-PH",{maximumFractionDigits:2});
export const fi=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
export const fd=s=>{const[y,m,d]=s.split("-");return new Date(y,m-1,d).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})};
export const hl=h=>`${((h+11)%12)+1}:00 ${h<12?"AM":"PM"}`;
export const mail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
export const ph=p=>/^9\d{9}$/.test(p.replace(/[\s-]/g,"").replace(/^0/,""));
export const calc=(pkg,disc)=>{const p=pkg!==null?P[pkg][1]:0,tot=Math.round(p*(1-disc)*100)/100;return{p,tot,vat:Math.round(tot*12)/100,dp:tot/2}};