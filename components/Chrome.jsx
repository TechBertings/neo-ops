"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useRef,useState} from "react";
import {useApp} from "@/lib/store";
import Footer from "./Footer";
import ChatBot from "./ChatBot";


const AUTH=["/login","/signup","/forgot-password","/reset-password"];



export function Art(){
  const st=Array.from({length:24},(_,i)=>{const a=i*Math.PI/12,r=i%2?62:78;return `${(150+r*Math.cos(a)).toFixed(1)},${(250+r*Math.sin(a)).toFixed(1)}`}).join(" ");
  return <svg viewBox="0 0 420 420" fill="var(--sh)" stroke="var(--sh)" strokeLinejoin="round" strokeWidth="26" aria-hidden="true"><polygon points="210,60 280,160 140,160"/><polygon points={st} transform="translate(-60,-30)"/><rect x="250" y="230" width="110" height="110" rx="10" transform="rotate(4 305 285)"/></svg>;
}
export function Logo({style}){return <Link className="logo" href="/" style={style}>NEO<small>STUDIOS</small></Link>}

export function AuthShell({children}){
  return <div className="auth"><div className="form"><Logo style={{position:"absolute",left:28,top:14}}/>{children}</div><div className="art"><Art/></div></div>;
}
const NOTIFS=[
  {id:1,t:"Booking confirmed",d:"Your Duo: Premium shoot on Nov 20 is confirmed.",w:"2h ago",n:true},
  {id:2,t:"Payment received",d:"Your 50% down payment has been received.",w:"2h ago",n:true},
  {id:3,t:"Refund processing",d:"Your refund for BOOKING_55719 is being processed.",w:"Yesterday",n:false},
];
const Ico=({children})=><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
function Header(){
  const p=usePathname(),{user,logout}=useApp();
      const [open,setOpen]=useState(null),[ns,setNs]=useState(NOTIFS),ref=useRef(null);
  const links=[["/","Home"],["/about","About"],["/my-bookings","My Bookings"],["/booking","Booking"]];
  const unread=ns.filter(x=>x.n).length;
  const tog=k=>setOpen(open===k?null:k);

  useEffect(()=>{
    const down=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(null)};
    const key=e=>{if(e.key==="Escape")setOpen(null)};
    document.addEventListener("mousedown",down);document.addEventListener("keydown",key);
    return()=>{document.removeEventListener("mousedown",down);document.removeEventListener("keydown",key)};
  },[]);
  useEffect(()=>{setOpen(null)},[p]);

 return <header><Logo/>
    <nav>{links.map(([h,t])=><Link key={h} href={h} className={p===h?"on":""}>{t}</Link>)}</nav>
    <div className="hd-ic" ref={ref}>
      <div className="hd-w">
        <button type="button" className="hd-b" aria-label="Notifications" aria-expanded={open==="n"} onClick={()=>tog("n")}>
          <Ico><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></Ico>
          {unread>0&&<span className="hd-dot">{unread}</span>}
        </button>
        {open==="n"&&<div className="hd-dd">
          <div className="hd-t"><b>Notifications</b>{unread>0&&<button type="button" onClick={()=>setNs(ns.map(x=>({...x,n:false})))}>Mark all as read</button>}</div>
          {ns.length===0?<p className="hd-e">No notifications yet.</p>:ns.map(x=>
            <div key={x.id} className={"hd-n"+(x.n?" new":"")}><b>{x.t}</b><span>{x.d}</span><small>{x.w}</small></div>)}
          <Link className="hd-f" href="/my-bookings">View my bookings</Link>
        </div>}
      </div>
      <div className="hd-w">
        <button type="button" className="hd-b" aria-label="Account menu" aria-expanded={open==="u"} onClick={()=>tog("u")}>
          <Ico><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Ico>
        </button>
        {open==="u"&&<div className="hd-dd sm">
          {user?<>
            <div className="hd-t"><div><b>{user.name}</b>{user.email&&<small>{user.email}</small>}{user.phone&&<small>+63 {user.phone}</small>}</div></div>
                        <Link href="/profile">View profile</Link>
            <Link href="/my-bookings">My Bookings</Link>
            <button type="button" onClick={()=>{setOpen(null);logout()}}>Log out</button>
          </>:<>
            <Link href="/login">Log in</Link>
            <Link href="/signup">Sign up</Link>
          </>}
        </div>} 
      </div>
     </div></header>;
}


export function Shell({children}){
  const p=usePathname(),auth=AUTH.includes(p);
  return <>{!auth&&<Header/>}<main className="main">{children}</main>{!auth&&<Footer/>}{!auth&&<ChatBot/>}</>;
}