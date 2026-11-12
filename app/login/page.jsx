"use client";
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {AuthShell} from "@/components/Chrome";
import {Field} from "@/components/Field";
import {useApp} from "@/lib/store";
export default function Login(){
  const [v,set]=useState({}),[err,setErr]=useState({}),{login,google}=useApp(),r=useRouter();
  const submit=e=>{e.preventDefault();if(login(v.email||"",v.pw||""))r.push("/booking");else setErr({email:" ",pw:"Wrong email or password!"})};
  return <AuthShell><form onSubmit={submit} noValidate>
    <h2 style={{fontSize:28}}>Welcome Back!</h2><p className="sub">Sign in to NEO Studios to save billing information and be updated for vouchers for discounted prices!</p>
    <button type="button" className="btn g" onClick={()=>{google();r.push("/booking")}}>🌐 Google</button><div className="or">or sign up with email</div>
    <Field label="Email Address" name="email" type="email" ph="example@youremailprovider.com" v={v} set={set} err={err.email}/>
    <Field label="Password" name="pw" type="password" ph="Password" v={v} set={set} err={err.pw}/>
    <Link href="/forgot-password" className="lnk" style={{display:"inline-block",marginTop:6}}>Forgot Password?</Link>
    <label className="chk"><input type="checkbox" defaultChecked/> Keep me signed in on this device</label>
    <button className="btn">Log In</button>
    <p className="c">Don’t have an account? <Link href="/signup" className="lnk">Sign up</Link></p></form></AuthShell>;
}
