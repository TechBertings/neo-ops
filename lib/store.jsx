"use client";
import {createContext,useContext,useEffect,useState} from "react";
// DEMO ONLY: accounts live in localStorage (plain-text passwords). Replace with real auth + DB (e.g. Auth.js, Supabase) later.
const Ctx=createContext(null);
export const useApp=()=>useContext(Ctx);
const blank={step:1,pkg:null,bd:[],soc:"",date:"",time:"",method:"",disc:0,ref:null,d:{name:"",phone:"",email:"",fb:"",note:""}};
const rd=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};

// DEMO ONLY: ito ang lalabas kapag kulang ang data ng account
export const DEMO={name:"Jerico Pacana",phone:"9611018293",email:"jericopacan@gmail.com",fb:"facebook.com/jerico.pacana"};
const fill=u=>({...DEMO,...Object.fromEntries(Object.entries(u||{}).filter(([,v])=>v))});
const prefill=u=>{const f=fill(u);return {name:f.name,phone:f.phone,email:f.email,fb:f.fb,note:""}};

export function AppProvider({children}){
  const [user,setUser]=useState(null),[b,setB]=useState(()=>({...blank,d:prefill(null)})),[last,setLast]=useState(null);

  useEffect(()=>{
    const u=rd("neo_session");
    setUser(u);setLast(rd("neo_last"));
    setB(x=>({...x,d:{...x.d,...prefill(u)}}));
  },[]);

  const enter=u=>{setUser(u);wr("neo_session",u);setB(x=>({...x,d:{...x.d,...prefill(u)}}))};
  const login=(email,pw)=>{const u=(rd("neo_users")||[]).find(x=>x.email===email.trim().toLowerCase()&&x.pw===pw);if(u)enter(u);return !!u};
  const signup=u=>{const all=rd("neo_users")||[];if(all.some(x=>x.email===u.email))return false;wr("neo_users",[...all,u]);enter(u);return true};
  const google=()=>enter({name:"Google User",email:"",phone:""});
  const logout=()=>{setUser(null);wr("neo_session",null);setB({...blank,d:prefill(null)})};
  const up=p=>setB(x=>({...x,...p}));
  // Pag natapos na ang booking (step 5), i-save muna bilang "last" bago i-reset
  const reset=()=>{
    if(b.step===5){setLast(b);wr("neo_last",b)}
    setB({...blank,d:prefill(user)});
  };

  return <Ctx.Provider value={{user:fill(user),rawUser:user,login,signup,google,logout,b,up,reset,last}}>{children}</Ctx.Provider>;
}