"use client";
import {useRef,useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import {useApp} from "../../lib/store";
import {Field,Phone} from "@/components/Field";
import {P,BD,peso,fi,fd,hl,mail,ph,calc} from "../../lib/data";

const Row=({a,c})=><tr><td>{a}</td><td>{c}</td></tr>;

function Summary({b}){
  const k=b.pkg!==null?P[b.pkg]:null,c=calc(b.pkg,b.disc);
  if(!k)return <div className="pn sm"><h3>Your booking</h3><small style={{color:"var(--mu)"}}>Start by picking a package to display information.</small></div>;
  return <div className="pn sm"><h3>Your booking</h3><table><tbody>
    <Row a="SHOOT" c="Pro Shoot"/><Row a="OPTION" c={k[0]}/><Row a="PAX" c={k[2]}/><Row a="DATE" c={b.date?fd(b.date):"Not set"}/><Row a="TIME" c={b.time||"Not set"}/>
    <Row a="PRICE" c={peso(c.p)}/><Row a="VAT included (12%)" c={peso(c.vat)}/><Row a="TOTAL" c={peso(c.tot)}/><Row a="DOWN PAYMENT (50%)" c={peso(c.dp)}/></tbody></table></div>;
}

function Samples({b}){
  const k=b.pkg!==null?P[b.pkg]:null;
  if(!k)return <div className="pn"><b style={{fontSize:13}}>Sample work</b><small style={{display:"block",color:"var(--mu)",marginTop:4}}>Pick a package to see photos from previous shoots.</small></div>;
  return <div className="pn">
    <div className="bd-top"><b style={{fontSize:13}}>Sample work: {k[0]}</b><small>Photos from previous clients</small></div>
    <div className="sp-g">{[1,2,3,4].map(n=>
      <div key={b.pkg+"-"+n} role="img" aria-label={`${k[0]} sample ${n}`} style={{background:`url(/samples/${b.pkg}/${n}.jpg) center/cover, var(--sh)`}}/>)}
    </div>
  </div>;
}
function Options({b,up}){
  return <><h2>Choose your shoot</h2><p className="sub">Create freely. Capture authentically. Remember every moment.</p>
    <div className="pk">{P.map((q,i)=><button key={q[0]} onClick={()=>up({pkg:i})} className={b.pkg===i?"on":""}><div className="av">{q[0][0]}</div><div><b>{q[0]}</b><span>{peso(q[1])}</span></div></button>)}</div>
        <div style={{marginTop:16}}><Samples b={b}/></div>
    <div className="pn" style={{marginTop:16}}>
      <b style={{fontSize:13}}>I allow NEO Studios to post my photos on social media</b>
      <div className="bd">{["Yes","No"].map(o=><label key={o}><input type="radio" name="so" checked={b.soc===o} onChange={()=>up({soc:o})}/>{o}</label>)}</div>
    </div></>;
}
function Schedule({b,up}){
  const [m,setM]=useState(()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),1)});
  const y=m.getFullYear(),mo=m.getMonth(),n=new Date(y,mo+1,0).getDate(),t=new Date();t.setHours(0,0,0,0);
  return <><h2>Pick a date and time</h2><p className="sub">Open daily 7:00 AM to 7:00 PM. Your session runs 1.5 hours.</p>
    <div className="calw"><div className="pn"><div className="mh"><button onClick={()=>setM(new Date(y,mo-1,1))} aria-label="Previous month">‹</button><span>{m.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</span><button onClick={()=>setM(new Date(y,mo+1,1))} aria-label="Next month">›</button></div>
      <div className="cal">{["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><b key={d}>{d}</b>)}{Array.from({length:m.getDay()},(_,i)=><i key={"e"+i}/>)}
        {Array.from({length:n},(_,i)=>{const d=i+1,x=fi(new Date(y,mo,d));return <button key={d} className={b.date===x?"on":""} disabled={new Date(y,mo,d)<t} onClick={()=>up({date:x,time:""})}>{d}</button>})}</div></div>
      <div className="pn">{b.date?<><div className="mh">{fd(b.date)}</div><div className="sl">{Array.from({length:12},(_,i)=>7+i).map(h=>{const l=hl(h),bk=(+b.date.slice(-2)*7+h*3)%5===0; /* TODO: replace fake "booked" rule with DB lookup */
        return <button key={h} className={b.time===l?"on":""} disabled={bk} onClick={()=>up({time:l})}>{l}</button>})}</div>
        <p style={{fontSize:11,color:"var(--mu)"}}>Struck-through times are fully booked. Time slots are hourly; your session runs 1.5 hours.</p></>:<small style={{color:"var(--mu)"}}>Pick a date to see open times.</small>}</div></div></>;
}
function Details({b,up,err}){
  const set=d=>up({d});
  return <><h2>Your Details</h2><p className="sub">We’ll use these to confirm your booking and send your invoice.</p>
    <Field label="Full Name" name="name" ph="Full name" v={b.d} set={set} err={err.name}/>
    <div className="row"><div><Phone v={b.d} set={set} err={err.phone}/></div><div><Field label="Email Address" name="email" type="email" ph="example@youremailprovider.com" v={b.d} set={set} err={err.email}/></div></div>
    <label htmlFor="note">Notes</label><textarea id="note" rows={4} value={b.d.note} onChange={e=>set({...b.d,note:e.target.value})} placeholder="Any concerns or special requests about your booking? Let us know here."/></>;
}
const METHODS=["GCash","Maya","Credit / Debit Card","QR PH"];
const CARD="Credit / Debit Card";
const FMT={
  num:v=>v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim(),
  exp:v=>{const d=v.replace(/\D/g,"").slice(0,4);return d.length>2?d.slice(0,2)+"/"+d.slice(2):d},
  cvc:v=>v.replace(/\D/g,"").slice(0,4),
  name:v=>v,
};

function Payment({b,up,go,onPay}){
  const [vc,setVc]=useState(""),[ve,setVe]=useState(""),[cd,setCd]=useState({num:"",exp:"",cvc:"",name:""}),[ce,setCe]=useState({});
  const k=P[b.pkg],c=calc(b.pkg,b.disc),isCard=b.method===CARD;
  const apply=()=>{if(vc.trim().toUpperCase()==="NEO10"){up({disc:.1});setVe("")}else{up({disc:0});setVe("Voucher code not valid.")}};
  const set=f=>e=>setCd({...cd,[f]:FMT[f](e.target.value)});
  const pay=()=>{
    // DEMO ONLY: huwag mag-store o mag-send ng card details sa sarili mong server.
    // Sa production, gumamit ng hosted fields ng payment gateway (PayMongo, Xendit, Stripe, etc.).
    if(isCard){
      const x={},[mm,yy]=cd.exp.split("/");
      if(cd.num.replace(/\s/g,"").length!==16)x.num="Enter a 16-digit card number.";
      if(!(+mm>=1&&+mm<=12&&yy&&yy.length===2))x.exp="Use MM/YY.";
      if(cd.cvc.length<3)x.cvc="3 or 4 digits.";
      if(cd.name.trim().length<2)x.name="Enter the name on the card.";
      setCe(x);if(Object.keys(x).length)return;
    }
    onPay();
  };
const F=(f,label,ph)=><div key={f}><label>{label}</label><input type="text" inputMode={f==="name"?"text":"numeric"} autoComplete="off" placeholder={ph} value={cd[f]} onChange={set(f)} className={ce[f]?"bad":""}/>{ce[f]&&<small className="e" style={{marginTop:-6,marginBottom:8}}>{ce[f]}</small>}</div>;
  return <div className="pcols"><div>
    <h2>Review and Confirm</h2><p className="sub">Please check everything below. Need to change something? Use Edit.</p>
        <div className="pn">
      <div className="ed"><div><b>{k[0]}</b><span>Pro Shoot · {k[2]} pax</span></div><button onClick={()=>go(1)}>Edit</button></div>
      <div className="ed"><div><b>{fd(b.date)}</b><span>{b.time} · 1.5 hours</span></div><button onClick={()=>go(2)}>Edit</button></div>
      <div className="ed"><div><b>{b.d.name}</b><span>+63 {b.d.phone} · {b.d.email}</span></div><button onClick={()=>go(3)}>Edit</button></div>
      <div className="rv" style={{marginTop:12}}>
        <div><h4>WHAT’S INCLUDED</h4><p>✓ Layout (Toga or Uniform)</p><p>✓ Soft copies, retouched</p></div>
        <div><h4>&nbsp;</h4><p>✓ Professional photographer</p><p>✓ Professional lighting setup</p></div>
        <div><h4>PRINTS</h4><p>✓ 2pcs Photocard</p><p>✓ 2pc 5x7</p></div>
      </div>
      <div className="vo"><input type="text" placeholder="Have a voucher code? (try NEO10)" value={vc} onChange={e=>setVc(e.target.value)}/><button onClick={apply}>Apply</button></div>
      {ve&&<small className="e" style={{margin:"-8px 0 8px"}}>{ve}</small>}
    </div>
    <h2 style={{marginTop:24}}>Payment method</h2><p className="sub">Pick how you’d like to pay your down payment.</p>
    <div className="pay">{METHODS.map(m=><button key={m} className={b.method===m?"on":""} onClick={()=>up({method:m})}>{m}</button>)}</div>
  </div>

  <aside className="co">
    <h3>Order Checkout</h3>
    <div className="ln"><span>{k[0]}</span><span>{peso(c.p)}</span></div>
    <div className="ln"><span>Subtotal (before VAT)</span><span>{peso(c.tot-c.vat)}</span></div>
    <div className="ln"><span>{b.disc?`Voucher: ${b.disc*100}% off applied`:"No voucher entered"}</span><span>{b.disc?"-"+peso(c.p-c.tot):"—"}</span></div>
    <div className="ln"><span>VAT (12%)</span><span>{peso(c.vat)}</span></div>
    <div className="ln t"><span>Total Due</span><span>{peso(c.tot)}</span></div>
    <div className="ln"><span>Down Payment (50%)</span><span>{peso(c.dp)}</span></div>
    <div className="due"><small>Amount to pay now</small><b>{peso(c.dp)}</b><small>Balance of {peso(c.tot-c.dp)} is paid at the studio.</small></div>
    <hr/>
    {!b.method&&<p className="sub" style={{fontSize:13}}>Choose a payment method to continue.</p>}
  {isCard&&<>
  {F("num","Card Number","1234 1234 1234 1234")}
  <div className="g2">{F("exp","Expiry","MM/YY")}{F("cvc","CVC","CVC")}</div>
  {F("name","Cardholder Name","Full name on card")}
</>}
    {b.method&&!isCard&&<p className="sub" style={{fontSize:13}}>You’ll be redirected to {b.method} to finish your payment. (Demo: this goes straight to the receipt.)</p>}
    <button className="btn" disabled={!b.method} onClick={pay}>Pay {peso(c.dp)}</button>
  </aside></div>;
}
function Steps({s,go}){
  return <div className="steps">{["Options","Schedule","Details","Payment"].flatMap((n,i)=>{
    const d=s>i+1||s===5,can=s<5&&i+1<s;
    return [i>0&&<i key={"l"+i}/>,
      <span key={n} className={(d?"d":s===i+1?"on":"")+(can?" go":"")}
        {...(can?{role:"button",tabIndex:0,onClick:()=>go(i+1),onKeyDown:e=>e.key==="Enter"&&go(i+1)}:{})}>
        <em>{d?"✓":i+1}</em>{n}</span>]})}</div>;
}
function Receipt({b,done}){
  const k=P[b.pkg],c=calc(b.pkg,b.disc),t=new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const D=({rows})=><dl>{rows.map(([a,x])=><span key={a} style={{display:"contents"}}><dt>{a}</dt><dd>{x}</dd></span>)}</dl>;
  return <><h2>Payment Details</h2><p className="sub">Below are the details of your completed transaction, including your payment method and reference number.</p>
    <div className="rc"><div style={{color:"var(--ok)",fontSize:28}}>✔</div><h2 style={{letterSpacing:2}}>Payment Successful</h2><small style={{color:"var(--mu)"}}>Your down payment has been received. Your booking is now confirmed!</small>
      <hr style={{border:0,borderTop:"1px solid var(--ln)",margin:"14px 0 8px"}}/><div style={{color:"var(--mu)"}}>Amount Paid:</div><div className="big">{peso(c.dp)}</div>
      <b style={{display:"block",textAlign:"left"}}>Payment Details</b><D rows={[["Payment Method",b.method],["Payment Status","PAID"],["Transaction ID",b.ref.t],["Date Paid",t]]}/>
      <b style={{display:"block",textAlign:"left"}}>Booking Details</b><D rows={[["Booking Reference",b.ref.b],["Package",k[0]],["Schedule",`${fd(b.date)}, ${b.time}`],["Total Booking Price",peso(c.tot)],["Down Payment",peso(c.dp)],["Remaining Balance",peso(c.tot-c.dp)]]}/>
      <div style={{borderTop:"1px solid var(--ln)",paddingTop:12}}><b style={{fontSize:15}}>Details sent to your Email!</b><p style={{color:"var(--mu)"}}>A copy was sent to {b.d.email}.</p><button className="btn s" style={{borderRadius:20,width:"100%"}} onClick={done}>Back to Home Page</button></div></div></>;
}
export default function Booking(){
  const {b,up,reset}=useApp(),r=useRouter(),[err,setErr]=useState({}),s=b.step;
  const ok=s===1?b.pkg!==null:s===2?!!(b.date&&b.time):true;
  const go=n=>{up({step:n});window.scrollTo(0,0)};
  const next=()=>{
    if(s===3){const x={};if(b.d.name.trim().length<2)x.name="Please enter your full name.";if(!ph(b.d.phone))x.phone="Please enter a valid phone number.";if(!mail(b.d.email))x.email="Please enter a valid email address.";setErr(x);if(Object.keys(x).length)return}
    go(s+1)};
  const onPay=()=>{
    // TODO: gumawa ng booking + payment sa API/payment gateway mo dito
    up({step:5,ref:{b:"BOOKING_"+Math.floor(1e4+Math.random()*9e4),t:"xyz_"+Math.floor(1e8+Math.random()*9e8)}});window.scrollTo(0,0)};
  const back=()=>s>1&&s<5?go(s-1):r.back();
  return <div className="wrap">
    <h1>Book your shoot</h1>
    <p>Reserve your slot in a few quick steps</p>
    <hr style={{border:0,borderTop:"1px solid var(--ln)",margin:"20px 0"}}/>
    <Steps s={s} go={go}/>
    {s===4?<Payment b={b} up={up} go={go} onPay={onPay}/>:s===5?<Receipt b={b} done={()=>{reset();r.push("/")}}/>:<div className="cols"><div>{s===1?<Options b={b} up={up}/>:s===2?<Schedule b={b} up={up}/>:<Details b={b} up={up} err={err}/>}</div><Summary b={b}/></div>}
    {s<5&&<div className="bar">{s>1&&<button className="btn s ghost" onClick={back}>‹ Previous</button>}{s<4&&<button className="btn s" disabled={!ok} onClick={next}>Next ›</button>}</div>}
  </div>;
}