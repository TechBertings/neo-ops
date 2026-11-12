"use client";
import {useState} from "react";
import Link from "next/link";
import {AuthShell} from "@/components/Chrome";
import {Field} from "@/components/Field";
import {mail} from "@/lib/data";
export default function Forgot(){
  const [v,set]=useState({}),[err,setErr]=useState({}),[sent,setSent]=useState(false);
  const submit=e=>{e.preventDefault();if(!mail(v.email||""))return setErr({email:"Please enter a valid email address."});setSent(true)};
  return <AuthShell><h2 style={{fontSize:28}}>Forgot Password?</h2><p className="sub">No worries! It happens. Enter your registered email address and we’ll send you a link to reset your password.</p>
    {sent?<div className="pn">A reset link was sent to <b>{v.email}</b>. Check your inbox.<br/><br/><Link className="lnk" href="/reset-password">Open reset link (demo)</Link></div>
    :<form onSubmit={submit} noValidate><Field label="Email Address" name="email" type="email" ph="example@youremailprovider.com" v={v} set={set} err={err.email}/><button className="btn" style={{marginTop:14}}>Send Password Reset Link</button></form>}
    <p className="c">Remembered your password? <Link href="/login" className="lnk">Back to login.</Link></p></AuthShell>;
}
