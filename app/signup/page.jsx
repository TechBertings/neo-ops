"use client";
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {AuthShell} from "@/components/Chrome";
import {Field,Phone} from "@/components/Field";
import {useApp} from "@/lib/store";
import {mail,ph} from "@/lib/data";
export default function Signup(){
  const [v,set]=useState({}),[err,setErr]=useState({}),{signup,google}=useApp(),r=useRouter();
  const submit=e=>{e.preventDefault();const x={},{name="",phone="",email="",pw="",pw2=""}=v;
    if(name.trim().length<7)x.name="Name too short! Minimum of 7 characters.";
    if(!ph(phone))x.phone="Please enter a valid phone number.";
    if(!mail(email))x.email="Please enter a valid email address.";
    if(pw.length<8)x.pw="Password too short! Use at least 8 characters.";
    if(pw!==pw2)x.pw2="Passwords don’t match!";
    if(!Object.keys(x).length&&!signup({name:name.trim(),phone,email:email.toLowerCase(),pw}))x.email="Email is already registered. Try logging in.";
    setErr(x);if(!Object.keys(x).length)r.push("/booking")};
  return <AuthShell><form onSubmit={submit} noValidate>
    <h2 style={{fontSize:28}}>Welcome!</h2><p className="sub">Sign in to NEO Studios to save billing information and be updated for vouchers for discounted prices!</p>
    <button type="button" className="btn g" onClick={()=>{google();r.push("/booking")}}>🌐 Google</button><div className="or">or sign up with email</div>
    <Field label="Full Name" name="name" ph="Full name" v={v} set={set} err={err.name}/>
    <Phone v={v} set={set} err={err.phone}/>
    <Field label="Email Address" name="email" type="email" ph="example@youremailprovider.com" v={v} set={set} err={err.email}/>
    <Field label="Password" name="pw" type="password" ph="At least 8 characters" v={v} set={set} err={err.pw}/>
    <Field label="Confirm Password" name="pw2" type="password" ph="Repeat password" v={v} set={set} err={err.pw2}/>
    <label className="chk"><input type="checkbox" defaultChecked/> Keep me signed in on this device</label>
    <button className="btn">Sign Up</button>
    <p className="c">Already have an account? <Link href="/login" className="lnk">Log in</Link></p></form></AuthShell>;
}
