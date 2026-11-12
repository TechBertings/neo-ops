"use client";
import {useState} from "react";
import Link from "next/link";
import {peso,fd} from "../../lib/data";
import Swal from "sweetalert2";

const LABEL={all:"All",pending:"Pending",confirmed:"Confirmed",cancelled:"Cancelled",refund:"For Refund"};
const TABS=Object.keys(LABEL);
const PER=5;

// STATIC DATA: palitan ng fetch mula sa DB later. date = YYYY-MM-DD, tot = total (may VAT), dp = 50%
const BOOKINGS=[
  {ref:"BOOKING_48213",pkg:"Duo: Premium",pax:2,bd:"Static Gray",date:"2026-11-20",time:"10:00 AM",tot:899,status:"confirmed"},
  {ref:"BOOKING_77102",pkg:"Group: Elite",pax:6,bd:"Rose Pink",date:"2026-11-22",time:"2:00 PM",tot:1899,status:"pending"},
  {ref:"BOOKING_30955",pkg:"Classic Package A",pax:1,bd:"White",date:"2026-11-25",time:"9:00 AM",tot:999,status:"pending"},
  {ref:"BOOKING_66481",pkg:"Prestige Package",pax:4,bd:"Black",date:"2026-12-02",time:"11:00 AM",tot:3499,status:"confirmed"},
  {ref:"BOOKING_12090",pkg:"Express",pax:1,bd:"Paper Cream",date:"2026-10-30",time:"4:00 PM",tot:399,status:"cancelled"},
  {ref:"BOOKING_55719",pkg:"Yearbook Package",pax:1,bd:"Yearbook Exclusive",date:"2026-10-28",time:"1:00 PM",tot:649,status:"refund"},
  {ref:"BOOKING_90342",pkg:"Classic Package B",pax:2,bd:"Sage Green",date:"2026-12-05",time:"3:00 PM",tot:1199,status:"confirmed"},
  {ref:"BOOKING_24867",pkg:"Duo: Basic",pax:2,bd:"Salt & Sun",date:"2026-12-07",time:"8:00 AM",tot:599,status:"pending"},
  {ref:"BOOKING_81530",pkg:"Group: Basic",pax:5,bd:"Deep Teal",date:"2026-10-18",time:"5:00 PM",tot:1399,status:"cancelled"},
  {ref:"BOOKING_47026",pkg:"Classic Package C",pax:3,bd:"Royal Purple",date:"2026-10-12",time:"12:00 PM",tot:1799,status:"refund"},
  {ref:"BOOKING_63378",pkg:"Express",pax:1,bd:"Crimson Red",date:"2026-12-10",time:"10:00 AM",tot:399,status:"confirmed"},
  {ref:"BOOKING_19954",pkg:"Duo: Premium",pax:2,bd:"Sunset Orange",date:"2026-12-12",time:"6:00 PM",tot:899,status:"pending"},
  {ref:"BOOKING_58801",pkg:"Classic Package A",pax:1,bd:"White",date:"2026-09-29",time:"9:00 AM",tot:999,status:"cancelled"},
];
const row=(a,b)=>`<div class="sw-r"><span>${a}</span><b>${b}</b></div>`;

function showDetails(x){
  const dp=x.tot/2;
  Swal.fire({
    title:x.pkg,
    html:`<small class="sw-ref">${x.ref} · ${LABEL[x.status]}</small>
      <div class="sw-l">
        ${row("Date",fd(x.date))}
        ${row("Time",x.time+" · 1.5 hours")}
        ${row("Pax",x.pax)}
        ${row("Backdrop",x.bd)}
        ${row("Total",peso(x.tot))}
        ${row("Down payment",peso(dp))}
        ${row("Balance at studio",peso(x.tot-dp))}
      </div>`,
    confirmButtonText:"Close",
    confirmButtonColor:"#111",
    customClass:{popup:"mb-sw"},
  });
}
function Card({x}){
  const canCancel=x.status==="pending"||x.status==="confirmed";
  const dp=x.tot/2;
  return <div className="mb-c">
    <div className="mb-h">
      <div><b>{x.pkg}</b><small>{x.ref}</small></div>
      <span className={"mb-s "+x.status}>{LABEL[x.status]}</span>
    </div>
    <div className="mb-g">
      <div><h4>SCHEDULE</h4><p>{fd(x.date)}</p><p>{x.time}</p></div>
      <div><h4>DETAILS</h4><p>{x.pax} pax</p><p>{x.bd}</p></div>
      <div><h4>PAYMENT</h4><p>Total {peso(x.tot)}</p><p>Down payment {peso(dp)}</p></div>
    </div>
    {x.status==="refund"&&<p className="mb-n">Refund of {peso(dp)} is being processed.</p>}
    {x.status==="pending"&&<p className="mb-n">Waiting for confirmation from the studio.</p>}
    <div className="mb-a">
<button className="btn s ghost" onClick={()=>showDetails(x)}>View details</button>
      {canCancel&&<button className="btn s ghost" onClick={()=>{/* TODO: cancel booking via API */}}>Cancel booking</button>}
    </div>
  </div>;
}

function Pager({cur,pages,go}){
  if(pages<=1)return null;
  return <nav className="mb-p" aria-label="Pagination">
    <button disabled={cur===1} onClick={()=>go(cur-1)} aria-label="Previous page">‹</button>
    {Array.from({length:pages},(_,i)=>i+1).map(n=>
      <button key={n} className={n===cur?"on":""} aria-current={n===cur?"page":undefined} onClick={()=>go(n)}>{n}</button>)}
    <button disabled={cur===pages} onClick={()=>go(cur+1)} aria-label="Next page">›</button>
  </nav>;
}

export default function MyBookings(){
  const [tab,setTab]=useState("all"),[pg,setPg]=useState(1);
  const list=tab==="all"?BOOKINGS:BOOKINGS.filter(x=>x.status===tab);
  const pages=Math.max(1,Math.ceil(list.length/PER));
  const cur=Math.min(pg,pages);
  const rows=list.slice((cur-1)*PER,cur*PER);
  const count=t=>t==="all"?BOOKINGS.length:BOOKINGS.filter(x=>x.status===t).length;
  const pick=t=>{setTab(t);setPg(1)};
  const go=n=>{setPg(n);window.scrollTo({top:0,behavior:"smooth"})};

  return <div className="wrap">
    <h1>My Bookings</h1>
    <p className="sub">Track your pending, confirmed, cancelled and refunded bookings.</p>

    <div className="mb-t" role="tablist">
      {TABS.map(t=><button key={t} role="tab" aria-selected={tab===t} className={tab===t?"on":""} onClick={()=>pick(t)}>
        {LABEL[t]} <em>{count(t)}</em></button>)}
    </div>

    {rows.length===0
      ?<div className="pn mb-e"><b>No bookings here yet.</b><p className="sub">When you book a shoot, it will show up here.</p><Link href="/booking" className="btn s">Book a shoot</Link></div>
      :<>
        <div className="mb-l">{rows.map(x=><Card key={x.ref} x={x}/>)}</div>
        <div className="mb-f">
          <small>Showing {(cur-1)*PER+1}–{(cur-1)*PER+rows.length} of {list.length}</small>
          <Pager cur={cur} pages={pages} go={go}/>
        </div>
      </>}

    <small className="mb-pol">Need to cancel? Please read our <Link href="/terms-and-conditions">Terms and Condition</Link> for cancellation and refund rules.</small>
  </div>;
}