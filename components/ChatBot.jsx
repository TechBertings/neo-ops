"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {P,peso} from "@/lib/data";

const BOT_IMG=""; // optional: "/images/bot.png"
const CHIPS=["Packages & prices","How to book","Schedule & hours","Payment & refunds"];
const GREETING={from:"bot",text:"Hi there! 👋 I’m the NEO Studios assistant. I can help with packages, booking, schedules, and payments. What do you need?"};

const KB=[
  {k:/package|price|presyo|magkano|how much|cost|rate/,
   t:()=>"Here are our packages:\n"+P.map(([n,p])=>`• ${n}: ${peso(p)}`).join("\n")+"\nPrices include 12% VAT.",
   l:["/booking","Choose a package"]},
  {k:/pay|refund|cancel|down|gcash|maya|card|visa|vat|bayad/,
   t:()=>"A 50% down payment confirms your slot, and you pay the balance at the studio. You can pay with GCash, Maya, Mastercard, or VISA. For cancellations and refunds, please read our policy page.",
   l:["/cancellation-and-refunds","Cancellation and Refunds"]},
  {k:/hour|open|schedule|time|oras|slot|long|gaano/,
   t:()=>"We’re open daily, 7:00 AM to 7:00 PM. Time slots are hourly and each session runs 1.5 hours. Struck-through times on the calendar are already booked.",
   l:["/booking","Pick a date"]},
  {k:/voucher|promo|discount|code/,
   t:()=>"You can enter a voucher code on the last step (Review and Confirm). The discount shows right away in your total."},
  {k:/where|location|address|malabon|saan/,
   t:()=>"We’re a self-portrait studio in Malabon City, Philippines."},
  {k:/agent|human|person|staff|contact|facebook|instagram/,
   t:()=>"You can message us on Facebook or Instagram and our team will reply. Please include your booking reference if you have one."},
  {k:/book|reserve|paano|how/,
   t:()=>"Booking takes four steps:\n1. Choose your shoot (package and backdrop)\n2. Pick a date and time\n3. Add your details\n4. Review and pay the 50% down payment",
   l:["/booking","Start booking"]},
];
const FALLBACK={text:"I can help with packages and prices, how to book, schedule and hours, and payments. For anything else, message us on Facebook or Instagram."};
const answer=q=>{const s=q.toLowerCase(),m=KB.find(x=>x.k.test(s));return m?{text:m.t(),link:m.l}:FALLBACK};

export default function ChatBot(){
  const [open,setOpen]=useState(false),[msgs,setMsgs]=useState([GREETING]),[input,setInput]=useState(""),[busy,setBusy]=useState(false);
  const end=useRef(null);
  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"})},[msgs,busy,open]);

  const send=async t=>{
    t=t.trim();if(!t||busy)return;
    const next=[...msgs,{from:"user",text:t}];
    setMsgs(next);setInput("");setBusy(true);
    let a=null;
    if(!CHIPS.includes(t)){
      try{ // try the AI route first; falls back to the built-in answers if it isn't set up
        const h=next.slice(next.findIndex(m=>m.from==="user")).map(m=>({role:m.from==="user"?"user":"assistant",content:m.text}));
        const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:h})});
        if(r.ok){const d=await r.json();if(d.reply)a={text:d.reply}}
      }catch{}
    }
    if(!a){await new Promise(r=>setTimeout(r,500));a=answer(t)}
    setMsgs(m=>[...m,{from:"bot",...a}]);setBusy(false);
  };

  const Av=()=><span className="cb-av">{BOT_IMG?<img src={BOT_IMG} alt=""/>:"N"}</span>;
  return <>
    {open&&<div className="cb" role="dialog" aria-label="NEO Studios assistant">
      <div className="cb-h"><Av/><div><b>NEO Assistant</b><small><i/>Online</small></div>
        <button onClick={()=>setOpen(false)} aria-label="Close chat">✕</button></div>
      <div className="cb-m">
        {msgs.map((m,i)=><div key={i} className={"cb-r "+m.from}>
          {m.from==="bot"&&<Av/>}
          <div className="cb-b">{m.text}{m.link&&<Link href={m.link[0]} className="cb-l" onClick={()=>setOpen(false)}>{m.link[1]} →</Link>}</div></div>)}
        {busy&&<div className="cb-r bot"><Av/><div className="cb-b cb-t"><i/><i/><i/></div></div>}
        {msgs.length<3&&<div className="cb-c">{CHIPS.map(c=><button key={c} onClick={()=>send(c)}>{c}</button>)}</div>}
        <div ref={end}/>
      </div>
      <form className="cb-f" onSubmit={e=>{e.preventDefault();send(input)}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message..." aria-label="Message"/>
        <button disabled={!input.trim()||busy} aria-label="Send">➤</button></form>
      <small className="cb-s">Booking questions only. Your data is safe with us.</small>
    </div>}
    <button className="cb-fab" onClick={()=>setOpen(!open)} aria-label={open?"Close chat":"Open chat"} aria-expanded={open}>
      {open?"✕":<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/><circle cx="9" cy="12" r=".6"/><circle cx="12.5" cy="12" r=".6"/><circle cx="16" cy="12" r=".6"/></svg>}
    </button>
  </>;
}